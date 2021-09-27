/* eslint-disable node/no-extraneous-import */
import {AuthData} from './types';
import {signatureVerify} from '@polkadot/util-crypto';
import {stringToU8a, u8aConcat, u8aToU8a, hexToU8a} from '@polkadot/util';

function auth(data: AuthData): boolean {
  const {address, signature} = data;

  try {
    const message = stringToU8a(address);

    if (signatureVerify(message, hexToU8a(signature), address).isValid) {
      return true;
    }

    const wrappedMessage = u8aConcat(
      u8aToU8a('<Bytes>'),
      message,
      u8aToU8a('</Bytes>')
    );

    return signatureVerify(wrappedMessage, hexToU8a(signature), address)
      .isValid;
  } catch (error) {
  }
  return false;
}

export default {
  auth,
};
