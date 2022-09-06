package main

import (
	"crypto/x509"
	"encoding/base64"
	"encoding/pem"
	"strconv"
	"time"

	gorsa "crypto/rsa"

	"github.com/pkg/errors"
	"gitlab.com/xx_network/crypto/signature/rsa"
)

const (
	UDBCertEncoded = `-----BEGIN CERTIFICATE-----
MIIFqTCCA5GgAwIBAgIUEVshfaLgjzuVfLlyk0mTsXIkVewwDQYJKoZIhvcNAQEL
BQAwgYAxCzAJBgNVBAYTAktZMRQwEgYDVQQHDAtHZW9yZ2UgVG93bjETMBEGA1UE
CgwKeHggbmV0d29yazEPMA0GA1UECwwGRGV2T3BzMRMwEQYDVQQDDAp4eC5uZXR3
b3JrMSAwHgYJKoZIhvcNAQkBFhFhZG1pbnNAeHgubmV0d29yazAeFw0yMTA1MDcx
NTExNTVaFw0zMTA1MDUxNTExNTVaMIGAMQswCQYDVQQGEwJLWTEUMBIGA1UEBwwL
R2VvcmdlIFRvd24xEzARBgNVBAoMCnh4IG5ldHdvcmsxDzANBgNVBAsMBkRldk9w
czETMBEGA1UEAwwKeHgubmV0d29yazEgMB4GCSqGSIb3DQEJARYRYWRtaW5zQHh4
Lm5ldHdvcmswggIiMA0GCSqGSIb3DQEBAQUAA4ICDwAwggIKAoICAQC1dYoVYmYA
L4TaKC9g3cTM8LqTD7Ofdo4LKkkluqPKadX6rZyrvO90LtOtcH/1yxipTOnaKF0J
9/kTrxgTroKgIrHuzHOE7w87hcV4zPveYX+4nc8OBQRkVh0slIfPGUWQMSAx0ojv
Aqstkrk8SapcSJK0AJi2wHephJhSnmnKbq56NSD4VwGbT9O8YAqsrU0FzGxTcers
QILgQY3BdcnzJL3VRjzMaLT3oCbXS2FPD6Z46JVs/jCc+fg7TT7N1VJwsNJ0w7gR
nV3iB5XG/9Em/khQ2Ne2mPRoh4xaXPFeAmXYhiREFI2t4LrgeHwySuRhsRLolYA+
95nSZ1FCuPabV+jv2UURLN581VzLjgOA8Ad60P1yKfyP6N2BcR/99xD/Y+pBvsn5
wgSVbPTxq15M3WehPLVvoie66pg25uLo+EdyvkzFIBjdy8oNW5qKB6IhrqM5OKsp
xvdh/nQ/6bikIZxmdJqhTs0slhD6NlY+RnHNg/9xyDU/aoU/tn06cL9xlhVA88A/
I1Tz5JJdF6G05O/MaTe5FaCJJly6+uY3R6O9f4eKdeuwVdvLHjKvFHir78djG5wq
xYieGaiUSxy6kr0b283pVNxWlWVPUxlRQpr9EWB9cfKzjuMie83xdCGfJOgfiw1q
KOirdiO3Y/goSsndolKrARWRO5Af4P4f/wIDAQABoxkwFzAVBgNVHREEDjAMggp4
eC5uZXR3b3JrMA0GCSqGSIb3DQEBCwUAA4ICAQAIUMML1m+NXFF2qnXrkbJUrr0Y
kMejzFkSrx0PypqXThDUwdCdkYZkNzcfTB/jvNMn6PfU7uR5OYqTgKjHyGxG7ZZs
RhxL21jTUYq9H45aMRYJzOZ/jOag2QbrV+46YsbCMJoZhD9da2qVOLNPHyG1pYfY
HzlObq+uy23iNQSL9dNSw9PbvPY8UVMqkY9dXEqFtOuivLoacUU6+ZiOnp/Cbed8
E+oIhP7U3Zlnl1WMyMM94ltdVOqpzyiaNuqLE1S7ngN1qukiu63B50JH7YCxiwuC
IrcyRErwrCPFdpjxsgJViH3cQG3Y07Eof2KJRYoyJ1NF9UgXfTpZ3P7lDSEtDre2
YLKZbAPJRYwnyrPmw/Gs1PNIf02C+UglgqhtcpvTLQ+PxJp0u58JJfKqUDqzOAYl
OtVJJ71coADrz9ON1W9TsJ154sHIQVF/wjLic9mUOnn0zsWuk2ClcGJp67UF8ZSe
eWbnQipc/rxcsh9KF/n+lG7thmEaJ10tntr0X5vYR4e1FjIlfc2wk46yH7+pIl/3
R9quX/3zRxxNKNugkz+Jp+WeL6oP2ozzh4Nr9H1rdAsgkj89t2RKteXp4XZ8Pp1i
uXO9ulyHkAvQxyehoFk44Q0Z2AEkSDbNCtQ5yRKTKoeeL04vbAvn7L0XWQ7jDJje
xHGnyrYJGhiR8Sp20w==
-----END CERTIFICATE-----
`
)

func jointVerify(data *DataForVerify) error {
	// UDBPubkey
	block, _ := pem.Decode([]byte(UDBCertEncoded))
	cert, _ := x509.ParseCertificate(block.Bytes)
	UDBPubkeyGo := cert.PublicKey.(*gorsa.PublicKey)
	UDBPubkey := &rsa.PublicKey{PublicKey: *UDBPubkeyGo}

	// Hash username
	userNameHash := hashUsername(data.UserName)

	// Get userPubKey
	userPubKeyTrue, err := base64.StdEncoding.DecodeString(data.UserPubKey)
	if err != nil {
		return err
	}

	userPubKey, err := rsa.LoadPublicKeyFromPem(userPubKeyTrue)
	if err != nil {
		return err
	}

	// Get verifSig
	verifSig, err := base64.StdEncoding.DecodeString(data.VerifSig)
	if err != nil {
		return err
	}

	// Verify user pubkey and name
	if err := verifyVerification(UDBPubkey, userNameHash, userPubKey, verifSig); err != nil {
		return errors.WithMessage(err, "Failed to verify the Verification Signature")
	}

	// Get fileHash
	fileHash, err := base64.StdEncoding.DecodeString(data.FileHash)
	if err != nil {
		return err
	}

	// Get uploadSig
	uploadSig, err := base64.StdEncoding.DecodeString(data.UploadSig)
	if err != nil {
		return err
	}

	// Get timestamp
	timestampInt64, err := strconv.ParseInt(data.Timestamp, 10, 64)
	if err != nil {
		return err
	}
	timestamp := time.Unix(0, timestampInt64)

	if err := verifyUpload(userPubKey, time.Now(), timestamp, fileHash, uploadSig); err != nil {
		return errors.WithMessage(err, "Failed to verify the Upload Signature")
	}

	return nil
}
