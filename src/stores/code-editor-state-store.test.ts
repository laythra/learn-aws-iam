import { describe, expect, it } from 'vitest';

import CodeEditorStore, { type CodeEditorState } from '@/stores/code-editor-state-store';
import { IAMNodeEntity } from '@/types/iam-enums';

function getState(): CodeEditorState {
  return CodeEditorStore.getSnapshot().context;
}

function resetStore(): void {
  // Deinitialize resets most of the state
  CodeEditorStore.send({ type: 'deinitializeCodeEditor', nodeId: '' });
}

describe('CodeEditorStateStore', () => {
  describe('open / close', () => {
    it('opens in create mode', () => {
      resetStore();
      CodeEditorStore.send({ type: 'open', mode: 'create' });

      expect(getState().isOpen).toBe(true);
      expect(getState().mode).toBe('create');
    });

    it('opens in edit mode with selected node', () => {
      resetStore();
      CodeEditorStore.send({
        type: 'open',
        mode: 'edit',
        selectedNodeId: 'node-1',
        selectedIAMEntity: IAMNodeEntity.Role,
      });

      expect(getState().isOpen).toBe(true);
      expect(getState().mode).toBe('edit');
      expect(getState().selectedNodeId).toBe('node-1');
      expect(getState().selectedIAMEntity).toBe(IAMNodeEntity.Role);
    });

    it('defaults selectedIAMEntity to IdentityPolicy when not provided', () => {
      resetStore();
      CodeEditorStore.send({ type: 'open', mode: 'create' });

      expect(getState().selectedIAMEntity).toBe(IAMNodeEntity.IdentityPolicy);
    });

    it('closes the editor', () => {
      resetStore();
      CodeEditorStore.send({ type: 'open', mode: 'create' });
      CodeEditorStore.send({ type: 'close' });

      expect(getState().isOpen).toBe(false);
    });
  });

  describe('content management', () => {
    it('sets content for a node', () => {
      resetStore();
      CodeEditorStore.send({ type: 'setContent', nodeId: 'n1', content: '{"Version": "2012"}' });

      expect(getState().content['n1']).toBe('{"Version": "2012"}');
      expect(getState().isValidating).toBe(true);
    });

    it('clears content for a node', () => {
      resetStore();
      CodeEditorStore.send({ type: 'setContent', nodeId: 'n1', content: 'data' });
      CodeEditorStore.send({ type: 'clearContent', nodeId: 'n1' });

      expect(getState().content['n1']).toBeUndefined();
    });
  });

  describe('errors and warnings', () => {
    it('sets errors and warnings for a node', () => {
      resetStore();
      const errors = [{ from: 0, to: 5, severity: 'error' as const, message: 'bad' }];
      const warnings = ['Watch out'];

      CodeEditorStore.send({
        type: 'setCodeErrorsAndWarnings',
        nodeId: 'n1',
        errors,
        warnings,
      });

      expect(getState().errors['n1']).toEqual(errors);
      expect(getState().warnings['n1']).toEqual(warnings);
    });
  });

  describe('policy selection', () => {
    it('selects and deselects policies', () => {
      resetStore();
      CodeEditorStore.send({ type: 'selectPolicy', policyId: 'p1' });
      CodeEditorStore.send({ type: 'selectPolicy', policyId: 'p2' });

      expect(getState().selectedPolicies).toContain('p1');
      expect(getState().selectedPolicies).toContain('p2');

      CodeEditorStore.send({ type: 'deselectPolicy', policyId: 'p1' });
      expect(getState().selectedPolicies).not.toContain('p1');
      expect(getState().selectedPolicies).toContain('p2');
    });
  });

  describe('selectedIAMEntity', () => {
    it('updates the selected entity', () => {
      resetStore();
      CodeEditorStore.send({
        type: 'setSelectedIAMEntity',
        payload: IAMNodeEntity.SCP,
      });

      expect(getState().selectedIAMEntity).toBe(IAMNodeEntity.SCP);
    });
  });

  describe('help popup', () => {
    it('shows and hides help popup', () => {
      resetStore();
      CodeEditorStore.send({
        type: 'showHelpPopup',
        entity: IAMNodeEntity.Role,
      });

      expect(getState().helpPopupInfo.isOpen).toBe(true);
      expect(getState().helpPopupInfo.entity).toBe(IAMNodeEntity.Role);

      CodeEditorStore.send({ type: 'hideHelpPopup' });
      expect(getState().helpPopupInfo.isOpen).toBe(false);
    });
  });

  describe('node label', () => {
    it('sets node label', () => {
      resetStore();
      CodeEditorStore.send({ type: 'setNodeLabel', label: 'MyRole', nodeId: 'n1' });

      expect(getState().label['n1']).toBe('MyRole');
      expect(getState().isValidating).toBe(true);
    });

    it('sets node label error', () => {
      resetStore();
      CodeEditorStore.send({
        type: 'setNodeLabelError',
        error: 'Name too long',
        isValidating: false,
      });

      expect(getState().labelError).toBe('Name too long');
      expect(getState().isValidating).toBe(false);
    });
  });

  describe('deinitializeCodeEditor', () => {
    it('resets state on deinitialize', () => {
      CodeEditorStore.send({ type: 'open', mode: 'edit', selectedNodeId: 'n1' });
      CodeEditorStore.send({ type: 'setContent', nodeId: 'n1', content: 'test' });
      CodeEditorStore.send({
        type: 'setSelectedIAMEntity',
        payload: IAMNodeEntity.SCP,
      });

      CodeEditorStore.send({ type: 'deinitializeCodeEditor', nodeId: 'n1' });
      const state = getState();

      expect(state.isOpen).toBe(false);
      expect(state.isCodeEditorInitialized).toBe(false);
      expect(state.selectedIAMEntity).toBe(IAMNodeEntity.IdentityPolicy);
      expect(state.errors).toEqual({});
      expect(state.warnings).toEqual({});
      expect(state.content).toEqual({});
      expect(state.label).toEqual({});
    });
  });

  describe('setIsValidating', () => {
    it('toggles isValidating', () => {
      resetStore();
      CodeEditorStore.send({ type: 'setIsValidating', payload: true });
      expect(getState().isValidating).toBe(true);

      CodeEditorStore.send({ type: 'setIsValidating', payload: false });
      expect(getState().isValidating).toBe(false);
    });
  });

  describe('setSelectedAccount', () => {
    it('sets selected account and marks as validating', () => {
      resetStore();
      CodeEditorStore.send({ type: 'setSelectedAccount', selectedAccountId: 'acct-123' });

      expect(getState().selectedAccountId).toBe('acct-123');
      expect(getState().isValidating).toBe(true);
    });
  });
});
