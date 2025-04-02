import { describe, expect, it } from 'vitest';

import { deleteNode } from './nodes-deletion-state-machine-actions';
import { createMockContext } from '@/__test-helpers__/context';
import { createPolicyNode } from '@/factories/policy-node-factory';

// TODO: Add more tests involving deleting nodes with inbound/outbound edges
describe('nodes-deletion-state-machine-actions', () => {
  it('deletes a node and updates the context', () => {
    const mockNode = createPolicyNode({});
    const context = createMockContext({
      nodes: [mockNode],
    });

    expect(context.nodes.length).toHaveLength(1);

    const { updatedContext } = deleteNode(context, mockNode);

    expect(updatedContext.nodes.length).haveLength(0);
  });
});
