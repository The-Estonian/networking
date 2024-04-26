package structs

type Groups struct {
	Id          string
	Creator     string
	CreatorId   string
	Title       string
	Description string
	Date        string
	Members     []string
}

type NewGroup struct {
	Id          string
	Creator     string
	CreatorId   string
	Title       string
	Description string
	Date        string
	Members     string
}

var GroupID string
