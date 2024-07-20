import React from 'react';
import { useState } from 'react';

import {
  Modal,
  ModalContent,
  ModalOverlay,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  Text,
  Flex,
  Select,
} from '@chakra-ui/react';
import _ from 'lodash';

import { CodeEditorErrorsBox } from './CodeEditorErrorsBox';
import { CodeEditorWindow } from './CodeEditorWindow';
import { useCodeEditor } from '../hooks/useCodeEditor';
import { WithPopoverButton } from '@/components/Decorated';
import { useIAMNodesManager } from '@/hooks/useIAMNodesManager';
import { IAMScriptableEntity, IAMNodeEntity } from '@/types';

interface CodeEditorProps {
  initialPolicy?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ initialPolicy }) => {
  const { isCodeEditorOpen, content, setContent, errors, setErrors, closeCodeEditor } =
    useCodeEditor(initialPolicy);
  const { createNode } = useIAMNodesManager();
  const editorContentRef = React.useRef<HTMLDivElement>(null);
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
    closeCodeEditor();
  };

  return (
    <Modal isOpen={isCodeEditorOpen} onClose={closeCodeEditor} id='modal_content'>
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
        <ModalBody ref={editorContentRef}>
          <CodeEditorWindow
            entity={iamEntity}
            setErrors={_.partial(setErrors, iamEntity)}
            setContent={_.partial(setContent, iamEntity)}
            content={renderedContent}
          />
          <CodeEditorErrorsBox errors={renderedErrors} />
        </ModalBody>
        <ModalFooter>
          <WithPopoverButton
            colorScheme='blue'
            mr={3}
            onClick={submit}
            isDisabled={!_.isEmpty(renderedErrors)}
            elementid='modal_content'
          >
            Submit
          </WithPopoverButton>
          <Button variant='ghost' onClick={closeCodeEditor}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
