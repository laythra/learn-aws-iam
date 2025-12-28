export const VALID_INITIAL_POSITIONS = [
  'center',
  'top-center',
  'bottom-center',
  'left-center',
  'right-center',
  'top-left',
  'top-right',
  'bottom-left',
  'bottom-right',
] as const;

export type ValidInitialPosition = (typeof VALID_INITIAL_POSITIONS)[number];

/**
 * Defines logical placement of nodes in layout groups inside the canvas.
 * Nodes in the same group are positioned relative to each other and stacked by direction.
 */
export interface NodeLayoutGroup {
  id: string;
  /**
   * Defines the initial position of the group relative to the canvas viewport.
   * This is used to position the group when it is first rendered.
   */
  position: ValidInitialPosition;
  /**
   * Defines the direction in which nodes are laid out within this group.
   * 'horizontal' means nodes are laid out side by side,
   * 'vertical' means nodes are stacked on top of each other.
   */
  layout_direction: 'horizontal' | 'vertical';
  /**
   * Defines the amount of space between its adjacent vertical nodes
   * and horizontal nodes, depending on the layout direction.
   */
  vertical_spacing?: number;
  /**
   * Defines the amount of space between its adjacent horizontal nodes
   * and vertical nodes, depending on the layout direction.
   */
  horizontal_spacing?: number;
  /**
   * Defines the margin around the group.
   * Supports top and left margins.
   */
  margin?: {
    top: number;
    left: number;
  };
}
