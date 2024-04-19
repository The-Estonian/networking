package structs

type Posts struct {
	PostID   string
	Username string
	Avatar   string
	Title    string
	Content  string
	Picture  string
	Privacy  string
	Date     string
}

var NewPost struct {
	Title   string `json:"title"`
	Content string `json:"content"`
	Picture string `json:"picture"`
	Privacy string `json:"privacy"`
}
