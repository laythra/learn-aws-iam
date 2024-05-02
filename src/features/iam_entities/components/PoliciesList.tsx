import { FormControl, FormLabel, Stack, Checkbox, Text } from '@chakra-ui/react';
import _ from 'lodash';

import { useIAMNodesManager } from '@/hooks/useIAMNodesManager';
import { IAMNodeEntity } from '@/types';

interface PoliciesList {}

const PoliciesList: React.FC<PoliciesList> = () => {
  const { createdNodes } = useIAMNodesManager();
  const policies = createdNodes.filter(node => node.entity === IAMNodeEntity.Policy);

  return (
    <FormControl>
      <FormLabel>Associated Policies</FormLabel>
      {_.isEmpty(policies) && (
        <Text textAlign='center' p={4} decoration='GrayText' fontWeight='bold'>
          No policies created yet
        </Text>
      )}
      <Stack>
        {policies.map(node => {
          return (
            <Checkbox key={node.id} value={node.id}>
              {node.label}
            </Checkbox>
          );
        })}
      </Stack>
    </FormControl>
  );
};

export default PoliciesList;
