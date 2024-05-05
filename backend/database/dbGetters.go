package database

import (
	"backend/database/sqlite"
	"backend/helpers"
	"backend/structs"
	"database/sql"
	"fmt"
	"strings"
)

// is email in table
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

// is username in table
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

// get userid and password by email
func GetUserIdPswByEmail(email string) (string, string) {
	db := sqlite.DbConnection()
	var userId string
	var userPsw string
	command := "SELECT id, password FROM users WHERE email=?"
	err := db.QueryRow(command, email).Scan(&userId, &userPsw)
	if err != nil {
		if err != sql.ErrNoRows {
			helpers.CheckErr("GetUserIdPswByEmail", err)
		}
		return "0", "Email error"
	}
	defer db.Close()
	return userId, userPsw
}

// get userid by email
func GetUserIdByEmail(email string) string {
	db := sqlite.DbConnection()
	var userId string
	command := "SELECT id FROM users WHERE email=?"
	err := db.QueryRow(command, email).Scan(&userId)
	if err != nil {
		if err != sql.ErrNoRows {
			helpers.CheckErr("GetUserIdByEmail", err)
		}
		return "0"
	}
	defer db.Close()
	return userId
}

// get userId session by hash from session table
func GetUserSession(cookie string) string {
	db := sqlite.DbConnection()
	command := "SELECT user_fk_users FROM session WHERE hash=?"
	err := db.QueryRow(command, cookie).Scan(&cookie)
	if err != nil {
		if err != sql.ErrNoRows {
			helpers.CheckErr("GetUserSession", err)
		}
		return "0"
	}
	defer db.Close()
	return cookie
}

func GetUserProfile(userId string) structs.Profile {
	db := sqlite.DbConnection()
	var userProfile structs.Profile
	command := "SELECT id, email, first_name, last_name, date_of_birth, username, about_user, avatar FROM users WHERE id=?"
	err := db.QueryRow(command, userId).Scan(&userProfile.Id,
		&userProfile.Email,
		&userProfile.FirstName,
		&userProfile.LastName,
		&userProfile.DateOfBirth,
		&userProfile.Username,
		&userProfile.AboutUser,
		&userProfile.Avatar)
	if err != nil {
		if err != sql.ErrNoRows {
			helpers.CheckErr("getUserProfile", err)
		}
		fmt.Println("User email not found in users table!")
	}
	defer db.Close()
	return userProfile
}

func GetProfilePosts(userId string) []structs.ProfilePosts {
	db := sqlite.DbConnection()
	var profilePosts []structs.ProfilePosts
	command := "SELECT id, user_fk_users, post_content, post_image, privacy_fk_posts_privacy, date FROM posts WHERE user_fk_users=?"
	rows, err := db.Query(command, userId)
	if err != nil {
		helpers.CheckErr("GetProfilePosts", err)
	}
	for rows.Next() {
		var profilePost structs.ProfilePosts
		err = rows.Scan(&profilePost.PostId,
			&profilePost.UserId,
			&profilePost.PostContent,
			&profilePost.Picture,
			&profilePost.PostPrivacy,
			&profilePost.Date)
		if err != nil {
			helpers.CheckErr("GetProfilePosts", err)
		}
		profilePosts = append(profilePosts, profilePost)
	}
	defer db.Close()
	return profilePosts
}

func GetAllPosts() []structs.Posts {
	db := sqlite.DbConnection()
	defer db.Close()

	var allPosts []structs.Posts

	command := "SELECT posts.id, users.username, users.avatar, posts.post_Title, posts.post_content, posts.post_image, posts.privacy_fk_posts_privacy, posts.date, users.email FROM posts INNER JOIN users ON posts.user_fk_users == users.id ORDER BY posts.date DESC"
	rows, err := db.Query(command)
	if err != nil {
		helpers.CheckErr("getAllPosts", err)
		return nil
	}
	defer rows.Close()

	for rows.Next() {
		var post structs.Posts
		err = rows.Scan(&post.PostID, &post.Username, &post.Avatar, &post.Title, &post.Content, &post.Picture, &post.Privacy, &post.Date, &post.Email)
		if err != nil {
			helpers.CheckErr("getAllPosts", err)
			continue
		}
		allPosts = append(allPosts, post)
	}

	if err = rows.Err(); err != nil {
		helpers.CheckErr("getAllPosts", err)
	}
	return allPosts
}

