import React, { useRef } from 'react';
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
import { ReactCodeMirrorRef } from '@uiw/react-codemirror';
import _ from 'lodash';
import { Node } from 'reactflow';
import { EventFromLogic } from 'xstate';

import { CodeEditorErrorsBox } from './CodeEditorErrorsBox';
import { CodeEditorWarningsBox } from './CodeEditorWarningsBox';
import { CodeEditorWindow } from './CodeEditorWindow';
import { useCodeEditor } from '../hooks/useCodeEditor';
import { LevelsProgressionContext } from '@/components/providers/LevelsProgressionProvider';
import { useMultipleSchemaValidators } from '@/hooks/useSchemaValidator';
import { MANAGED_POLICIES } from '@/machines/config';
import {
  IAMScriptableEntity,
  IAMNodeEntity,
  CustomTheme,
  IAMPolicyNodeData,
  IAMPolicyRoleCreationObjective,
} from '@/types';
import { isJSONValid } from '@/utils/iam-code-linter';
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
  const [nextIamNodeId, policyNodeTemplate, policyRoleObjectives, stateMachine] =
    LevelsProgressionContext.useSelector(state => [
      state.context.next_iam_node_id,
      state.context.iam_policy_template,
      state.context.policy_role_objectives,
      state.machine,
    ]);

  const {
    isCodeEditorOpen,
    content,
    setContent,
    errors,
    setErrors,
    closeCodeEditor,
    setWarnings,
    warnings,
  } = useCodeEditor(
    policyRoleObjectives?.[0]?.initial_code || MANAGED_POLICIES.AWSS3ReadOnlyAccess,
    policyRoleObjectives?.[0]?.initial_code || MANAGED_POLICIES.AWSS3ReadOnlyAccess
  );

  const renderedErrors = errors[selectedIamEntity];
  const renderedWarnings = warnings[selectedIamEntity];
  const renderedContent = content[selectedIamEntity];
  const codeEditorRef = useRef<ReactCodeMirrorRef>(null);
  const schemaValidators = useMultipleSchemaValidators(policyRoleObjectives);

  const findTargetValidPolicy = (): IAMPolicyRoleCreationObjective | undefined => {
    return policyRoleObjectives?.find((_objective, index) => {
      return isJSONValid(codeEditorRef.current!.view!, schemaValidators[index]);
    });
  };

  const submit = (): void => {
    if (!codeEditorRef.current || !codeEditorRef.current.view) return;

    // We need to find the first objective with no errors
    const targetValidPolicy = findTargetValidPolicy();

    let nodeId;

    if (targetValidPolicy) {
      nodeId = targetValidPolicy.entityId;
    } else {
      nodeId = getNodeName(selectedIamEntity, nextIamNodeId[selectedIamEntity]);
    }

    const node: Node<IAMPolicyNodeData> = _.merge({}, policyNodeTemplate, {
      id: nodeId,
      data: {
        id: nodeId,
        label: nodeId,
        entity: selectedIamEntity,
        code: renderedContent,
        unnecessary_policy: !targetValidPolicy,
        resources_affected: targetValidPolicy?.resource_affected || [],
      } as IAMPolicyNodeData,
    });

    levelActor.send({ type: 'ADD_IAM_NODE', node });

    if (targetValidPolicy?.on_finish_event) {
      levelActor.send({
        type: targetValidPolicy.on_finish_event,
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
            setWarnings={_.partial(setWarnings, selectedIamEntity)}
            setContent={_.partial(setContent, selectedIamEntity)}
            content={renderedContent}
            setIsLinting={setIsLinting}
            targetObjective={policyRoleObjectives.length == 1 ? policyRoleObjectives[0] : undefined}
            findTargetValidPolicy={findTargetValidPolicy}
            ref={codeEditorRef}
          />
          <CodeEditorErrorsBox errors={renderedErrors} />
          <CodeEditorWarningsBox warnings={renderedWarnings} />
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
