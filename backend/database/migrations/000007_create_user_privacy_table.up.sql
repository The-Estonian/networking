CREATE TABLE user_privacy (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_fk_users INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    privacy_fk_users_privacy INTEGER REFERENCES posts_privacy(id) ON DELETE CASCADE
);

INSERT INTO user_privacy (user_fk_users, privacy_fk_users_privacy) VALUES ("1", "1");