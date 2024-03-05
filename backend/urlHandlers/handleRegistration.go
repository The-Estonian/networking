package urlHandlers

import (
	"encoding/json"
	"fmt"
	"backend/structs"
	"net/http"
)

func handleRegistration(w http.ResponseWriter, r *http.Request) {
	var registration structs.Register
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&registration); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	// Assuming you have some user registration logic here
	// For simplicity, we'll just print the received user data
	fmt.Printf("Received registration request: %+v\n", registration)

	w.WriteHeader(http.StatusCreated)
}
