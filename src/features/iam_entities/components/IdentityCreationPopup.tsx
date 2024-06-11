import { useEffect, useState } from 'react';

import {
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalContent,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  Text,
  Flex,
  Select,
  FormControl,
  FormLabel,
  FormHelperText,
  Divider,
  position,
} from '@chakra-ui/react';
import _ from 'lodash';
import { Node } from 'reactflow';
import { EventFrom, EventFromLogic } from 'xstate';

import { PoliciesList } from './PoliciesList';
import { useIdentityCreator } from '../hooks/useIdentityCreator';
import { InputWithPopover } from '@/components/Form/InputWithPopover';
import { LevelsProgressionContext } from '@/components/levels_progression/LevelsProgressionProvider'; // eslint-disable-line
import { IAMIdentityEntity, IAMNodeEntity, IAMNodeProps } from '@/types';

interface IdentityCreationPopupProps {}

export const IdentityCreationPopup: React.FC<IdentityCreationPopupProps> = () => {
  const levelActor = LevelsProgressionContext.useActorRef();
  const nextNodePosition = LevelsProgressionContext.useSelector(
    state => state.context.next_node_position
  );
  const iamNodeTemplate = LevelsProgressionContext.useSelector(
    state => state.context.iam_user_template
  );

  const nextIamUserId = LevelsProgressionContext.useSelector(
    state => state.context.next_iam_user_id
  );

  const { closeIdentityCreator, isIdentityCreatorOpen } = useIdentityCreator();
  const [userName, setUserName] = useState('');
  const [groupName, setGroupName] = useState('');
  const [iamIdentityEntity, setIamIdentityEntity] = useState<IAMIdentityEntity>(IAMNodeEntity.User);
  const [attachedPolicies, setAttachedPolicies] = useState<IAMNodeProps[]>([]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (iamIdentityEntity === IAMNodeEntity.User) {
      setUserName(e.target.value);
    } else {
      setGroupName(e.target.value);
    }
  };

  const getNameFieldVal = (): string => {
    return iamIdentityEntity === IAMNodeEntity.User ? userName : groupName;
  };

  const submit = (): void => {
    const node = _.merge(iamNodeTemplate, {
      id: `iam_user${nextIamUserId}`,
      description: `New ${_.upperFirst(iamIdentityEntity)}`,
      position: nextNodePosition,
      data: {
        label: getNameFieldVal(),
      } as IAMNodeProps,
    }) as Node;

    levelActor.send({ type: 'ADD_IAM_NODE', node: node } as EventFromLogic<
      typeof levelActor.logic
    >);
    levelActor.send({ type: 'IAM_USER_CREATED' });

    closeIdentityCreator();
  };

  useEffect(() => {
    if (isIdentityCreatorOpen) {
      levelActor.send({ type: 'CREATE_USER_POPUP_OPENED' } as EventFrom<typeof levelActor.logic>);
    }
  }, [isIdentityCreatorOpen]);

  return (
    <Modal isOpen={isIdentityCreatorOpen} onClose={closeIdentityCreator}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Flex justifyContent='space-between'>
            <Text>New {_.upperFirst(iamIdentityEntity)}</Text>
            <Select
              value={iamIdentityEntity}
              onChange={e => setIamIdentityEntity(e.target.value as IAMIdentityEntity)}
              width={['100%', '50%']}
            >
              <option value={IAMNodeEntity.User}>User</option>
              <option value={IAMNodeEntity.Group}>Group</option>
            </Select>
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>
              {iamIdentityEntity === IAMNodeEntity.User ? 'User Name' : 'Group Name'}
            </FormLabel>
            <InputWithPopover id='username' value={getNameFieldVal()} onChange={handleNameChange} />
            <FormHelperText>This could be any name you like...</FormHelperText>
          </FormControl>

          <Divider my={4} />

          <PoliciesList
            attachedPolicies={attachedPolicies}
            setAttachedPolicies={setAttachedPolicies}
          />
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
