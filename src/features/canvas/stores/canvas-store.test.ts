import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CanvasStore } from './canvas-store';
import { createAccountNode } from '@/domain/nodes/account-node-factory';
import { createIdentityPolicyNode } from '@/domain/nodes/identity-policy-node-factory';
import { IAMAnyNode } from '@/types/iam-node-types';

vi.mock('../utils/apply-node-positions', () => ({
  positionNewNodes: (_: IAMAnyNode[], nodes: IAMAnyNode[]) => nodes,
}));

const DEFAULT_POSITIONING = {
  layoutGroups: [],
  sidePanelWidth: 0,
  reactFlowViewport: { x: 0, y: 0, zoom: 1 },
};

function sendSetNodes(nodes: IAMAnyNode[]): void {
  CanvasStore.send({ type: 'setNodes', nodes, ...DEFAULT_POSITIONING });
}

function sendAddNodes(nodes: IAMAnyNode[]): void {
  CanvasStore.send({ type: 'addNodes', nodes, ...DEFAULT_POSITIONING });
}

describe('CanvasStore', () => {
  beforeEach(() => {
    CanvasStore.send({ type: 'clearCanvas' });
  });

  describe('toggleAccountCollapse', () => {
    it('collapses an account node and hides its children', () => {
      const account = createAccountNode({ rootOverrides: { id: 'account-1' } });
      const child = createIdentityPolicyNode({
        rootOverrides: { id: 'policy-1', parentId: 'account-1' },
      });

      sendSetNodes([account, child]);
      CanvasStore.send({ type: 'toggleAccountCollapse', accountId: 'account-1' });

      const { nodes } = CanvasStore.getSnapshot().context;
      expect(nodes.find(n => n.id === 'account-1')?.data.collapsed).toBe(true);
      expect(nodes.find(n => n.id === 'policy-1')?.hidden).toBe(true);
    });

    it('expands a collapsed account node and shows its children', () => {
      const account = createAccountNode({ rootOverrides: { id: 'account-1' } });
      const child = createIdentityPolicyNode({
        rootOverrides: { id: 'policy-1', parentId: 'account-1' },
      });

      sendSetNodes([account, child]);
      CanvasStore.send({ type: 'toggleAccountCollapse', accountId: 'account-1' }); // collapse
      CanvasStore.send({ type: 'toggleAccountCollapse', accountId: 'account-1' }); // expand

      const { nodes } = CanvasStore.getSnapshot().context;
      expect(nodes.find(n => n.id === 'account-1')?.data.collapsed).toBe(false);
      expect(nodes.find(n => n.id === 'policy-1')?.hidden).toBe(false);
    });

    it('does nothing if the account node does not exist', () => {
      const account = createAccountNode({ rootOverrides: { id: 'account-1' } });

      sendSetNodes([account]);
      CanvasStore.send({ type: 'toggleAccountCollapse', accountId: 'non-existent' });

      const { nodes } = CanvasStore.getSnapshot().context;
      expect(nodes.find(n => n.id === 'account-1')?.data.collapsed).toBeUndefined();
    });
  });

  describe('addNodes', () => {
    it('uncollapses a collapsed parent and unhides\
       existing children when a new child is added', () => {
      const account = createAccountNode({ rootOverrides: { id: 'account-1' } });
      const existingChild = createIdentityPolicyNode({
        rootOverrides: { id: 'policy-1', parentId: 'account-1' },
      });

      sendSetNodes([account, existingChild]);
      CanvasStore.send({ type: 'toggleAccountCollapse', accountId: 'account-1' });

      const newChild = createIdentityPolicyNode({
        rootOverrides: { id: 'policy-2', parentId: 'account-1' },
      });
      sendAddNodes([newChild]);

      const { nodes } = CanvasStore.getSnapshot().context;
      expect(nodes.find(n => n.id === 'account-1')?.data.collapsed).toBe(false);
      expect(nodes.find(n => n.id === 'policy-1')?.hidden).toBe(false);
      expect(nodes.find(n => n.id === 'policy-2')).toBeDefined();
    });

    it('does not affect a non-collapsed parent', () => {
      const account = createAccountNode({ rootOverrides: { id: 'account-1' } });
      const existingChild = createIdentityPolicyNode({
        rootOverrides: { id: 'policy-1', parentId: 'account-1' },
      });

      sendSetNodes([account, existingChild]);

      const newChild = createIdentityPolicyNode({
        rootOverrides: { id: 'policy-2', parentId: 'account-1' },
      });
      sendAddNodes([newChild]);

      const { nodes } = CanvasStore.getSnapshot().context;
      expect(nodes.find(n => n.id === 'account-1')?.data.collapsed).toBeUndefined();
      expect(nodes.find(n => n.id === 'policy-1')?.hidden).toBe(false);
    });

    it('adds nodes without a parent without side effects', () => {
      const account = createAccountNode({ rootOverrides: { id: 'account-1' } });
      sendSetNodes([account]);

      const standalone = createIdentityPolicyNode({ rootOverrides: { id: 'policy-1' } });
      sendAddNodes([standalone]);

      const { nodes } = CanvasStore.getSnapshot().context;
      expect(nodes).toHaveLength(2);
      expect(nodes.find(n => n.id === 'account-1')?.data.collapsed).toBeUndefined();
    });

    describe('popoverShown', () => {
      it('uncollapses a collapsed parent account and unhides its children', () => {
        const account = createAccountNode({ rootOverrides: { id: 'account-1' } });
        const child = createIdentityPolicyNode({
          rootOverrides: { id: 'policy-1', parentId: 'account-1' },
        });

        sendSetNodes([account, child]);
        CanvasStore.send({ type: 'toggleAccountCollapse', accountId: 'account-1' });
        CanvasStore.send({ type: 'popoverShown', elementId: 'policy-1' });

        const { nodes } = CanvasStore.getSnapshot().context;
        expect(nodes.find(n => n.id === 'account-1')?.data.collapsed).toBe(false);
        expect(nodes.find(n => n.id === 'policy-1')?.hidden).toBe(false);
      });

      it('does nothing if the node has no parent', () => {
        const standalone = createIdentityPolicyNode({ rootOverrides: { id: 'policy-1' } });

        sendSetNodes([standalone]);
        CanvasStore.send({ type: 'popoverShown', elementId: 'policy-1' });

        const { nodes } = CanvasStore.getSnapshot().context;
        expect(nodes.find(n => n.id === 'policy-1')?.hidden).toBeFalsy();
      });

      it('does nothing if the parent account is not collapsed', () => {
        const account = createAccountNode({ rootOverrides: { id: 'account-1' } });
        const child = createIdentityPolicyNode({
          rootOverrides: { id: 'policy-1', parentId: 'account-1' },
        });

        sendSetNodes([account, child]);
        CanvasStore.send({ type: 'popoverShown', elementId: 'policy-1' });

        const { nodes } = CanvasStore.getSnapshot().context;
        expect(nodes.find(n => n.id === 'account-1')?.data.collapsed).toBeUndefined();
      });
    });
  });
});
