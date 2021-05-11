export default {
  rpc: {},
  types: {
    CSMUnlockChunk: {
      value: 'Compact<Balance>',
      bn: 'BlockNumber',
    },
    CSMLedger: {
      total: 'Compact<Balance>',
      active: 'Compact<Balance>',
      unlocking: 'Vec<CSMUnlockChunk<Balance>>',
    },
  },
};
