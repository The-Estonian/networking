CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    avatar TEXT,
    username TEXT,
    aboutuser TEXT
);