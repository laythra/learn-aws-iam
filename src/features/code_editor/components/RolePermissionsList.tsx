import {
  ListItem,
  List,
  Checkbox,
  Text,
  HStack,
  Heading,
  Box,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  AccordionItem,
} from '@chakra-ui/react';
import _ from 'lodash';

import { LevelsProgressionContext } from '@/components/providers/LevelsProgressionProvider';
import { IAMNodeEntity } from '@/types';

interface RolePermissionsListProps {}

export const RolePermissionsList: React.FC<RolePermissionsListProps> = () => {
  const nodes = LevelsProgressionContext.useSelector(state => state.context.nodes, _.isEqual);
  const policyNodes = nodes.filter(node => node.data.entity === IAMNodeEntity.Policy);

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
                  <Checkbox>
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
