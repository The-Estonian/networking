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
		err := r.ParseMultipartForm(10 << 20) // 10 MB
		if err != nil {
			http.Error(w, "HandlePrivacy; Error parsing form ", http.StatusInternalServerError)
			return
		}

		// Get the userId from the FormData
		requestedId := r.FormValue("userId")
		fmt.Println("privacy requestedId: ", requestedId)

		// get session owner userId from session
		sessionId := validators.ValidateUserSession(cookie.Value)
		fmt.Println("privacy sessionId: ", sessionId)

		// check if user wants to see own profile
		if requestedId == sessionId {
			// get logged in user privacy
			callback["GetPrivacy"] = validators.ValidateUserPrivacyHash(cookie.Value)
			fmt.Println("GetPrivacy if user wants to see own profile: ", callback["GetPrivacy"])
			callback["ButtonVisible"] = "1"
		} else { // requested profile is not the same as session profile
			// get requestedEmail profile privacy, to see if it is public or private
			privacyValue := validators.ValidateUserPrivacyId(requestedId)
			callback["ButtonVisible"] = "2"
			if privacyValue == "1" { //profile is public
				callback["GetPrivacy"] = "1"
			} else { // privacy value is "2", private profile
				callback["GetPrivacy"] = "2"
			}
			fmt.Println("GetPrivacy if user wants to see other profile: ", callback["GetPrivacy"])
		}
	}
	fmt.Println("callback: ", callback)
	writeData, err := json.Marshal(callback)
	helpers.CheckErr("HandlePrivacy", err)
	w.Write(writeData)
}
