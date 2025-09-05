import { useReactFlow, Viewport, ControlButton } from '@xyflow/react';

import { WithPopoverBox } from '@/components/Decorated';
import { ElementID } from '@/config/element-ids';

export const ResetZoomButton: React.FC = () => {
  const { setViewport } = useReactFlow();

  const resetTo100 = (): void => {
    const vp: Viewport = { x: 0, y: 0, zoom: 1 };
    setViewport(vp, { duration: 300 });
  };

  return (
    <WithPopoverBox data-element-id={ElementID.ResetZoomButton}>
      <ControlButton onClick={resetTo100} title='Reset view (origin, 1x zoom)'>
        1×
      </ControlButton>
    </WithPopoverBox>
  );
};
