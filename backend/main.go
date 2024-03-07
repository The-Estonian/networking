package main

import (
	"backend/database/sqlite"
	"backend/midware"
	"backend/urlHandlers"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	_ "github.com/mattn/go-sqlite3"
)

func main() {
	sqlite.Create()
	newRouter := mux.NewRouter()
	newRouter.Use(midware.CorsMiddleware)
	urlHandlers.StartHandlers(newRouter)
	http.Handle("/", newRouter)
	fmt.Println("Backend server started on port 8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
