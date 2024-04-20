CREATE TABLE user_privacy (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_fk_users INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    privacy_fk_users_privacy INTEGER REFERENCES posts_privacy(id) ON DELETE CASCADE
);