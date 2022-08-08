export default {
  rpc: {},
  types: {
    RegisterPayload: {
      code: 'Vec<u8>',
      who: 'AccountId',
      pubkey: 'Vec<u8>',
      public: 'MultiSigner',
    },
  },
};
