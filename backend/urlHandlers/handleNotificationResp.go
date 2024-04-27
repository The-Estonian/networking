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

func HandleNotificationResponse(w http.ResponseWriter, r *http.Request) {
	fmt.Println("NotificationResponse attempt!")

	var notificationResponse structs.Notifications

	err := json.NewDecoder(r.Body).Decode(&notificationResponse)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

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
		
		// Add user to group, depending if he accepted or declined
		if notificationResponse.NotificationData.NotificationType == "groupInvatation" {
			validators.ValidateSetNewGroupMember(notificationResponse.GroupID,
				 								 notificationResponse.CurrentUser,
				  								 notificationResponse.NotificationResponse)
		}
	}
	writeData, err := json.Marshal(callback)
	helpers.CheckErr("HandlePosts", err)
	w.Write(writeData)
}
