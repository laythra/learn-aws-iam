export default `
  Identity-Based Policies, whether **AWS Managed** or **Customer Managed** have the same structure:

  * **Effect**: Whether the policy allows or denies the access
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
        "Action": ["s3:Get*", "s3:List*"], ::badge[LISTING ALL OBJECTS AND BUCKETS]::
        "Resource": "*", ::badge[ALL S3 BUCKETS]::
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
