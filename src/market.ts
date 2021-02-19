export default {
    rpc: {},
    types: {
        FileInfo: {
            file_size: 'u64',
            expired_on: 'BlockNumber',
            claimed_at: 'BlockNumber',
            amount: 'Balance',
            expected_replica_count: 'u32',
            reported_replica_count: 'u32',
            replicas: 'Vec<Replica<AccountId>>'
        },
        UsedInfo: {
            used_size: 'u64',
            reported_group_count: 'u32',
            groups: 'BTreeMap<SworkerAnchor, bool>'
        },
        Status: {
            _enum: ['Free', 'Reserved']
        },
        Replica: {
            who: 'AccountId',
            valid_at: 'BlockNumber',
            anchor: 'SworkerAnchor',
            is_reported: 'bool'
        },
        Releases: {
            _enum: ['V1_0_0', 'V2_0_0']
        },
        MerchantLedger: {
            reward: 'Balance',
            collateral: 'Balance'
        }
    }
};