func GetNewPost() structs.Posts {
	db := sqlite.DbConnection()
	var lastPost structs.Posts

	command := "SELECT posts.id, users.username, users.avatar, posts.post_title, posts.post_content, posts.post_image, posts.privacy_fk_posts_privacy, posts.date FROM posts INNER JOIN users ON posts.user_fk_users == users.id ORDER BY posts.date DESC LIMIT 1"
	err := db.QueryRow(command).Scan(&lastPost.PostID, &lastPost.Username, &lastPost.Avatar, &lastPost.Title, &lastPost.Content, &lastPost.Picture, &lastPost.Privacy, &lastPost.Date)
	if err != nil {
		if err != sql.ErrNoRows {
			helpers.CheckErr("getNewpost", err)
		}
		fmt.Println("Error selecting last post")
	}
	defer db.Close()
	return lastPost
}

func GetAllUsers(userId string) []structs.Profile {
	db := sqlite.DbConnection()
	var allUsers []structs.Profile

	command := "SELECT id, username, email FROM users"
	rows, err := db.Query(command)
	if err != nil {
		helpers.CheckErr("getAllPosts", err)
		return nil
	}

	for rows.Next() {
		var user structs.Profile
		err = rows.Scan(&user.Id, &user.Username, &user.Email)
		if err != nil {
			helpers.CheckErr("getAllPosts", err)
			continue
		}
		if user.Id != userId {
			allUsers = append(allUsers, user)
		}
	}

	defer rows.Close()

	defer db.Close()
	return allUsers
}

func GetAllComments(postID string) []structs.Comments {
	db := sqlite.DbConnection()
	defer db.Close()

	var allComments []structs.Comments

	command := "SELECT users.username, users.avatar, comments.comment_content, comments.comment_image, comments.date FROM comments INNER JOIN users ON user_fk_users == users.id where post_Id_fk_posts = ? ORDER BY comments.date DESC"
	rows, err := db.Query(command, postID)
	if err != nil {
		helpers.CheckErr("getAllComments", err)
		return nil
	}
	defer rows.Close()

	for rows.Next() {
		var comment structs.Comments
		err = rows.Scan(&comment.Username, &comment.Avatar, &comment.Content, &comment.Picture, &comment.Date)
		if err != nil {
			helpers.CheckErr("getAllComments loop: ", err)
			continue
		}
		allComments = append(allComments, comment)
	}

	if err = rows.Err(); err != nil {
		helpers.CheckErr("getAllComments rows: ", err)
	}
	return allComments
}

func GetNewComment() structs.Comments {
	db := sqlite.DbConnection()
	var newComment structs.Comments

	command := "SELECT users.username, users.avatar, comments.comment_content, comments.comment_image, comments.date FROM comments INNER JOIN users ON user_fk_users == users.id ORDER BY comments.date DESC LIMIT 1"
	err := db.QueryRow(command).Scan(&newComment.Username, &newComment.Avatar, &newComment.Content, &newComment.Picture, &newComment.Date)
	if err != nil {
		if err != sql.ErrNoRows {
			helpers.CheckErr("getNewComment", err)
		}
		fmt.Println("Error selecting new comment")
	}
	defer db.Close()
	return newComment
}

// Get user privacy setting
func GetUserPrivacy(userId string) string {
	db := sqlite.DbConnection()
	var privacy string
	command := "SELECT privacy_fk_users_privacy FROM user_privacy WHERE user_fk_users=?"
	err := db.QueryRow(command, userId).Scan(&privacy)
	if err != nil {
		if err != sql.ErrNoRows {
			helpers.CheckErr("GetUserPrivacy", err)
		}
		return "0"
	}
	defer db.Close()
	return privacy
	// 1 = public, 2 = private, (3 = almost private)???
}

