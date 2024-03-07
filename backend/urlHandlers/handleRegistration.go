package urlHandlers

import (
	"backend/structs"
	"encoding/json"
	"fmt"
	"net/http"
)

func handleRegistration(w http.ResponseWriter, r *http.Request) {

	err := r.ParseMultipartForm(10 << 20) // 10 MB limit
    if err != nil {
        http.Error(w, "Unable to parse form data", http.StatusInternalServerError)
        return
    }

	file, _, err := r.FormFile("file")
    if err != nil {
        http.Error(w, "Unable to get file from form", http.StatusBadRequest)
        return
    }
	defer file.Close()

	var registration structs.Register
	decoder := json.NewDecoder(r.Body)
	fmt.Println(decoder)
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
