/**
 * Shared markdown notes about IAM policies, reused across the code-editor help popups
 * (`features/code_editor/config/help-content.ts`) and the level tutorial popups
 * (e.g. `levels/level3/tutorial_messages/popup-tutorial-messages.ts`). Lives in `config/`
 * because `features/` and `levels/` can't import each other.
 *
 * Rendered through the custom markdown pipeline, so `::badge[]::` and `|color()` directives
 * are supported. The leading blank lines let it be appended directly after other markdown.
 */
export const CASE_SENSITIVITY_NOTE = `

> |color(blue) ::badge[CASE-SENSITIVE]:: AWS IAM is case-sensitive: element names like
**Effect**, **Action**, and **Resource**, values like **Allow** and **Deny**, and ARNs
all need the exact casing AWS uses. Action names are AWS's one exception, but they must
match exactly here too, so just follow AWS's documented casing throughout.
`;
