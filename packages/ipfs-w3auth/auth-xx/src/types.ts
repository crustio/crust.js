interface AuthData {
  address: string;
  signature: string;
  txMsg: string;
  tyMsg: string;
}

class AuthError extends Error {
  constructor(msg: string) {
    super(msg);
    Object.setPrototypeOf(this, AuthError.prototype);
  }
}

export {AuthData, AuthError};
