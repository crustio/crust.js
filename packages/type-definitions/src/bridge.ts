export default {
  rpc: {},
  types: {
    BridgeChainId: 'u8',
    ChainId: 'u8',
    ResourceId: 'H256',
    DepositNonce: 'u64',
    ProposalStatus: {
      _enum: ['Initiated', 'Approved', 'Rejected'],
    },
    ProposalVotes: {
      votes_for: 'Vec<AccountId>',
      votes_against: 'Vec<AccountId>',
      status: 'ProposalStatus',
      expiry: 'BlockNumber',
    },
    Erc721Token: {
      id: 'TokenId',
      metadata: 'Vec<u8>',
    },
    TokenId: 'U256',
  },
};
