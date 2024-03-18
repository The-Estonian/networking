package urlHandlers

import "net/http"

func StartHandlers(r *http.ServeMux) {
	r.HandleFunc("/login", HandleLogin)
	r.HandleFunc("/register", HandleRegistration)
	r.HandleFunc("/status", HandleStatus)
	r.HandleFunc("/logout", HandleLogout)
}
