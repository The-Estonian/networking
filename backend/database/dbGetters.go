package database

import (
	"backend/database/sqlite"
	"backend/helpers"
	"database/sql"
)

func GetEmailIfExists(email string) bool {
	db := sqlite.DbConnection()
	var userId string
	command := "SELECT id FROM users WHERE email=?"
	err := db.QueryRow(command, email).Scan(&userId)
	if err != nil {
		if err != sql.ErrNoRows {
			helpers.CheckErr("GetEmailIfExists", err)
		}
		return false
	}
	defer db.Close()
	return true
}

func GetUsernameIfExists(username string) bool {
	db := sqlite.DbConnection()
	var userId string
	command := "SELECT id FROM users WHERE username=?"
	err := db.QueryRow(command, username).Scan(&userId)
	if err != nil {
		if err != sql.ErrNoRows {
			helpers.CheckErr("GetUsernameIfExists", err)
		}
		return false
	}
	defer db.Close()
	return true
}

func GetUserIdPswByEmail(email string) (string, string) {
	db := sqlite.DbConnection()
	var userId string
	var userPsw string
	command := "SELECT id,password FROM users WHERE email=?"
	err := db.QueryRow(command, email).Scan(&userId, &userPsw)
	if err != nil {
		if err != sql.ErrNoRows {
			helpers.CheckErr("GetPswByEmail", err)
		}
		return "0", "Email error"
	}
	defer db.Close()
	return userId, userPsw
}

func GetUserSession(cookie string) bool {
	db := sqlite.DbConnection()
	command := "SELECT user FROM session WHERE hash=?"
	err := db.QueryRow(command, cookie).Scan(&cookie)
	if err != nil {
		if err != sql.ErrNoRows {
			helpers.CheckErr("GetUserSession", err)
		}
		return false
	}
	defer db.Close()
	return true
}
