import { Box } from '@chakra-ui/react';
import { useSelector } from '@xstate/store/react';

import codeEditorStateStore from '../stores/code-editor-state-store';
import { IAMScriptableEntity } from '@/types';

interface CodeEditorWarningsBoxProps {
  nodeId: string;
  selectedIAMEntity: IAMScriptableEntity;
}

export const CodeEditorWarningsBox: React.FC<CodeEditorWarningsBoxProps> = ({
  nodeId,
  selectedIAMEntity,
}) => {
  const warnings = useSelector(
    codeEditorStateStore,
    state => state.context.warnings[selectedIAMEntity][nodeId]
  );

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
