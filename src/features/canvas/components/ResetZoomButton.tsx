import { useReactFlow, Viewport, ControlButton } from '@xyflow/react';

import { TutorialPopover } from '@/app_shell/tutorial/TutorialPopover';
import { ElementID } from '@/config/element-ids';

export const ResetZoomButton: React.FC = () => {
  const { setViewport } = useReactFlow();

  const resetTo100 = (): void => {
    const vp: Viewport = { x: 0, y: 0, zoom: 1 };
    setViewport(vp, { duration: 300 });
  };

  return (
    <TutorialPopover elementId={ElementID.ResetZoomButton}>
      <ControlButton onClick={resetTo100} title='Reset view (origin, 1x zoom)'>
        1×
      </ControlButton>
    </TutorialPopover>
  );
};
