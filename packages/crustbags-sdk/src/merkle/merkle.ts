import { beginCell, Builder } from '@ton/core';
import { sha256 } from 'js-sha256';

export function proofsIntoBody(body: Builder, datas: bigint[]) {
    const chunks: bigint[][] = [[]];
    const chunkcount = 3;
    datas.forEach(data => {
        let last = chunks[chunks.length - 1];
        if (last!.length === chunkcount) {
            chunks.push([]);
        }
        last = chunks[chunks.length - 1];
        last!.push(data);
    });
    // console.info('datas:', chunks);
    const cbs = chunks.map(chunk => {
        const cell = beginCell();
        cell.storeUint(chunk.length, 16);
        chunk.forEach(data => cell.storeUint(data, 256));
        return cell;
    });
    //
    if (cbs.length <= 4) {
        cbs.forEach(cb => body.storeRef(cb));
    } else if (cbs.length <= 20) {
        let ncbs = cbs.slice(0);
        while (ncbs.length) {
            console.info('ncbs:', ncbs.length);
            const p = ncbs[0];
            ncbs.slice(1, 5).forEach(cb => p!.storeRef(cb));
            body.storeRef(p!);
            ncbs = ncbs.slice(5);
        }
    }
}
// for ton contract
export function cellHash(value: bigint) {
    const hash = beginCell().storeUint(value, 256).endCell().hash(0).toString('hex');
    return BigInt('0x' + hash);
}

export type MerkleTreeOpt<T> = {
    // chunk data convert result size < 32byte(256bit)
    dataConvert: (data: Buffer) => T;
    // data hash
    dataHash: (data: T, index: number) => T;
    // hash up
    hashUp: (a: T, b: T) => T;
    chunkSize: number;
};

export const defOpt: MerkleTreeOpt<bigint> = {
    dataConvert: (data: Buffer) =>
        BigInt(`0x${data.byteLength > 32 ? sha256(data) : data.toString('hex')}`),
    dataHash: (data, index) => cellHash(data ^ BigInt(index)),
    hashUp: (a, b) => cellHash(a ^ b),
    chunkSize: 32
};
export class MerkleTree<T = bigint> {
    opt: MerkleTreeOpt<T>;
    tree?: T[];
    constructor(opt?: Partial<MerkleTreeOpt<T>>) {
        this.opt = {
            ...(defOpt as unknown as MerkleTreeOpt<T>),
            ...opt
        };
    }

    hasRemaining = async () => {
        if (typeof requestIdleCallback == 'undefined') return;
        while (true) {
            const has = await new Promise<boolean>(resolve => {
                requestIdleCallback(t => {
                    resolve(t.timeRemaining() > 1);
                });
            });
            if (has) return;
        }
    };

    async genTree(file: Blob | File) {
        const chunkSize = this.opt.chunkSize;
        const nodes: T[] = new Array(Math.ceil(file.size / chunkSize));
        let offset = 0;
        let index = 0;
        while (true) {
            await this.hasRemaining();
            const readCount = Math.min(
                Math.ceil((file.size - offset) / chunkSize),
                Math.ceil((1024 * 256) / chunkSize)
            );
            const ab = await file.slice(offset, offset + chunkSize * readCount).arrayBuffer();
            for (let readI = 0; readI < readCount; readI++) {
                const item = Buffer.from(
                    ab,
                    readI * chunkSize,
                    Math.min(ab.byteLength - readI * chunkSize, chunkSize)
                );
                const nodeI = readI + index;
                nodes[nodeI] = this.opt.dataHash(this.opt.dataConvert(item), nodeI);
            }
            index += readCount;
            offset = offset + readCount * chunkSize;
            if (offset >= file.size) {
                break;
            }
        }
        const tree: T[] = new Array(2 * nodes.length - 1);
        for (let i = 0; i < nodes.length; i++) {
            tree[tree.length - 1 - i] = nodes[i]!;
        }
        for (let i = tree.length - 1 - nodes.length; i >= 0; i--) {
            tree[i] = this.opt.hashUp(tree[2 * i + 1]!, tree[2 * i + 2]!);
        }
        this.tree = tree;
        return tree[0];
    }

    getProofs(i: number) {
        if (!this.tree) throw new Error('Not found tree');
        i = this.tree.length - 1 - i; // tree index
        const proof: T[] = [];
        while (i > 0) {
            proof.push(this.tree[i - (-1) ** (i % 2)]!);
            i = Math.floor((i - 1) / 2);
        }
        return proof;
    }
    async getDataAndProofs(file: Blob | File, i: number) {
        const proofs = this.getProofs(i);
        const chunkSize = this.opt.chunkSize;
        const data = await file.slice(i * chunkSize, i * chunkSize + chunkSize).arrayBuffer();
        const first = this.opt.dataConvert(Buffer.from(data));
        return [first, ...proofs];
    }

    verify(dataAndProofs: T[], i: number, root: T) {
        if (dataAndProofs.length < 2) {
            throw new Error('proofs error');
        }
        let tempHash: T = 0n as T;
        dataAndProofs.forEach((item, index) => {
            if (index) {
                tempHash = this.opt.hashUp(tempHash, item);
            } else {
                tempHash = this.opt.dataHash(item, i);
            }
        });
        return tempHash === root;
    }
}
