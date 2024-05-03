package structs

type GrInvNotifications struct {
	NotificationResponse  string `json:"decision"`
	GrInvNotificationData `json:"notificationResponse"`
}

type GrInvNotificationData struct {
	SenderId         string
	SenderEmail      string
	GroupId          string `json:"GroupId"`
	GroupTitle       string `json:"message"`
	RecieverId       string `json:"touser"`
	NotificationType string `json:"type"`
	NotificationId   string
}

type EventNotifications struct {
	SenderId         string `json:"fromuserid"`
	RecieverId       string
	SenderEmail      string `json:"SenderEmail"`
	EventTitle       string `json:"EventTitle"`
	EventDescription string
	EventTime        string `json:"EventTime"`
	EventId          string `json:"EventId"`
	GroupId          string `json:"GroupId"`
	GroupTitle       string `json:"GroupTitle"`
}
