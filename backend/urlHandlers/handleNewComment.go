package urlHandlers

import (
	"backend/helpers"
	"backend/structs"
	"backend/validators"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/google/uuid"
)

func HandleNewComment(w http.ResponseWriter, r *http.Request) {
	fmt.Println("NewComment attempt!")

	err := r.ParseMultipartForm(10 << 20)
	if err != nil {
		http.Error(w, "Comment picture file too big", http.StatusInternalServerError)
		return
	}

	content := r.FormValue("content")

	imageName := ""
	fileExtension := ""

	if len(r.MultipartForm.File) > 0 {
		file, fileHeader, err := r.FormFile("picture")
		if err != nil {
			fmt.Println("Comment picture upload error", err)
		}
		defer file.Close()

		fileExtension = filepath.Ext(fileHeader.Filename)
		if fileExtension != ".jpeg" && fileExtension != ".jpg" && fileExtension != ".gif" {
			http.Error(w, "Comment picture can only be jpg or gif", http.StatusInternalServerError)
			return
		}

		imageName = uuid.New().String()
		dst, err := os.Create(fmt.Sprintf("./database/images/%s%s", imageName, filepath.Ext(fileHeader.Filename)))
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		defer dst.Close()
		_, err = io.Copy(dst, file)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}

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
		validators.ValidateSetNewComment(UserID, content, imageName+fileExtension, structs.PostID)
		callback["newComment"] = "accepted"
		callback["sendNewComment"] = validators.ValidateNewComments()
	}
	writeData, err := json.Marshal(callback)
	helpers.CheckErr("HandleNewComment", err)
	w.Write(writeData)
}
