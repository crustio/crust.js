export default {
  rpc: {},
  types: {
    CsmBalance: 'Balance',
    CsmBalanceOf: 'Balance',
    CSMLedger: {
      total: 'Compact<Balance>',
      active: 'Compact<Balance>',
      unlocking: 'Vec<CSMUnlockChunk<Balance>>',
    },
    CSMUnlockChunk: {
      value: 'Compact<Balance>',
      bn: 'Compact<BlockNumber>',
    },
  },
};
