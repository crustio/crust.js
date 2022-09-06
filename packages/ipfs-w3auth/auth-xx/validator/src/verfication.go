package main

import (
	"crypto"
	"hash"

	"gitlab.com/xx_network/crypto/signature/rsa"
)

// VerifyVerificationSignature verifies the signature provided from SignVerification.
func verifyVerification(pubKey *rsa.PublicKey,
	usernameHash []byte, receptionPubKey *rsa.PublicKey, signature []byte) error {

	// Create hash that was signed
	opts := rsa.NewDefaultOptions()
	opts.Hash = crypto.SHA256
	hashed := makeVerificationSignatureHash(usernameHash,
		receptionPubKey.N.Bytes(), opts.Hash.New())

	// Verify signature
	return rsa.Verify(pubKey, opts.Hash, hashed, signature, opts)
}

func makeVerificationSignatureHash(usernameHash, receptionPubKey []byte, h hash.Hash) []byte {
	_, _ = h.Write(receptionPubKey)
	_, _ = h.Write(usernameHash)
	return h.Sum(nil)
}
