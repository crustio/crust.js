export default {
  rpc: {},
  types: {
    Group: {
      members: 'BTreeSet<AccountId>',
      allowlist: 'BTreeSet<AccountId>',
    },
    IASSig: 'Vec<u8>',
    Identity: {
      anchor: 'SworkerAnchor',
      punishment_deadline: 'u64',
      group: 'Option<AccountId>',
    },
    ISVBody: 'Vec<u8>',
    MerkleRoot: 'Vec<u8>',
    ReportSlot: 'u64',
    PKInfo: {
      code: 'SworkerCode',
      anchor: 'Option<SworkerAnchor>',
    },
    SworkerAnchor: 'Vec<u8>',
    SworkerCert: 'Vec<u8>',
    SworkerCode: 'Vec<u8>',
    SworkerPubKey: 'Vec<u8>',
    SworkerSignature: 'Vec<u8>',
    WorkReport: {
      report_slot: 'u64',
      spower: 'u64',
      free: 'u64',
      reported_files_size: 'u64',
      reported_srd_root: 'MerkleRoot',
      reported_files_root: 'MerkleRoot',
    },
  },
};
