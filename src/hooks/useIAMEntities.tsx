import { useContext } from 'react';

import { IAMEntitiesContext } from '@/components/nodes/IAMEntitiesProvider';
import { IAMEntitiesContextState } from '@/types';

const useIAMEntities = (): IAMEntitiesContextState => {
  const context = useContext(IAMEntitiesContext);

  if (!context) {
    throw new Error('useIAMEntities must be used within a IAMEntitiesProvider');
  }

  return context;
};

export default useIAMEntities;
