import { Flex, HStack, Tab, TabList, Tabs, Text } from '@chakra-ui/react';
import _ from 'lodash';

import CodeEditorHelpButton from './CodeEditorHelpButton';
import { ElementID } from '@/config/element-ids';
import { CanvasStore } from '@/features/canvas/stores/canvas-store';
import { useIsElementRestricted } from '@/hooks/useIsElementRestricted';
import codeEditorStateStore from '@/stores/code-editor-state-store';
import { IAMCodeDefinedEntity, IAMNodeEntity } from '@/types';
interface CodeEditorHeaderProps {
  selectedIAMEntity: IAMCodeDefinedEntity;
  codeEditorMode: 'create' | 'edit';
  nodeId: string;
}

export const CodeEditorHeader: React.FC<CodeEditorHeaderProps> = ({
  selectedIAMEntity,
  codeEditorMode,
  nodeId,
}) => {
  if (codeEditorMode === 'edit') {
    const selectedNode = CanvasStore.getSnapshot().context.nodes.find(node => node.id === nodeId)!;

    return (
      <HStack justifyContent='space-between'>
        <Text>
          Edit {_.upperFirst(selectedIAMEntity)}: {selectedNode.data.label}
        </Text>
        <CodeEditorHelpButton selectedEntity={selectedNode.data.entity as IAMCodeDefinedEntity} />
      </HStack>
    );
  }

  const setSelectedIAMEntity = (entity: IAMCodeDefinedEntity): void => {
    codeEditorStateStore.send({ type: 'setSelectedIAMEntity', payload: entity });
  };

  const tabs = [
    { element_id: ElementID.CodeEditorPolicyTab, node_entity: IAMNodeEntity.Policy },
    { element_id: ElementID.CodeEditorRoleTab, node_entity: IAMNodeEntity.Role },
    { element_id: ElementID.CodeEditorSCPTab, node_entity: IAMNodeEntity.SCP },
    {
      element_id: ElementID.CodeEditorResourcePolicyTab,
      node_entity: IAMNodeEntity.ResourcePolicy,
    },
  ];

  const restrictedTabs = useIsElementRestricted(tabs.map(tab => tab.element_id));

  const tabsToRender = tabs.filter((_tab, index) => {
    return !restrictedTabs[index];
  });

  return (
    <Flex justifyContent='space-between'>
      <Text>New {_.upperFirst(selectedIAMEntity)}</Text>

      <HStack>
        <CodeEditorHelpButton selectedEntity={selectedIAMEntity} />
        <Tabs
          index={tabsToRender.findIndex(tab => tab.node_entity === selectedIAMEntity)}
          onChange={index =>
            setSelectedIAMEntity(tabsToRender[index].node_entity as IAMCodeDefinedEntity)
          }
          variant='soft-rounded'
          size='sm'
        >
          <TabList>
            {tabsToRender.map(({ element_id, node_entity }) => (
              <Tab key={element_id}>{node_entity}</Tab>
            ))}
          </TabList>
        </Tabs>
      </HStack>
    </Flex>
  );
};
