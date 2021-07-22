export default {
  rpc: {},
  types: {
    FileInfo: {
      file_size: 'u64',
      spower: 'u64',
      expired_at: 'BlockNumber',
      calculated_at: 'BlockNumber',
      amount: 'Balance',
      prepaid: 'Balance',
      reported_replica_count: 'u32',
      replicas: 'Vec<Replica<AccountId>>',
    },
    Releases: {
      _enum: ['V1_0_0', 'V2_0_0'],
    },
    Replica: {
      who: 'AccountId',
      valid_at: 'BlockNumber',
      anchor: 'SworkerAnchor',
      is_reported: 'bool',
      created_at: 'Option<BlockNumber>',
    },
    Status: {
      _enum: ['Free', 'Reserved'],
    },
  },
};
