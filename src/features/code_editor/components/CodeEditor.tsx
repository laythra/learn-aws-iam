import React from 'react';
import { useState } from 'react';

import {
  Modal,
  ModalContent,
  ModalOverlay,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  Flex,
  TabList,
  Tab,
  Tabs,
  useTheme,
} from '@chakra-ui/react';
import _ from 'lodash';
import { Node } from 'reactflow';
import { EventFromLogic } from 'xstate';

import { CodeEditorErrorsBox } from './CodeEditorErrorsBox';
import { CodeEditorWindow } from './CodeEditorWindow';
import { useCodeEditor } from '../hooks/useCodeEditor';
import { LevelsProgressionContext } from '@/components/providers/LevelsProgressionProvider';
import { MANAGED_POLICIES } from '@/machines/config';
import { IAMScriptableEntity, IAMNodeEntity, CustomTheme, IAMAnyNodeData } from '@/types';
import { getNodeName } from '@/utils/names';

interface CodeEditorProps {}

export const CodeEditor: React.FC<CodeEditorProps> = () => {
  const theme = useTheme<CustomTheme>();

  const editorContentRef = React.useRef<HTMLDivElement>(null);
  const [selectedIamEntity, setSelectedIamEntity] = useState<IAMScriptableEntity>(
    IAMNodeEntity.Policy
  );
  const [isLinting, setIsLinting] = useState<boolean>(false);
  const levelActor = LevelsProgressionContext.useActorRef();
  const [nextIamNodeId, policyNodeTemplate, scriptableEntityCreationObjective, stateMachine] =
    LevelsProgressionContext.useSelector(state => [
      state.context.next_iam_node_id,
      state.context.iam_policy_template,
      state.context.policy_role_objectives?.find(
        objective => objective.validate_inside_code_editor
      ),
      state.machine,
    ]);

  const { isCodeEditorOpen, content, setContent, errors, setErrors, closeCodeEditor } =
    useCodeEditor(
      scriptableEntityCreationObjective?.initial_code || MANAGED_POLICIES.AWSS3ReadOnlyAccess,
      scriptableEntityCreationObjective?.initial_code || MANAGED_POLICIES.AWSS3ReadOnlyAccess
    );

  const renderedErrors = errors[selectedIamEntity === IAMNodeEntity.Policy ? 'policy' : 'role'];
  const renderedContent = content[selectedIamEntity === IAMNodeEntity.Policy ? 'policy' : 'role'];

  const submit = (): void => {
    const nodeId = getNodeName(selectedIamEntity, nextIamNodeId[selectedIamEntity]);
    const node: Node<IAMAnyNodeData> = _.merge({}, policyNodeTemplate, {
      id: nodeId,
      data: {
        id: nodeId,
        label: nodeId,
        entity: selectedIamEntity,
        code: renderedContent,
      },
    });

    levelActor.send({ type: 'ADD_IAM_NODE', node });

    if (scriptableEntityCreationObjective?.on_finish_event) {
      levelActor.send({
        type: scriptableEntityCreationObjective.on_finish_event,
      } as EventFromLogic<typeof stateMachine>);
    }

    closeCodeEditor();
  };

  const handleTabChange = (index: number): void => {
    const newEntity = index === 0 ? IAMNodeEntity.Policy : IAMNodeEntity.Role;

    setSelectedIamEntity(newEntity);
  };

  return (
    <Modal isOpen={isCodeEditorOpen} onClose={closeCodeEditor} id='modal_content'>
      <ModalOverlay />
      <ModalContent maxW={theme.sizes.modalsMaxWidthInPixels}>
        <ModalHeader>
          <Flex justifyContent='space-between'>
            <Text>New {_.upperFirst(selectedIamEntity)}</Text>
            <Tabs onChange={handleTabChange} variant='soft-rounded' size='sm'>
              <TabList>
                <Tab>{IAMNodeEntity.Policy}</Tab>
                <Tab>{IAMNodeEntity.Role}</Tab>
              </TabList>
            </Tabs>
          </Flex>
        </ModalHeader>
        <ModalBody ref={editorContentRef}>
          <CodeEditorWindow
            setErrors={_.partial(setErrors, selectedIamEntity)}
            setContent={_.partial(setContent, selectedIamEntity)}
            content={renderedContent}
            setIsLinting={setIsLinting}
            targetObjective={scriptableEntityCreationObjective}
          />
          <CodeEditorErrorsBox errors={renderedErrors} />
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme='blue'
            mr={3}
            onClick={submit}
            isDisabled={!_.isEmpty(renderedErrors)}
            isLoading={isLinting}
            loadingText='Checking...'
          >
            Submit
          </Button>
          <Button variant='ghost' onClick={closeCodeEditor}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
