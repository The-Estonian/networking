package urlHandlers

import (
	"backend/validators"
	"fmt"
	"net/http"
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		origin := r.Header.Get("Origin")
		switch origin {
		case "http://localhost:3000",
			"ws://localhost:3000",
			"http://www.devpipe.ee",
			"http://devpipe.ee",
			"ws://www.devpipe.ee",
			"wss://devpipe.ee",
			"https://www.devpipe.ee",
			"https://devpipe.ee":
			return true
		}
		return false
	},
}

// var clients = make(map[*Client]bool)
var clientConnections = make(map[string]*Client)
var broadcast = make(chan SocketMessage)

type SocketMessage struct {
	Type   string `json:"type"`
	Status string `json:"status"`
	// From             string   `json:"fromuser"`
	FromId           string   `json:"fromuserid"`
	Message          string   `json:"message"`
	To               string   `json:"touser"`
	ConnectedClients []string `json:"connectedclients"`
}

type Client struct {
	connection  *websocket.Conn
	send        chan []byte
	connOwnerId string
	mu          sync.Mutex
	lastActive  time.Time
}

// func periodicUserPresenceCheck() {
// 	for {
// 		time.Sleep(time.Minute)
// 		// Iterate through clients and update their online status based on lastActive
// 		currentTimestamp := time.Now()
// 		if len(clientConnections) > 0 {

// 		}
// 		for client := range clientConnections {
// 			clientConnections[client].mu.Lock()
// 			if currentTimestamp.Sub(clientConnections[client].lastActive) > 3*time.Minute {
// 				clientConnections[client].connection.Close()
// 				delete(clientConnections, client)
// 			} else {
// 				clientConnections[client].mu.Unlock()
// 			}
// 		}
// 	}
// }

func handleMessages() {
	for {
		msg := <-broadcast
		switch msg.Type {
		case "message":
			// set new message into db
			validators.ValidateSetNewMessage(msg.FromId, msg.Message, msg.To)
			// send to user directly
			for client := range clientConnections {
				if msg.To == clientConnections[client].connOwnerId {
					clientConnections[client].mu.Lock()
					err := clientConnections[client].connection.WriteJSON(msg)
					if err != nil {
						fmt.Println("Error writing message to client:", err)
						clientConnections[client].mu.Unlock()
						return
					}
					clientConnections[client].mu.Unlock()
				}
			}
		case "onlineStatus":
			users := []string{}
			for client := range clientConnections {
				users = append(users, clientConnections[client].connOwnerId)
			}
			var allUsers SocketMessage
			if msg.Message == "offline" {
				// if client, ok := clientConnections[userId]; ok && client != nil {
				// 	client.connection.Close()
				// 	delete(clientConnections, userId)
				// }
				allUsers = SocketMessage{
					Type:             "onlineStatus",
					Status:           "offline",
					ConnectedClients: users,
				}
			} else {
				allUsers = SocketMessage{
					Type:             "onlineStatus",
					Status:           "online",
					ConnectedClients: users,
				}
			}
			// broadcast everyone that you are online/offline
			for client := range clientConnections {
				clientConnections[client].mu.Lock()
				err := clientConnections[client].connection.WriteJSON(allUsers)
				if err != nil {
					fmt.Println("Error broadcasting online status to client:", err)
					clientConnections[client].mu.Unlock()
					return
				}
				clientConnections[client].mu.Unlock()
			}
		}
	}
}

func HandleSocket(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Websocket attempt!")

	cookie, err := r.Cookie("socialNetworkSession")
	userId := validators.ValidateUserSession(cookie.Value)
	if userId == "0" {
		fmt.Println("User not allowed closing connection!")
		return
	}

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println(err)
		return
	}
	defer conn.Close()

	client := &Client{
		connection:  conn,
		connOwnerId: userId,
		send:        make(chan []byte, 256),
	}

	// clients[client] = true
	client.mu.Lock()
	clientConnections[userId] = client
	client.mu.Unlock()

	defer func() {
		client.mu.Lock()
		delete(clientConnections, userId)
		client.mu.Unlock()
	}()

	go handleMessages()
	// go periodicUserPresenceCheck()

	for {
		var msg SocketMessage
		err := conn.ReadJSON(&msg)
		if err != nil {
			fmt.Println("Error in receiving message:", err)
			client.mu.Lock()
			delete(clientConnections, userId)
			client.mu.Unlock()
			return
		}
		client.mu.Lock()
		client.lastActive = time.Now()
		client.mu.Unlock()
		broadcast <- msg
	}
}
