export default `
  Resource-Based Policies are attached directly to resources (like S3 buckets, SNS topics, etc.)
  and have the same structure as identity-based policies, plus a **Principal** element:

  * **Effect**: Whether the policy allows or denies the access
  * **Principal**: Who is allowed or denied access (IAM users, roles, AWS accounts, services)
  * **Action**: The specific actions that the policy allows or denies
  * **Resource**: The resources to which the policy applies
  * **Condition**: Additional conditions that must be met for the policy to apply

  &nbsp;

  ~~~js
  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow", ::badge[ALLOWS SPECIFIED ACTIONS]::
        "Principal": { ::badge[WHO CAN ACCESS THIS RESOURCE]::
          "AWS": "arn:aws:iam::123456789012:user/Hanamichi"
        },
        "Action": ["s3:Get*", "s3:List*"], ::badge[LISTING ALL OBJECTS]::
        "Resource": "arn:aws:s3:::my-bucket/*", ::badge[THIS BUCKET'S OBJECTS]::
        "Condition": { ::badge[APPLY THIS POLICY IFF USER HAS 2FA ENABLED]::
          "BoolIfExists": {
            "aws:MultiFactorAuthPresent": "true"
          }
        }
      }
    ]
  }|fullwidth
  ~~~
`;
