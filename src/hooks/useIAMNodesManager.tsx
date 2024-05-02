import { useContext } from 'react';

import { IAMEntitiesContext } from '@/components/nodes/IAMEntitiesProvider';
import { IAMEntitiesContextState } from '@/types';

/**
 * Hook used for managing IAM nodes which are mainly rendered in the canvas.
 * @returns {IAMEntitiesContextState} The context state for IAM nodes.
 */
export const useIAMNodesManager = (): IAMEntitiesContextState => {
  const context = useContext(IAMEntitiesContext);

  if (!context) {
    throw new Error('useIAMEntities must be used within a IAMEntitiesProvider');
  }

  return context;
};
