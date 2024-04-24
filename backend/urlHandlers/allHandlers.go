package urlHandlers

import "net/http"

func StartHandlers(r *http.ServeMux) {
	r.HandleFunc("/login", HandleLogin)
	r.HandleFunc("/register", HandleRegistration)
	r.HandleFunc("/status", HandleStatus)
	r.HandleFunc("/logout", HandleLogout)
	r.HandleFunc("/profile", HandleProfile)
	r.HandleFunc("/newprivacy", HandleNewPrivacy)
	r.HandleFunc("/getprivacy", HandlePrivacy)
	r.HandleFunc("/posts", HandlePosts)
	r.HandleFunc("/newpost", HandleNewPost)
	r.HandleFunc("/comments", HandleComments)
	r.HandleFunc("/newcomment", HandleNewComment)
	r.HandleFunc("/groups", HandleGroups)
	r.HandleFunc("/newgroup", HandleNewGroup)
	r.HandleFunc("/websocket", HandleSocket)
	r.HandleFunc("/userlist", HandleUserList)
	r.HandleFunc("/messages", HandleChatMessages)
	r.Handle("/avatar/", http.StripPrefix("/avatar/", http.FileServer(http.Dir("./database/images"))))
}
