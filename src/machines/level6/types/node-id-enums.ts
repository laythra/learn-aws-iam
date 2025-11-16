export const AccountID = {
  TrustingAccount: '123456789012',
  TrustedAccount: '987654321098',
} as const;

export enum UserNodeID {
  TrustedAccountIAMUser = 'user-1',
}

export enum ResourceNodeID {
  TrustingAccountDynamoDBTable = 'resource-dynamodb-1',
}

export enum RoleNodeID {
  TrustingAccountDynamoDBReadRole = 'resource-role-1',
}

export enum PolicyNodeID {
  TrustingAccountFinanceReportsReadPolicy = 'resource-policy-1',
  TrustedAccountAssumeRolePolicy = 'resource-policy-2',
}
