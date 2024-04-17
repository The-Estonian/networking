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

--INSERT INTO users posts_privacy (privacy) VALUES ("public");