import {AuthData, AuthResult, AuthError} from './types';
import SubstrateAuth from '@crustio/ipfs-w3auth-substrate';
import EthAuth from '@crustio/ipfs-w3auth-ethereum';
import SolanaAuth from '@crustio/ipfs-w3auth-solana';
import AvalancheAuth from '@crustio/ipfs-w3auth-avalanche';
import FlowAuth from '@crustio/ipfs-w3auth-flow';
import ElrondAuth from '@crustio/ipfs-w3auth-elrond';

const _ = require('lodash');

const mapBySigType = (
  sigTypes: string[],
  authObject: object,
  chainType: number
) => {
  return _.zipObject(
    sigTypes,
    _.fill(Array(_.size(sigTypes)), {
      chainType: chainType,
      authObj: authObject,
    })
  );
};

const authProviders = {
  ...mapBySigType(['substrate', 'sub', 'crust', 'cru'], SubstrateAuth, 0),
  ...mapBySigType(['ethereum', 'eth', 'polygon', 'pol'], EthAuth, 1),
  ...mapBySigType(['solana', 'sol', 'near', 'nea'], SolanaAuth, 2),
  ...mapBySigType(['avalanche', 'ava'], AvalancheAuth, 3),
  ...mapBySigType(['flow', 'flo'], FlowAuth, 4),
  ...mapBySigType(['elrond', 'elr'], ElrondAuth, 5),
};

async function auth(
  signatureType: string,
  data: AuthData
): Promise<AuthResult> {
  const authProvider = _.get(
    authProviders,
    _.toLower(_.trim(signatureType)),
    null
  );
  if (_.isEmpty(authProvider)) {
    throw new AuthError('Unsupported web3 signature');
  }
  const result: AuthResult = {
    success: await authProvider.authObj.auth(data),
    chainType: authProvider.chainType,
    address: data.address,
  };
  return result;
}

export default {
  auth,
};
