import { FixedPopover } from './overlays/FixedPopover';
import { MobileWarningPopup } from './overlays/MobileWarningPopup';

export const AppOverlays: React.FC = () => (
  <>
    <MobileWarningPopup />
    <FixedPopover />
  </>
);
