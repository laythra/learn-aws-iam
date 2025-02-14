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
import { CheckBadgeIcon, XCircleIcon } from '@heroicons/react/20/solid';
import { InformationCircleIcon } from '@heroicons/react/24/solid';
import _ from 'lodash';
import Markdown from 'react-markdown';

import { components } from '@/utils/markdown/components';

interface SidePanelObjectiveHintButtonProps {
  hint: string;
}

const SidePanelObjectiveHintButton: React.FC<SidePanelObjectiveHintButtonProps> = ({ hint }) => {
  return (
    <Popover>
      <PopoverTrigger>
        <Button fontSize='xs' alignSelf='flex-end' size='sm'>
          Hint
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader fontWeight='semibold'>
          <HStack align='center'>
            <InformationCircleIcon height={20} />
            <Text> Hint </Text>
          </HStack>
        </PopoverHeader>
        <PopoverBody>
          <Markdown components={components}>{hint}</Markdown>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default SidePanelObjectiveHintButton;
