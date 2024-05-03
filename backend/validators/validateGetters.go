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
func ValidateUserLogin(email, password string) (bool, string, string) {
	email = helpers.StandardizeName(email)
	userId, userPsw := database.GetUserIdPswByEmail(email)
	if userId != "0" {
		if helpers.CheckPassword(password, userPsw) {
			hash := uuid.New().String()
			// set user and UUID in DB
			database.SetToSessions(userId, hash)
			return true, hash, userId
		} else {
			return false, "Password error", "0"
		}
	} else {
		return false, "Email error", "0"
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
func ValidateUserList(hash string) ([]structs.Profile, string) {
	userId := database.GetUserSession(hash)
	return database.GetAllUsers(userId), userId
}

// provide user profile posts from db
func ValidateProfilePosts(hash string) []structs.ProfilePosts {
	// get userid by hash
	userId := database.GetUserSession(hash)
	// get user profile posts by userid
	return database.GetProfilePosts(userId)
}

func ValidateComments(postID string) []structs.Comments {
	return database.GetAllComments(postID)
}

func ValidateNewComments() structs.Comments {
	return database.GetNewComment()
}
func ValidateUserMessages(hash, partnerId string) []structs.ChatMessage {
	// get userid by hash
	userId := database.GetUserSession(hash)
	// get user profile posts by userid
	return database.GetMessages(userId, partnerId)
}

func ValidateUserPrivacy(hash string) string {
	// get userid by hash
	userId := database.GetUserSession(hash)
	// get user profile privacy by userid
	return database.GetUserPrivacy(userId)
}

func ValidateGroups() []structs.Groups {
	return database.GetAllGroups()
}

func ValidateNewGroup() structs.NewGroup {
	return database.GetNewGroup()
}

func ValidateNotifications(UserId string) []structs.GrInvNotificationData {
	return database.GetNotifications(UserId)
}

func ValidateEventNotifications(UserId string) []structs.EventNotifications {
	return database.GetEventNotifications(UserId)
}

func ValidateGetGroupMembers(groupId string) []string {
	return database.GetGroupMembers(groupId)
}
