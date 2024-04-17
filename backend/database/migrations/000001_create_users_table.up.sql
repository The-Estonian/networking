CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    username TEXT,
    about_user TEXT,
    avatar TEXT
);

INSERT INTO users (email, password, first_name, last_name, date_of_birth) VALUES ("Asd@asd.com", "$2a$14$f93Qadhf7vVe.LoebyXLvOwMcTTxlZMEcXZEnefj4KMVv6kSuYigC", "Asd", "Asd", "1990-03-01 00:00:00+00:00");