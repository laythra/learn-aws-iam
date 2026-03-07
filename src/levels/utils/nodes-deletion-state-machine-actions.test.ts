import { describe, expect, it } from 'vitest';

import { deleteNode } from './nodes-deletion-state-machine-actions';
import { createMockContext } from '@/__test-helpers__/context';
import { createIdentityPolicyNode } from '@/domain/nodes/identity-policy-node-factory';

// TODO: Add more tests involving deleting nodes with inbound/outbound edges
describe('nodes-deletion-state-machine-actions', () => {
  it('deletes a node and updates the context', () => {
    const mockNode = createIdentityPolicyNode({});
    const context = createMockContext({
      nodes: [mockNode],
    });

    expect(context.nodes).toHaveLength(1);

    const { updatedContext } = deleteNode(context, mockNode);

    expect(updatedContext.nodes).toHaveLength(0);
  });
});
