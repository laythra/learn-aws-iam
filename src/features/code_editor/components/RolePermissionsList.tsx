import {
  ListItem,
  List,
  Checkbox,
  Text,
  Heading,
  Box,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  AccordionItem,
} from '@chakra-ui/react';
import isEqual from 'lodash/isEqual';

import { useLevelSelector } from '@/app_shell/runtime/level-runtime';
import codeEditorStateStore from '@/stores/code-editor-state-store';
import { IAMNodeEntity } from '@/types/iam-enums';

interface RolePermissionsListProps {}

export const RolePermissionsList: React.FC<RolePermissionsListProps> = () => {
  const nodes = useLevelSelector(state => state.context.nodes, isEqual);
  const policyNodes = nodes.filter(node => node.data.entity === IAMNodeEntity.Policy);

  const updateSelectedPolicies = (policyId: string, isChecked: boolean): void => {
    codeEditorStateStore.send({
      type: isChecked ? 'selectPolicy' : 'deselectPolicy',
      policyId,
    });
  };

  return (
    <Box py={2}>
      <Accordion allowToggle>
        <AccordionItem>
          <AccordionButton>
            <Heading size='md' py={2}>
              Role Permissions
            </Heading>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <List maxH={200} overflow='auto'>
              {policyNodes.map(node => (
                <ListItem key={node.id}>
                  <Checkbox onChange={e => updateSelectedPolicies(node.id, e.target.checked)}>
                    <Text fontWeight='700'>{node.data.label}</Text>
                  </Checkbox>
                </ListItem>
              ))}
            </List>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
};
