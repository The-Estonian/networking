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
		unFollowId := r.FormValue("unFollowId")

		viewId := requestedId
		var ownProfile bool
		var followingUser bool

		// get session owner userId from session
		sessionId := validators.ValidateUserSession(cookie.Value)

		if requestedId == "" || requestedId == sessionId {
			ownProfile = true
			viewId = sessionId
		}

		if unFollowId != "" {
			validators.ValidateUnfollowUser(sessionId, unFollowId)
		}

		following := validators.ValidateFollowing(viewId)
		followers := validators.ValidateFollowers(viewId)

		for _, follower := range followers {
			if follower.SenderId == sessionId {
				followingUser = true
			}
		}

		// get profile info
		userProfile, err := validators.ValidateUserProfileInfo(sessionId, requestedId, followingUser)
		if err != nil {
			callback["profile"] = err.Error()
			return
		}
		callback["profile"] = userProfile

		userProfilePosts, err := validators.ValidateUserProfilePosts(sessionId, requestedId, followingUser)
		if err != nil {
			callback["posts"] = err.Error()
			return
		}
		callback["posts"] = userProfilePosts
		callback["followers"] = followers
		callback["following"] = following
		callback["ownProfile"] = ownProfile
		callback["alreadyFollowing"] = followingUser
	}
	writeData, err := json.Marshal(callback)
	helpers.CheckErr("HandleProfile", err)
	w.Write(writeData)
}
