CREATE TABLE messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message_sender_fk_users INTEGER REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    message_receiver_fk_users INTEGER REFERENCES users(id) ON DELETE CASCADE,
    date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);