import base from './base';
import benefit from './benefit';
import claims from './claims';
import {
  jsonrpcFromDefs,
  typesAliasFromDefs,
  typesFromDefs,
} from '@open-web3/orml-type-definitions/utils';
import locks from './locks';
import market from './market';
import staking from './staking';
import swork from './swork';
import maxwellBenefit from './maxwellBenefit';
import maxwellMarket from './maxwellMarket';
import maxwellSwork from './maxwellSwork';

export const crust = {
  base,
  benefit,
  claims,
  locks,
  market,
  staking,
  swork,
};

export const maxwell = {
  base,
  claims,
  maxwellBenefit,
  maxwellMarket,
  maxwellSwork,
  staking,
};

export const crustTypes = {
  ...typesFromDefs(crust),
};

export const maxwellTypes = {
  ...typesFromDefs(maxwell),
};

export const crustRpc = jsonrpcFromDefs(crust);
export const crustTypesAlias = typesAliasFromDefs(crust);

export const maxwellRpc = jsonrpcFromDefs(maxwell);
export const maxwellTypesAlias = typesAliasFromDefs(maxwell);

const crustBundle = {
  rpc: crustRpc,
  types: [
    {
      minmax: [undefined, undefined] as any,
      types: {
        ...crustTypes,
      },
    },
  ],
  alias: crustTypesAlias,
};

const maxwellBundle = {
  rpc: maxwellRpc,
  types: [
    {
      minmax: [undefined, undefined] as any,
      types: {
        ...maxwellTypes,
      },
    },
  ],
  alias: maxwellTypesAlias,
};

// Type overrides have priority issues
export const typesBundleForPolkadot = {
  spec: {
    crust: crustBundle,
    maxwell: maxwellBundle,
  },
};
