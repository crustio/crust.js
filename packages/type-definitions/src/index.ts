import base from './base';
import benefit from './benefit';
import csmLocking from './csmLocking';
import claims from './claims';
import {
  jsonrpcFromDefs,
  typesAliasFromDefs,
  typesFromDefs,
} from '@open-web3/orml-type-definitions/utils';
import market from './market';
import staking from './staking';
import swork from './swork';

export const crustTypes = {
  base,
  benefit,
  claims,
  csmLocking,
  market,
  staking,
  swork,
};

export const types = {
  ...typesFromDefs(crustTypes),
};

export const rpc = jsonrpcFromDefs(crustTypes);
export const typesAlias = typesAliasFromDefs(crustTypes);

const bundle = {
  rpc,
  types: [
    {
      minmax: [undefined, undefined] as any,
      types: {
        ...types,
      },
    },
  ],
  alias: typesAlias,
};

// Type overrides have priority issues
export const typesBundleForPolkadot = {
  spec: {
    crust: bundle,
  },
};
