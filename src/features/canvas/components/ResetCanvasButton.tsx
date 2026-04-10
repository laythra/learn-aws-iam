import { ArrowPathIcon } from '@heroicons/react/24/solid';
import { ControlButton } from '@xyflow/react';

import { ElementID } from '@/config/element-ids';
import { TutorialPopover } from '@/runtime/tutorial/TutorialPopover';

interface ResetCanvasButtonProps {
  onReset: () => void;
}

export const ResetCanvasButton: React.FC<ResetCanvasButtonProps> = ({ onReset }) => {
  return (
    <TutorialPopover elementId={ElementID.ResetCanvasButton}>
      <ControlButton onClick={onReset} title='Reset canvas to original layout'>
        <ArrowPathIcon width={16} height={16} />
      </ControlButton>
    </TutorialPopover>
  );
};
