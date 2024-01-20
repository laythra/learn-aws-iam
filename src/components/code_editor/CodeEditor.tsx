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

import CodeEditorErrorsBox from './CodeEditorErrorsBox';
import PolicyCodeEditor from './PolicyCodeEditor';

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
            <Text>New {iamEntity}</Text>
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
            <Text> ROLE CODE EDITOR GOES HERE </Text>
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
