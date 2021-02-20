import {jsonrpcFromDefs, typesAliasFromDefs, typesFromDefs} from '@open-web3/orml-type-definitions/utils';
import stakingPool from './staking';
import claims from './claims';
import market from './market';
import swork from './swork';
import versioned from './types-known/versioned';

export const crustTypes = {
    stakingPool,
    claims,
    market,
    swork
}

export const types = {
    ...typesFromDefs(crustTypes),
};

export const typesBundle = {
    spec: {
      crust: {
        types: versioned
      }
    }
};

export const rpc = jsonrpcFromDefs(crustTypes);
export const typesAlias = typesAliasFromDefs(crustTypes);

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
      crust: bundle
    }
};