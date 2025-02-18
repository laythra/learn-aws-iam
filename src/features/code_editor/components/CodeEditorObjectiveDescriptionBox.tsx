import { Box, HStack } from '@chakra-ui/react';
import Markdown from 'react-markdown';

import { remarkChakra } from '@/utils/markdown/chakra-markdown';
import { components } from '@/utils/markdown/components';

interface CodeEditorObjectiveDescriptionBoxProps {
  objectiveDescription: string;
}

export const CodeEditorObjectiveDescriptionBox: React.FC<
  CodeEditorObjectiveDescriptionBoxProps
> = ({ objectiveDescription }) => {
  return (
    <HStack
      spacing={3}
      align='center'
      borderRadius='lg'
      p={2.5}
      w='fit-content'
      borderColor='gray.800'
    >
      <Box
        w='12px'
        h='12px'
        bg='gray.800'
        borderRadius='full'
        boxShadow='0 0 4px gray'
        flexShrink={0}
      />
      <Markdown components={components} rehypePlugins={[remarkChakra]}>
        {objectiveDescription}
      </Markdown>
    </HStack>
  );
};
