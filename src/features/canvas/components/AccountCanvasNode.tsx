import { useEffect } from 'react';

import { Box, Text, Tooltip, useTheme } from '@chakra-ui/react';
import { ArrowDownLeftIcon, ArrowUpRightIcon } from '@heroicons/react/24/solid';
import { Handle, Position, useUpdateNodeInternals } from '@xyflow/react';

import { CanvasStore } from '../stores/canvas-store';
import { useLevelSelector } from '@/app_shell/runtime/level-runtime';
import { TutorialPopover } from '@/app_shell/tutorial/TutorialPopover';
import { CustomTheme } from '@/types/custom-theme';
import { HandleID } from '@/types/iam-enums';
import { IAMAccountNode } from '@/types/iam-node-types';

export interface IAMCanvasNodeProps {
  data: IAMAccountNode['data'];
  id: string;
  height?: number | undefined;
  width?: number | undefined;
}

export const AccountCanvasNode: React.FC<IAMCanvasNodeProps> = ({
  data: { collapsed, label, handles },
  id,
  height: nodeHeight,
  width: nodeWidth,
}) => {
  const updateNodeInternals = useUpdateNodeInternals();
  const withPopoverElementId = useLevelSelector(state => state.context.popover_content?.element_id);
  const isSelected = withPopoverElementId === id;
  const theme = useTheme<CustomTheme>();

  const toggleCollapse = (): void => {
    CanvasStore.send({
      type: 'toggleAccountCollapse',
      accountId: id,
    });
  };

  useEffect(() => {
    updateNodeInternals(id);
  }, [collapsed, id, updateNodeInternals]);

  useEffect(() => {
    if (withPopoverElementId === id) {
      CanvasStore.send({ type: 'updateSelectedNodeId', nodeId: id });
    }
  }, [withPopoverElementId, id]);

  const finalHeight = collapsed ? 80 : nodeHeight;
  const finalWidth = collapsed ? 200 : nodeWidth;

  return (
    <TutorialPopover elementId={id}>
      <Box
        bg={collapsed ? 'gray.50' : 'whiteAlpha.600'}
        border='2px solid'
        borderColor='gray.500'
        borderRadius='lg'
        height={`${finalHeight}px`}
        width={`${finalWidth}px`}
        data-element-id={id}
        position='relative'
        zIndex={isSelected ? theme.zIndices.tooltip : theme.zIndices.base}
      >
        {collapsed ? (
          <>
            <Handle type='target' position={Position.Top} id={HandleID.Top} />
            <Text
              fontSize='sm'
              fontWeight='600'
              noOfLines={1}
              position='absolute'
              top='50%'
              left='50%'
              transform='translate(-50%, -50%)'
              width='90%'
              textAlign='center'
            >
              {label}
            </Text>
            <Box
              as='button'
              type='button'
              onClick={toggleCollapse}
              position='absolute'
              right={2}
              top={2}
              cursor='pointer'
            >
              <Tooltip label='Expand Node' placement='top' hasArrow>
                <Box>
                  <ArrowUpRightIcon width={16} height={16} />
                </Box>
              </Tooltip>
            </Box>
          </>
        ) : (
          <>
            <Text fontSize='large' fontWeight='700' p={2}>
              {label}
            </Text>

            <Box
              as='button'
              type='button'
              onClick={toggleCollapse}
              position='absolute'
              right={2}
              top={2}
              cursor='pointer'
            >
              <Tooltip label='Collapse Node' placement='top' hasArrow>
                <Box>
                  <ArrowDownLeftIcon width={24} height={24} />
                </Box>
              </Tooltip>
            </Box>

            {handles.map(h => (
              <Handle key={h.id} {...h} />
            ))}
          </>
        )}
      </Box>
    </TutorialPopover>
  );
};
