import {AuthData} from './types';
import * as _ from 'lodash';
import {ethers} from 'ethers';
import axios from 'axios';
const Web3 = require('web3');
const HUO_CHAIN_SIGN_VERIFY_URL = getEnv(
  'HUO_CHAIN_SIGN_VERIFY_URL_KEY',
  'http://116.63.172.139:9021/api/v2/signVerify'
);
function stringEqual(address: string, recoverAddress: string): boolean {
  return _.toLower(_.trim(recoverAddress)) === _.toLower(_.trim(address));
}

function getEnv(value: string, defaultValue: string): string {
  return process.env[value] || defaultValue;
}

async function auth(data: AuthData): Promise<boolean> {
  const {address, txMsg, signature} = data;
  console.log(`authData: ${JSON.stringify(data)}`);
  if (_.isEmpty(txMsg)) {
    console.error('huochain: txMsg is empty');
    return false;
  }

  const signatureWithPrefix = _.startsWith(_.toLower(signature), '0x')
    ? signature
    : `0x${signature}`;

  const {privateKey, account} = JSON.parse(
    Buffer.from(txMsg, 'hex').toString()
  );
  if (_.isEmpty(privateKey) || _.isEmpty(account)) {
    console.error('huochain: privateKey or account is empty');
    return false;
  }
  // check address
  const wallet = new ethers.Wallet(privateKey);
  if (!stringEqual(address, wallet.address)) {
    console.error('huochain: invalid address');
    return false;
  }
  // check sign msg
  try {
    const web3 = new Web3();
    const result = web3.eth.accounts.sign(address, privateKey);
    if (!stringEqual(result.signature, signatureWithPrefix)) {
      console.error('huochain: invalid signature');
      return false;
    }
    const huoChainResult = await axios.post(HUO_CHAIN_SIGN_VERIFY_URL, {
      account: account,
      publicKey: wallet.publicKey,
      signature: signatureWithPrefix,
      messageHash: result.messageHash,
    });
    const {data, errorCode} = huoChainResult.data;
    console.log(`huochain result data: ${data} errorCode: ${errorCode} `);
    return data && errorCode === 0;
  } catch (e) {
    console.error(`huochain auth err: ${e.stack}`);
    return false;
  }
}

export default {
  auth,
};
