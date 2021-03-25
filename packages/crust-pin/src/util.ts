/* eslint-disable node/no-extraneous-import */
import {SubmittableExtrinsic} from '@polkadot/api/promise/types';
import {Keyring} from '@polkadot/keyring';

/**
 * Send tx to Crust Network
 * @param {SubmittableExtrinsic} tx substrate-style tx
 * @param {string} seeds tx already been sent
 */
export async function sendTx(
  tx: SubmittableExtrinsic,
  seeds: string
): Promise<boolean> {
  console.log('⛓  Send tx to chain...');
  const krp = loadKeyringPair(seeds);

  return new Promise((resolve, reject) => {
    tx.signAndSend(krp, ({events = [], status}) => {
      console.log(
        `  ↪ 💸  Transaction status: ${status.type}, nonce: ${tx.nonce}`
      );

      if (
        status.isInvalid ||
        status.isDropped ||
        status.isUsurped ||
        status.isRetracted
      ) {
        reject(new Error('Invalid transaction'));
      } else {
        // Pass it
      }

      if (status.isInBlock) {
        events.forEach(({event: {method, section}}) => {
          if (section === 'system' && method === 'ExtrinsicFailed') {
            // Error with no detail, just return error
            console.error(`  ↪ ❌  Send transaction(${tx.type}) failed.`);
            resolve(false);
          } else if (method === 'ExtrinsicSuccess') {
            console.log(`  ↪ ✅  Send transaction(${tx.type}) success.`);
            resolve(true);
          }
        });
      } else {
        // Pass it
      }
    }).catch(e => {
      reject(e);
    });
  });
}

/**
 * Load keyring pair with seeds
 * @param {string} seeds
 */
function loadKeyringPair(seeds: string) {
  const kr = new Keyring({
    type: 'sr25519',
  });

  const krp = kr.addFromUri(seeds);
  return krp;
}
