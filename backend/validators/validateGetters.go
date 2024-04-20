package validators

import (
	"backend/database"
	"backend/helpers"
	"backend/structs"

	"github.com/google/uuid"
)

// check if username or email exists in users table
func ValidateUserRegistration(email, username string) (bool, bool) {
	email = helpers.StandardizeName(email)
	emailExists := database.GetEmailIfExists(email)
	if len(username) > 0 {
		username = helpers.StandardizeName(username)
		usernameExists := database.GetUsernameIfExists(username)
		return emailExists, usernameExists
	}
	return emailExists, false
}

// check if username and password match
func ValidateUserLogin(email, password string) (bool, string) {
	email = helpers.StandardizeName(email)
	userId, userPsw := database.GetUserIdPswByEmail(email)
	if userId != "0" {
		if helpers.CheckPassword(password, userPsw) {
			hash := uuid.New().String()
			// set user and UUID in DB
			database.SetToSessions(userId, hash)
			return true, hash
		} else {
			return false, "Password error"
		}
	} else {
		return false, "Email error"
	}
}

// check if user has valid session
func ValidateUserSession(cookie string) string {
	return database.GetUserSession(cookie)
}

// provide user profile from db
func ValidateUserProfile(hash string) structs.Profile {
	// get userid by hash
	userId := database.GetUserSession(hash)
	// get user profile by userid
	return database.GetUserProfile(userId)
}

func ValidatePosts() []structs.Posts {
	return database.GetAllPosts()
}

func ValidateNewPost() structs.Posts {
	return database.GetNewPost()
}
func ValidateUserList(hash string) []structs.Profile {
	userId := database.GetUserSession(hash)
	return database.GetAllUsers(userId)
}

// provide user profile posts from db
func ValidateProfilePosts(hash string) []structs.ProfilePosts {
	// get userid by hash
	userId := database.GetUserSession(hash)
	// get user profile posts by userid
	return database.GetProfilePosts(userId)
}

func ValidateProfilePrivacy(hash string) string {
	// get userid by hash
	userId := database.GetUserSession(hash)
	// get user profile privacy by userid
	return database.GetUserPrivacy(userId)
}
