import {
  jsonrpcFromDefs,
  typesAliasFromDefs,
  typesFromDefs,
} from '@open-web3/orml-type-definitions/utils';
import staking from './staking';
import claims from './claims';
import market from './market';
import swork from './swork';
import base from './base';

export const crustTypes = {
  base,
  staking,
  claims,
  market,
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
