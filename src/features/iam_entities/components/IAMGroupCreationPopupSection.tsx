import React from 'react';

import { FormControl, FormLabel, FormHelperText, Input } from '@chakra-ui/react';

interface IAMGroupCreationPopupSectionProps {
  groupName: string;
  setGroupName: (value: string) => void;
}

export const IAMGroupCreationPopupSection: React.FC<IAMGroupCreationPopupSectionProps> = ({
  groupName,
  setGroupName,
}) => {
  return (
    <>
      <FormControl>
        <FormLabel>Group Name</FormLabel>
        <Input value={groupName} onChange={e => setGroupName(e.target.value)} />
        <FormHelperText>This could be any Groupname you like</FormHelperText>
      </FormControl>

      {/* <Box pt={8}>
        <PoliciesList />
      </Box> */}
    </>
  );
};
