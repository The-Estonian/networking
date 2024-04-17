package structs

type Posts struct {
	PostID   string
	Username string
	Avatar   string
	Title    string
	Content  string
	Privacy  string
	Date     string
}

var NewPost struct {
	Title   string
	Content string
	Privacy string
}
