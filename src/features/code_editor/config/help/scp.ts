export default `
  Service Control Policies (SCPs) are guardrail policies that set
  permission boundaries for AWS accounts within an organization.

  SCPs don't grant permissions - they define the maximum permissions
  that can be granted to IAM entities:

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
        "Effect": "Deny", ::badge[DENIES SPECIFIED ACTIONS]::
        "Action": [
          "ec2:RunInstances"
        ], ::badge[LAUNCHING EC2 INSTANCES]::
        "Resource": "*", ::badge[ON ALL RESOURCES]::
        "Condition": { ::badge[APPLY THIS RESTRICTION IFF REGION IS NOT ALLOWED]::
          "StringNotEquals": {
            "aws:RequestedRegion": [
              "us-east-1",
              "eu-west-1"
            ]
          }
        }
      }
    ]
  }|fullwidth
  ~~~

  This SCP acts as a guardrail, preventing any IAM user or role in the account
  from launching EC2 instances outside the allowed regions.
`;
