import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
} from '@chakra-ui/react';
import _ from 'lodash';
import Markdown from 'react-markdown';

import { remarkChakra } from '@/utils/markdown/chakra-markdown';
import { components as markdownComponents } from '@/utils/markdown/components';

interface CodeEditorObjectiveHintsProps {
  objectiveHints: { title: string; content: string }[];
}

export const CodeEditorObjectiveHints: React.FC<CodeEditorObjectiveHintsProps> = ({
  objectiveHints,
}) => {
  return (
    <Accordion allowToggle defaultIndex={0}>
      {objectiveHints.map((hint, index) => (
        <AccordionItem key={index}>
          <AccordionButton>
            <Box as='span' flex='1' textAlign='left' fontWeight='semibold'>
              {_.upperFirst(hint.title)}
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <Markdown components={markdownComponents} rehypePlugins={[remarkChakra]}>
              {hint.content}
            </Markdown>
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
