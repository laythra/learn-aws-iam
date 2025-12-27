import { theme } from '@/theme';
import { NodeLayoutGroup, ValidInitialPosition } from '@/types/iam-layout-types';

const DEFAULT_HORIZONTAL_SPACING = theme.sizes.iamNodeWidthInPixels + 20;
const DEFAULT_VERTICAL_SPACING = theme.sizes.iamNodeHeightInPixels + 20;

export function createHorizontalGroup(
  id: string,
  position: ValidInitialPosition,
  spacing = DEFAULT_HORIZONTAL_SPACING,
  margin = { top: 0, left: 0 }
): NodeLayoutGroup {
  return {
    id,
    position,
    layout_direction: 'horizontal',
    horizontal_spacing: spacing,
    margin,
  };
}

export function createVerticalGroup(
  id: string,
  position: ValidInitialPosition,
  spacing = DEFAULT_VERTICAL_SPACING,
  margin = { top: 0, left: 0 }
): NodeLayoutGroup {
  return {
    id,
    position,
    layout_direction: 'vertical',
    vertical_spacing: spacing,
    margin,
  };
}
