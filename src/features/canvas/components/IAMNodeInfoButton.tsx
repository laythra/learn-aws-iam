import {
  Popover,
  Text,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverHeader,
  PopoverBody,
  PopoverCloseButton,
  IconButton,
  type PlacementWithLogical,
  Code,
  Tooltip,
} from '@chakra-ui/react';
import { CodeBracketIcon, PencilSquareIcon } from '@heroicons/react/20/solid';

interface IAMNodeInfoButtonProps {
  label: string;
  verboseDescription?: string;
  codeDescription?: string;
  placement?: PlacementWithLogical;
}

export const IAMNodeInfoButton: React.FC<IAMNodeInfoButtonProps> = ({
  label,
  verboseDescription,
  codeDescription,
  placement = 'end-end',
}) => {
  return (
    <Popover placement={placement} closeOnBlur={true} isLazy={true} closeDelay={0}>
      <PopoverTrigger>
        <IconButton
          aria-label='info'
          icon={<CodeBracketIcon />}
          position='absolute'
          top={1}
          right={1}
          variant='ghost'
          opacity={0.5}
          height='16px'
          width='16px'
          minWidth='auto'
          _hover={{ bg: 'gray.200', opacity: 1 }}
        />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverHeader textAlign='left' display='flex' alignItems='center'>
          <Text fontSize='16px' fontWeight='500'>
            {label}
          </Text>
        </PopoverHeader>
        <PopoverCloseButton />
        <PopoverBody textAlign='left'>
          {codeDescription && (
            <Code width='100%' whiteSpace='pre-wrap' position='relative'>
              <Tooltip label='Edit' aria-label='Edit' placement='top'>
                <IconButton
                  ml={1}
                  aria-label='edit'
                  icon={<PencilSquareIcon />}
                  variant='ghost'
                  minWidth='auto'
                  height='20px'
                  width='20px'
                  position='absolute'
                  top={1}
                  right={1}
                  opacity={0.5}
                  _hover={{ bg: 'gray.200', opacity: 1 }}
                />
              </Tooltip>
              {codeDescription}
            </Code>
          )}
          {verboseDescription && <Text>{verboseDescription}</Text>}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
