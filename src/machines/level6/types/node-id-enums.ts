export enum UserNodeID {
  OriginatingAccountAuditorUser = 'Richard',
}

export enum ResourceNodeID {
  FirstAccountDynamoDBTable = 'FirstAccountDynamoDBTable',
}

export enum RoleNodeID {
  DynamoDBReadRole = 'finance-reports-read-role',
}

export enum PolicyNodeID {
  DynamoDBTableReadAccess = 'DynamoDBTableReadAccess',
  AssumeRolePolicy = 'AssumeRolePolicy',
}
