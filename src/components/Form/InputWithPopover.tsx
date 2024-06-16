import { Input, type InputProps } from '@chakra-ui/react';

import { withPopover } from '@/decorators/withPopover';

export const InputWithPopover = withPopover<InputProps & { id: string }>(Input);
