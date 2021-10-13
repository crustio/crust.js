import {AuthData, AuthError} from './types';
import SubstrateAuth from '@crustio/ipfs-w3auth-substrate';
import EthAuth from '@crustio/ipfs-w3auth-ethereum';
import SolanaAuth from '@crustio/ipfs-w3auth-solana';
import AvalancheAuth from '@crustio/ipfs-w3auth-avalanche';
import FlowAuth from '@crustio/ipfs-w3auth-flow';
import ElrondAuth from '@crustio/ipfs-w3auth-elrond';

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
};

function auth(signatureType: string, data: AuthData): boolean {
  const authProvider = _.get(
    authProviders,
    _.toLower(_.trim(signatureType)),
    null
  );
  if (_.isEmpty(authProvider)) {
    throw new AuthError('Unsupported web3 signature');
  }
  return authProvider.auth(data);
}

export default {
  auth,
};
