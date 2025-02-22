import { Alert, AlertDescription, AlertIcon, AlertTitle, HStack } from '@chakra-ui/react';
import Markdown from 'react-markdown';

import { remarkChakra } from '@/utils/markdown/chakra-markdown';
import { components } from '@/utils/markdown/components';

interface CodeEditorObjectiveCalloutProps {
  calloutMessage: string;
}

export const CodeEditorObjectiveCallout: React.FC<CodeEditorObjectiveCalloutProps> = ({
  calloutMessage,
}) => {
  return (
    <Alert
      colorScheme='gray'
      status='info'
      borderRadius='lg'
      p={3}
      mt={4}
      flexDirection='column'
      alignItems='flex-start'
    >
      <HStack>
        <AlertIcon height='1em' width='1em' m={0} />
        <AlertTitle fontSize='md'>For Your Reference</AlertTitle>
      </HStack>

      <AlertDescription>
        <Markdown components={components} rehypePlugins={[remarkChakra]}>
          {calloutMessage}
        </Markdown>
      </AlertDescription>
    </Alert>
  );
};
