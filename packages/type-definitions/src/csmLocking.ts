export default {
  rpc: {},
  types: {
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