// get userid if email in table
func GetUserIdIfEmailExists(email string) string {
	db := sqlite.DbConnection()
	var userId string
	command := "SELECT id FROM users WHERE email=?"
	err := db.QueryRow(command, email).Scan(&userId)
	if err != nil {
		if err != sql.ErrNoRows {
			helpers.CheckErr("GetEmailIfExists", err)
		}
		return "no such email"
	}
	defer db.Close()
	return userId
}

func GetMessages(fromuser, touser string) []structs.ChatMessage {
	db := sqlite.DbConnection()
	var UserMessages []structs.ChatMessage
	command := "SELECT * FROM messages WHERE (message_sender_fk_users = ? AND message_receiver_fk_users = ?) OR (message_receiver_fk_users = ? AND message_sender_fk_users = ?) ORDER BY id"
	rows, err := db.Query(command, touser, fromuser, touser, fromuser)
	if err != sql.ErrNoRows {
		helpers.CheckErr("GetMessages", err)
	}
	defer db.Close()
	helpers.CheckErr("GetMessage", err)
	for rows.Next() {
		var message structs.ChatMessage
		rows.Scan(&message.ChatMessageId, &message.MessageSender, &message.Message, &message.MessageReceiver, &message.Date)
		UserMessages = append(UserMessages, message)
	}
	defer rows.Close()
	return UserMessages
}

func GetAllGroups() []structs.Groups {
	db := sqlite.DbConnection()
	defer db.Close()

	var allGroups []structs.Groups

	command := `SELECT guilds.id, users.username, guilds.guild_title, guilds.guild_description, guilds.date, group_concat(guildmembers.members_fk_users) as members
				FROM guilds 
				INNER JOIN users ON guilds.creator_fk_users == users.id 
				LEFT JOIN guildmembers ON guilds.id == guildmembers.guild_id_fk_guilds
				GROUP BY guilds.id
				ORDER BY guilds.date DESC`

	rows, err := db.Query(command)
	if err != nil {
		helpers.CheckErr("Selecting getAllGroups", err)
		return nil
	}
	defer rows.Close()

	for rows.Next() {
		var group structs.Groups
		var members string
		err = rows.Scan(&group.Id, &group.Creator, &group.Title, &group.Description, &group.Date, &members)
		if err != nil {
			helpers.CheckErr("Iterating GetAllGroups", err)
			continue
		}
		group.Members = strings.Split(members, ",")
		allGroups = append(allGroups, group)
	}

	if err = rows.Err(); err != nil {
		helpers.CheckErr("GetAllGroups rows", err)
	}
	return allGroups
}

func GetNewGroup() structs.NewGroup {
	db := sqlite.DbConnection()
	var newGroup structs.NewGroup

	command := "SELECT guilds.id, users.username, users.id, guilds.guild_title, guilds.guild_description, guilds.date FROM guilds INNER JOIN users ON guilds.creator_fk_users == users.id ORDER BY guilds.date DESC LIMIT 1"
	err := db.QueryRow(command).Scan(&newGroup.Id, &newGroup.Creator, &newGroup.Members, &newGroup.Title, &newGroup.Description, &newGroup.Date)
	if err != nil {
		if err != sql.ErrNoRows {
			helpers.CheckErr("getNewGroup", err)
		}
		fmt.Println("Error selecting new group")
	}
	defer db.Close()
	return newGroup
}

func GetNotifications(currentUser string) []structs.GrInvNotifications {
	db := sqlite.DbConnection()
	defer db.Close()

	var allNotif []structs.GrInvNotifications

	command := `SELECT sender_fk_users, reciever_fk_users, email, guild_title, guildnotifications.id, guilds.id FROM guildnotifications
				INNER JOIN guilds ON guildnotifications.guildid_fk_guilds = guilds.id
				INNER JOIN users ON guildnotifications.sender_fk_users = users.id
				WHERE reciever_fk_users = ?`

	rows, err := db.Query(command, currentUser)
	if err != nil {
		helpers.CheckErr("GetNotifications selecting error: ", err)
		return nil
	}
	defer rows.Close()

	for rows.Next() {
		var notif structs.GrInvNotifications

		err = rows.Scan(&notif.SenderId, &notif.RecieverId, &notif.SenderEmail, &notif.GroupTitle, &notif.NotificationId, &notif.GroupId)
		if err != nil {
			helpers.CheckErr("GetNotifications Next error: ", err)
			continue
		}
		allNotif = append(allNotif, notif)
	}

	if err = rows.Err(); err != nil {
		helpers.CheckErr("GetNotifications", err)
	}
	return allNotif
}

