package main

import (
	"crypto"
	"encoding/binary"
	"hash"
	"time"

	"github.com/pkg/errors"
	"gitlab.com/xx_network/crypto/signature/rsa"
)

// For test
const (
	uploadGracePeriod = 1 * time.Minute
)

// VerifyUpload verifies the user's upload signature. The signature
// should be from SignUpload. The timestamp provided must be +-1 minute
// from the current time passed in as "now".
func verifyUpload(userPublicKey *rsa.PublicKey,
	now, timestamp time.Time, fileHash, signature []byte) error {

	// Check if timestamp is within the grace period
	startOfPeriod := now.Add(-uploadGracePeriod)
	endOfPeriod := now.Add(uploadGracePeriod)
	if now.After(endOfPeriod) || now.Before(startOfPeriod) {
		return errors.Errorf("Timestamp %s is not in between "+
			"the grace period (%s, %s)",
			timestamp, startOfPeriod.String(), endOfPeriod.String())
	}

	// Hash together timestamp and
	opts := rsa.NewDefaultOptions()
	opts.Hash = crypto.SHA256
	hashed := makeUploadHash(fileHash, serializeTimestamp(timestamp),
		opts.Hash.New())

	return rsa.Verify(userPublicKey, opts.Hash, hashed, signature, opts)
}

// serializeTimestamp is a helper function which will serialize a
// [time.Time] to a byte slice. This will grab use time.Time's
// UnixNano function and serialize it using [binary.BigEndian].
func serializeTimestamp(timestamp time.Time) []byte {
	tsUnix := timestamp.UnixNano()
	tsSerialize := make([]byte, 8)
	binary.BigEndian.PutUint64(tsSerialize, uint64(tsUnix))
	return tsSerialize
}

// makeUploadHash is a helper function which hashes together the
// timestamp and file hash. This hashed will be what is signed.
func makeUploadHash(fileHash []byte, ts []byte, h hash.Hash) []byte {
	_, _ = h.Write(fileHash)
	_, _ = h.Write(ts)
	return h.Sum(nil)
}
