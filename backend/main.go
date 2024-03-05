package main

import (
	"backend/database/sqlite"
	"backend/urlHandlers"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	_ "github.com/mattn/go-sqlite3"
)

func main() {
	sqlite.Create()
	r := mux.NewRouter()
	urlHandlers.StartHandlers(r)
	http.Handle("/", r)
	fmt.Println("Backend server started on port 8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
