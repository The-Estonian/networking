package urlHandlers

import (
	"backend/helpers"
	"backend/structs"
	"backend/validators"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

func HandleGroups(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Groups attempt!")

	var callback = make(map[string]interface{})
	var sendGroups []structs.Groups

	cookie, err := r.Cookie("socialNetworkSession")
	// if not err and cookie valid
	if err != nil || validators.ValidateUserSession(cookie.Value) == "0" {
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
		sendGroups = validators.ValidateGroups()
		callback["groups"] = sendGroups
	}
	writeData, err := json.Marshal(callback)
	helpers.CheckErr("HandleGroups", err)
	w.Write(writeData)
}