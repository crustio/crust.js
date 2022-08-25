package main

import (
	"crypto/sha256"
)

const usernameHashSalt = "CrustXXBackupUsernameSalt"

// hashUsername hashes the passed in username using the sha256 hashing algorithm.
func hashUsername(userName string) []byte {
	h := sha256.New()
	_, _ = h.Write([]byte(userName))
	_, _ = h.Write([]byte(usernameHashSalt))
	return h.Sum(nil)
}
