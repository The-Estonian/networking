package database

import (
	"backend/database/sqlite"
	"backend/helpers"
	"time"
)

func SetToUsers(email, password, firstName, lastName string, date_of_birth time.Time, avatar, username, aboutuser string) {
	db := sqlite.DbConnection()
	command := "INSERT INTO users(email, password, first_name, last_name, date_of_birth, username, about_user, avatar) VALUES(?, ?, ?, ?, ?, ?, ?, ?)"
	_, err := db.Exec(command, email, password, firstName, lastName, date_of_birth, username, aboutuser, avatar)
	helpers.CheckErr("SetToUsers", err)
	defer db.Close()
}

func SetToSessions(userId, hash string) {
	db := sqlite.DbConnection()
	command := "INSERT OR REPLACE INTO session(user_fk_users, hash, date) VALUES(?, ?,datetime('now', '+2 hours'))"
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

func SetNewPost(user, title, postContent, image, privacy string) {
	db := sqlite.DbConnection()
	command := "INSERT INTO posts (user_fk_users, post_title, post_content, post_image, privacy_fk_posts_privacy, date) VALUES(?, ?, ?, ?, ?, datetime('now', '+2 hours'))"
	_, err := db.Exec(command, user, title, postContent, image, privacy)
	helpers.CheckErr("SetNewPost", err)
	defer db.Close()
}

func SetNewMessage(messageSender, message, messageReceiver string) {
	db := sqlite.DbConnection()
	command := "INSERT INTO messages (message_sender_fk_users, message, message_receiver_fk_users, date) VALUES(?, ?, ?, datetime('now', '+2 hours'))"
	_, err := db.Exec(command, messageSender, message, messageReceiver)
	helpers.CheckErr("SetNewMessage", err)
	defer db.Close()
}
