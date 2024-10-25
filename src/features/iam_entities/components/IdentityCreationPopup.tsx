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
import { EventFrom } from 'xstate';

import { useIdentityCreator } from '../hooks/useIdentityCreator';
import { WithPopoverBox, WithPopoverInput } from '@/components/Decorated';
import { LevelsProgressionContext } from '@/components/providers/LevelsProgressionProvider';
import { IAMIdentityEntity, IAMNodeEntity } from '@/types';

interface IdentityCreationPopupProps {}

export const IdentityCreationPopup: React.FC<IdentityCreationPopupProps> = () => {
  const levelActor = LevelsProgressionContext.useActorRef();

  const { closeIdentityCreator, isIdentityCreatorOpen } = useIdentityCreator();
  const [userName, setUserName] = useState('');
  const [groupName, setGroupName] = useState('');
  const [iamIdentityEntity, setIamIdentityEntity] = useState<IAMIdentityEntity>(IAMNodeEntity.User);

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
    if (iamIdentityEntity === IAMNodeEntity.User) {
      levelActor.send({ type: 'ADD_IAM_USER_NODE', user_props: { label: userName } });
    } else {
      // TODO: Create IAM Group node
    }

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
