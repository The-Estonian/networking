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

func HandleNewPost(w http.ResponseWriter, r *http.Request) {
	fmt.Println("NewPost attempt!")

	err := json.NewDecoder(r.Body).Decode(&structs.NewPost)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	var callback = make(map[string]string)
	cookie, err := r.Cookie("socialNetworkSession")
	UserID := validators.ValidateUserSession(cookie.Value)
	// if not err and cookie valid

	if err != nil || UserID == "0" {
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
		// get posts info
		callback["newPost"] = "accepted"

		validators.ValidateSetNewPost(UserID, structs.NewPost.Title, structs.NewPost.Content, structs.NewPost.Privacy)

	}
	writeData, err := json.Marshal(callback)
	helpers.CheckErr("HandlePosts", err)
	w.Write(writeData)
}
