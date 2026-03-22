import React from 'react';

import { FormControl, FormLabel, FormHelperText, Input } from '@chakra-ui/react';

import { TutorialPopover } from '@/runtime/tutorial/TutorialPopover';

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
        <TutorialPopover elementId='username'>
          <Input
            data-element-id='username'
            value={userName}
            onChange={e => setUserName(e.target.value)}
          />
        </TutorialPopover>
        <FormHelperText>This could be any username you like</FormHelperText>
      </FormControl>

      {/* <Box pt={8}>
        <PoliciesList />
      </Box> */}
    </>
  );
};
