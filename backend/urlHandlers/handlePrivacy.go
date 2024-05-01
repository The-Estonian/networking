package urlHandlers

import (
	"backend/helpers"
	"backend/validators"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"
)

func HandlePrivacy(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Privacy attempt!")

	var callback = make(map[string]interface{})
	cookie, err := r.Cookie("socialNetworkSession")
	fmt.Println("r value: ", r.URL.Path)
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
		// extract userEmail from URL
		requestedEmail := strings.TrimPrefix(r.URL.Path, "/getprivacy/")
		fmt.Println("requestedEmail: ", requestedEmail)
		// get email from session
		sessionEmail := validators.ValidateEmailFromSession(cookie.Value)
		fmt.Println("sessionEmail: ", sessionEmail)

		// check if user wants to see own profile
		if requestedEmail == sessionEmail {
			// get logged in user privacy
			callback["GetPrivacy"] = validators.ValidateUserPrivacyHash(cookie.Value)
			fmt.Println("GetPrivacy if user wants to see own profile: ", callback["GetPrivacy"])
			callback["ButtonVisible"] = "1"
		} else { // requested profile is not the same as session profile
			// get requestedEmail profile privacy, to see if it is public or private
			privacyValue := validators.ValidateUserPrivacyEmail(requestedEmail)
			callback["ButtonVisible"] = "2"
			if privacyValue == "1" { //profile is public
				callback["GetPrivacy"] = "1"
			} else { // privacy value is "2", private profile
				callback["GetPrivacy"] = "2"
			}
			fmt.Println("GetPrivacy if user wants to see other profile: ", callback["GetPrivacy"])
		}
	}

	writeData, err := json.Marshal(callback)
	helpers.CheckErr("HandlePrivacy", err)
	w.Write(writeData)
}
