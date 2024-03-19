package urlHandlers

import (
	"backend/helpers"
	"backend/validators"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

func HandleProfile(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Profile attempt!")

	var callback = make(map[string]string)
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
			SameSite: http.SameSiteLaxMode,
		}
		http.SetCookie(w, &sessionCookie)

		authCookie := http.Cookie{
			Name:    "socialNetworkAuth",
			Value:   "false",
			Expires: time.Now(),
			Path:    "/",
		}
		http.SetCookie(w, &authCookie)
		callback["login"] = "fail"
	} else {
		callback["login"] = "success"
		// get profile info
		userProfile := validators.ValidateUserProfile(cookie.Value)
		fmt.Println("profileHandler:", userProfile)
		profileJson, err := json.Marshal(userProfile)
		helpers.CheckErr("profileJson", err)
		callback["profile"] = string(profileJson)
	}
	writeData, err := json.Marshal(callback)
	helpers.CheckErr("HandleProfile", err)
	w.Write(writeData)
}
