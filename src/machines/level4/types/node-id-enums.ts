export enum PolicyNodeID {
  DeveloperPolicy = 'DeveloperPolicy',
  DataScientistPolicy = 'DataScientistPolicy',
  InternPolicy = 'InternPolicy',
}

export enum UserNodeID {
  Developer1 = 'Developer #1',
  Developer2 = 'Developer #2',
  DataScientist1 = 'Data Scientist #1',
  Intern1 = 'Intern #1',
  Intern2 = 'Intern #2',
}

export enum ResourceNodeID {
  CustomerDataDynamoTable = 'CustomerData',
  AnalyticsDataDynanoTable = 'AnalyticsData',
  SecureCorpDataS3Bucket = 'timeshift-assets',
  SecureCorpLogsS3Bucket = 'timeshift-db-backups',
}
