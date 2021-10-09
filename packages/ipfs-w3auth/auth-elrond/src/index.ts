import {AuthData} from './types';
import {Signature} from '@elrondnetwork/erdjs/out/signature';
import {SignableMessage} from '@elrondnetwork/erdjs/out/signableMessage';
import {Address, UserPublicKey, UserVerifier} from '@elrondnetwork/erdjs';

/**
 * SolanaAuth expects BS58 public address, and hex signature string
 */
function auth(data: AuthData): boolean {
  const signedM = new SignableMessage({
    address: new Address(data.address),
    message: Buffer.from(data.address),
    signature: new Signature(data.signature),
  });
  const publicKey = new UserPublicKey(
    Address.fromString(data.address).pubkey()
  );
  const verifier = new UserVerifier(publicKey);
  const valid = verifier.verify(signedM);
  return valid;
}

export default {
  auth,
};
