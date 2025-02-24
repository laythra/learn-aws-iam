import { HStack, Text } from '@chakra-ui/react';
import { ExclamationCircleIcon } from '@heroicons/react/16/solid';
import { CheckCircleIcon } from '@heroicons/react/16/solid';

interface CodeEditorProgressStatusProps {
  level: 'error' | 'warning' | 'success';
  message: string;
}

export const CodeEditorProgressStatus: React.FC<CodeEditorProgressStatusProps> = ({
  level,
  message,
}) => {
  const colorScheme = {
    error: 'red',
    warning: 'yellow',
    success: 'green',
  }[level];

  const IconComponent = {
    error: ExclamationCircleIcon,
    warning: ExclamationCircleIcon,
    success: CheckCircleIcon,
  }[level];

  return (
    <HStack color={`${colorScheme}.600`}>
      <IconComponent height='1em' width='1em' />
      <Text fontWeight='semibold'>{message}</Text>
    </HStack>
  );
};
