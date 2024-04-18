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
		// get profile info
		userProfile := validators.ValidateUserProfile(cookie.Value)
		profileJson, err := json.Marshal(userProfile)
		helpers.CheckErr("HandleProfile json", err)
		callback["profile"] = string(profileJson)

		// get profile posts
		profilePosts := validators.ValidateProfilePosts(cookie.Value)
		postsJson, err := json.Marshal(profilePosts)
		helpers.CheckErr("HandleProfilePosts json", err)
		callback["posts"] = string(postsJson)
	}
	writeData, err := json.Marshal(callback)
	helpers.CheckErr("HandleProfile", err)
	w.Write(writeData)
}
