import { Dispatch, SetStateAction } from 'react';

import { Flex, Tab, TabList, Tabs, Text } from '@chakra-ui/react';
import _ from 'lodash';

import { CodeEditorMode } from '@/stores/code-editor-popup-store';
import { IAMNodeEntity, IAMScriptableEntity } from '@/types';

interface CodeEditorHeaderProps {
  codeEditorMode: CodeEditorMode;
  selectedIAMEntity: string;
  setSelectedIAMEntity: (entity: IAMScriptableEntity) => void;
}

export const CodeEditorHeader: React.FC<CodeEditorHeaderProps> = ({
  codeEditorMode,
  selectedIAMEntity,
  setSelectedIAMEntity,
}) => {
  if (codeEditorMode === CodeEditorMode.Edit) {
    return <Text>Edit {_.upperFirst(selectedIAMEntity)}</Text>;
  }

  return (
    <Flex justifyContent='space-between'>
      <Text>New {_.upperFirst(selectedIAMEntity)}</Text>
      <Tabs
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
