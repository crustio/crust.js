interface AuthData {
  address: string;
  signature: string;
  txMsg: string;
  tyMsg: string;
  tzMsg: string;
  tkMsg: string;
}

class AuthError extends Error {
  constructor(msg: string) {
    super(msg);
    Object.setPrototypeOf(this, AuthError.prototype);
  }
}

class Failure {
  error: FailureError;

  constructor(error: FailureError) {
    this.error = error;
  }

  static unauthorized(details: string): Failure {
    return new Failure(new FailureError('UNAUTHORIZED', details));
  }
}

class FailureError {
  reason: string;
  details: string;

  constructor(reason: string, details: string) {
    this.reason = reason;
    this.details = details;
  }
}


export {AuthData, AuthError, Failure, FailureError};
