export default `
  Identity-Based Policies, whether **AWS Managed** or **Customer Managed** have the same structure:

  * **Effect**: Whether the policy allows or denies the access
  * **Action**: The specific actions that the policy allows or denies
  * **Resource**: The resources to which the policy applies
  * **Condition**: Additional conditions that must be met for the policy to apply
  * **Sid**: An optional identifier for the statement

  &nbsp;

  ~~~js
  {
    "Version": "2012-10-17", ::badge[POLICY LANGUAGE VERSION]::
    "Statement": [
      {
        "Sid": "AllowS3Read", ::badge[OPTIONAL STATEMENT IDENTIFIER]::
        "Effect": "Allow", ::badge[ALLOWS SPECIFIED ACTIONS]::
        "Action": ["s3:Get*", "s3:List*"], ::badge[READ-ONLY ACCESS TO S3]::
        "Resource": "*", ::badge[ALL S3 BUCKETS]::
        "Condition": { ::badge[APPLY THIS POLICY IF USER HAS 2FA ENABLED]::
          "BoolIfExists": {
            "aws:MultiFactorAuthPresent": "true"
          }
        }
      }
    ]
  }|fullwidth
  ~~~

  > |color(warning) ::badge[WARNING]:: **Deny** takes precedence over **Allow**.
  If a user has one policy that allows an action but another policy that denies it,
  the action will be denied.
`;
