package urlHandlers

import "github.com/gorilla/mux"

func StartHandlers(r *mux.Router) {
	r.HandleFunc("/register", handleRegistration).Methods("POST")
}
