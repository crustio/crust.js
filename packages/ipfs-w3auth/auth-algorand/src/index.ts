import {AuthData} from './types';
import {verifyBytes} from 'algosdk';

async function auth(data: AuthData): Promise<boolean> {
  return verifyBytes(
    Buffer.from(data.address),
    Buffer.from(data.signature, 'base64'),
    data.address
  );
}

export default {
  auth,
};
