package urlHandlers

import (
	"backend/database"
	"backend/validators"
	"fmt"
	"net/http"
)

func HandleNewPrivacy(w http.ResponseWriter, r *http.Request) {
	fmt.Println("NewPrivacy attempt!")

	cookie, err := r.Cookie("session")
	if err != nil {
		http.Error(w, "No session", http.StatusInternalServerError)
		return
	}

	hash := cookie.Value
	userId := validators.ValidateUserSession(hash)
	if userId == "0" {
		http.Error(w, "Invalid session", http.StatusInternalServerError)
		return
	}

	privacy := r.FormValue("privacy")
	if privacy != "public" && privacy != "private" {
		http.Error(w, "Invalid privacy value", http.StatusInternalServerError)
		return
	}

	database.SetUserPrivacy(userId, privacy)
}
