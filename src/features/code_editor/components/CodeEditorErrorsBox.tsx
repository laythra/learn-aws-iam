import { Box, Divider } from '@chakra-ui/react';
import { Diagnostic } from '@codemirror/lint';

interface CodeEditorErrorsBoxProps {
  errors: Diagnostic[];
}

export const CodeEditorErrorsBox: React.FC<CodeEditorErrorsBoxProps> = ({ errors }) => {
  if (errors.length === 0) {
    return null;
  } else {
    return (
      <Box>
        <Divider orientation='horizontal' marginTop={4} marginBottom={4} />
        {errors.map(error => (
          <Box key={error.from} color='red.500'>
            {error.message}
          </Box>
        ))}
      </Box>
    );
  }
};
