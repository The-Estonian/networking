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

func HandleProfile(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Profile attempt!")

	var callback = make(map[string]interface{})
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

		// extract userEmail from URL
		requestedEmail := strings.TrimPrefix(r.URL.Path, "/profile/")
		fmt.Println("requestedEmail: ", requestedEmail)
		// get email from session
		sessionEmail := validators.ValidateEmailFromSession(cookie.Value)
		fmt.Println("sessionEmail: ", sessionEmail)

		// compare emails
		if requestedEmail == sessionEmail {
			// get profile privacy
			profilePrivacy := validators.ValidateUserPrivacyHash(cookie.Value)
			callback["privacy"] = profilePrivacy

			// get profile info
			userProfile := validators.ValidateUserProfile(requestedEmail)
			callback["profile"] = userProfile

			// get profile posts
			profilePosts := validators.ValidateProfilePosts(requestedEmail)
			callback["posts"] = profilePosts
		} else {
			// get requestedEmail profile privacy, to see if it is public or private
			//..............................
		}
	}
	writeData, err := json.Marshal(callback)
	helpers.CheckErr("HandleProfile", err)
	w.Write(writeData)
}
