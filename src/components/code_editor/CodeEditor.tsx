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
import CodeEditorErrorsBox from 'components/code_editor/CodeEditorErrorsBox';
import CodeEditorWindow from 'components/code_editor/CodeEditorWindow';
import useCodeEditor from 'hooks/useCodeEditor';
import useIAMEntities from 'hooks/useIAMEntities';
import _ from 'lodash';
import { IAMScriptableEntity, IAMNodeEntity } from 'types';

interface CodeEditorProps {}

const CodeEditor: React.FC<CodeEditorProps> = ({}) => {
  const { closeModal, modalOpen, content, setContent, errors, setErrors } = useCodeEditor();
  const { createNode } = useIAMEntities();
  const [iamEntity, setIamEntity] = useState<IAMScriptableEntity>(IAMNodeEntity.Policy);

  const renderedErrors = errors[iamEntity === IAMNodeEntity.Policy ? 'policy' : 'role'];
  const renderedContent = content[iamEntity === IAMNodeEntity.Policy ? 'policy' : 'role'];

  const submit = (): void => {
    const node = {
      id: Date.now().toString(),
      entity: iamEntity,
      label: 'New ' + _.upperFirst(iamEntity),
      description: 'New ' + _.upperFirst(iamEntity),
      content: renderedContent,
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
              onChange={e => setIamEntity(e.target.value as IAMScriptableEntity)}
              width={['100%', '50%']}
            >
              <option value={IAMNodeEntity.Policy}>Policy</option>
              <option value={IAMNodeEntity.Role}>Role</option>
            </Select>
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <CodeEditorWindow
            entity={iamEntity}
            setErrors={_.partial(setErrors, iamEntity)}
            setContent={_.partial(setContent, iamEntity)}
            content={renderedContent}
          />
          <CodeEditorErrorsBox errors={renderedErrors} />
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme='blue'
            mr={3}
            onClick={submit}
            isDisabled={!_.isEmpty(renderedErrors)}
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
