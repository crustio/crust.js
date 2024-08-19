import {
    Address,
    beginCell,
    Cell,
    Contract,
    contractAddress,
    ContractProvider,
    Dictionary,
    Sender,
    SendMode,
    toNano
} from '@ton/core';
import { defOpt } from './merkle/merkle';

export const default_storage_period = 60n * 60n * 24n * 180n;
export const default_max_storage_proof_span = 60n * 60n * 24n;
export const default_max_storage_providers_per_order = 30n;

export const op_upgrade = 0xdbfaf817;
export const op_update_admin = 0x8a3447f9;
export const op_update_treasury = 0xf33714b2;
export const op_update_storage_contract_code = 0x31c08cfa;
export const op_set_config_param = 0x761225c1;
export const op_place_storage_order = 0xa8055863;
export const op_recycle_undistributed_storage_fees = 0x3c14cdbe;
export const op_register_as_storage_provider = 0x1addc0dc;
export const op_unregister_as_storage_provider = 0x401a6169;
export const op_submit_storage_proof = 0x1055bfcc;
export const op_claim_storage_rewards = 0xd6b37a4b;
export const op_add_storage_provider_to_white_list = 0xd9d13623;
export const op_remove_storage_provider_from_white_list = 0xbd51af76;

export const config_min_storage_fee = 0x7bb75940;

export type CrustBagsContent = {
    type: 0 | 1;
    uri: string;
};

export function crustBagsContentToCell(content: CrustBagsContent) {
    return beginCell().storeUint(content.type, 8).storeStringTail(content.uri).endCell();
}

export type CrustBagsConfig = {
    adminAddress: Address;
    treasuryAddress: Address;
    storageContractCode: Cell;
    configParamsDict: Dictionary<bigint, Cell>;
    storageProviderWhitelistDict: Dictionary<Address, Cell>;
};

export function crustBagsConfigToCell(config: CrustBagsConfig): Cell {
    return beginCell()
        .storeAddress(config.adminAddress)
        .storeAddress(config.treasuryAddress)
        .storeRef(config.storageContractCode)
        .storeDict(config.configParamsDict)
        .storeDict(config.storageProviderWhitelistDict)
        .endCell();
}

