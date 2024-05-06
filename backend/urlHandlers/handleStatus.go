package urlHandlers

import (
	"backend/helpers"
	"backend/validators"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

func HandleStatus(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Status attempt!")

	var callback = make(map[string]string)
	cookie, err := r.Cookie("socialNetworkSession")
	// if not err and cookie valid

	if err != nil {
		// if cookie doesn't exist
		callback["login"] = "fail"
	} else {
		userId := validators.ValidateUserSession(cookie.Value)
		// if user is 0
		if userId == "0" {
			callback["login"] = "fail"
		} else {
			// user is valid
			callback["login"] = "success"
			callback["userid"] = userId
			callback["useravatar"] = validators.ValidateUserAvatar(userId)
		}
	}
	if callback["login"] == "fail" {
		sessionCookie := http.Cookie{
			Name:     "socialNetworkSession",
			Value:    "",
			Expires:  time.Now(),
			Path:     "/",
			HttpOnly: true,
			SameSite: http.SameSiteNoneMode,
			Secure:   true,
		}
		http.SetCookie(w, &sessionCookie)

		authCookie := http.Cookie{
			Name:     "socialNetworkAuth",
			Value:    "false",
			Expires:  time.Now(),
			Path:     "/",
			SameSite: http.SameSiteNoneMode,
			Secure:   true,
		}
		http.SetCookie(w, &authCookie)
	}
	writeData, err := json.Marshal(callback)
	helpers.CheckErr("handleLogin", err)
	w.Write(writeData)
}
