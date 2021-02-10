import { rpc as ormlRpc, types as ormlTypes, typesAlias as ormlAlias } from '@open-web3/orml-type-definitions';
import { jsonrpcFromDefs, typesAliasFromDefs, typesFromDefs } from '@open-web3/orml-type-definitions/utils';
import stakingPool from './staking';
import claims from './claims';
import market from './market';
import swork from './swork';
import versioned from './types-known/versioned';

const crustDefs = {
    stakingPool,
    claims,
    market,
    swork
}

export const types = {
    ...ormlTypes,
    ...typesFromDefs(crustDefs),
};

export const typesBundle = {
    spec: {
      maxwell: {
        types: versioned
      }
    }
};

export const rpc = jsonrpcFromDefs(crustDefs, { ...ormlRpc });
export const typesAlias = typesAliasFromDefs(crustDefs, { ...ormlAlias });

const bundle = {
    rpc,
    types: [...versioned].map((version) => {
      return {
        minmax: version.minmax,
        types: {
          ...types,
          ...version.types
        }
      };
    }),
    alias: typesAlias
  };
  

// Type overrides have priority issues
export const typesBundleForPolkadot = {
    spec: {
      maxwell: bundle
    }
};