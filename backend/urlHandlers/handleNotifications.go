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

func HandleNotifications(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Notifications attempt!")

	var callback = make(map[string]interface{})
	var sendNotifications []structs.AllNotifications

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
		sendNotifications = validators.ValidateNotifications(UserID)
		callback["sendNotifications"] = sendNotifications
	}
	writeData, err := json.Marshal(callback)
	helpers.CheckErr("HandleNotificatons", err)
	w.Write(writeData)
}
