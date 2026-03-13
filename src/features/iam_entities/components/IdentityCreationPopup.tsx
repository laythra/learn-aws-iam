import { useEffect, useMemo, useState } from 'react';

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
  TabList,
  Tabs,
  Tab,
  Box,
  Input,
} from '@chakra-ui/react';
import _ from 'lodash';

import { TutorialPopover } from '@/app_shell/tutorial/TutorialPopover';
import { useIdentityCreator } from '@/app_shell/ui/useIdentityCreator';
import { useIsElementRestricted } from '@/app_shell/ui/useIsElementRestricted';
import { ElementID } from '@/config/element-ids';
import { validateIAMName } from '@/domain/iam-graph-utils';
import { useLevelActor } from '@/runtime/level-runtime';
import { IAMNodeEntity } from '@/types/iam-enums';
import {
  StatefulStateMachineEvent,
  StatelessStateMachineEvent,
} from '@/types/state-machine-event-enums';

export const IdentityCreationPopup: React.FC = () => {
  const levelActor = useLevelActor();

  const { closeIdentityCreator, isIdentityCreatorOpen, defaultSelectedIdentity } =
    useIdentityCreator();

  const [isUserTabRestricted, isGroupTabRestricted] = useIsElementRestricted([
    ElementID.IdentityCreationPopupUserTab,
    ElementID.IdentityCreationPopupGroupTab,
  ]);

  const [iamIdentityEntity, setIamIdentityEntity] = useState<
    IAMNodeEntity.User | IAMNodeEntity.Group
  >(defaultSelectedIdentity);

  const [formState, setFormState] = useState<
    Record<
      IAMNodeEntity.User | IAMNodeEntity.Group,
      { name: string; isValidating: boolean; error?: string }
    >
  >({
    [IAMNodeEntity.User]: { name: '', isValidating: false },
    [IAMNodeEntity.Group]: { name: '', isValidating: false },
  });

  const debouncedValidate = useMemo(
    () =>
      _.debounce((name: string, entity: IAMNodeEntity.User | IAMNodeEntity.Group) => {
        const existingNames = levelActor.getSnapshot().context.nodes.map(n => n.data.label);
        const error = validateIAMName(name, existingNames, 64);

        setFormState(prev => ({
          ...prev,
          [entity]: { ...prev[entity], isValidating: false, error },
        }));
      }, 500),
    [levelActor]
  );

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const name = e.target.value;

    setFormState(prev => ({
      ...prev,
      [iamIdentityEntity]: { name, error: prev[iamIdentityEntity].error, isValidating: true },
    }));

    debouncedValidate(name, iamIdentityEntity);
  };

  const handleTabChange = (index: number): void => {
    const newEntity = index === 0 ? IAMNodeEntity.User : IAMNodeEntity.Group;
    levelActor.send({ type: StatelessStateMachineEvent.CreateIAMIdentityTabChanged });

    setIamIdentityEntity(newEntity);
  };

  const getNameFieldVal = (): string => {
    return formState[iamIdentityEntity].name;
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
    if (!isIdentityCreatorOpen) return;

    levelActor.send({
      type: StatelessStateMachineEvent.CreateIAMIdentityPopupOpened,
    });

    if (!isUserTabRestricted) {
      setIamIdentityEntity(IAMNodeEntity.User);
    } else if (!isGroupTabRestricted) {
      setIamIdentityEntity(IAMNodeEntity.Group);
    }
  }, [isIdentityCreatorOpen]);

  useEffect(() => {
    handleNameChange({
      target: { value: getNameFieldVal() },
    } as React.ChangeEvent<HTMLInputElement>);
  }, [isIdentityCreatorOpen, iamIdentityEntity]);

  return (
    <Modal isOpen={isIdentityCreatorOpen} onClose={closeIdentityCreator}>
      <ModalOverlay />
      <ModalContent data-element-id={ElementID.IAMIdentityCreatorPopup}>
        <ModalHeader>
          <Flex justifyContent='space-between'>
            <Text>New {_.upperFirst(iamIdentityEntity)}</Text>
            <TutorialPopover elementId={ElementID.IAMIdentitySelectorTypeForCreation}>
              <Box data-element-id={ElementID.IAMIdentitySelectorTypeForCreation} fontSize='8px'>
                <Tabs
                  onChange={handleTabChange}
                  variant='soft-rounded'
                  size='sm'
                  index={iamIdentityEntity === IAMNodeEntity.User ? 0 : 1}
                >
                  <TabList>
                    <Tab isDisabled={isUserTabRestricted} data-element-id={ElementID.CreateUserTab}>
                      {IAMNodeEntity.User}
                    </Tab>
                    <Tab
                      isDisabled={isGroupTabRestricted}
                      data-element-id={ElementID.CreateGroupTab}
                    >
                      {IAMNodeEntity.Group}
                    </Tab>
                  </TabList>
                </Tabs>
              </Box>
            </TutorialPopover>
          </Flex>
        </ModalHeader>
        <ModalBody>
          <FormControl>
            <FormLabel>
              {iamIdentityEntity === IAMNodeEntity.User ? 'User Name' : 'Group Name'}
            </FormLabel>
            <TutorialPopover elementId={ElementID.IAMIdentityNameInput}>
              <Input
                data-element-id={ElementID.IAMIdentityNameInput}
                value={getNameFieldVal()}
                onChange={handleNameChange}
              />
            </TutorialPopover>
            {!_.isEmpty(formState[iamIdentityEntity]['error']) && (
              <Text color='red.500' fontSize='sm'>
                {formState[iamIdentityEntity]['error']}
              </Text>
            )}
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme='blue'
            mr={3}
            onClick={submit}
            isDisabled={
              formState[iamIdentityEntity]['isValidating'] ||
              !_.isEmpty(formState[iamIdentityEntity]['error'])
            }
          >
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
