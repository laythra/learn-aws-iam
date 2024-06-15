import { useContext } from 'react';

import { Flex, Text, Box, Button, Icon } from '@chakra-ui/react';
import { IconButton } from '@chakra-ui/react';
import { Handle, NodeProps } from 'reactflow';

import IAMNodeIcon from './IAMNodeIcon';
import { IconButtonWithPopover } from '@/components/Element/Button/IconButtonWithPopover';
import { LevelsProgressionContext } from '@/components/levels_progression/LevelsProgressionProvider';
import { IAMNodeContext } from '@/components/nodes/IAMNodeProvider';
import { withPopover } from '@/decorators/withPopover';
import type { TutorialMessage } from '@/machines/types';
import type { IAMCanvasNodeProps } from '@/types';

/**
 * `IAMCanvasNode` renders a generic square node with a label and an icon.
 * It uses Chakra UI for styling and Ant Design icons for the icon.
 *
 * Props:
 * @param `id`: The unique identifier of the node.
 * @param `data`: The node data passed from React Flow.
 */
const IAMCanvasNode: React.FC<NodeProps> = ({ data, id }) => {
  const { description, entity, label, handles } = data as IAMCanvasNodeProps;
  const { setSelectedNode, selectedNode } = useContext(IAMNodeContext);
  const levelState = LevelsProgressionContext.useSelector(state => state);
  const levelActor = LevelsProgressionContext.useActorRef();

  const handleClick = (): void => {
    setSelectedNode({ id, label, entity, description });
  };

  const popoverContent = (): TutorialMessage => {
    return {
      element_id: id,
      popover_title: label,
      popover_content: 'This is some dummy content',
      show_next_button: false,
      popover_placement: 'top-end',
    };
  };

  const showInfoPopover = (): void => {
    levelActor.send({ type: 'SHOW_POPOVER', popover_content: popoverContent() });
  };

  const isSelected = selectedNode?.id === id;

  return (
    <Flex
      direction='column'
      justifyContent='center'
      alignItems='center'
      p={4}
      bg='white'
      boxShadow='md'
      borderRadius='lg'
      position='relative'
      width='100px'
      height='100px'
      textAlign='center'
      borderWidth={isSelected ? '2px' : '1px'}
      borderColor={isSelected ? 'blue.500' : 'gray.200'}
      onClick={handleClick}
    >
      {handles.map(handle => (
        <Handle key={handle.id} {...handle} />
      ))}
      <IAMNodeIcon nodeLabel='User' />
      <Box marginTop={1}>
        <Text fontWeight='700'>{label}</Text>
      </Box>
      <IconButton
        aria-label='info'
        icon={<IAMNodeIcon nodeLabel='User' boxSize='12px' />}
        size='sm'
        position='absolute'
        top={0}
        right={0}
        onClick={showInfoPopover}
        variant='ghost'
        _hover={{ bg: 'gray.200' }}
      />
    </Flex>
  );
};

export default withPopover(IAMCanvasNode);
