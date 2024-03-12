package validators

import (
	"backend/database"
	"backend/helpers"
)

// check if username or email exists in users table
func ValidateUserRegistration(email, username string) (bool, bool) {
	email = helpers.StandardizeName(email)
	username = helpers.StandardizeName(username)
	emailExists := database.GetEmailIfExists(email)
	if len(username) > 0 {
		usernameExists := database.GetUsernameIfExists(username)
		return emailExists, usernameExists
	}
	return emailExists, false
}
