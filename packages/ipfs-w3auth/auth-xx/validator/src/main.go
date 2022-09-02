package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

func verify(w http.ResponseWriter, req *http.Request) {
	switch req.Method {
	case "POST":
		param := &DataForVerify{}

		err := json.NewDecoder(req.Body).Decode(param)
		pstr, _ := json.Marshal(param)
		fmt.Println(string(pstr))
		if err != nil || param.PubKey == "" || param.UserName == "" ||
			param.Signature == "" || param.ReceptionPubKey == "" {
			w.WriteHeader(http.StatusBadRequest)
		} else {
			err = verifyVerificationSignature(param)
			if err != nil {
				fmt.Println(err)
				w.WriteHeader(http.StatusUnauthorized)
			}
			w.WriteHeader(http.StatusOK)
		}
	default:
		w.WriteHeader(http.StatusNotFound)
	}
}

func main() {
	http.HandleFunc("/verify", verify)
	fmt.Println("XX validator listen on 38297 port...")
	_ = http.ListenAndServe(":38297", nil)
}
