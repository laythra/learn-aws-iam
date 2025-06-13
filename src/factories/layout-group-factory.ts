import { ValidInitialPosition } from '@/features/canvas/utils/nodes-position';
import { theme } from '@/theme';
import { NodeLayoutGroup } from '@/types';

const DEFAULT_HORIZONTAL_SPACING = theme.sizes.iamNodeWidthInPixels + 20;
const DEFAULT_VERTICAL_SPACING = theme.sizes.iamNodeHeightInPixels + 20;

export function createHorizontalGroup(
  id: string,
  position: ValidInitialPosition,
  spacing = DEFAULT_HORIZONTAL_SPACING
): NodeLayoutGroup {
  return {
    id,
    position,
    layout_direction: 'horizontal',
    horizontal_spacing: spacing,
  };
}

export function createVerticalGroup(
  id: string,
  position: ValidInitialPosition,
  spacing = DEFAULT_VERTICAL_SPACING
): NodeLayoutGroup {
  return {
    id,
    position,
    layout_direction: 'vertical',
    vertical_spacing: spacing,
  };
}
