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
import _ from 'lodash';

import CodeEditorErrorsBox from './CodeEditorErrorsBox';
import PolicyCodeEditor from './PolicyCodeEditor';
import RoleCodeEditor from './RoleCodeEditor';

type iamEntityType = 'policy' | 'role';

interface CodeEditorProps {}

const CodeEditor: React.FC<CodeEditorProps> = ({}) => {
  const { closeModal, modalOpen, ...errorsProps } = useCodeEditor();
  const [iamEntity, setIamEntity] = useState<iamEntityType>('policy');
  const errorsToView = iamEntity == 'policy' ? errorsProps.policyErrors : errorsProps.roleErrors;

  return (
    <Modal isOpen={modalOpen} onClose={closeModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Flex justifyContent='space-between'>
            <Text>New {_.upperFirst(iamEntity)}</Text>
            <Select
              value={iamEntity}
              onChange={e => setIamEntity(e.target.value as iamEntityType)}
              width={['100%', '50%']}
            >
              <option value='policy'>Policy</option>
              <option value='role'>Role</option>
            </Select>
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {iamEntity == 'policy' ? (
            <PolicyCodeEditor setErrors={errorsProps.setPolicyErrors} />
          ) : (
            <RoleCodeEditor setErrors={errorsProps.setRoleErrors} />
          )}
          <CodeEditorErrorsBox errors={errorsToView} />
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme='blue'
            mr={3}
            onClick={closeModal}
            isDisabled={errorsToView.length > 0}
          >
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
