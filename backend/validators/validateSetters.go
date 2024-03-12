package validators

import (
	"backend/database"
	"backend/helpers"
	"time"
)

// Create new user in users table
func ValidateSetToUsers(email, password, firstName, lastName, date_of_birth, avatar, username, aboutuser string) {
	email = helpers.StandardizeName(email)

	password, err := helpers.GenerateHashPassword(password)
	if err != nil {
		helpers.CheckErr("ValidateSetToUsers, password", err)
	}

	firstName = helpers.StandardizeName(firstName)
	lastName = helpers.StandardizeName(lastName)

	parsedDate, err := time.Parse("2006-01-02", date_of_birth)
	if err != nil {
		helpers.CheckErr("ValidateSetToUsers, convert Date", err)
	}

	username = helpers.StandardizeName(username)
	// date_of_birth = helpers.StandardizeName(date_of_birth)
	database.SetToUsers(email, password, firstName, lastName, parsedDate, avatar, username, aboutuser)
}
