export default `
  Permission Boundaries serve as a safeguard to ensure that the permissions of an IAM entity
  (user or role) do not go beyond a specified limit. A permission boundary defines
  the maximum permissions that an identity-based policy can grant to an IAM entity.

  Even if a user's policy allows broader access,
  the permission boundary limits what actions can actually be executed.

  &nbsp;

  * **Effect**: Whether the policy permits or denies the access
  * **Action**: The specific actions that the policy permits or denies
  * **Resource**: The resources to which the policy applies
  * **Condition**: Additional conditions that must be met for the policy to apply

  &nbsp;

  ~~~js
  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow", ::badge[SETS MAXIMUM ALLOWED PERMISSIONS]::
        "Action": ["s3:*", "dynamodb:*", "lambda:*"], ::badge[LIMITS TO ONLY THESE SERVICES]::
        "Resource": "*" ::badge[WITHIN ANY RESOURCE]::
      }
    ]
  }|fullwidth
  ~~~

  &nbsp;

  In this example, even if a user has full administrator access,
  the permission boundary ensures they can only work with S3, DynamoDB, and Lambda services.

  **Important**: Permission boundaries use the same syntax as identity-based policies.
  An identity-based policy can be attached to a user or a role as a permission boundary.
`;
