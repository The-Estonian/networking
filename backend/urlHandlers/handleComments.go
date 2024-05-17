package urlHandlers

import (
	"backend/helpers"
	"backend/structs"
	"backend/validators"
	"encoding/json"
	"fmt"
	"net/http"
)

func HandleComments(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Comments attempt!")

	if handleSession(w, r) {
		var callback = make(map[string]interface{})
		callback["login"] = "success"

		postId := r.FormValue("postID")
		var sendComments []structs.Comments
		sendComments = validators.ValidateComments(postId)
		callback["comments"] = sendComments
		writeData, err := json.Marshal(callback)
		helpers.CheckErr("HandleComments", err)
		w.Write(writeData)
	}
}
