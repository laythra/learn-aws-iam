export enum UserNodeID {
  TrustedAccountIAMUser = 'arn:aws:iam::123456789012:user/richard',
}

export enum ResourceNodeID {
  TrustingAccountDynamoDBTable = 'arn:aws:dynamodb:us-west-2:123456789012:table/finance-reports',
}

export enum RoleNodeID {
  TrustingAccountDynamoDBReadRole = 'arn:aws:iam::123456789012:role/finance-reports-read-role',
}

export enum PolicyNodeID {
  // eslint-disable-next-line
  TrustingAccountFinanceReportsReadPolicy = 'arn:aws:iam::123456789012:policy/finance-reports-read-policy',
  TrustedAccountAssumeRolePolicy = 'arn:aws:iam::123456789012:policy/assume-role-policy',
}