func GetEventNotifications(currentUser string) []structs.EventNotifications {
	db := sqlite.DbConnection()
	defer db.Close()

	var allNotif []structs.EventNotifications

	command := `SELECT event_notifications.id, sender_fk_users, reciever_fk_users, email, event_title, event_description, event_time, events.id, guild_id_fk_guilds, guild_title 
				FROM event_notifications
				INNER JOIN events ON event_notifications.event_id_fk_events = events.id
				INNER JOIN users ON event_notifications.sender_fk_users = users.id
				INNER JOIN guilds ON event_notifications.guild_id_fk_guilds = guilds.id
				WHERE reciever_fk_users = ?`

	rows, err := db.Query(command, currentUser)
	if err != nil {
		helpers.CheckErr("GetEventNotifications selecting error: ", err)
		return nil
	}
	defer rows.Close()

	for rows.Next() {
		var notif structs.EventNotifications

		err = rows.Scan(&notif.NotificationId, &notif.SenderId, &notif.RecieverId, &notif.SenderEmail, &notif.EventTitle, &notif.EventDescription, &notif.EventTime, &notif.EventId, &notif.GroupId, &notif.GroupTitle)
		if err != nil {
			helpers.CheckErr("GetEventNotifications Next error: ", err)
			continue
		}
		allNotif = append(allNotif, notif)
	}

	if err = rows.Err(); err != nil {
		helpers.CheckErr("GetEventNotifications", err)
	}
	return allNotif
}

func GetGroupMembers(groupId string) []string {
	db := sqlite.DbConnection()
	defer db.Close()

	var groupMembers []string
	command := "SELECT members_fk_users FROM guildmembers WHERE guild_id_fk_guilds = ?"
	rows, err := db.Query(command, groupId)
	if err != nil {
		helpers.CheckErr("GetGroupMembers selecting error: ", err)
		return nil
	}
	defer rows.Close()

	for rows.Next() {
		var member string
		err = rows.Scan(&member)
		if err != nil {
			helpers.CheckErr("GetGroupMembers Next error: ", err)
			continue
		}
		groupMembers = append(groupMembers, member)
	}

	if err = rows.Err(); err != nil {
		helpers.CheckErr("GetGroupMembers", err)
	}
	return groupMembers
}

func GetUserProfileInfo(currentUserId, targetUserId string) (structs.Profile, error) {
	fmt.Println("currentUserId: ", currentUserId)
	fmt.Println("targetUserId: ", targetUserId)
	db := sqlite.DbConnection()
	var userProfile structs.Profile

	command := `
    SELECT u.id, u.email, u.first_name, u.last_name, u.date_of_birth, u.username, u.about_user, u.avatar
    FROM users u
    INNER JOIN user_privacy up ON u.id = up.user_fk_users
    WHERE (up.privacy_fk_users_privacy = 1 AND u.id = ?)
        OR (u.id = ? AND u.id = ?)
`
	err := db.QueryRow(command, targetUserId, currentUserId, targetUserId).Scan(
		&userProfile.Id,
		&userProfile.Email,
		&userProfile.FirstName,
		&userProfile.LastName,
		&userProfile.DateOfBirth,
		&userProfile.Username,
		&userProfile.AboutUser,
		&userProfile.Avatar)
	if err != nil {
		if err == sql.ErrNoRows {
			// No user with the given ID was found, or their privacy settings do not allow the current user to view their profile
			return structs.Profile{Privacy: "-1"}, nil
		}
		helpers.CheckErr("GetUserProfileInfo: ", err)
		return structs.Profile{}, err
	}
	defer db.Close()
	return userProfile, nil
}
