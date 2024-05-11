package structs

type ChatMessage struct {
	ChatMessageId   string
	MessageSender   string
	Message         string
	MessageReceiver string
	Date            string
}

type GroupMessage struct {
	GroupChatMessageId     string
	GroupChatMessageSender string
	GroupChatMessage       string
	GroupChatId            string
	Date                   string
}
