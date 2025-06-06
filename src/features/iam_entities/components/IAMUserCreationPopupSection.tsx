import React from 'react';

import { FormControl, FormLabel, FormHelperText } from '@chakra-ui/react';

import { WithPopoverInput } from '@/components/Decorated';

interface IAMUserCreationPopupSectionProps {
  userName: string;
  setUserName: (value: string) => void;
}

export const IAMUserCreationPopupSection: React.FC<IAMUserCreationPopupSectionProps> = ({
  userName,
  setUserName,
}) => {
  return (
    <>
      <FormControl>
        <FormLabel>User Name</FormLabel>
        <WithPopoverInput
          data-element-id='username'
          value={userName}
          onChange={e => setUserName(e.target.value)}
        />
        <FormHelperText>This could be any username you like</FormHelperText>
      </FormControl>

      {/* <Box pt={8}>
        <PoliciesList />
      </Box> */}
    </>
  );
};
