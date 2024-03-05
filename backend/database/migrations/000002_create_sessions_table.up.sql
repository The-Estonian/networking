CREATE TABLE session (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    hash TEXT NOT NULL,
    date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);