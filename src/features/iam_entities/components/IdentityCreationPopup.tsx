import { useEffect, useState } from 'react';

import {
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  Flex,
  FormControl,
  FormLabel,
  FormHelperText,
  Divider,
  TabList,
  Tabs,
  Tab,
} from '@chakra-ui/react';
import _ from 'lodash';
import { Node } from 'reactflow';
import { EventFrom } from 'xstate';

import { useIdentityCreator } from '../hooks/useIdentityCreator';
import { WithPopoverBox, WithPopoverInput } from '@/components/Decorated';
import { LevelsProgressionContext } from '@/components/providers/LevelsProgressionProvider';
import { IAMIdentityEntity, IAMNodeEntity, IAMPolicyNodeData, IAMAnyNodeData } from '@/types';

interface IdentityCreationPopupProps {}

export const IdentityCreationPopup: React.FC<IdentityCreationPopupProps> = () => {
  const levelActor = LevelsProgressionContext.useActorRef();
  const {
    next_node_position: nextNodePosition,
    iam_user_template: iamUserNodeTemplate,
    iam_group_template: iamGroupNodeTemplate,
    next_iam_node_id: nextIamNodeId,
  } = LevelsProgressionContext.useSelector(state => {
    return _.pick(state.context, [
      'next_node_position',
      'iam_user_template',
      'iam_group_template',
      'next_iam_node_id',
    ]);
  });

  const { closeIdentityCreator, isIdentityCreatorOpen } = useIdentityCreator();
  const [userName, setUserName] = useState('');
  const [groupName, setGroupName] = useState('');
  const [iamIdentityEntity, setIamIdentityEntity] = useState<IAMIdentityEntity>(IAMNodeEntity.User);
  const [attachedPolicies, setAttachedPolicies] = useState<IAMPolicyNodeData[]>([]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (iamIdentityEntity === IAMNodeEntity.User) {
      setUserName(e.target.value);
    } else {
      setGroupName(e.target.value);
    }
  };

  const handleTabChange = (index: number): void => {
    const newEntity = index === 0 ? IAMNodeEntity.User : IAMNodeEntity.Group;
    levelActor.send({ type: 'CREATE_IAM_IDENTITY_TAB_CHANGED' });

    setIamIdentityEntity(newEntity);
  };

  const getNameFieldVal = (): string => {
    return iamIdentityEntity === IAMNodeEntity.User ? userName : groupName;
  };

  const submit = (): void => {
    const nodeTemplate =
      iamIdentityEntity === IAMNodeEntity.User ? iamUserNodeTemplate : iamGroupNodeTemplate;

    // Passing an empty object as the first argument to _.merge to produce a new object reference.
    const nodeId = `${nodeTemplate?.id}_${nextIamNodeId}`;

    console.log(nodeId);
    const node: Node<IAMAnyNodeData> = _.merge({}, nodeTemplate, {
      id: nodeId,
      description: `New ${_.upperFirst(iamIdentityEntity)}`,
      position: nextNodePosition,
      data: {
        label: getNameFieldVal(),
        entity: iamIdentityEntity,
      },
    });

    const creationEvent =
      iamIdentityEntity === IAMNodeEntity.User ? 'IAM_USER_CREATED' : 'IAM_GROUP_CREATED';

    levelActor.send({ type: 'ADD_IAM_NODE', node: node });
    levelActor.send({ type: creationEvent });

    closeIdentityCreator();
  };

  useEffect(() => {
    if (isIdentityCreatorOpen) {
      levelActor.send({ type: 'CREATE_IAM_IDENTITY_POPUP_OPENED' } as EventFrom<
        typeof levelActor.logic
      >);
    }
  }, [isIdentityCreatorOpen]);

  return (
    <Modal isOpen={isIdentityCreatorOpen} onClose={closeIdentityCreator}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Flex justifyContent='space-between'>
            <Text>New {_.upperFirst(iamIdentityEntity)}</Text>
            <WithPopoverBox elementid='identity_creation_select' fontSize='8px'>
              <Tabs onChange={handleTabChange} variant='soft-rounded' size='sm'>
                <TabList>
                  <Tab>User</Tab>
                  <Tab>Group</Tab>
                </TabList>
              </Tabs>
            </WithPopoverBox>
          </Flex>
        </ModalHeader>
        <ModalBody>
          <FormControl>
            <FormLabel>
              {iamIdentityEntity === IAMNodeEntity.User ? 'User Name' : 'Group Name'}
            </FormLabel>
            <WithPopoverInput
              elementid='iam_identity_name'
              value={getNameFieldVal()}
              onChange={handleNameChange}
            />
            <FormHelperText>This could be any name you like...</FormHelperText>
          </FormControl>

          <Divider my={4} />

          {/* <PoliciesList
            attachedPolicies={attachedPolicies}
            setAttachedPolicies={setAttachedPolicies}
          /> */}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={submit}>
            Submit
          </Button>
          <Button variant='ghost' onClick={closeIdentityCreator}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
