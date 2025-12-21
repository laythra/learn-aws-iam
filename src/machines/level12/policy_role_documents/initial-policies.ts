export const INITIAL_POLICIES = {
  CLOUDTRAIL_DELETE_POLICY: {
    Version: '2012-10-17',
    Statement: [
      {
        Sid: 'DeleteAnyTrail',
        Effect: 'Allow',
        Action: [
          'cloudtrail:DeleteTrail',
          'cloudtrail:DescribeTrails',
          'cloudtrail:ListTrails',
          'cloudtrail:GetTrailStatus',
        ],
        Resource: '*',
      },
    ],
  },
  FIRST_SCP_OBJECTIVE_POLICY: {
    Version: '2012-10-17',
    Statement: [
      {
        Sid: 'DenyDeletingCloudTrails',
        Effect: '???',
        Action: '???',
        Resource: '*',
      },
    ],
  },
  EC2_TRUST_POLICY: {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Principal: {
          Service: 'ec2.amazonaws.com',
        },
        Action: 'sts:AssumeRole',
        Condition: {
          StringEquals: {
            'aws:PrincipalTag/team': 'backend',
          },
        },
      },
    ],
  },
};
