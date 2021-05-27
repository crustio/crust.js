export default {
  rpc: {},
  types: {
    FileInfo: {
      file_size: 'u64',
      expired_on: 'BlockNumber',
      calculated_at: 'BlockNumber',
      amount: 'Balance',
      prepaid: 'Balance',
      reported_replica_count: 'u32',
      replicas: 'Vec<Replica<AccountId>>',
    },
    MerchantLedger: {
      reward: 'Balance',
      collateral: 'Balance',
    },
    Releases: {
      _enum: ['V1_0_0', 'V2_0_0'],
    },
    Replica: {
      who: 'AccountId',
      valid_at: 'BlockNumber',
      anchor: 'SworkerAnchor',
      is_reported: 'bool',
    },
    Status: {
      _enum: ['Free', 'Reserved'],
    },
    UsedInfo: {
      used_size: 'u64',
      reported_group_count: 'u32',
      groups: 'BTreeMap<SworkerAnchor, bool>',
    },
  },
};
