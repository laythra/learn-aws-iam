import { Box, IconButton, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { PlusCircleIcon } from '@heroicons/react/24/solid';
import _ from 'lodash';

import { useLevelActor, useLevelSelector } from '@/app_shell/runtime/level-runtime';
import { TutorialPopover } from '@/app_shell/tutorial/TutorialPopover';
import { useAnimatedRedDot } from '@/app_shell/ui/useAnimatedRedDot';
import { useIdentityCreator } from '@/app_shell/ui/useIdentityCreator';
import { useIsElementRestricted } from '@/app_shell/ui/useIsElementRestricted';
import AnimatedRedDot from '@/components/AnimatedRedDot';
import { ElementID } from '@/config/element-ids';
import codeEditorStateStore from '@/stores/code-editor-state-store';
import { StatelessStateMachineEvent } from '@/types/state-machine-event-enums';

interface NewEntityButtonProps {}

export const NewEntityButton: React.FC<NewEntityButtonProps> = () => {
  const { openIdentityCreator } = useIdentityCreator();
  const levelActor = useLevelActor();
  const { isRedDotEnabledForElement: isRedDotEnabled } = useAnimatedRedDot({
    elementIds: [ElementID.NewEntityBtn],
  });

  const [isUserGroupMenuItemRestricted, isRolesMenuItemRestricted, isNewEntityBtnRestricted] =
    useIsElementRestricted([
      ElementID.CreateUserGroupMenuItem,
      ElementID.CreateRolesAndPoliciesMenuItem,
      ElementID.NewEntityBtn,
    ]);

  const [showPopovers, showFixedPopovers, popoverContent] = useLevelSelector(
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

  const handleMenuOpen = (): void => {
    levelActor.send({ type: StatelessStateMachineEvent.HidePopovers });
  };

  const openCodeEditor = (): void => {
    codeEditorStateStore.send({ type: 'open', mode: 'create' });
  };

  return (
    <>
      <Menu onOpen={handleMenuOpen}>
        {!isNewEntityBtnRestricted && (
          <TutorialPopover elementId={ElementID.NewEntityBtn}>
            <Box position='relative'>
              <MenuButton
                data-element-id={ElementID.NewEntityBtn}
                isDisabled={disableEntityButton}
                as={IconButton}
                size='sm'
                aria-label='New'
                icon={<PlusCircleIcon />}
                color={'gray.600'}
                _hover={{ color: 'black' }}
                _active={{ color: 'black' }}
                bg='transparent'
              />
              {!disableEntityButton && isRedDotEnabled(ElementID.NewEntityBtn) && (
                <AnimatedRedDot />
              )}
            </Box>
          </TutorialPopover>
        )}
        <MenuList>
          {!isUserGroupMenuItemRestricted && (
            <TutorialPopover elementId={ElementID.CreateUserGroupMenuItem}>
              <MenuItem
                data-element-id={ElementID.CreateUserGroupMenuItem}
                onClick={openIdentityCreator}
              >
                Users & Groups
              </MenuItem>
            </TutorialPopover>
          )}

          {!isRolesMenuItemRestricted && (
            <TutorialPopover elementId={ElementID.CreateRolesAndPoliciesMenuItem}>
              <MenuItem
                onClick={openCodeEditor}
                data-element-id={ElementID.CreateRolesAndPoliciesMenuItem}
              >
                Roles & Policies
              </MenuItem>
            </TutorialPopover>
          )}
        </MenuList>
      </Menu>
    </>
  );
};
