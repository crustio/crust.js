import { createReadStream } from 'fs';
import path from 'path';
import { isMainThread, parentPort, Worker as ThreadWorker, workerData } from 'worker_threads';
import { MerkleTree } from './merkle';
import { getTonBagDetails } from './tonsutils';

type WD =
    | {
          type: 'getProofs';
          bag_id: string;
          random: number;
      }
    | {
          type: 'getMerkleRoot';
          bag_id: string;
      };

const exp: {
    getProofs(bag_id: string, random: number): Promise<bigint[]>;
    getMerkleRoot(bag_id: string): Promise<bigint>;
} = {
    async getProofs() {
        return [];
    },

    async getMerkleRoot() {
        return 0n;
    }
};

if (isMainThread) {
    let works: ThreadWorker[] = [];
    const maxWorks = 5;
    const reqGenWork = async (workerData: WD, reject: (e: Error) => void) => {
        while (true) {
            if (works.length < maxWorks) {
                const worker = new ThreadWorker(__filename, { workerData });
                works = works.concat(worker);
                worker.on('error', error => {
                    reject(error);
                });

                worker.on('exit', code => {
                    works = works.filter(w => w !== worker);
                    if (code !== 0) {
                        reject(new Error(`work stopred with code ${code}`));
                    }
                });
                return worker;
            }

            await new Promise(resolve => setTimeout(resolve, 500));
        }
    };

    exp.getProofs = (bag_id: string, random: number) =>
        new Promise<bigint[]>((resolve, reject) => {
            reqGenWork({ type: 'getProofs', bag_id: bag_id, random }, reject).then(w => {
                w.on('message', resolve);
            });
        });

    exp.getMerkleRoot = (bag_id: string) =>
        new Promise<bigint>((resolve, reject) => {
            reqGenWork({ type: 'getMerkleRoot', bag_id: bag_id }, reject).then(w => {
                w.on('message', resolve);
            });
        });
} else {
    const main = async function () {
        const wd = workerData as WD;
        const bd = await getTonBagDetails(wd.bag_id);
        if (bd.downloaded !== bd.size) {
            throw new Error('Bag not downloaded');
        }
        if (!['getProofs', 'getMerkleRoot'].includes(wd.type)) {
            throw new Error('Type error');
        }
        const files = bd.files as { index: number; name: string; size: number }[];
        const chunks: Buffer[] = [];
        for (const ifile of files) {
            const ipath = path.resolve(bd.path, bd.dir_name, ifile.name);
            // const fstat = await promises.stat(ipath)
            const rs = createReadStream(ipath);
            await new Promise(resolve => {
                rs.on('data', (buf: Buffer) => {
                    chunks.push(buf);
                });
                rs.on('end', resolve);
                rs.read();
            });
        }
        const fc = new Blob(chunks);
        const mt = new MerkleTree();
        await mt.genTree(fc);
        if (wd.type === 'getProofs') {
            const dap = await mt.getDataAndProofs(fc, Math.floor(wd.random / fc.size));
            parentPort?.postMessage(dap);
        } else if (wd.type === 'getMerkleRoot') {
            parentPort?.postMessage(mt.tree![0]);
        }
    };
    main();
}
export default exp;
