import { FormControl, FormLabel, Stack, Checkbox, Text, Box } from '@chakra-ui/react';
import useIAMEntities from 'hooks/useIAMEntities';
import _ from 'lodash';
import { IAMNodeEntity } from 'types';

interface PoliciesList {}

const PoliciesList: React.FC<PoliciesList> = () => {
  const { createdNodes } = useIAMEntities();
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
