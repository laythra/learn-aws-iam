import { FixedPopover } from './overlays/FixedPopover';
import { MobileWarningPopup } from './overlays/MobileWarningPopup';
import { ObjectiveCompleteToast } from './overlays/ObjectiveCompleteToast';
import { TutorialPopup } from './overlays/TutorialPopup';

export const AppOverlays: React.FC = () => (
  <>
    <TutorialPopup />
    <MobileWarningPopup />
    <ObjectiveCompleteToast />
    <FixedPopover />
  </>
);
