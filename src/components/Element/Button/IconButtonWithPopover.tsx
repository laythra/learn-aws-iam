import { IconButton, type IconButtonProps } from '@chakra-ui/react';

import { withPopover } from '@/decorators/withPopover';

export const IconButtonWithPopover = withPopover<IconButtonProps & { id: string }>(IconButton);
