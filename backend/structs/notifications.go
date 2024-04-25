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
