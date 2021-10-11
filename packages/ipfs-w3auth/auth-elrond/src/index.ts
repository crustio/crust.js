import {AuthData} from './types';
import {Address, UserPublicKey, UserVerifier} from '@elrondnetwork/erdjs';

async function auth(data: AuthData): Promise<boolean> {
    const publicKey = new UserPublicKey(
        Address.fromString(data.address).pubkey()
    );
    const valid = publicKey.verify(
        Buffer.from(data.txMsg, 'hex'),
        Buffer.from(data.signature, 'hex')
    );
    return valid;
}

export default {
    auth,
};
