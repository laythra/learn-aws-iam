import React from 'react';

import { Button } from '@chakra-ui/react';

export interface MyButtonProps {
  label: string;
  onClick: () => void;
  colorScheme: string;
}

export const MyButton: React.FC<MyButtonProps> = ({ label, onClick, colorScheme }) => {
  return (
    <Button colorScheme={colorScheme} onClick={onClick} size='lg'>
      {label}
    </Button>
  );
};
