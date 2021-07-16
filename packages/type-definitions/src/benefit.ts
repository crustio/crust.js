export default {
  rpc: {},
  types: {
    EraBenefits: {
      total_fee_reduction_quota: 'Compact<Balance>',
      total_market_active_funds: 'Compact<Balance>',
      used_fee_reduction_quota: 'Compact<Balance>',
      active_era: 'Compact<EraIndex>'
    },
    FeeReductionBenefit: {
      funds: 'Balance',
      total_fee_reduction_count: 'u32',
      used_fee_reduction_quota: 'Balance',
      used_fee_reduction_count: 'u32',
      refreshed_at: 'EraIndex',
    },
    FundsType: {
      _enum: [
        'SWORK',
        'MARKET'
      ]
    },
    FundsUnlockChunk: {
      value: 'Compact<Balance>',
      era: 'Compact<EraIndex>'
    },
    MarketBenefit: {
      /// It's total funds value
      total_funds: `Compact<Balance>`,
      /// It's own active funds value
      active_funds: `Compact<Balance>`,
      /// The used reduction for fee
      used_fee_reduction_quota: 'Compact<Balance>',
      /// The file reward for market
      file_reward: 'Compact<Balance>',
      /// The latest refreshed active era index
      refreshed_at: `Compact<EraIndex>`,
      /// Any balance that is becoming free
      unlocking_funds: `Vec<FundsUnlockChunk<Balance>>`,
    },
    SworkBenefit: {
      /// It's total funds value
      total_funds: 'Compact<Balance>',
      /// It's own active funds value
      active_funds: 'Compact<Balance>',
      /// The total reduction count for report works
      total_fee_reduction_count: `u32`,
      /// The used reduction count for report works
      used_fee_reduction_count: `u32`,
      /// The latest refreshed active era index
      refreshed_at: `Compact<EraIndex>`,
      /// Any balance that is becoming free
      unlocking_funds: `Vec<FundsUnlockChunk<Balance>>`
    }
  },
};
