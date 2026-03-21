import { describe, it, expect, vi } from 'vitest';

import { updateConnectionEdges } from './edges-creation-state-machine-actions';
import { createMockContext } from '@/__test-helpers__/context';
import { createGroupNode } from '@/domain/nodes/group-node-factory';
import { createUserNode } from '@/domain/nodes/user-node-factory';
import { INITIAL_TUTORIAL_POLICY_NODES } from '@/levels/level1/nodes/identity-policy-nodes';
import { INITIAL_TUTORIAL_RESOURCE_NODES } from '@/levels/level1/nodes/resource-nodes';
import { INITIAL_TUTORIAL_USER_NODES } from '@/levels/level1/nodes/user-nodes';
import { EDGE_CONNECTION_OBJECTIVES } from '@/levels/level1/objectives/edge-connection-objectives';
import { EdgeConnectionFinishEvent } from '@/levels/level1/types/finish-event-enums';
import { PolicyNodeID, ResourceNodeID, UserNodeID } from '@/levels/level1/types/node-ids';

vi.mock('@/levels/common-state-machine-setup', () => ({
  createStateMachineSetup: vi.fn(),
}));

const policyNode = INITIAL_TUTORIAL_POLICY_NODES[0];
const tutorialUser = INITIAL_TUTORIAL_USER_NODES[0];
const resourceNode = INITIAL_TUTORIAL_RESOURCE_NODES[0];

function makeBaseContext(
  overrides: Parameters<typeof createMockContext>[0] = {}
): ReturnType<typeof createMockContext> {
  return createMockContext({
    level_number: 1,
    nodes: [policyNode, tutorialUser, resourceNode],
    edges_connection_objectives: EDGE_CONNECTION_OBJECTIVES[0].map(o => ({
      ...o,
      is_finished: false,
    })),
    ...overrides,
  });
}

describe('updateConnectionEdges — objective completion (Level 1)', () => {
  it('emits the finish event when the required edge matches the active objective', () => {
    const context = makeBaseContext();
    const { events } = updateConnectionEdges(context, policyNode, tutorialUser);

    expect(events).toContain(EdgeConnectionFinishEvent.PolicyAttachedToTutorialUser);
  });

  it('does not emit a finish event when connecting to a user not in any objective', () => {
    const unknownUser = createUserNode({ dataOverrides: { id: 'user-unknown', label: 'unknown' } });
    const context = makeBaseContext({ nodes: [policyNode, unknownUser, resourceNode] });

    const { events } = updateConnectionEdges(context, policyNode, unknownUser);

    expect(events).toEqual([]);
  });

  it('marks the base edge as unnecessary_edge when no objective matches', () => {
    const unknownUser = createUserNode({ dataOverrides: { id: 'user-unknown', label: 'unknown' } });
    const context = makeBaseContext({ nodes: [policyNode, unknownUser, resourceNode] });

    const { updatedContext } = updateConnectionEdges(context, policyNode, unknownUser);

    const baseEdge = updatedContext.edges.find(
      e => e.source === PolicyNodeID.S3ReadPolicy && e.target === 'user-unknown'
    );
    expect(baseEdge?.data.unnecessary_edge).toBe(true);
  });

  it('does not emit a finish event when the objective is already finished', () => {
    const context = makeBaseContext({
      edges_connection_objectives: EDGE_CONNECTION_OBJECTIVES[0].map(o => ({
        ...o,
        is_finished: true,
      })),
    });

    const { events } = updateConnectionEdges(context, policyNode, tutorialUser);

    expect(events).toEqual([]);
  });

  it('deduplicates edges when connecting the same pair twice', () => {
    const context = makeBaseContext();
    const { updatedContext: after1 } = updateConnectionEdges(context, policyNode, tutorialUser);
    const { updatedContext: after2 } = updateConnectionEdges(after1, policyNode, tutorialUser);

    const policyToUserEdges = after2.edges.filter(
      e => e.source === PolicyNodeID.S3ReadPolicy && e.target === UserNodeID.TutorialUser
    );
    expect(policyToUserEdges).toHaveLength(1);
  });
});

describe('updateConnectionEdges — policy → group (Level 1)', () => {
  it('propagates policy access to users already connected to the group', () => {
    const groupNode = createGroupNode({ dataOverrides: { id: 'group-1', label: 'devs' } });

    const context = createMockContext({
      level_number: 1,
      nodes: [policyNode, tutorialUser, groupNode, resourceNode],
      edges_connection_objectives: [],
    });
    const { updatedContext: withUserInGroup } = updateConnectionEdges(
      context,
      tutorialUser,
      groupNode
    );
    const { updatedContext: afterPolicyAttached } = updateConnectionEdges(
      withUserInGroup,
      policyNode,
      groupNode
    );

    const userToResourceEdge = afterPolicyAttached.edges.find(
      e => e.source === UserNodeID.TutorialUser && e.target === ResourceNodeID.PublicImagesS3Bucket
    );
    expect(userToResourceEdge).toBeDefined();
  });
});
