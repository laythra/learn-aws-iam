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
} from '@chakra-ui/react';
import useCodeEditor from 'hooks/useCodeEditor';
import useIAMEntities from 'hooks/useIAMEntities';
import _ from 'lodash';
import { IAMNodeEntity } from 'types';

import CodeEditorErrorsBox from './CodeEditorErrorsBox';
import PolicyCodeEditor from './PolicyCodeEditor';
import RoleCodeEditor from './RoleCodeEditor';

type iamEntityType = 'policy' | 'role';

interface CodeEditorProps {}

const CodeEditor: React.FC<CodeEditorProps> = ({}) => {
  const { closeModal, modalOpen, ...errorsProps } = useCodeEditor();
  const { createNode } = useIAMEntities();
  const [iamEntity, setIamEntity] = useState<IAMNodeEntity>(IAMNodeEntity.Policy);
  const errorsToView =
    iamEntity == IAMNodeEntity.Policy ? errorsProps.policyErrors : errorsProps.roleErrors;

  const submit = (event: React.MouseEvent): void => {
    const node = {
      id: Date.now().toString(),
      entity: iamEntity,
      label: 'New ' + _.upperFirst(iamEntity),
      description: 'New ' + _.upperFirst(iamEntity),
    };

    createNode(node);
    closeModal();
  };

  return (
    <Modal isOpen={modalOpen} onClose={closeModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Flex justifyContent='space-between'>
            <Text>New {_.upperFirst(iamEntity)}</Text>
            <Select
              value={iamEntity}
              onChange={e => setIamEntity(e.target.value as IAMNodeEntity)}
              width={['100%', '50%']}
            >
              <option value='policy'>Policy</option>
              <option value='role'>Role</option>
            </Select>
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {iamEntity == IAMNodeEntity.Policy ? (
            <PolicyCodeEditor setErrors={errorsProps.setPolicyErrors} />
          ) : (
            <RoleCodeEditor setErrors={errorsProps.setRoleErrors} />
          )}
          <CodeEditorErrorsBox errors={errorsToView} />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={submit} isDisabled={errorsToView.length > 0}>
            Submit
          </Button>
          <Button variant='ghost' onClick={closeModal}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CodeEditor;
