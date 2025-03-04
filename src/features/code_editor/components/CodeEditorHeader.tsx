import { Flex, HStack, Tab, TabList, Tabs, Text } from '@chakra-ui/react';
import _ from 'lodash';

import CodeEditorHelpButton from './CodeEditorHelpButton';
import codeEditorStateStore from '../stores/code-editor-state-store';
import { CanvasStore } from '@/features/canvas/stores/canvas-store';
import { CodeEditorMode } from '@/stores/code-editor-popup-store';
import { IAMNodeEntity, IAMScriptableEntity } from '@/types';
interface CodeEditorHeaderProps {
  selectedIAMEntity: IAMScriptableEntity;
  codeEditorMode: CodeEditorMode;
  nodeId: string;
}

export const CodeEditorHeader: React.FC<CodeEditorHeaderProps> = ({
  selectedIAMEntity,
  codeEditorMode,
  nodeId,
}) => {
  if (codeEditorMode === CodeEditorMode.Edit) {
    const selectedNode = CanvasStore.getSnapshot().context.nodes.find(node => node.id === nodeId)!;

    return (
      <HStack justifyContent='space-between'>
        <Text>
          Edit {_.upperFirst(selectedIAMEntity)}: {selectedNode.data.label}
        </Text>
        <CodeEditorHelpButton selectedEntity={selectedNode.data.entity as IAMScriptableEntity} />
      </HStack>
    );
  }

  const setSelectedIAMEntity = (entity: IAMScriptableEntity): void => {
    codeEditorStateStore.send({ type: 'setSelectedIAMEntity', payload: entity });
  };

  return (
    <Flex justifyContent='space-between'>
      <Text>New {_.upperFirst(selectedIAMEntity)}</Text>

      <HStack>
        <CodeEditorHelpButton selectedEntity={selectedIAMEntity} />
        <Tabs
          index={selectedIAMEntity === IAMNodeEntity.Policy ? 0 : 1}
          onChange={index =>
            setSelectedIAMEntity(index === 0 ? IAMNodeEntity.Policy : IAMNodeEntity.Role)
          }
          variant='soft-rounded'
          size='sm'
        >
          <TabList>
            <Tab>{IAMNodeEntity.Policy}</Tab>
            <Tab>{IAMNodeEntity.Role}</Tab>
          </TabList>
        </Tabs>
      </HStack>
    </Flex>
  );
};
