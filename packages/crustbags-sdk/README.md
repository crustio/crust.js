## CrustBags SDK
SDK for interacting with CrustBags contract

### Installation

```bash
npm install @crustnetwork/crustbags-sdk @ton/ton @ton/core @ton/crypto
```

### Usage 

#### Place Storage Order
```javascript
import CrustBagssdk from '@crustnetwork/crustbags-sdk'
import { default_storage_period } from "@crustnetwork/crustbags-sdk/src/CrustBags";
import { Address, toNano } from "@ton/core";
import { mnemonicToPrivateKey } from "@ton/crypto";
import { TonClient, WalletContractV4 } from "@ton/ton";

const tc = new TonClient({
    endpoint: "https://testnet.toncenter.com/api/v2/jsonRPC",
});
const CrustBagsAddress = Address.parse(
    "EQBOOMNqG0rvNm6vFGfR4qZl48BTDw_gYefVI4DQ70t9GoPC"
);
const CrustBags = CrustBagssdk.CrustBags.createFromAddress(CrustBagsAddress);

const openCrustBags = tc.open(CrustBags);
const keyPair = await mnemonicToPrivateKey(["your", "mnemonic"]);
const wallet = tc.open(
    WalletContractV4.create({ workchain: 0, publicKey: keyPair.publicKey })
);
await openCrustBags.sendPlaceStorageOrder(
    wallet.sender(keyPair.secretKey),
    tonrrentHash, // torrentHash or bagId
    1024n, // fileSize
    merkleHash, // file merkle tree root hash
    toNano("0.1"), // storageFee
    default_storage_period // storage period time
);

```

### API Reference

#### merkle tree 
```javascript
import { merkle } from '@crustnetwork/crustbags-sdk'

const readAsBlob = async (file: string) => {
  return new Promise<Blob>((resolve, reject) => {
    let chunks: Buffer[] = [];
    fs.createReadStream(file)
      .on("error", reject)
      .on("data", (data: Buffer) => {
        chunks.push(data);
      })
      .on("end", () => resolve(new Blob(chunks)));
  });
};

const mt = new merkle.MerkleTree();
const blob = await readAsBlob("test.txt");
// generate merkle tree
await mt.genTree(blob);
// merkle tree root
const merkleRoot = mt.tree![0];
// getMerkle proofs
const dataProofs = await mt.getDataAndProofs(blob, 1)
```

#### Tonutils
Wraped for the [Tonutils-storage](https://github.com/crustio/tonutils-storage) api
Require env TON_STORAGE_UTILS_API=http://localhost:7721

```javascript
import { tonutils } from '@crustnetwork/crustbags-sdk'

// create bag
const bagId = await tonutils.createBag('path', 'description')

```