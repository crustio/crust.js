import {AuthData} from './types';
import * as _ from 'lodash';
import {ethers} from 'ethers';
import { recoverPersonalSignature } from "@metamask/eth-sig-util";

function addressesEquals(address: string, recoverAddress: string): boolean {
  return _.toLower(_.trim(recoverAddress)) === _.toLower(_.trim(address));
}

function auth(data: AuthData): boolean {
  const {address, signature} = data;

  const signatureWithPrefix = _.startsWith(_.toLower(signature), '0x')
    ? signature
    : `0x${signature}`;

  // For some signing tools like mycrypto, we can directly verify the signature
  let recoveredAddress = ethers.utils.verifyMessage(
    address,
    signatureWithPrefix
  );

  if (addressesEquals(address, recoveredAddress)) {
    return true;
  }
  // Some some signing tools like myetherwallet, we need hash the message before recover
  const hashBytes = ethers.utils.arrayify(address);
  const messageHash = ethers.utils.hashMessage(hashBytes);
  recoveredAddress = ethers.utils.recoverAddress(
    messageHash,
    signatureWithPrefix
  );
  if (addressesEquals(address, recoveredAddress)) {
    return true;
  }

  // verify with @metamask/eth-sig-util
  recoveredAddress = recoverPersonalSignature({ data: address, signature: signatureWithPrefix});

  return addressesEquals(address, recoveredAddress);
}

export default {
  auth,
};
