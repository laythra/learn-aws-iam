# Architecture

This document walks through how Learn AWS IAM is built under the hood. It's meant for anyone who wants to understand the codebase, whether you're looking to contribute, debug something, or just curious to get a sense of how things work.

The project is an interactive learning platform split into levels. Each level drops users onto a visual canvas where they wire up IAM policies, roles, users, and other AWS entities. The goal is to finish a set of objectives—usually by creating policies and connecting things correctly. There's a tutorial layer guiding users through each concept, and validation happens in real time so mistakes surface immediately.

What makes this interesting architecturally is that each level runs on its own state machine. This keeps the complex tutorial flows, objective tracking, and validation logic properly encapsulated and isolated per level. The canvas (built on ReactFlow) and every component in the app, subscribes to events from the current level's state machine in order to render the appropriate interactable components such as popups, nodes, edges, and more.

## Contents

- [Tech Stack](#tech-stack)
- [How the Pieces Fit Together](#how-the-pieces-fit-together)
- [State Machines: The Backbone](#state-machines-the-backbone)
- [The Canvas System](#the-canvas-system)
- [Policy Editor](#policy-editor)
- [Tutorial Content](#tutorial-content)
- [Project Layout](#project-layout)
- [Patterns Worth Knowing](#patterns-worth-knowing)
- [Testing Approach](#testing-approach)
- [Building and Deploying](#building-and-deploying)
- [Why Things Are the Way They Are](#why-things-are-the-way-they-are)

---

## Tech Stack

Here's what's running under the hood:

**Frontend core**: React with TypeScript, bundled by Vite. Initially bootstrapped with Create React App, later migrated for faster builds and better DX.

**State management**: XState handles orchestating each level's flow, including tutorial content, objective tracking, and what nodes and edges currently exist in the level.

**Canvas**: ReactFlow (@xyflow/react) renders the graph of IAM entities. Nodes are users, policies, roles, etc. Edges are the relationships between them.

**Code editing**: CodeMirror 6 powers the JSON policy editor. AJV validates policies against JSON schemas in real time.

**UI components**: Chakra UI for the component library, Framer Motion for animations. Markdown content goes through react-markdown with some custom plugins for badges and icons.

**Testing**: End-to-end tests with Playwright, Unit tests with Vitest. The units tests need more coverage, the E2E tests cover all twelve levels.

**Deployment**: A simple multi-stage docker image, with nginx serving the static build created by vite
JSON schemas in real time.

---

## How the Pieces Fit Together

The app has a few distinct layers that work together:

1. **State machines** State machines sit at the center. Each level has one. It tracks everything: which nodes exist, what edges connect them, which objectives are complete, what popup is showing, whether the user can interact with certain elements yet, etc. State machines serve as a blueprint for each level and make orchestrating the experience seamless.

2. **The Canvas**: Renders existing nodes and edges. The state machine is the source of truth for which entities exist on the canvas. However, the canvas relies on a separate lightweight XState store for reading and updating UI state. This store is better optimized for high-frequency interactions such as dragging nodes and hovering over edges. The state machine syncs with the canvas to define which nodes and edges to show, while supplementary UI state - such as positioning and hover state - is maintained exclusively in the canvas store.

3. **The code editor** is where users write policies. Its state is shared via a custom hook to propagate it across multiple components. When the user submits a policy, it is validated and the result is sent to the state machine.

4. **The tutorial system** controls the guided experience. Popups, popovers, and element restrictions all flow from the state machine's current state. Move to a new tutorial step, and the visible UI changes automatically.

5. **Stores** handle simpler state that does not require full state machine treatment, for both convenience and performance. Canvas node positions, code editor warnings, and the currently active state machine actor live in @xstate/store instances.

The provider hierarchy in [App.tsx](src/App.tsx) sets all this up:

```
ChakraProvider
  └── ModalProvider
        └── LevelsProgressionProvider  ← This is where the magic happens
              └── ReactFlowProvider
                    └── MainContainer
```

`LevelsProgressionProvider` reads the current level from the store, spins up the appropriate state machine, and makes its actor available to everything below via context.

---

## State Machines: The Backbone

Each level is defined in [src/machines/level{N}/](src/machines/) with the following structure:

```
level5/
├── state-machine.ts         # The XState machine definition
├── initial-connections.ts   # What connections to initially show on the canvas
├── level-runtime-fns.ts     # Functions used for runtime hydration, since machines must be serializable for snapshotting
├── nodes/                   # The various nodes to show during the lifecycle of the level
├── objectives/              # Objective definitions and validation
│   ├── edge-connection-objectives.ts
│   ├── level-objectives.ts
│   ├── role-creation-objectives.ts
│   ├── trust-policy-edit-objectives.ts
│   └── user-group-creation-objectives.ts
├── schemas/                 # JSON schemas for validation
├── tutorial_messages/       # Tutorial content
│   ├── fixed-popover-messages.ts
│   ├── popover-tutorial-messages.ts
│   └── popup-tutorial-messages.ts
└── types/                   # Level-specific TypeScript types
```

All twelve machines share a common setup via [common-state-machine-setup.ts](src/machines/common-state-machine-setup.ts).
This factory function (~600 lines) defines shared actions, guards, and event handling logic.
Each individual level machine plugs in its own objectives, nodes, and tutorial flow.

The machine context represents the full state of a level:

- `nodes` and `edges` — what’s currently on the canvas
- `objectives` — the active goals and their completion state
- `show_popups`, `popup_content`, `show_popovers`, `popover_content` — tutorial and guidance state
- `restricted_elements` — which UI elements are currently hidden.
- and other related level state

Shared top-level event handlers live in [shared-top-level-events.ts](src/machines/shared-top-level-events.ts).

These translate common user actions (adding nodes, deleting edges, updating policies, etc.) into the machine’s internal logic provided by the common setup.
Each level then extends this base configuration with its own transitions and constraints.

### Why state machines?

Each level follows a mostly linear flow with branches:
first show a popup, wait for a click, reveal certain nodes, highlight a button, validate what the user creates, and handle errors if they do something wrong. State machines are a very natural fit for this. Each tutorial step maps to a state, user actions drive transitions, and guards make sure the user can’t skip ahead or reach an invalid step.

Without machines, this logic quickly turns into a mess — scattered useEffect hooks, fragile condition checks, and subtle bugs when things happen out of order. With machines, the flow is explicit, easy to reason about, and easy to debug. You can also visualize the whole thing, which makes a huge difference when working on complex levels.

### Event emission

The machines never talk to React Flow directly.
They don’t “render” anything. Instead, they emit events that anything interested can listen to:

- `NODES_ADDED`, `NODES_DELETED`, `NODES_RESET`
- `EDGES_ADDED`, `EDGES_DELETED`, `EDGES_RESET`
- `NODE_UPDATED`, `OBJECTIVE_COMPLETED`

The canvas layer subscribes to those events and decides how to reflect them on screen:

```typescript
levelActor.on('NODES_DELETED', ({ nodeIds }) => {
  canvasStore.send({ type: 'markNodesForDeletion', nodeIds });
  // Animation plays, then nodes actually disappear
});
```

This indirection becomes really important once you start caring about animations.
When the machine says “these nodes are gone”, the canvas doesn’t immediately remove them. It waits ~300ms for the fade-out to finish, then drops them from the DOM.

The animation happens through a multi-step process:

1. Machine emits `NODES_DELETED` with IDs
2. Canvas store marks those nodes as “deleting”, which triggers Framer Motion exit animations
3. Upon animation completion, another action gets dispatched to the canvas store to actually remove the nodes from state.

Without this multi-step, event-driven approach, nodes would vanish instantly when the machine state changes. Syncing the machine to the canvas would fall back to a plain useEffect, which would make proper animation handling awkward and opaque.

### Functions registry

XState machines need to remain serializable — mainly so snapshots can be stored during checkpoints. That means you can’t put functions directly into machine context.
At the same time, objectives need validator functions, and guard rails need filter functions for runtime checks, so you still need a way to associate logic with the machine.

The workaround is [functions-registry.ts](src/config/functions-registry.ts): a plain object that maps each level to the functions it needs.

```typescript
FunctionsRegistry[5].validate_functions['create_admin_policy'];
FunctionsRegistry[5].objectives_guard_rails_blocked_edges_fns['scp_blocks_s3'];
```

The machine stores the function _name_, and runtime code looks up the actual function from the registry, hydrating the machine context on runtime as needed.

---

## The Canvas System

The canvas is where users spend most of their time. It renders IAM entities as draggable nodes, with edges representing the relationships between them.

The level’s state machine is the source of truth for which nodes and edges exist. The canvas, however, doesn’t read directly from the machine. Instead, the machine syncs its state into a lightweight @xstate/store instance dedicated to canvas UI concerns. That store also holds purely UI-related state such as node positions, selection, hover state, and similar details.

Keeping this state outside the main machine makes a big difference for performance. High-frequency interactions like dragging, hovering, and selecting nodes don’t have to pass through the full state machine, which keeps the interaction layer fast and responsive.

In practice, the data flow looks like this:

```
State machine -> useCanvas hook -> canvas store -> ReactFlow rendering.
```

### What lives where

The canvas code is in [src/features/canvas/](src/features/canvas/):

- `components/` — Node and edge React components
- `hooks/useCanvas.ts` — The main hook providing the entire state of the canvas
- `stores/canvas-store.ts` — the store that holds canvas UI state (hover, selection, etc.)
- `utils/` — positioning math and connection validation (this will likely move elsewhere over time)

### Node types

ReactFlow needs a map of node types to components. Ours looks like:

```typescript
{
  policy: IAMCanvasNode,
  user: IAMCanvasNode,
  iam_group: IAMCanvasNode,  // 'group' is reserved by ReactFlow
  role: IAMCanvasNode,
  resource: IAMCanvasNode,
  account: AccountCanvasNode,
  ou: IAMCanvasNode,
  scp: IAMCanvasNode,
  resource_policy: IAMCanvasNode,
  permission_boundary: IAMCanvasNode,
  user_aggregated: IAMCanvasNode,
}
```

Most entities use `IAMCanvasNode`, which reads the entity type from node data and renders accordingly. `AccountCanvasNode` is separate because AWS accounts need special layout treatment (they contain other entities visually).

### The canvas store

This is an `@xstate/store`, not a full state machine. It holds:

The current set of nodes and edges (synced from the level machine)

- Which node or edge is selected or hovered
- Which nodes are in the middle of a delete animation
- Node positions
- Which node has its content / ARN / tags expanded
- Side panel state (which tabs are open)

The main reason for keeping this in a separate lightweight store is performance, as described earlier in the Canvas System section.

### useCanvas hook

This hook ([useCanvas.ts](src/features/canvas/hooks/useCanvas.ts)) is the glue:

1. Subscribes to events from the level's state machine
2. Translates them into canvas store actions
3. Handles connection validation when users try to draw edges
4. Manages the animation timing for adds/deletes

When a user drags a connection, `useCanvas` runs it through validation:

1. Check [valid-connections.ts](src/features/canvas/utils/valid-connections.ts) — is this entity pair even allowed?
2. Check `edges_management_disabled` in the machine context — are connections allowed at this point in the level?
3. Check `blocked_connections` in the machine context — is this specific connection blocked right now?
4. If all pass, send `ADD_EDGE` to the machine

### Layout groups

When a level starts, nodes need to appear in sensible positions. Users shouldn’t have to untangle a mess before they can start learning.

Each node has a layout_group_id like `'center'`, `'bottom-left'`, or `'right-vertical'`. The canvas uses this along with a few runtime factors to calculate where nodes should go:

- Current viewport size
- Side panel width (if it’s open)
- How many other nodes are already in the same group
- The group’s direction (horizontal or vertical) and spacing rules

All of this logic lives in the canvas store’s `addNodes` action.
When new nodes are introduced, they get placed automatically while existing nodes are left exactly where the user put them.

### Animations

Framer Motion handles the visual effects:

- **Creation**: Nodes scale up from 0.9 and fade in. There's also a 3-second gradient pulse effect.
- **Deletion**: Nodes blur slightly and drift upward while fading out.
- **Edges**: New edges get a 7-second glow animation.

The two-phase deletion is worth noting. When the machine says "delete these nodes," we first mark them in the store (triggering the fade animation) then actually remove them after the animation completes. Otherwise you'd see nodes vanish abruptly.

---

## Policy Editor

Most levels boil down to "write the correct IAM policy." The editor needs to be good enough for JSON editing while showing helpful guidance and real-time validation.

### Implementation

The editor lives in [src/features/code_editor/](src/features/code_editor/). The main modal is `CodeEditor.tsx`, with separate components for creation vs. editing modes.

CodeMirror 6 powers the actual editing. It's configured with:

- JSON syntax highlighting and folding
- Linting via a custom extension that runs AJV validation
- A badge extension that renders help icons inline

The editor is “uncontrolled” in React terms — CodeMirror manages its own internal state.
That said, we still impose structure around it using a custom hook [useCodeEditor.tsx](src/features/code_editor/hooks//useCodeEditor.ts), since the editor’s state needs to be shared across multiple components.

Each edit is debounced to prevent re-running the validation on each keystroke and to give the user the sense of validation taking place in the background .

### Code Editor Validation

The editor validates policy JSON on two levels.

First, there is basic structure and syntax checking using the shared schemas in
[`src/schemas/`](src/schemas/):

- `iam-policy-schema.json` — standard IAM policies
- `iam-role-trust-policy-schema.json` — trust policies for roles
- `iam-shared-condition-schema.json` — the `Condition` block format

On top of that, individual creation objectives can attach their own validation rules.
Those live under each level’s `schemas/` directory. For example, in level 5 the EC2 role objective validates against `ec2-role-schema.json`, which enforces that the trust policy explicitly includes `ec2.amazonaws.com` as the service principal.

At runtime, each level’s `level-runtime-fns.ts` file maps node IDs to the schema they should use. AJV compiles all of those validators once at startup and reuses them for the lifetime of the level.

### Tabs

The editor supports multiple policy types in tabs:

- Customer Managed Policy
- Role Trust Policy
- Service Control Policy (SCP)
- Resource Policy
- Permission Boundary

Each tab has its own content and validation. Which tabs are visible depends on the level and tutorial state—some levels hide tabs until the user reaches a certain point.

### Help badges

The custom `badgeExtension` in CodeMirror renders small badge-like icons next to certain lines. It leverages CodeMirror’s extension system to attach contextual hints and explanations directly to relevant parts of the policy while the user is editing it.

![Help Badges](./assets/images/codemirror_badge_example.png)

---

## Tutorial Content

The guided experience runs on popups (modal dialogs) and popovers (small tooltips attached to elements), as well as fixed popovers (popovers fixed to a specific part of the user's screen).

### Authoring

Tutorial content is written as plain strings in `tutorial_messages/popups.ts` and `popovers.ts` for each level. These are rendered using `react-markdown` with a couple of custom plugins:

- `rehypeChakraBadge` turns `badge[text]` into styled Chakra badges
- `rehypeIcon` turns `:icon[IconName]:` into actual icon components

So tutorial authors can write:

```md
Click the :badge[Create Policy] button to add a new policy.
Look for the :icon[AddIcon]: icon in the toolbar.
```

…and have it render with proper styling and inline icons in the UI.

### Flow control

The state machine drives what the user sees at any point in the tutorial. Each tutorial step is a machine state. Entering a state typically:

1. Sets `show_popovers: true` and populates `popover_content`
2. Updates `restricted_elements` to lock or unlock parts of the UI
3. Waits for a specific event (button click, policy created, etc.)
4. Transitions to the next state

The `withTutorialGuard` decorator hides components when they appear in `restricted_elements`.
The `withPopover` decorator attaches the appropriate popover content to components based on their element IDs.

### Element IDs

There is a central `ElementId` enum that ties several parts of the system together:

- Components (via `data-element-id` attributes)
- Tutorial popovers (via `popover_target`)
- E2E tests (via `getByTestId`)
- Restriction logic (via `restricted_elements`)

This keeps everything in sync. When a new interactive element is introduced, it only needs an entry in the enum. From there, it can immediately be targeted by tutorials and tests, as long as the component is decorated with the appropriate popover / popup decorator.

## Project Layout

Here's how the code is organized:

```
src/
├── features/
│   ├── canvas/           # Everything ReactFlow-related
│   ├── code_editor/      # CodeMirror and policy editing
│   └── iam_entities/     # Entity creation dialogs
│
├── machines/
│   ├── level1/ through level12/  # Per-level definitions
│   ├── common-state-machine-setup.ts
│   └── shared-top-level-events.ts
│
├── components/
│   ├── providers/        # Context providers
│   ├── Popover/          # Tutorial popovers
│   ├── Popup/            # Tutorial popups
│   ├── SidePanels/       # Objectives panel, etc.
│   ├── Decorated/        # Pre-wrapped components
│   └── ...
│
├── factories/
│   ├── nodes/            # Node creation factories
│   ├── edge-factory.ts
│   └── layout-group-factory.ts
│
├── decorators/           # HOCs for tutorial behavior
├── hooks/                # Custom React hooks
├── stores/               # @xstate/store instances
├── types/                # TypeScript definitions
├── schemas/              # JSON validation schemas
├── config/               # Constants, element IDs, registry
└── utils/                # Shared utilities
```

### Project Structure Philosophy

The split between `features/` and `machines/` is intentional.

`features/` is about rendering — React components, hooks, and UI stores.
`machines/` is about logic — what can happen, in what order, and under what conditions.

Each level is fully self-contained inside its own `machines/level{N}/` folder.
You can understand Level 5 without needing to look at Level 4 or Level 6.

---

## Patterns Worth Knowing

### Factory functions for nodes and edges

Rather than constructing node objects inline everywhere, factories in [src/factories/](src/factories/) provide consistent defaults:

```typescript
const policy = createPolicyNode({
  id: 'my-policy',
  label: 'AdminAccess',
  layout_group_id: 'center',
});
```

The factory fills in entity type, default styles, and generates IDs if needed. Same idea for edges and layout groups.

### Decorators for cross-cutting concerns

Three HOCs in [src/decorators/](src/decorators/) handle tutorial behavior:

- `withPopover` — Wraps a component with popover trigger logic
- `withTutorialGuard` — Hides the component if it's currently restricted
- `withStatemachineEvent` — Fires a machine event when clicked

These stack. A button might need all three. Rather than prop-drilling tutorial state everywhere, the decorators grab what they need from context.

### Hooks as an alternative

The hooks in [src/hooks/](src/hooks/) offer the same functionality but composable within a component:

```typescript
function MyButton() {
  const restricted = useIsElementRestricted(ElementId.MyButton);
  const { isPopoverActive } = useTutorialPopover(ElementId.MyButton);

  if (restricted) return null;
  return <Button>...</Button>;
}
```

Hooks are easier to test and make the behavior of a component more explicit. For that reason, the codebase is gradually moving away from decorators toward hooks where it makes sense. Stacking decorators can also become hard to reason about over time — in some cases a single component ends up wrapped in several different decorators, effectively combining all available behaviors at once.

```typescript
  export const GuardedMenuItemWithEventAndPopover = withTutorialGuard<
    MenuItemProps & { event: StatelessStateMachineEvent; 'data-element-id': string }
  >(MenuItemWithEventAndPopover);
  export const GuardedIconButtonWithStateMachineEvent = withTutorialGuard<
    IconButtonProps & { event: StatelessStateMachineEvent; 'data-element-id': string }
  >(WithStateMachineEventIconButton);
  export const GuardedMenuItemWithPopover = withTutorialGuard<
    MenuItemProps & { 'data-element-id': string }
  >(WithPopoverMenuItem);
}
```

### The provider stack

[LevelsProgressionProvider](src/components/providers/LevelsProgressionProvider.tsx) deserves special mention. It:

1. Reads the current level from the store
2. Looks up the machine definition from a registry
3. Checks localStorage for a checkpoint snapshot
4. Creates (or restores) the actor
5. Wraps children in the actor's context

Changing levels means unmounting this provider and remounting with a different machine. All the subscriptions and state reset automatically.

---

## Testing Approach

### End-to-end with Playwright

The E2E suite in [`tests/e2e/`](tests/e2e/) covers every level of the application.
Each level has a dedicated spec file that walks through the full user flow.

Custom fixtures in
[`test-fixtures.ts`](tests/e2e/helpers/test-fixtures.ts) provide high-level testing primitives:

- `tutorial` — advance through popups and popovers
- `nodes` — create, delete, and assert against nodes
- `edges` — draw and validate connections
- `setLevel` — start at a specific level
- `goToLevelAtStage` — jump directly to a mid-level checkpoint

Helper modules in the same directory (`node-actions.ts`, `edge-actions.ts`, etc.) encapsulate common operations to keep test cases concise and readable.

### Stage snapshots

Complex levels contain many tutorial steps. Replaying the full flow in every test significantly increases execution time, particularly in CI.

Stage snapshots allow tests to start from intermediate checkpoints:

1. Play through a level to the desired state
2. Export the machine snapshot using the debug utility
3. Encode and store the snapshot as part of the test setup
4. Load the snapshot in tests via `loadStage('level5-stage3')`

This approach substantially reduces test runtime for targeted scenarios.

This introduces a maintenance tradeoff: if a level’s state model changes, the corresponding snapshot must be regenerated.

### Unit tests with Vitest

Utility code under [`src/utils/`](src/utils/) and selected machine helpers are covered by unit tests.
These execute quickly and cover edge cases that are difficult to express through E2E testing.

### Configuration notes

In CI, tests run with two workers.
Traces are captured on the first retry.
Screenshots and videos are recorded on failure.

---

## Building and Deploying

### Development

```bash
make run-dev
```

This builds and runs the Docker dev container with hot reload. The app appears at `localhost:5173`.

Vite handles bundling with:

- Path alias `@` → `src/`
- Node polyfills for browser compatibility
- TypeScript checking on save

### Production build

```bash
make docker-build
```

The [Dockerfile](Dockerfile) has two stages:

1. **Builder**: Node 22 Alpine, installs dependencies via Yarn 4, runs `yarn build`
2. **Runtime**: Nginx Alpine, copies the built `dist/` folder, serves static files

Final image is tiny, just Nginx and the compiled assets.

### Scripts

From `package.json`:

- `yarn dev` — Start Vite dev server
- `yarn build` — Production build to `dist/`
- `yarn test` — Run Vitest unit tests
- `yarn lint` / `yarn lint:fix` — ESLint
- `yarn format` — Prettier

The Makefile wraps Docker operations:

- `make run-dev` — Dev container with mounted source
- `make run-prod` — Production container
- `make test-e2e` — Run Playwright suite

---

That's the architecture. Questions or clarifications welcome—open an issue or find me on the project's discussions.
