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

func HandlePosts(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Posts attempt!")

	var callback = make(map[string]interface{})

	cookie, err := r.Cookie("socialNetworkSession")
	userId := validators.ValidateUserSession(cookie.Value)
	// if not err and cookie valid
	if err != nil || userId == "0" {
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
		var sendPosts []structs.Posts

		sendPosts = validators.ValidatePosts(userId)
		callback["posts"] = sendPosts
	}
	writeData, err := json.Marshal(callback)
	helpers.CheckErr("HandlePosts", err)
	w.Write(writeData)
}
