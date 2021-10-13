import {Response} from 'express';
import {AuthError} from './types';
import authRegistry from './authRegistry';
const _ = require('lodash');
const chainTypeDelimiter = '-';
const pkSigDelimiter = ':';

async function auth(req: any, res: Response, next: any) {
  // 1. Parse basic auth header 'Authorization: Basic [AuthToken]'
  if (
    !_.includes(req.headers.authorization, 'Basic ') &&
    !_.includes(req.headers.authorization, 'Bearer ')
  ) {
    res.writeHead(401, {'Content-Type': 'application/json'});
    res.end(
      JSON.stringify({
        Error: 'Empty Signature',
      })
    );
    return;
  }

  try {
    // 2. Decode AuthToken
    const base64Credentials = _.split(
      _.trim(req.headers.authorization),
      ' '
    )[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString(
      'ascii'
    );

    // 3. Parse AuthToken as `ChainType[substrate/eth/solana].PubKey:SignedMsg`
    const [passedAddress, sig] = _.split(credentials, pkSigDelimiter);
    console.log(`Got public address '${passedAddress}' and sigature '${sig}'`);

    // 4. Extract chain type, default: 'sub' if not specified
    const gaugedAddress = _.includes(passedAddress, chainTypeDelimiter)
      ? passedAddress
      : `sub${chainTypeDelimiter}${passedAddress}`;
    const [chainType, address, txMsg] = _.split(
      gaugedAddress,
      chainTypeDelimiter
    );

    const result = await authRegistry.auth(chainType, {
      address,
      txMsg,
      signature: sig,
    });

    if (result.success === true) {
      console.log(
        `Validate chainType: ${result.chainType} address: ${address} success`
      );
      req.authResult = result;
      next();
    } else {
      console.error('Validation failed');
      res.writeHead(401, {'Content-Type': 'application/json'});

      res.end(
        JSON.stringify({
          Error: 'Invalid Signature',
        })
      );
    }
  } catch (error: any) {
    console.error(error.message);
    res.writeHead(401, {'Content-Type': 'application/json'});
    res.end(
      JSON.stringify({
        Error: error instanceof AuthError ? error.message : 'Invalid Signature',
      })
    );
    return;
  }
}

module.exports = auth;
