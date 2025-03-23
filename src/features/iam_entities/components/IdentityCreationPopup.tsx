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
import { ElementID } from '@/config/element-ids';
import { useDisableInTutorial } from '@/hooks/useDisableInTutorial';
import { IAMIdentityEntity, IAMNodeEntity } from '@/types';
import {
  StatefulStateMachineEvent,
  StatelessStateMachineEvent,
} from '@/types/state-machine-event-enums';

interface IdentityCreationPopupProps {}

export const IdentityCreationPopup: React.FC<IdentityCreationPopupProps> = () => {
  const levelActor = LevelsProgressionContext().useActorRef();

  const { closeIdentityCreator, isIdentityCreatorOpen, defaultSelectedIdentity } =
    useIdentityCreator();

  const { isElementEnabled } = useDisableInTutorial({
    elementIds: [ElementID.IdentityCreationPopupGroupTab, ElementID.IdentityCreationPopupUserTab],
  });

  const [userName, setUserName] = useState('');
  const [groupName, setGroupName] = useState('');
  const [iamIdentityEntity, setIamIdentityEntity] =
    useState<IAMIdentityEntity>(defaultSelectedIdentity);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (iamIdentityEntity === IAMNodeEntity.User) {
      setUserName(e.target.value);
    } else {
      setGroupName(e.target.value);
    }
  };

  const handleTabChange = (index: number): void => {
    const newEntity = index === 0 ? IAMNodeEntity.User : IAMNodeEntity.Group;
    levelActor.send({ type: StatelessStateMachineEvent.CreateIAMIdentityTabChanged });

    setIamIdentityEntity(newEntity);
  };

  const getNameFieldVal = (): string => {
    return iamIdentityEntity === IAMNodeEntity.User ? userName : groupName;
  };

  const submit = (): void => {
    levelActor.send({
      type: StatefulStateMachineEvent.AddIAMUserGroupNode,
      node_data: { label: getNameFieldVal() },
      node_entity: iamIdentityEntity,
    });

    closeIdentityCreator();
  };

  useEffect(() => {
    if (isIdentityCreatorOpen) {
      levelActor.send({
        type: StatelessStateMachineEvent.CreateIAMIdentityPopupOpened,
      } as EventFrom<typeof levelActor.logic>);
    }
  }, [isIdentityCreatorOpen]);

  useEffect(() => {
    if (isElementEnabled(ElementID.IdentityCreationPopupUserTab)) {
      setIamIdentityEntity(IAMNodeEntity.User);
    } else if (isElementEnabled(ElementID.IdentityCreationPopupGroupTab)) {
      setIamIdentityEntity(IAMNodeEntity.Group);
    }
  }, [isElementEnabled]);

  return (
    <Modal isOpen={isIdentityCreatorOpen} onClose={closeIdentityCreator}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Flex justifyContent='space-between'>
            <Text>New {_.upperFirst(iamIdentityEntity)}</Text>
            <WithPopoverBox elementid={ElementID.IAMIdentitySelectorTypeForCreation} fontSize='8px'>
              <Tabs
                onChange={handleTabChange}
                variant='soft-rounded'
                size='sm'
                index={iamIdentityEntity === IAMNodeEntity.User ? 0 : 1}
              >
                <TabList>
                  <Tab isDisabled={!isElementEnabled(ElementID.IdentityCreationPopupUserTab)}>
                    {IAMNodeEntity.User}
                  </Tab>
                  <Tab isDisabled={!isElementEnabled(ElementID.IdentityCreationPopupGroupTab)}>
                    {IAMNodeEntity.Group}
                  </Tab>
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
              elementid={ElementID.IAMIdentityNameInput}
              value={getNameFieldVal()}
              onChange={handleNameChange}
            />
            <FormHelperText>This could be any name you like...</FormHelperText>
          </FormControl>

          <Divider my={4} />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={submit}>
            submit
          </Button>
          <Button variant='ghost' onClick={closeIdentityCreator}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
