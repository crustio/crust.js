/* eslint-disable node/no-extraneous-import */
import { AuthData } from './types';
import axios from 'axios'

async function auth(data: AuthData): Promise<boolean> {
  try {
    var host = "http://localhost:38297"
    if (process.env.XX_VALIDATE_HOST) {
      host = process.env.XX_VALIDATE_HOST
    }

    const res = await axios.post(`${host}/verify`, {
      userPubKey: data.address,
      userName: data.txMsg,
      verifSig: data.signature,
      fileHash: data.tyMsg,
      timestamp: data.tzMsg,
      uploadSig: data.tkMsg,
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
