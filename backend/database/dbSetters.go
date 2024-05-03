package database

import (
	"backend/database/sqlite"
	"backend/helpers"
	"fmt"
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
	command := "INSERT INTO messages (message_sender_fk_users, message, message_receiver_fk_users, date) VALUES(?, ?, ?, datetime('now', '+3 hours'))"
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

func SetNewGroupNotification(messageSender, groupId, messageReceiver, notfType string) bool {
	db := sqlite.DbConnection()
	defer db.Close()

	var notificationCount int
	var memberCount int

	err := db.QueryRow("SELECT COUNT(*) FROM guildnotifications WHERE reciever_fk_users = ? AND guildid_fk_guilds = ?", messageReceiver, groupId).Scan(&notificationCount)
	if err != nil {
		helpers.CheckErr("SetNewGroupNotification - NotificationCount: ", err)
		return false
	}

	// Dont insert member or notification in table if they are already in table
	err = db.QueryRow("SELECT COUNT(*) FROM guildmembers WHERE members_fk_users = ? AND guild_id_fk_guilds = ?", messageReceiver, groupId).Scan(&memberCount)
	if err != nil {
		helpers.CheckErr("SetNewGroupNotification - MemberCount: ", err)
		return false
	}

	if memberCount > 0 || notificationCount > 0 {
		return false
	}

	command := "INSERT INTO guildnotifications (sender_fk_users, reciever_fk_users, guildid_fk_guilds, notf_type, date) VALUES(?, ?, ?, ?, datetime('now', '+2 hours'))"
	_, err = db.Exec(command, messageSender, messageReceiver, groupId, notfType)
	helpers.CheckErr("SetNewGroupNotification - Insert: ", err)

	command = "SELECT email FROM users WHERE id = ?"
	row := db.QueryRow(command, messageSender)
	var email string
	err = row.Scan(&email)
	helpers.CheckErr("GetEmail - Scan: ", err)
	fmt.Println("email: ", email)

	return true
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

func SetNewEvent(groupId, title, description, eventTime string) string {
	db := sqlite.DbConnection()
	defer db.Close()

	var id string
	command := "INSERT INTO events (guildid_fk_guilds, event_title, event_description, event_time) VALUES (?, ?, ?, ?) returning id"
	err := db.QueryRow(command, groupId, title, description, eventTime).Scan(&id)
	if err != nil {
		helpers.CheckErr("SetNewEvent", err)
	}
	return id
}

func SetNewEventNotification(fromId, groupId, eventID, eventReciever string) {
	db := sqlite.DbConnection()
	defer db.Close()

	command := "INSERT INTO event_notifications (sender_fk_users, guild_id_fk_guilds, event_id_fk_events, reciever_fk_users) VALUES(?, ?, ?, ?)"
	_, err := db.Exec(command, fromId, groupId, eventID, eventReciever)
	helpers.CheckErr("SetNewGroupNotification - Insert: ", err)
}
