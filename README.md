![license](https://img.shields.io/badge/License-GPL%203.0-blue?logo=gnu&style=flat-square)
[![npm](https://img.shields.io/npm/v/@crustio/type-definitions?logo=npm&style=flat-square)](https://www.npmjs.com/package/@crustio/type-definitions)

# crust.js

This library provides additional typing information for users to access Crust Network by using [polkadot.js](https://github.com/polkadot-js/api)

## Getting Started

More documentation and examples on [Crust Wiki](https://wiki.crust.network/)

1. Install dependencies

```shell
yarn add @polkadot/api @crustio/type-definitions
```

2. Create API instance

```ts
import {ApiPromise, WsProvider} from '@polkadot/api';
import {typesBundleForPolkadot} from '@crustio/type-definitions';

async function main() {
    const api = new ApiPromise({
      provider: new WsProvider('wss://api.crust.network'),
      typesBundle: typesBundleForPolkadot,
    });
    await api.isReady;

    // Use api
}

main();
```

3. Interact with chain

```ts
// Query file info
const fileInfo = await api.query.market.files('QmRaknS23vXEcdJezkrVC5WrApQNUkUDdTpbRdvh5fuJHc');
console.log(fileInfo.toHuman());
```

## Crust Types

- Use crust types

```ts
import {crustTypes} from '@crustio/type-definitions';

// Define FileInfo
export type FileInfo = typeof crustTypes.market.types.FileInfo;

// Use FileInfo as `interface`
```

- Types

  - [DSM Types](https://github.com/crustio/crust.js/blob/main/src/market.ts): `FileInfo`, `MerchantLedger`, `Replica`, ...
  - [MPoW Types](https://github.com/crustio/crust.js/blob/main/src/swork.ts): `Identity`, `WorkReport`, ...
  - [GPoS Types](https://github.com/crustio/crust.js/blob/main/src/staking.ts): `Guarantee`, ...

## Contribution
  
  Please send a PR(Pull Request) to contribute this repo and read the following rules:

  1. **No `--force` pushes** or modifying the master branch history in any way. If you need to rebase, ensure you do it in your own repo.
  2. **Non-main branches**, prefixed with a short name moniker (e.g. zik/my-feature) must be used for ongoing work.
  3. **All modifications** must be made in **pull-request** to solicit feedback from other contributors.
  4. A pull-request **must not be merged until CI** has finished successfully.
  5. Contributors should adhere to the [Google Typescript Style Guide](https://github.com/google/gts).
