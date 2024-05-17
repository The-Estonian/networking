package urlHandlers

import (
	"backend/helpers"
	"backend/validators"
	"encoding/json"
	"fmt"
	"net/http"
)

func HandleGetGroupMessages(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Group Messages attempt!")

	if handleSession(w, r) {
		var callback = make(map[string]interface{})
		callback["login"] = "success"

		groupId := r.FormValue("groupId")
		callback["groupMessages"] = validators.ValidateGroupMessages(groupId)
		writeData, err := json.Marshal(callback)
		helpers.CheckErr("HandlePosts", err)
		w.Write(writeData)
	}
}
