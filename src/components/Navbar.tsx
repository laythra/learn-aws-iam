import React from 'react';

import { Box, Button, Flex, HStack, Input, Text } from '@chakra-ui/react';
import { useTheme } from '@chakra-ui/react';
import _ from 'lodash';

import { LevelsProgressionContext } from './providers/LevelsProgressionProvider';
import { ElementID } from '@/config/element-ids';
import { NewEntityButtonWithPopover } from '@/features/iam_entities';
import currentLevelDetailsStore from '@/stores/current-level-details-store';
import { CustomTheme } from '@/types';

interface NavbarProps {}

export const Navbar: React.FC<NavbarProps> = () => {
  const theme = useTheme<CustomTheme>();
  const [value, levelNumber] = LevelsProgressionContext().useSelector(
    state => [state.value, state.context.level_number],
    _.isEqual
  );

  const [pseudoLevelNumber, setPseudoLevelNumber] = React.useState<number>(levelNumber);

  return (
    <Box
      position='fixed'
      top='0'
      left='0'
      right='0'
      bg='white'
      height={theme.sizes.navbarHeightInPixels}
      p={4}
      boxShadow='md'
      zIndex={theme.zIndices.docked}
    >
      <Flex alignItems='center' justifyContent='space-between'>
        <Text fontSize='xl' fontWeight='bold' color='black'>
          IAM Project
        </Text>
        <HStack spacing={4}>
          {(import.meta.env.VITE_APP_ENV || 'development') === 'development' && ( // TODO: REMOVE THIS! Something hacky for dev purposes only.
            <HStack>
              <Text>{JSON.stringify(value)}</Text>
              <Input
                name='level_number'
                value={pseudoLevelNumber}
                type='number'
                onChange={e => setPseudoLevelNumber(Number(e.target.value))}
              />
              <Button
                onClick={() =>
                  currentLevelDetailsStore.send({
                    type: 'setLevelNumber',
                    levelNumber: pseudoLevelNumber,
                  })
                }
              >
                GO
              </Button>
            </HStack>
          )}
          <Text fontSize='lg' fontWeight='bold' color='black'>
            Level {levelNumber}/10
          </Text>
          <NewEntityButtonWithPopover elementid={ElementID.NewEntityBtn} />
        </HStack>
      </Flex>
    </Box>
  );
};
