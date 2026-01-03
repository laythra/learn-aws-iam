import {
  Button,
  HStack,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
} from '@chakra-ui/react';
import { InformationCircleIcon } from '@heroicons/react/24/solid';
import Markdown from 'react-markdown';

import { rehypeChakraBadge } from '@/utils/markdown/chakra-markdown';
import { rehypeIcon } from '@/utils/markdown/icons-markdown';
import { components } from '@/utils/markdown/components';

interface SidePanelObjectiveHintButtonProps {
  hint: string;
}

const SidePanelObjectiveHintButton: React.FC<SidePanelObjectiveHintButtonProps> = ({ hint }) => {
  return (
    <Popover>
      <PopoverTrigger>
        <Button fontSize='xs' size='sm'>
          Hint
        </Button>
      </PopoverTrigger>
      <PopoverContent boxShadow='dark-lg'>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader fontWeight='semibold'>
          <HStack align='center'>
            <InformationCircleIcon height={20} />
            <Text> Hint </Text>
          </HStack>
        </PopoverHeader>
        <PopoverBody maxH='200px' overflowY='auto'>
          <Markdown components={components} rehypePlugins={[rehypeChakraBadge, rehypeIcon]}>
            {hint}
          </Markdown>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default SidePanelObjectiveHintButton;
