package structs

type Notifications struct {
	NotificationResponse string `json:"decision"`
	NotificationData     `json:"notificationResponse"`
}

type NotificationData struct {
	GroupID          string `json:"groupId"`
	GroupTitle       string `json:"message"`
	CurrentUser      string `json:"touser"`
	NotificationType string `json:"type"`
}

type AllNotifications struct {
	SenderId         string
	RecieverId       string `json:"touser"`
	SenderEmail      string
	Title            string `json:"message"`
	NotificationId   string
	GroupId          string
	NotificationType string `json:"type"`
}
