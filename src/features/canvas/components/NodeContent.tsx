import { Text, Image, Badge, Tooltip, HStack, Skeleton, VStack } from '@chakra-ui/react';

import { IAMNodeEntity } from '@/types/iam-enums';

export interface NodeContentProps {
  imageSrc: string | undefined;
  label: string;
  entity: IAMNodeEntity;
  resourceType: string | false;
  isUnnecessary: boolean;
}

const NodeContent: React.FC<NodeContentProps> = ({
  imageSrc,
  label,
  entity,
  resourceType,
  isUnnecessary,
}) => (
  <HStack width='100%' spacing={0}>
    <Image
      src={imageSrc}
      boxSize='50px'
      flexShrink={0}
      mr={2}
      fallback={<Skeleton boxSize='45px' fadeDuration={3} />}
      loading='lazy'
    />
    <VStack flex={1} minW={0} spacing={0} align='flex-start' justifyContent='flex-end'>
      <HStack spacing={0} width='100%' overflow='hidden'>
        <Tooltip label={label}>
          <Text
            fontWeight='700'
            fontSize='13px'
            whiteSpace='nowrap'
            overflow='hidden'
            textOverflow='ellipsis'
            fontFamily='monospace'
          >
            {label}
          </Text>
        </Tooltip>
        {isUnnecessary && (
          <Tooltip label={`This ${entity} does not serve any purpose.`} cursor='help'>
            <Badge colorScheme='red' fontSize='12px' fontWeight='700' ml={1}>
              !
            </Badge>
          </Tooltip>
        )}
      </HStack>
      <Text
        fontSize='14px'
        whiteSpace='nowrap'
        overflow='hidden'
        textOverflow='ellipsis'
        width='100%'
      >
        {entity === IAMNodeEntity.Resource ? resourceType : entity}
      </Text>
    </VStack>
  </HStack>
);

export default NodeContent;
