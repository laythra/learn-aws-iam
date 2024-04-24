import React from 'react';

import { Icon } from '@chakra-ui/react';

import { resolveIcon } from '@/utils/icon-resolver';

interface IAMNodeIconProps {
  nodeLabel: string;
  boxSize?: string;
}

const IAMNodeIcon: React.FC<IAMNodeIconProps> = ({ nodeLabel, boxSize = '24px' }) => {
  const icon = resolveIcon(nodeLabel);

  return <Icon as={icon} boxSize={boxSize} />;
};

export default IAMNodeIcon;
