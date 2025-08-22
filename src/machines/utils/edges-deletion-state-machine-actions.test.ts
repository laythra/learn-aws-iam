import { describe, it } from 'vitest';

import { deleteConnectionEdges } from './edges-deletion-state-machine-actions';
import { createMockContext } from '@/__test-helpers__/context';
import { createEdge } from '@/factories/edge-factory';
import { createPolicyNode } from '@/factories/nodes/policy-node-factory';
import { createResourceNode } from '@/factories/nodes/resource-node-factory';
import { createUserNode } from '@/factories/nodes/user-node-factory';

describe('deleteConnectionEdges', () => {
  it('should delete the specified edges and their dependents from the context', () => {
    const policyNode = createPolicyNode({});
    const userNode = createUserNode({});
    const resourceNode = createResourceNode({});

    const edge1 = createEdge({ rootOverrides: { source: policyNode.id, target: userNode.id } });
    const edge2 = createEdge({
      rootOverrides: { source: userNode.id, target: resourceNode.id },
      dataOverrides: { parent_edge_id: edge1.id },
    });

    const context = createMockContext({
      nodes: [policyNode, userNode, resourceNode],
      edges: [edge1, edge2],
    });

    const { updatedContext } = deleteConnectionEdges(context, [edge1.id]);

    expect(updatedContext.edges).toEqual([]);
  });
});
