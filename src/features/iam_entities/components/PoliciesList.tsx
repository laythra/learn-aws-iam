import { FormControl, FormLabel, Stack, Checkbox, Text } from '@chakra-ui/react';
import _ from 'lodash';
import { Node } from 'reactflow';

import { LevelsProgressionContext } from '@/components/providers/LevelsProgressionProvider';
import { IAMNodeEntity, IAMPolicyNodeData } from '@/types';

interface PoliciesListProps {
  attachedPolicies: IAMPolicyNodeData[];
  setAttachedPolicies: (policies: IAMPolicyNodeData[]) => void;
}

export const PoliciesList: React.FC<PoliciesListProps> = ({
  attachedPolicies,
  setAttachedPolicies,
}) => {
  const createdNodes = LevelsProgressionContext().useSelector(state => state.context.nodes);
  const policies = createdNodes.filter(
    node => node.data.entity === IAMNodeEntity.Policy
  ) as Node<IAMPolicyNodeData>[];

  const handlePolicyChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const policyId = e.target.value;
    const targetPolicy = policies.find(p => p.id === policyId) as Node<IAMPolicyNodeData>;

    if (!e.target.checked) {
      setAttachedPolicies(attachedPolicies.filter(p => p.id !== policyId));
    } else if (targetPolicy) {
      // setAttachedPolicies([...attachedPolicies, targetPolicy]);
    }
  };

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
          const isPolicyAttached = _.some(attachedPolicies, { id: node.id });
          return (
            <Checkbox
              key={node.id}
              value={node.id}
              checked={isPolicyAttached}
              onChange={handlePolicyChange}
            >
              {node.className}
            </Checkbox>
          );
        })}
      </Stack>
    </FormControl>
  );
};
