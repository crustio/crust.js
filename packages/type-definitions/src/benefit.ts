export default {
  rpc: {},
  types: {
    EraBenefits: {
      total_benefits: 'Balance',
      total_funds: 'Balance',
      used_benefits: 'Balance',
      active_era: 'EraIndex',
    },
    FeeReductionBenefit: {
      funds: 'Balance',
      total_fee_reduction_count: 'u32',
      used_fee_reduction_quota: 'Balance',
      used_fee_reduction_count: 'u32',
      refreshed_at: 'EraIndex',
    },
  },
};
