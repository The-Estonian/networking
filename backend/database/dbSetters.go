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

func SetNewComment(user, commenContent, image, postID string) {
	db := sqlite.DbConnection()
	command := "INSERT INTO comments (user_fk_users, comment_content, comment_image, post_Id_fk_posts, date) VALUES(?, ?, ?, ?, datetime('now', '+2 hours'))"
	_, err := db.Exec(command, user, commenContent, image, postID)
	helpers.CheckErr("SetNewComment", err)
	defer db.Close()
}
func SetNewMessage(messageSender, message, messageReceiver string) {
	db := sqlite.DbConnection()
	command := "INSERT INTO messages (message_sender_fk_users, message, message_receiver_fk_users, date) VALUES(?, ?, ?, datetime('now', '+2 hours'))"
	_, err := db.Exec(command, messageSender, message, messageReceiver)
	helpers.CheckErr("SetNewMessage", err)
	defer db.Close()
}

// SetUserPrivacy sets user privacy settings, it currently uses posts_privacy_table values
// since the privacy settings values are the same for both users and posts
// dunno, might be a bad idea
func SetUserPrivacy(userId, privacyNmbr string) {
	db := sqlite.DbConnection()
	command := "INSERT OR REPLACE INTO user_privacy(user_fk_users, privacy_fk_users_privacy) VALUES(?, ?)"
	_, err := db.Exec(command, userId, privacyNmbr)
	helpers.CheckErr("SetUserPrivacy", err)
	defer db.Close()
}

func SetNewGroup(user, title, description string) {
	db := sqlite.DbConnection()

	command := "INSERT INTO guilds (creator_fk_users, guild_title, guild_description, date) VALUES(?, ?, ?, datetime('now', '+2 hours'))"
	_, err := db.Exec(command, user, title, description)
	helpers.CheckErr("SetNewGroup", err)

	var guildID int
	err = db.QueryRow("SELECT last_insert_rowid()").Scan(&guildID)
	helpers.CheckErr("SetNewGroup error getting inserted guildID", err)

	command = "INSERT INTO guildmembers (guild_id_fk_guilds, members_fk_users) VALUES (?, ?)"
	_, err = db.Exec(command, guildID, user)
	helpers.CheckErr("SetNewGroup error inserting guild creator into guildmembers table", err)

	defer db.Close()
}

func SetNewGroupNotification(messageSender, groupId, messageReceiver string) {
	db := sqlite.DbConnection()
	command := "INSERT INTO guildnotifications (sender_fk_users, reciever_fk_users, guildid_fk_guilds, date) VALUES(?, ?, ?, datetime('now', '+2 hours'))"
	_, err := db.Exec(command, messageSender, messageReceiver, groupId)
	helpers.CheckErr("SetNewGroupNotification", err)
	defer db.Close()
}

func SetNewGroupMember(groupId, userId, userResponse string) {
	if userResponse == "accept" {
		db := sqlite.DbConnection()
		command := "INSERT INTO guildmembers (guild_id_fk_guilds, members_fk_users) VALUES (?, ?)"
		_, err := db.Exec(command, groupId, userId)
		helpers.CheckErr("SetNewGroupMember", err)
		defer db.Close()
	}

	db := sqlite.DbConnection()
	command := "DELETE FROM guildnotifications WHERE guildid_fk_guilds=? AND reciever_fk_users=?"
	_, err := db.Exec(command, groupId, userId)
	helpers.CheckErr("SetNewGroupMember remove notification", err)
	defer db.Close()
}
