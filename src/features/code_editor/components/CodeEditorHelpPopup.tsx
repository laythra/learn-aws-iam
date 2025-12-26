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
import Markdown from 'react-markdown';

import codeEditorStateStore from '@/stores/code-editor-state-store';
import { CustomTheme, IAMNodeEntity } from '@/types';
import { rehypeChakraBadge } from '@/utils/markdown/chakra-markdown';
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

const IAM_ROLE_HELP_POPUP_CONTENT = `
Each **IAM role** has a **trust policy** that specifies who can assume it.

A **trust policy** is a JSON document that defines the trusted entities that can assume the role.
The basic structure of *IAM roles* should be easy to digest now that we've covered the basics:
* **Principal**: The entity that is allowed to assume the role. It can be an AWS service,
a regular IAM user or even an AWS account
* **Effect**: Whether the principal is allowed or denied the access
* **Action**: The action the pricipal is allowed to perform, it's almost always \`sts:AssumeRole\`

~~~js
{
  Version: '2012-10-17',
  Statement: [
    {
      Effect: 'Allow', ::badge[ALLOWS THE PRINCIPAL TO ASSUME THIS ROLE]::
      Principle: {
        Service: 's3.amazonaws.com', ::badge[THE PRINCIPAL HERE IS ANY S3 BUCKET]::
      },
      Action: 'sts:AssumeRole', ::badge[THE PRINCIPAL CAN ASSUME THIS ROLE]::
    },
  ],
}|fullwidth,
~~~

&nbsp;

The Principal can take the following formats:|lg
* **AWS service**:  \`{ "Service": "ec2.amazonaws.com" }\`
* **IAM User**:  \`{ "AWS": "arn:aws:iam::123456789012:user/FinanceUser" }\`
* **AWS Account**:  \`{ "AWS": "arn:aws:iam::123456789012:root" }\`
`;

interface CodeEditorHelpPopup {}

export const CodeEditorHelpPopup: React.FC<CodeEditorHelpPopup> = () => {
  const helpPopupInfo = useSelector(codeEditorStateStore, state => state.context.helpPopupInfo);
  const theme = useTheme<CustomTheme>();

  const closeHelpPopup = (): void => {
    codeEditorStateStore.send({ type: 'hideHelpPopup' });
  };

  const selectedEntity = helpPopupInfo.entity;
  const headerTitle =
    selectedEntity == IAMNodeEntity.Policy ? 'IAM Policy Schema' : 'IAM Role Schema';
  const helpPopupContent =
    selectedEntity == IAMNodeEntity.Policy
      ? IAM_POLICY_HELP_POPUP_CONTENT
      : IAM_ROLE_HELP_POPUP_CONTENT;

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
          <Text>{headerTitle}</Text>
        </ModalHeader>

        <ModalBody maxH='400px' overflowY='auto'>
          <Markdown components={components} rehypePlugins={[rehypeChakraBadge]}>
            {helpPopupContent}
          </Markdown>
        </ModalBody>
        <ModalFooter>
          <Button onClick={closeHelpPopup}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
