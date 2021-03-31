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
      guarantee_fee: 'Compact<Perbill>',
    },
  },
};
