/* eslint-disable node/no-extraneous-import */
import { AuthData } from './types';
import axios from 'axios'

async function auth(data: AuthData): Promise<boolean> {
  try {
    const res = await axios.post('http://localhost:38297/verify', {
      pubKey: data.address,
      signature: data.signature,
      userName: data.txMsg,
      receptionPubKey: data.tyMsg
    })

    if (res.status == 200) {
      return true
    }
  } catch (error) {
  }
  return false;
}

export default {
  auth,
};
