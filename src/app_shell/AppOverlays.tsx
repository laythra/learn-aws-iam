// Move fixed popover to level_progress feature
import { FixedPopover } from './overlays/FixedPopover';
import { MobileWarning } from './overlays/MobileWarning';

export const AppOverlays: React.FC = () => (
  <>
    <MobileWarning />
    <FixedPopover />
  </>
);
