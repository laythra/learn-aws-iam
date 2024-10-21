import { memo } from 'react';

import {
  Popover,
  Text,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverHeader,
  PopoverBody,
  PopoverCloseButton,
  IconButton,
  type PlacementWithLogical,
  Code,
  Tooltip,
} from '@chakra-ui/react';
import { CodeBracketIcon, PencilSquareIcon } from '@heroicons/react/20/solid';

import { WithStateMachineEventIconButton } from '@/components/Decorated';
import codeEditorPopupStore, { CodeEditorMode } from '@/stores/code-editor-popup-store';
import { IAMAnyNodeData } from '@/types';

interface IAMNodeInfoButtonProps {
  nodeId: string;
  label: string;
  verboseDescription?: string;
  codeDescription?: string;
  placement?: PlacementWithLogical;
}

const IAMNodeInfoButton: React.FC<IAMNodeInfoButtonProps> = ({
  nodeId,
  label,
  verboseDescription,
  codeDescription,
  placement = 'end-end',
}) => {
  return (
    <Popover placement={placement} closeOnBlur={true} isLazy={true} closeDelay={0}>
      <PopoverTrigger>
        <WithStateMachineEventIconButton
          event='IAM_NODE_CONTENT_OPENED'
          aria-label='info'
          icon={<CodeBracketIcon />}
          position='absolute'
          top={1}
          right={1}
          variant='ghost'
          opacity={0.5}
          height='16px'
          width='16px'
          minWidth='auto'
          _hover={{ bg: 'gray.200', opacity: 1 }}
        />
      </PopoverTrigger>
      <PopoverContent w='500px' overflowY='auto'>
        <PopoverArrow />
        <PopoverHeader textAlign='left' display='flex' alignItems='center'>
          <Text fontSize='16px' fontWeight='700'>
            {label}
          </Text>
        </PopoverHeader>
        <PopoverCloseButton />
        <PopoverBody textAlign='left'>
          {codeDescription && (
            <Code width='100%' whiteSpace='pre-wrap' position='relative'>
              <Tooltip label='Edit' aria-label='Edit' placement='top'>
                <IconButton
                  onClick={() =>
                    codeEditorPopupStore.send({
                      type: 'open',
                      mode: CodeEditorMode.Edit,
                      selectedNodeId: nodeId,
                    })
                  }
                  ml={1}
                  aria-label='edit'
                  icon={<PencilSquareIcon />}
                  variant='ghost'
                  minWidth='auto'
                  height='20px'
                  width='20px'
                  position='absolute'
                  top={2}
                  right={2}
                  opacity={0.5}
                  _hover={{ bg: 'gray.200', opacity: 1 }}
                />
              </Tooltip>
              {codeDescription}
            </Code>
          )}
          {verboseDescription && <Text>{verboseDescription}</Text>}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default memo(IAMNodeInfoButton);
