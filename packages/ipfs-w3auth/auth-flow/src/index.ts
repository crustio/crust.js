import {AuthData} from './types';
const fcl = require('@onflow/fcl');

async function auth(data: AuthData): Promise<boolean> {
  const {address, signature} = data;
  const newSignature = Buffer.from(signature, 'base64').toString('ascii');
  fcl.config().put('accessNode.api', 'https://flow-access-mainnet.portto.io'); // Configure FCL's Access Node
  const sign = JSON.parse(newSignature);
  const MSG = Buffer.from(address).toString('hex');
  const result = await fcl.verifyUserSignatures(MSG, sign);
  return result;
}

export default {
  auth,
};
