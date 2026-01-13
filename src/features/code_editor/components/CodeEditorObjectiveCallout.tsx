import { useState } from 'react';

import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  CloseButton,
  HStack,
} from '@chakra-ui/react';
import Markdown from 'react-markdown';

import { rehypeChakraBadge } from '@/lib/markdown/chakra-markdown';
import { components } from '@/lib/markdown/components';
import { rehypeIcon } from '@/lib/markdown/icons-markdown';

interface CodeEditorObjectiveCalloutProps {
  calloutMessage: string;
}

export const CodeEditorObjectiveCallout: React.FC<CodeEditorObjectiveCalloutProps> = ({
  calloutMessage,
}) => {
  const [visible, setVisible] = useState(true);

  if (!visible) {
    return null;
  }

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

      <CloseButton
        size='sm'
        position='absolute'
        top={2}
        right={2}
        onClick={() => setVisible(false)}
      />

      <AlertDescription>
        <Markdown components={components} rehypePlugins={[rehypeChakraBadge, rehypeIcon]}>
          {calloutMessage}
        </Markdown>
      </AlertDescription>
    </Alert>
  );
};
