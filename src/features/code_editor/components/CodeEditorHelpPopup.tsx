import React from 'react';

import {
  Modal,
  ModalContent,
  ModalOverlay,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Text,
} from '@chakra-ui/react';
import { useTheme } from '@chakra-ui/react';
import { useSelector } from '@xstate/store/react';
import _ from 'lodash';
import Markdown from 'react-markdown';

import codeEditorStateStore from '../stores/code-editor-state-store';
import { CustomTheme } from '@/types';
import { remarkChakra } from '@/utils/markdown/chakra-markdown';
import { components } from '@/utils/markdown/components';

const IAM_POLICY_HELP_POPUP_CONTENT = `
  Policies whether **AWS Managed** or **Customer Managed** have the same structure:

  * **Effect**: Whether the policy allows or denies the access
  * **Action**: The specific actions that the policy allows or denies
  * **Resource**: The resources to which the policy applies
  * **Condition**: Additional conditions that must be met for the policy to apply

  &nbsp;

  ~~~js
  {
    Version: '2012-10-17',
    Statement: [
      {
        "Effect": "Allow", ::badge[ALLOWS SPECIFIED ACTIONS]::
        "Action": ['s3:Get*', 's3:List*'], ::badge[LISTING ALL OBJECTS AND BUCKETS]::
        "Resource": '*', ::badge[ALL S3 BUCKETS]::
        "Condition": { ::badge[APPLY THIS POLICY IFF USER HAS 2FA ENABLED]::
          "BoolIfExists": {
            "aws:MultiFactorAuthPresent": "true"
          }
        }
      },
    ],
  }|fullwidth,
  ~~~
`;

interface CodeEditorHelpPopup {}

export const CodeEditorHelpPopup: React.FC<CodeEditorHelpPopup> = () => {
  const helpPopupInfo = useSelector(codeEditorStateStore, state => state.context.helpPopupInfo);
  const theme = useTheme<CustomTheme>();

  const closeHelpPopup = (): void => {
    codeEditorStateStore.send({ type: 'hideHelpPopup' });
  };

  return (
    <Modal
      isOpen={helpPopupInfo.isOpen}
      onClose={closeHelpPopup}
      isCentered
      motionPreset='slideInBottom'
    >
      <ModalOverlay />
      <ModalContent overflow='auto' maxW={theme.sizes.modalsMaxWidthInPixels + 150}>
        <ModalHeader>
          <Text>IAM Policy Schema</Text>
        </ModalHeader>

        <ModalBody>
          <Markdown components={components} rehypePlugins={[remarkChakra]}>
            {IAM_POLICY_HELP_POPUP_CONTENT}
          </Markdown>
        </ModalBody>
        <ModalFooter>
          <Button onClick={closeHelpPopup}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
