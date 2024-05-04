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

	var callback = make(map[string]interface{})
	cookie, err := r.Cookie("socialNetworkSession")

	// if not err and cookie valid
	UserID := validators.ValidateUserSession(cookie.Value)
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

		var notificationResponse structs.GrInvNotifications

		err := json.NewDecoder(r.Body).Decode(&notificationResponse)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		// Add user to group or event, depending if he accepted or declined
		if notificationResponse.NotificationType == "groupInvatation" {
			validators.ValidateSetNewGroupMember(notificationResponse.GroupId,
												 UserID,
												 notificationResponse.NotificationResponse)
		}

		if notificationResponse.NotificationType == "event" {
			validators.ValidateSetNewEventParticipant(notificationResponse.GroupId,
													  notificationResponse.EventId,
													  notificationResponse.NotificationId,
													  UserID,
													  notificationResponse.NotificationResponse)	
		}
	}
	writeData, err := json.Marshal(callback)
	helpers.CheckErr("Handlenofiticationresp", err)
	w.Write(writeData)
}