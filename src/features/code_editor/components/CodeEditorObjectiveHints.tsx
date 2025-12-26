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

import { rehypeChakraBadge } from '@/utils/markdown/chakra-markdown';
import { components as markdownComponents } from '@/utils/markdown/components';

interface CodeEditorObjectiveHintsProps {
  objectiveHints: { title: string; content: string }[];
}

export const CodeEditorObjectiveHints: React.FC<CodeEditorObjectiveHintsProps> = ({
  objectiveHints,
}) => {
  return (
    <Accordion allowMultiple>
      {objectiveHints.map(hint => (
        <AccordionItem key={hint.title}>
          <AccordionButton>
            <Box as='span' flex='1' textAlign='left' fontWeight='semibold'>
              {_.upperFirst(hint.title)}
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <Markdown components={markdownComponents} rehypePlugins={[rehypeChakraBadge]}>
              {hint.content}
            </Markdown>
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
