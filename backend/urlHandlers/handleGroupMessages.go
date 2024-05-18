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
		var userId string
		var callback = make(map[string]interface{})
		callback["login"] = "success"

		groupId := r.FormValue("groupId")
		cookie, err := r.Cookie("socialNetworkSession")
		if err != nil {
			fmt.Println("error getting cookie, HandleGetGroupMessages: ", err)
		} else {
			sessionValue := cookie.Value
			userId = validators.ValidateUserSession(sessionValue)
		}
		callback["groupMessages"] = validators.ValidateGroupMessages(groupId, userId)
		writeData, err := json.Marshal(callback)
		helpers.CheckErr("HandlePosts", err)
		w.Write(writeData)
	}
}
