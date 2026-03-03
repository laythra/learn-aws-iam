export const UserNodeID = {
  Mario: 'mario',
  Luigi: 'luigi',
  Peach: 'peach',
  Bowser: 'bowser',
  Wario: 'wario',
  Waluigi: 'waluigi',
} as const;

export const GroupNodeID = {
  PeachTeam: 'peach-team',
  BowserForce: 'bowser-force',
};

export const PolicyNodeID = {
  RDSManagePolicy1: 'policy-1',
  RDSManagePolicy2: 'policy-2',
  RDSSharedPolicy: 'policy-3',
} as const;

export const ResourceNodeID = {
  RDS1: 'resource-1',
  RDS2: 'resource-2',
  TeamPeachSecret: 'team-peach-secret',
  TeamBowserSecret: 'team-bowser-secret',
} as const;

export const RoleNodeID = {
  SlackCodeDeployRole: 'role-1',
};
