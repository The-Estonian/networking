package urlHandlers

import (
	"backend/helpers"
	"backend/validators"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

func HandlePrivacy(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Privacy attempt!")

	var callback = make(map[string]interface{})
	cookie, err := r.Cookie("socialNetworkSession")
	if err != nil || validators.ValidateUserSession(cookie.Value) == "0" {

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
		// parse form
		err := r.ParseMultipartForm(10 << 20)
		if err != nil {
			http.Error(w, "HandlePrivacy; Error parsing form ", http.StatusInternalServerError)
			return
		}
		// Get the userId from the FormData
		requestedId := r.FormValue("userId")
		// get session owner userId from session
		sessionId := validators.ValidateUserSession(cookie.Value)

		// check if user wants to see own profile
		if requestedId == sessionId || requestedId == "" {
			// get logged in user privacy
			callback["GetPrivacy"] = validators.ValidateUserPrivacyHash(cookie.Value)
			callback["ButtonVisible"] = "1"
		} else { // requested profile is not the same as session profile
			// get requestedEmail profile privacy, to see if it is public or private
			privacyValue := validators.ValidateUserPrivacyId(requestedId)
			callback["ButtonVisible"] = "2"
			if privacyValue == "1" {
				callback["GetPrivacy"] = "1"
			} else {
				callback["GetPrivacy"] = "2"
			}
		}
	}
	writeData, err := json.Marshal(callback)
	helpers.CheckErr("HandlePrivacy", err)
	w.Write(writeData)
}
