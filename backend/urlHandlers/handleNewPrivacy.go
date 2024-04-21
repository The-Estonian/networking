package urlHandlers

import (
	"backend/helpers"
	"backend/validators"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

func HandleNewPrivacy(w http.ResponseWriter, r *http.Request) {
	fmt.Println("NewPrivacy attempt!")

	err := r.ParseMultipartForm(10 << 20) // 10 MB, why do I need multipart form?
	if err != nil {
		http.Error(w, "Error parsing form", http.StatusInternalServerError)
		return
	}

	privacy := r.FormValue("privacy")

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
		callback["newPrivacy"] = "accepted"

		validators.ValidateSetUserPrivacy(UserID, privacy)
		callback["SendnewPrivacy"] = validators.ValidateUserPrivacy(cookie.Value)
	}

	writeData, err := json.Marshal(callback)
	helpers.CheckErr("HandlePrivacy", err)
	w.Write(writeData)
}
