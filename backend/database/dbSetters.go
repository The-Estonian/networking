package database

import (
	"backend/database/sqlite"
	"backend/helpers"
	"time"
)

func SetToUsers(email, password, firstName, lastName string, date_of_birth time.Time, avatar, username, aboutuser string) {
	db := sqlite.DbConnection()
	command := "INSERT INTO users(email, password, firstName, lastName, date_of_birth, avatar, username, aboutuser) VALUES(?, ?, ?, ?, ?, ?, ?,?)"
	_, err := db.Exec(command, email, password, firstName, lastName, date_of_birth, avatar, username, aboutuser)
	helpers.CheckErr("SetToUsers", err)
	defer db.Close()
}