export class CrustBags implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new CrustBags(address);
    }

    static createFromConfig(config: CrustBagsConfig, code: Cell, workchain = 0) {
        const data = crustBagsConfigToCell(config);
        const init = { code, data };
        return new CrustBags(contractAddress(workchain, init), init);
    }

    async getBalance(provider: ContractProvider) {
        const { balance } = await provider.getState();
        return balance;
    }

    async getIsStorageProviderWhitelisted(provider: ContractProvider, providerAddress: Address) {
        const result = await provider.get('is_storage_provider_white_listed', [
            { type: 'slice', cell: beginCell().storeAddress(providerAddress).endCell() }
        ]);
        return result.stack.readBigNumber();
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell()
        });
    }

    async sendUpgrade(provider: ContractProvider, via: Sender, newCode: Cell) {
        const msg = beginCell()
            .storeUint(op_upgrade, 32) // op
            .storeUint(0, 64) // queryId
            .storeRef(newCode)
            .endCell();

        await provider.internal(via, {
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: msg,
            value: toNano('0.1')
        });
    }

    async sendUpdateAdmin(provider: ContractProvider, via: Sender, newOwner: Address) {
        const msg = beginCell()
            .storeUint(op_update_admin, 32) // op
            .storeUint(0, 64) // queryId
            .storeAddress(newOwner)
            .endCell();

        await provider.internal(via, {
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: msg,
            value: toNano('0.1')
        });
    }

    async sendUpdateTreasury(provider: ContractProvider, via: Sender, newTreasury: Address) {
        const msg = beginCell()
            .storeUint(op_update_treasury, 32) // op
            .storeUint(0, 64) // queryId
            .storeAddress(newTreasury)
            .endCell();

        await provider.internal(via, {
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: msg,
            value: toNano('0.1')
        });
    }

    async sendUpdateStorageContractCode(provider: ContractProvider, via: Sender, newCode: Cell) {
        const msg = beginCell()
            .storeUint(op_update_storage_contract_code, 32) // op
            .storeUint(0, 64) // queryId
            .storeRef(newCode)
            .endCell();

        await provider.internal(via, {
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: msg,
            value: toNano('0.1')
        });
    }

    async sendSetConfigParam(
        provider: ContractProvider,
        via: Sender,
        param: bigint,
        value: bigint
    ) {
        const msg = beginCell()
            .storeUint(op_set_config_param, 32) // op
            .storeUint(0, 64) // queryId
            .storeUint(param, 256)
            .storeUint(value, 64)
            .endCell();

        await provider.internal(via, {
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: msg,
            value: toNano('0.1')
        });
    }

    async sendAddStorageProviderToWhitelist(
        provider: ContractProvider,
        via: Sender,
        storageProvider: Address
    ) {
        const msg = beginCell()
            .storeUint(op_add_storage_provider_to_white_list, 32) // op
            .storeUint(0, 64) // queryId
            .storeAddress(storageProvider)
            .endCell();

        await provider.internal(via, {
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: msg,
            value: toNano('0.1')
        });
    }

    async sendRemoveStorageProviderFromWhitelist(
        provider: ContractProvider,
        via: Sender,
        storageProvider: Address
    ) {
        const msg = beginCell()
            .storeUint(op_remove_storage_provider_from_white_list, 32) // op
            .storeUint(0, 64) // queryId
            .storeAddress(storageProvider)
            .endCell();

        await provider.internal(via, {
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: msg,
            value: toNano('0.1')
        });
    }

    static placeStorageOrderMessage(
        torrentHash: bigint,
        fileSize: bigint,
        merkleHash: bigint,
        chunkSize: bigint,
        totalStorageFee: bigint,
        storagePeriodInSec: bigint
    ) {
        return beginCell()
            .storeUint(op_place_storage_order, 32) // op
            .storeUint(0, 64) // queryId
            .storeUint(torrentHash, 256)
            .storeUint(fileSize, 64)
            .storeUint(merkleHash, 256)
            .storeUint(chunkSize, 32)
            .storeCoins(totalStorageFee)
            .storeUint(storagePeriodInSec, 256)
            .endCell();
    }

    async sendPlaceStorageOrder(
        provider: ContractProvider,
        via: Sender,
        torrentHash: bigint,
        fileSize: bigint,
        merkleHash: bigint,
        totalStorageFee: bigint,
        storagePeriodInSec: bigint
    ) {
        await provider.internal(via, {
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: CrustBags.placeStorageOrderMessage(
                torrentHash,
                fileSize,
                merkleHash,
                BigInt(defOpt.chunkSize),
                totalStorageFee,
                storagePeriodInSec
            ),
            value: totalStorageFee + toNano('0.1')
        });
    }

    async getAdminAddress(provider: ContractProvider) {
        const result = await provider.get('get_admin_address', []);
        return result.stack.readAddress();
    }

    async getTreasuryAddress(provider: ContractProvider) {
        const result = await provider.get('get_treasury_address', []);
        return result.stack.readAddress();
    }

    async getConfigParam(provider: ContractProvider, param: bigint, defaultVaule: bigint) {
        const result = await provider.get('get_param_value', [
            { type: 'int', value: param },
            { type: 'int', value: defaultVaule }
        ]);
        return result.stack.readBigNumber();
    }

    async getStorageProviderWhitelistDict(provider: ContractProvider) {
        const result = await provider.get('get_storage_provider_white_list_dict', []);
        return result.stack.readCell();
    }

    async getStorageContractAddress(
        provider: ContractProvider,
        storageContractCode: Cell,
        ownerAddress: Address,
        torrentHash: bigint,
        fileSize: bigint,
        merkleHash: bigint,
        initialStorageFee: bigint,
        storagePeriodInSec: bigint,
        maxStorageProofSpanInSec: bigint,
        treasuryAddress: Address,
        treasuryFeeRate: bigint,
        maxStorageProvidersPerOrder: bigint,
        storageProviderWhitelistDict: Cell
    ) {
        const result = await provider.get('get_storage_contract_address', [
            { type: 'cell', cell: storageContractCode },
            { type: 'slice', cell: beginCell().storeAddress(ownerAddress).endCell() },
            { type: 'int', value: torrentHash },
            { type: 'int', value: fileSize },
            { type: 'int', value: merkleHash },
            { type: 'int', value: BigInt(defOpt.chunkSize) },
            { type: 'int', value: initialStorageFee },
            { type: 'int', value: storagePeriodInSec },
            { type: 'int', value: maxStorageProofSpanInSec },
            { type: 'slice', cell: beginCell().storeAddress(treasuryAddress).endCell() },
            { type: 'int', value: treasuryFeeRate },
            { type: 'int', value: maxStorageProvidersPerOrder },
            { type: 'cell', cell: storageProviderWhitelistDict }
        ]);
        return result.stack.readAddress();
    }
}
