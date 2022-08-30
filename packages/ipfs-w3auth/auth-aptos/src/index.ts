import {AuthData} from './types';
import * as _ from 'lodash';
const nacl = require('tweetnacl');

/**
 * AptosAuth expects public key, and hex signature string
 * curl --location --request POST 'http://127.0.0.1:5050/api/v0/add'
 * --header 'authorization: 
 * Basic YXB0b3MtMHg5ODFhNjI5MjViM2Y1ZWMzNzRhMDAxM2NkMzcyNzM5MzE3Zj
 * diN2M2MzliMmIwZDYwOWQ1MzgyMTk0YzQxZmMyOjB4NGM5ZDY0ZmY3MmFlZWE4OG
 * ZhZGNhNTFiNTU1YzdjYTAwM2QxYzk2ZjFhMTc4OWVjZDhiNzlhZjBlMGE2YWQ3ZT
 * Q4NzQxNDc3MTM1NmY5MTA4ZjBhYWNiMzc1N2NjODJmZTIxMmFkMmViMjliMjY0ZG
 * E0ZjhlZmM0YTFkOTZlMDg=
 * -F file=@shell-wasm
 */
function auth(data: AuthData): boolean {
  const {address, signature} = data;

  const signatureWithoutPrefix = _.startsWith(_.toLower(signature), '0x')
    ? signature.substring(2)
    : signature;

  const addressWithoutPrefix = _.startsWith(_.toLower(address), '0x')
    ? address.substring(2)
    : address;

  return nacl.sign.detached.verify(
    new TextEncoder().encode(address),
    Uint8Array.from(Buffer.from(signatureWithoutPrefix, 'hex')),
    Uint8Array.from(Buffer.from(addressWithoutPrefix, 'hex')),
  );
}

export default {
  auth,
};
