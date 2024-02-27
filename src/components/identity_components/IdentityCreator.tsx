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
  Input,
  FormHelperText,
  Box,
} from '@chakra-ui/react';
import PoliciesList from 'components/identity_components/PoliciesList';
import useIAMIdentityCreator from 'hooks/useIdentityCreator';
import _ from 'lodash';
import { IAMIdentityEntity, IAMNodeEntity } from 'types';

interface IdentityCreator {}

const IdentityCreator: React.FC<IdentityCreator> = () => {
  const { closeIdentityCreator, isIdentityCreatorOpen } = useIAMIdentityCreator();
  const [userName, setUserName] = useState('');
  const [iamIdentityEntity, setIamIdentityEntity] = useState<IAMIdentityEntity>(IAMNodeEntity.User);

  const submit = (): void => {
    console.log('submit');
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
            <FormLabel>User Name</FormLabel>
            <Input value={userName} onChange={e => setUserName(e.target.value)} />
            <FormHelperText>This could be any username you like</FormHelperText>
          </FormControl>

          <Box pt={8}>
            <PoliciesList />
          </Box>
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

export default IdentityCreator;
