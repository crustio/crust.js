import {AuthData, AuthError} from './types';
import SubstrateAuth from '@crustnetwork/ipfs-w3auth-substrate';
import EthAuth from '@crustnetwork/ipfs-w3auth-ethereum';
import SolanaAuth from '@crustnetwork/ipfs-w3auth-solana';
import AvalancheAuth from '@crustnetwork/ipfs-w3auth-avalanche';
import FlowAuth from '@crustnetwork/ipfs-w3auth-flow';
import ElrondAuth from '@crustnetwork/ipfs-w3auth-elrond';
import XXAuth from '@crustnetwork/ipfs-w3auth-xx';
import AptosAuth from '@crustnetwork/ipfs-w3auth-aptos';
import AlgorandAuth from '@crustnetwork/ipfs-w3auth-algorand';
import TonAuth from '@crustnetwork/ipfs-w3auth-ton';

const _ = require('lodash');

const mapBySigType = (sigTypes: string[], authObject: object) => {
  return _.zipObject(sigTypes, _.fill(Array(_.size(sigTypes)), authObject));
};

const authProviders = {
  ...mapBySigType(['substrate', 'sub', 'crust', 'cru'], SubstrateAuth),
  ...mapBySigType(['ethereum', 'eth', 'polygon', 'pol'], EthAuth),
  ...mapBySigType(['solana', 'sol', 'near', 'nea'], SolanaAuth),
  ...mapBySigType(['avalanche', 'ava'], AvalancheAuth),
  ...mapBySigType(['flow', 'flo'], FlowAuth),
  ...mapBySigType(['elrond', 'elr'], ElrondAuth),
  ...mapBySigType(['xx'], XXAuth),
  ...mapBySigType(['aptos', 'apt'], AptosAuth),
  ...mapBySigType(['algorand', 'algo'], AlgorandAuth),
  ...mapBySigType(['ton'], TonAuth),
};

async function auth(signatureType: string, data: AuthData): Promise<boolean> {
  const authProvider = _.get(
    authProviders,
    _.toLower(_.trim(signatureType)),
    null
  );
  if (_.isEmpty(authProvider)) {
    throw new AuthError('Unsupported web3 signature');
  }
  return await authProvider.auth(data);
}

export default {
  auth,
};
