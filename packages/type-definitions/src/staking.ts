export default {
  rpc: {},
  types: {
    Guarantee: {
      targets: 'Vec<IndividualExposure<AccountId, Balance>>',
      total: 'Compact<Balance>',
      submitted_in: 'EraIndex',
      suppressed: 'bool',
    },
    ValidatorPrefs: {
      guaranteefee: 'Compact<Perbill>',
    },
  },
};
