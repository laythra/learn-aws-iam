import { Box, IconButton, Menu, MenuList } from '@chakra-ui/react';
import { PlusCircleIcon } from '@heroicons/react/24/solid';
import _ from 'lodash';

import { IdentityCreationPopup } from './IdentityCreationPopup';
import { useIdentityCreator } from '../hooks/useIdentityCreator';
import AnimatedRedDot from '@/components/Animated/AnimatedRedDot';
import { GuardedMenuItemWithPopover, TutorialGuardedMenuButton } from '@/components/Decorated';
import { LevelsProgressionContext } from '@/components/providers/level-actor-contexts';
import { ElementID } from '@/config/element-ids';
import { withPopover } from '@/decorators/withPopover';
import { useAnimatedRedDot } from '@/hooks/useAnimatedRedDot';
import codeEditorStateStore from '@/stores/code-editor-state-store';
import { StatelessStateMachineEvent } from '@/types/state-machine-event-enums';

interface NewEntityButtonProps {}

export const NewEntityButton: React.FC<NewEntityButtonProps> = () => {
  const { openIdentityCreator } = useIdentityCreator();
  const levelActor = LevelsProgressionContext().useActorRef();
  const { isRedDotEnabledForElement: isRedDotEnabled } = useAnimatedRedDot({
    elementIds: [ElementID.NewEntityBtn],
  });
  const [showPopovers, showFixedPopovers, popoverContent] = LevelsProgressionContext().useSelector(
    state => [
      state.context.show_popovers,
      state.context.show_fixed_popovers,
      state.context.popover_content,
    ],
    _.isEqual
  );

  // To keep the user focused on a shown tutorial popover,
  // we disable the button if a popover with a next button is shown.
  const disableEntityButton =
    (showPopovers && popoverContent?.show_next_button) || showFixedPopovers;

  const hidePopovers = (): void => {
    levelActor.send({ type: StatelessStateMachineEvent.HidePopovers });
  };

  const openCodeEditor = (): void => {
    codeEditorStateStore.send({ type: 'open', mode: 'create' });
  };

  return (
    <>
      <IdentityCreationPopup />
      <Menu>
        <Box position='relative'>
          <TutorialGuardedMenuButton
            data-element-id={ElementID.NewEntityBtn}
            isDisabled={disableEntityButton}
            as={IconButton}
            size='sm'
            aria-label='New'
            icon={<PlusCircleIcon />}
            onClick={hidePopovers}
            color={'gray.600'}
            _hover={{ color: 'black' }}
            _active={{ color: 'black' }}
            bg='transparent'
          />

          {!disableEntityButton && isRedDotEnabled(ElementID.NewEntityBtn) && <AnimatedRedDot />}
        </Box>
        <MenuList>
          <GuardedMenuItemWithPopover
            data-element-id={ElementID.CreateUserGroupMenuItem}
            onClick={openIdentityCreator}
          >
            Users & Groups
          </GuardedMenuItemWithPopover>

          <GuardedMenuItemWithPopover
            onClick={openCodeEditor}
            data-element-id={ElementID.CreateRolesAndPoliciesMenuItem}
          >
            Roles & Policies
          </GuardedMenuItemWithPopover>
        </MenuList>
      </Menu>
    </>
  );
};

export const NewEntityButtonWithPopover = withPopover(NewEntityButton);
