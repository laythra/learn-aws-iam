import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
} from '@chakra-ui/react';
import upperFirst from 'lodash/upperFirst';
import Markdown from 'react-markdown';

import { rehypeChakraBadge } from '@/lib/markdown/chakra-markdown';
import { customMarkdownComponents } from '@/lib/markdown/Components';
import { rehypeIcon } from '@/lib/markdown/icons-markdown';

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
              {upperFirst(hint.title)}
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <Markdown
              components={customMarkdownComponents}
              rehypePlugins={[rehypeChakraBadge, rehypeIcon]}
            >
              {hint.content}
            </Markdown>
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
