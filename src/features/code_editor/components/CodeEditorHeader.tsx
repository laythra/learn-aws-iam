import { Flex, Tab, TabList, Tabs, Text } from '@chakra-ui/react';
import _ from 'lodash';

import codeEditorStateStore from '../stores/code-editor-state-store';
import { CodeEditorMode } from '@/stores/code-editor-popup-store';
import { IAMNodeEntity, IAMScriptableEntity } from '@/types';
interface CodeEditorHeaderProps {
  selectedIAMEntity: IAMScriptableEntity;
  codeEditorMode: CodeEditorMode;
}

export const CodeEditorHeader: React.FC<CodeEditorHeaderProps> = ({
  selectedIAMEntity,
  codeEditorMode,
}) => {
  if (codeEditorMode === CodeEditorMode.Edit) {
    return <Text>Edit {_.upperFirst(selectedIAMEntity)}</Text>;
  }

  const setSelectedIAMEntity = (entity: IAMScriptableEntity): void => {
    codeEditorStateStore.send({ type: 'setSelectedIAMEntity', payload: entity });
  };

  return (
    <Flex justifyContent='space-between'>
      <Text>New {_.upperFirst(selectedIAMEntity)}</Text>
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
    </Flex>
  );
};
