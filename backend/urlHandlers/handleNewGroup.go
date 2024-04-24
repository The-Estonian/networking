package urlHandlers

import (
	"backend/helpers"
	"backend/validators"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

func HandleNewGroup(w http.ResponseWriter, r *http.Request) {
	fmt.Println("New group attempt!")

	title := r.FormValue("title")
	description := r.FormValue("description")

	fmt.Println("Tiitlel: ", title)
	fmt.Println("Descr: ", description)

	var callback = make(map[string]interface{})

	cookie, err := r.Cookie("socialNetworkSession")
	UserID := validators.ValidateUserSession(cookie.Value)

	if err != nil || UserID == "0" {
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
		validators.ValidateSetNewGroup(UserID, title, description)
		callback["newGroup"] = "accepted"
		callback["SendNewGroup"] = validators.ValidateNewGroup()
	}
	writeData, err := json.Marshal(callback)
	helpers.CheckErr("HandleNewGroup", err)
	w.Write(writeData)
}
