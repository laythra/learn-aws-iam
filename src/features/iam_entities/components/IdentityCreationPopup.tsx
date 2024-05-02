import { useState } from 'react';

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
  Input,
} from '@chakra-ui/react';
import _ from 'lodash';

import { useIdentityCreator } from '../hooks/useIdentityCreator';
import { IAMIdentityEntity, IAMNodeEntity } from '@/types';

interface IdentityCreationPopupProps {}

export const IdentityCreationPopup: React.FC<IdentityCreationPopupProps> = () => {
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

  const getNameFieldVal = (): string => {
    return iamIdentityEntity === IAMNodeEntity.User ? userName : groupName;
  };

  // TODO: Dispatch action to create new identity
  const submit = (): void => {
    closeIdentityCreator();
  };

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
            <Input value={getNameFieldVal()} onChange={handleNameChange} />
            <FormHelperText>This could be any name you like</FormHelperText>
          </FormControl>
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
