package urlHandlers

import (
	"backend/helpers"
	"backend/validators"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

func HandleGroupContent(w http.ResponseWriter, r *http.Request) {
	fmt.Println("GroupContent attempt!")

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
		callback["isGroupMember"] = false

		GroupId := r.FormValue("GroupId")

		groupMemebers := validators.ValidateGetGroupMembers(GroupId)

		// Send additional groupcontent if current user is groupmember
		for _, member := range groupMemebers {
			if member.Id == userId {
				callback["isGroupMember"] = true
				callback["groupMembers"] = groupMemebers
				callback["events"] = validators.ValidateGroupEvents(GroupId)
				break
			}
		}

		callback["posts"] = validators.ValidateGroupPosts(GroupId)
	}
	writeData, err := json.Marshal(callback)
	helpers.CheckErr("HandlePosts", err)
	w.Write(writeData)
}
