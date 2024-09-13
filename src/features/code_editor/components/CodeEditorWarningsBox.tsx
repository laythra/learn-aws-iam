import { Box, Divider } from '@chakra-ui/react';

interface CodeEditorWarningsBoxProps {
  warnings: string[];
}

export const CodeEditorWarningsBox: React.FC<CodeEditorWarningsBoxProps> = ({ warnings }) => {
  if (warnings.length === 0) {
    return null;
  } else {
    return (
      <Box>
        <Divider orientation='horizontal' marginTop={4} marginBottom={4} />
        {warnings.map(warning => (
          <Box key={warning} color='yellow.600'>
            {warning}
          </Box>
        ))}
      </Box>
    );
  }
};
