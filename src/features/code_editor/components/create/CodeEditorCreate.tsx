import React, { useRef, useEffect } from 'react';

import { Select, Input, FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/react';
import { Diagnostic } from '@codemirror/lint';
import CodeMirror, { EditorView } from '@uiw/react-codemirror';
import { useSelector } from '@xstate/store-react';
import _ from 'lodash';
import Markdown from 'react-markdown';

import { useCodeEditor } from '../../hooks/useCodeEditor';
import { CodeEditorObjectiveCallout } from '../CodeEditorObjectiveCallout';
import { CodeEditorObjectiveHints } from '../CodeEditorObjectiveHints';
import { CodeEditorProgressStatus } from '../CodeEditorProgressMessage';
import { ElementID } from '@/config/element-ids';
import { findAnyValidObjective, BASE_VALIDATION_FNS } from '@/domain/iam-policy-validator';
import { MANAGED_POLICIES } from '@/domain/managed-policies';
import { rehypeChakraBadge } from '@/lib/markdown/chakra-markdown';
import { customMarkdownComponents } from '@/lib/markdown/Components';
import { rehypeIcon } from '@/lib/markdown/icons-markdown';
import { useLevelSelector } from '@/runtime/level-runtime';
import { useIsElementRestricted } from '@/runtime/ui/useIsElementRestricted';
import { useLevelValidateFunctions } from '@/runtime/useLevelValidation';
import codeEditorStateStore from '@/stores/code-editor-state-store';
import { IAMCodeDefinedEntity, IAMNodeEntity } from '@/types/iam-enums';

interface CodeEditorCreateProps {
  nodeId: string;
  selectedIAMEntity: IAMCodeDefinedEntity;
  errors: Diagnostic[];
  warnings: string[];
}

const NO_MATCHING_POLICY_WARNING = 'This policy does not achieve any of the objectives.';
const MULTIPLE_OBJECTIVES_WARNING = `
  > |color(warning) ::badge[WARNING]:: There are **multiple policies** to create for this level.
  > The validator shows requirements for next chronological one,
  > feel free to start with whichever you prefer.
`;

export const CodeEditorCreate: React.FC<CodeEditorCreateProps> = ({
  nodeId,
  selectedIAMEntity,
  errors,
  warnings,
}) => {
  const [policyCreationObjectives, nodes] = useLevelSelector(
    state => [state.context.policy_creation_objectives, state.context.nodes],
    _.isEqual
  );

  const levelValidateFns = useLevelValidateFunctions();

  const [selectedAccountId, labelError, label] = useSelector(
    codeEditorStateStore,
    state => [state.context.selectedAccountId, state.context.labelError, state.context.label],
    _.isEqual
  );

  const selectedResourceNodeId = useSelector(
    codeEditorStateStore,
    state => state.context.selectedResourceNodeId
  );

  const [
    isPolicyTabRestricted,
    isRoleTabRestricted,
    isSCPTabRestricted,
    isResourcePolicyTabRestricted,
    isPermissionBoundaryTabRestricted,
  ] = useIsElementRestricted([
    ElementID.CodeEditorPolicyTab,
    ElementID.CodeEditorRoleTab,
    ElementID.CodeEditorSCPTab,
    ElementID.CodeEditorResourcePolicyTab,
    ElementID.CodeEditorPermissionBoundaryTab,
  ]);

  const multiAccount = nodes.some(node => node.data.entity === IAMNodeEntity.Account);
  const resourceNodes = nodes.filter(node => node.data.entity === IAMNodeEntity.Resource);
  const editorView = useRef<EditorView | null>(null);
  const showMultiAccountDropdown = multiAccount && selectedIAMEntity !== IAMNodeEntity.SCP;
  const showResourceNodeDropdown = selectedIAMEntity === IAMNodeEntity.ResourcePolicy;
  const unfinishedCreationObjectives = policyCreationObjectives.filter(
    objective => !objective.finished && objective.entity === selectedIAMEntity
  );

  const objectiveToTargetInEditor = unfinishedCreationObjectives[0];
  const initialContent = objectiveToTargetInEditor?.initial_code ?? MANAGED_POLICIES.EmptyPolicy;

  const getWarnings = (): string[] => {
    if (!editorView.current) return [];

    const anyValidPolicy = findAnyValidObjective(
      unfinishedCreationObjectives,
      levelValidateFns,
      nodes,
      editorView.current.state.doc.toString(),
      selectedAccountId
    );

    return anyValidPolicy ? [] : [NO_MATCHING_POLICY_WARNING];
  };

  const validateFns = (() => {
    const fns = unfinishedCreationObjectives.filterMap(obj => levelValidateFns?.[obj.id]?.(nodes));
    return fns.length > 0 ? fns : [BASE_VALIDATION_FNS[selectedIAMEntity]];
  })();

  const { onCreateEditor, extensions, validateNodeLabel, getContent } = useCodeEditor({
    nodeId,
    editorView,
    getWarnings,
    initialContent,
    validateFns,
    helpBadges: objectiveToTargetInEditor?.help_badges ?? [],
  });

  useEffect(() => {
    const entityOrder = [
      { restricted: isPolicyTabRestricted, entity: IAMNodeEntity.IdentityPolicy },
      { restricted: isRoleTabRestricted, entity: IAMNodeEntity.Role },
      { restricted: isSCPTabRestricted, entity: IAMNodeEntity.SCP },
      { restricted: isResourcePolicyTabRestricted, entity: IAMNodeEntity.ResourcePolicy },
      { restricted: isPermissionBoundaryTabRestricted, entity: IAMNodeEntity.PermissionBoundary },
    ];

    const isSelectedEntityRestricted = entityOrder.some(
      item => item.entity === selectedIAMEntity && item.restricted
    );

    if (isSelectedEntityRestricted) {
      const availableEntity = entityOrder.find(item => !item.restricted);
      if (availableEntity) {
        codeEditorStateStore.send({
          type: 'setSelectedIAMEntity',
          payload: availableEntity.entity as IAMCodeDefinedEntity,
        });
      }
    }
  }, [
    isPolicyTabRestricted,
    isRoleTabRestricted,
    isSCPTabRestricted,
    isResourcePolicyTabRestricted,
    isPermissionBoundaryTabRestricted,
    selectedIAMEntity,
  ]);

  useEffect(() => {
    const accountNodes = nodes.filter(node => node.data.entity === IAMNodeEntity.Account);
    if (accountNodes.length > 0) {
      codeEditorStateStore.send({
        type: 'setSelectedAccount',
        selectedAccountId: accountNodes[0].id,
      });
    }

    if (resourceNodes.length > 0) {
      codeEditorStateStore.send({
        type: 'setSelectedResourceNode',
        selectedResourceNodeId: resourceNodes[0].id,
      });
    }

    if (selectedIAMEntity === IAMNodeEntity.ResourcePolicy) {
      codeEditorStateStore.send({
        type: 'setNodeLabelError',
        error: undefined,
        isValidating: false,
      });
    } else {
      validateNodeLabel(label[nodeId] ?? '');
    }
  }, [nodeId]);

  return (
    <>
      {showMultiAccountDropdown && (
        <Select
          size='md'
          variant='filled'
          mb={4}
          width='40%'
          value={selectedAccountId}
          data-element-id={ElementID.AccountSelectionDropdown}
          onChange={e => {
            codeEditorStateStore.send({
              type: 'setSelectedAccount',
              selectedAccountId: e.target.value,
            });
          }}
        >
          {nodes
            .filter(node => node.data.entity === IAMNodeEntity.Account)
            .map(accountNode => (
              <option
                key={accountNode.id}
                value={accountNode.id}
                data-element-id={`account-option-${accountNode.id}`}
              >
                {accountNode.data.label}
              </option>
            ))}
        </Select>
      )}

      {showResourceNodeDropdown && resourceNodes.length > 0 && (
        <FormControl mb={4}>
          <FormLabel fontWeight='semibold'>Resource</FormLabel>
          <Select
            size='md'
            variant='filled'
            width='60%'
            value={selectedResourceNodeId ?? ''}
            onChange={e => {
              codeEditorStateStore.send({
                type: 'setSelectedResourceNode',
                selectedResourceNodeId: e.target.value,
              });
            }}
          >
            {resourceNodes.map(resourceNode => (
              <option key={resourceNode.id} value={resourceNode.id}>
                {resourceNode.data.label}
              </option>
            ))}
          </Select>
        </FormControl>
      )}

      {!showResourceNodeDropdown && (
        <FormControl isInvalid={labelError !== undefined}>
          <FormLabel fontWeight='semibold'>{selectedIAMEntity} Name</FormLabel>
          <Input
            placeholder='Any descriptive name you prefer...'
            onChange={newName => {
              codeEditorStateStore.send({
                type: 'setNodeLabel',
                label: newName.target.value,
                nodeId,
              });

              validateNodeLabel(newName.target.value);
            }}
            value={label[nodeId] ?? ''}
          />
          <FormErrorMessage>{labelError}</FormErrorMessage>
        </FormControl>
      )}

      <FormControl>
        <FormLabel fontWeight='semibold' mt={4}>
          Code
        </FormLabel>
        <CodeMirror
          value={getContent() ?? JSON.stringify(initialContent, null, 2)}
          onChange={newContent => {
            codeEditorStateStore.send({
              type: 'setContent',
              content: newContent,
              nodeId,
            });
          }}
          height='250px'
          extensions={extensions}
          onCreateEditor={onCreateEditor}
        />
      </FormControl>
      {!_.isEmpty(errors) && <CodeEditorProgressStatus message={errors[0].message} level='error' />}
      {!_.isEmpty(warnings) && _.isEmpty(errors) && (
        <CodeEditorProgressStatus message={warnings[0]} level='warning' />
      )}
      {_.isEmpty(errors) && _.isEmpty(warnings) && (
        <CodeEditorProgressStatus message='You got it right!' level='success' />
      )}
      {unfinishedCreationObjectives.length > 1 && (
        <Markdown
          components={customMarkdownComponents}
          rehypePlugins={[rehypeChakraBadge, rehypeIcon]}
        >
          {MULTIPLE_OBJECTIVES_WARNING}
        </Markdown>
      )}
      {objectiveToTargetInEditor?.callout_message && (
        <CodeEditorObjectiveCallout calloutMessage={objectiveToTargetInEditor.callout_message} />
      )}
      {objectiveToTargetInEditor?.hint_messages && (
        <CodeEditorObjectiveHints objectiveHints={objectiveToTargetInEditor?.hint_messages} />
      )}
    </>
  );
};
