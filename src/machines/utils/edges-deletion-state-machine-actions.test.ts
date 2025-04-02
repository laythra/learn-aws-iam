import { describe, it } from 'vitest';

import { deleteConnectionEdges } from './edges-deletion-state-machine-actions';
import { createMockContext } from '@/__test-helpers__/context';
import { createEdge } from '@/factories/edge-factory';
import { createPolicyNode } from '@/factories/policy-node-factory';
import { createResourceNode } from '@/factories/resource-node-factory';
import { createUserNode } from '@/factories/user-node-factory';

describe('deleteConnectionEdges', () => {
  it('should delete the specified edges and their dependents from the context', () => {
    const policyNode = createPolicyNode({});
    const userNode = createUserNode({});
    const resourceNode = createResourceNode({});

    const edge1 = createEdge({
      source: policyNode.id,
      target: userNode.id,
    });

    const edge2 = createEdge({
      source: userNode.id,
      target: resourceNode.id,
    });

    const context = createMockContext({
      nodes: [policyNode, userNode, resourceNode],
      edges: [edge1, edge2],
      nodes_connnections: [
        { from: policyNode, to: userNode },
        { from: userNode, to: resourceNode, parent_edge_id: edge1.id },
      ],
    });

    const { updatedContext } = deleteConnectionEdges(context, [edge1.id]);

    expect(updatedContext.nodes_connnections).toEqual([]);
    expect(updatedContext.edges).toEqual([]);
  });
});
