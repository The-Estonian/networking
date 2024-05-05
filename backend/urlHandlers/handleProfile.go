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

		// parse form
		err := r.ParseMultipartForm(10 << 20) // 10 MB
		if err != nil {
			http.Error(w, "HandleProfile; Error parsing form ", http.StatusInternalServerError)
			return
		}

		// Get the userId from the FormData
		requestedId := r.FormValue("userId")

		// get session owner userId from session
		sessionId := validators.ValidateUserSession(cookie.Value)

		// +++ TEST +++
		// requestedId = "1"

		// get profile info
		userProfile, err := validators.ValidateUserProfileInfo(sessionId, requestedId)
		if err != nil {
			// If GetUserProfileInfo returns an error, add the error message to the callback map and return
			callback["profile"] = err.Error()
			return
		}
		callback["profile"] = userProfile
		fmt.Println("profile: ", userProfile)

		// // check if user wants to see own profile
		// if requestedId == sessionId || requestedId == "" {
		// 	// get logged in user profile info
		// 	userProfile := validators.ValidateUserProfile(requestedId)
		// 	callback["profile"] = userProfile

		// 	// get logged in user profile posts
		// 	profilePosts := validators.ValidateProfilePosts(requestedId)
		// 	callback["posts"] = profilePosts
		// } else { // requested profile is not the same as session profile
		// 	// get requestedEmail profile privacy, to see if it is public or private
		// 	privacyValue := validators.ValidateUserPrivacyId(requestedId)
		// 	if privacyValue == "1" {
		// 		// get profile info
		// 		userProfile := validators.ValidateUserProfile(requestedId)
		// 		callback["profile"] = userProfile
		// 		fmt.Println("profile: ", userProfile)

		// 		// get profile posts
		// 		profilePosts := validators.ValidateProfilePosts(requestedId)
		// 		callback["posts"] = profilePosts
		// 	} else { // privacy value is "2"
		// 		// add user profile details that are visible from private profile

		// 		callback["profile"] = []string{}
		// 		callback["posts"] = []string{}
		// 	}
		// }
	}
	writeData, err := json.Marshal(callback)
	helpers.CheckErr("HandleProfile", err)
	w.Write(writeData)
}
