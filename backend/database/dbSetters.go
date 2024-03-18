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

func SetToSessions(userId, hash string) {
	db := sqlite.DbConnection()
	command := "INSERT OR REPLACE INTO session(user, hash, date) VALUES(?, ?,datetime('now', '+2 hours'))"
	_, err := db.Exec(command, userId, hash)
	helpers.CheckErr("SetToSessions", err)
	defer db.Close()
}

func SetRemoveHash(hash string) {
	db := sqlite.DbConnection()
	command := "DELETE FROM session WHERE hash=?"
	_, err := db.Exec(command, hash)
	helpers.CheckErr("SetRemoveHash", err)
	defer db.Close()
}
