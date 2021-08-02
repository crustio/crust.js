export default {
  rpc: {},
  types: {
    FileInfo: {
      file_size: 'u64',
      spower: 'u64',
      expired_at: 'BlockNumber',
      calculated_at: 'BlockNumber',
      amount: 'Compact<Balance>',
      prepaid: 'Compact<Balance>',
      reported_replica_count: 'u32',
      replicas: 'Vec<Replica<AccountId>>',
    },
    Replica: {
      who: 'AccountId',
      valid_at: 'BlockNumber',
      anchor: 'SworkerAnchor',
      is_reported: 'bool',
      created_at: 'Option<BlockNumber>',
    },
  },
};
