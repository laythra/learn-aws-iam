import { Box, IconButton, Menu, MenuList } from '@chakra-ui/react';
import { PlusCircleIcon } from '@heroicons/react/24/solid';
import _ from 'lodash';

import { IdentityCreationPopup } from './IdentityCreationPopup';
import { useIdentityCreator } from '../hooks/useIdentityCreator';
import AnimatedRedDot from '@/components/Animated/AnimatedRedDot';
import {
  GuardedMenuItemWithEventAndPopover,
  TutorialGuardedMenuButton,
} from '@/components/Decorated';
import { LevelsProgressionContext } from '@/components/providers/LevelsProgressionProvider';
import { ElementID } from '@/config/element-ids';
import { withPopover } from '@/decorators/withPopover';
import { CodeEditor } from '@/features/code_editor';
import { useAnimatedRedDot } from '@/hooks/useAnimatedRedDot';
import codeEditorPopupStore, { CodeEditorMode } from '@/stores/code-editor-popup-store';
import { StatelessStateMachineEvent } from '@/types/state-machine-event-enums';

interface NewEntityButtonProps {}

export const NewEntityButton: React.FC<NewEntityButtonProps> = () => {
  const { openIdentityCreator } = useIdentityCreator();
  const levelActor = LevelsProgressionContext().useActorRef();
  const { isRedDotEnabledForElement: isRedDotEnabled } = useAnimatedRedDot({
    elementIds: [ElementID.NewEntityBtn],
  });
  const [showPopovers, popoverContent] = LevelsProgressionContext().useSelector(
    state => [state.context.show_popovers, state.context.popover_content],
    _.isEqual
  );

  // To keep the user focused on a shown tutorial popover,
  // we disable the button if a popover with a next button is shown.
  const disableEntityButton = showPopovers && popoverContent?.show_next_button;

  const hidePopovers = (): void => {
    levelActor.send({ type: StatelessStateMachineEvent.HidePopovers });
  };

  const openCodeEditor = (): void => {
    codeEditorPopupStore.send({ type: 'open', mode: CodeEditorMode.Create });
  };

  return (
    <>
      <CodeEditor />
      <IdentityCreationPopup />
      <Menu>
        <Box position='relative'>
          <TutorialGuardedMenuButton
            elementid={ElementID.NewEntityBtn}
            isDisabled={disableEntityButton}
            as={IconButton}
            size='sm'
            aria-label='New'
            icon={<PlusCircleIcon />}
            onClick={hidePopovers}
            color={'blue.500'}
            _hover={{ color: 'blue.500' }}
            _active={{ color: 'blue.600' }}
            bg='transparent'
          />

          {!disableEntityButton && isRedDotEnabled(ElementID.NewEntityBtn) && <AnimatedRedDot />}
        </Box>
        <MenuList>
          <GuardedMenuItemWithEventAndPopover
            elementid={ElementID.CreateEntitiesMenuItem}
            event={StatelessStateMachineEvent.CreateIAMIdentityPopupOpened}
            onClick={openIdentityCreator}
          >
            Users & Groups
          </GuardedMenuItemWithEventAndPopover>

          <GuardedMenuItemWithEventAndPopover
            onClick={openCodeEditor}
            elementid={ElementID.CreateRolesAndPoliciesMenuItem}
            event={StatelessStateMachineEvent.CreateIAMPolicyRoleWindowOpened}
          >
            Roles & Policies
          </GuardedMenuItemWithEventAndPopover>
        </MenuList>
      </Menu>
    </>
  );
};

export const NewEntityButtonWithPopover = withPopover(NewEntityButton);
