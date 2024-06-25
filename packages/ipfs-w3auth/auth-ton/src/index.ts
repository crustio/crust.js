/* eslint-disable node/no-extraneous-import */
import {AuthData} from './types';
import nacl from 'tweetnacl';

function auth(data: AuthData): boolean {
  const {address, txMsg, signature} = data;

  try {
    if (!txMsg) return false;
    return nacl.sign.detached.verify(
      // message
      Buffer.from(txMsg, 'hex'),
      // signature
      Buffer.from(signature, 'base64'),
      // pubkey
      Buffer.from(address, 'hex')
    );
  } catch (error) {}
  return false;
}

export default {
  auth,
};
