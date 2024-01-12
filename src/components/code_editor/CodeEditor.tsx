import { useRef, useState } from 'react';

import {
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalContent,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
} from '@chakra-ui/react';
import { json } from '@codemirror/lang-json';
import { Diagnostic, linter } from '@codemirror/lint';
import { EditorView } from '@codemirror/view';
import CodeMirror from '@uiw/react-codemirror';
import useModal from 'hooks/useModal';
import _ from 'lodash';
import { lint } from 'utils/iam-policy-linter';

import CodeEditorErrorsBox from './CodeEditorErrorsBox';

interface CodeEditorProps {}

const defaultPolicy = JSON.stringify(
  {
    Version: '2012-10-17',
    Statement: [{ Effect: 'Allow', Action: '*', Resource: '*' }],
  },
  null,
  2
);

const CodeEditor: React.FC<CodeEditorProps> = ({}) => {
  const [errors, setErrors] = useState<Diagnostic[]>([]);
  const { toggleModal, modalOpen } = useModal();
  const editorRef = useRef<EditorView | undefined>();

  const checkForErrors = _.debounce((): void => {
    if (!editorRef.current) return;

    setErrors(lint(editorRef.current));
  }, 500);

  return (
    <Modal isOpen={modalOpen} onClose={toggleModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>New Policy</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <CodeMirror
            value={defaultPolicy}
            onChange={checkForErrors}
            height='200px'
            extensions={[json(), linter(lint)]}
            onCreateEditor={editor => (editorRef.current = editor)}
          />
          <CodeEditorErrorsBox errors={errors} />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={toggleModal} isDisabled={errors.length > 0}>
            Submit
          </Button>
          <Button variant='ghost' onClick={toggleModal}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CodeEditor;
