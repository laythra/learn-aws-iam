import { Box } from '@chakra-ui/react';
import { useSelector } from '@xstate/store/react';

import codeEditorStateStore from '../stores/code-editor-state-store';

interface CodeEditorWarningsBoxProps {
  nodeId: string;
}

export const CodeEditorWarningsBox: React.FC<CodeEditorWarningsBoxProps> = ({ nodeId }) => {
  const warnings = useSelector(codeEditorStateStore, state => state.context.warnings[nodeId]);

  if (!warnings || warnings.length === 0) {
    return null;
  } else {
    return (
      <Box>
        {warnings.map(warning => (
          <Box key={warning} color='yellow.600'>
            {warning}
          </Box>
        ))}
      </Box>
    );
  }
};
