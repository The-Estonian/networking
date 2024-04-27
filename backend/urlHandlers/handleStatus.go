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
	if err == nil {
		userId := validators.ValidateUserSession(cookie.Value)
		if userId == "0" {
			// check status
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
			callback["login"] = "fail"
		} else {
			callback["login"] = "success"
			callback["userid"] = userId
		}
		writeData, err := json.Marshal(callback)
		helpers.CheckErr("handleLogin", err)
		w.Write(writeData)
	}
	callback["login"] = "fail"
	writeData, err := json.Marshal(callback)
	helpers.CheckErr("handleLogin", err)
	w.Write(writeData)
}
