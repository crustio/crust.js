import { typesBundleForPolkadot } from '@crustio/type-definitions';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { sendTx } from './util';

export default class CrustPinner {
    readonly seeds: string;
    readonly crustApi: ApiPromise;

    constructor(s: string, chainAddr: string = 'wss://api.crust.network') {
        this.seeds = s;
        this.crustApi = new ApiPromise({
            provider: new WsProvider(chainAddr),
            typesBundle: typesBundleForPolkadot
        })
    }

    async pin(cid: string): Promise<boolean>{
        try {
            // 1. Check Api is ready
            await this.crustApi.isReadyOrError;

            // 2. Place storage order
            const tx = this.crustApi.tx.market.placeStorageOrder(cid, 200 * 1024 * 1024/* 200MB */, 0);
            
            const res = await sendTx(tx, this.seeds);

            // 3. Disconnect chain
            this.crustApi.disconnect();

            return res;
        } catch (e) {
            console.error(`Error happens on calling Crust Chain, details: ${e.message}`);
            return false;
        }
    }
}