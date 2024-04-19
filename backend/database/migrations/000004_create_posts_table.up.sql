CREATE TABLE posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_fk_users INTEGER REFERENCES users(id) ON DELETE CASCADE,
    post_title TEXT NOT NULL,
    post_content TEXT NOT NULL,
    post_image TEXT,
    privacy_fk_posts_privacy INTEGER REFERENCES posts_privacy(id) ON DELETE CASCADE,
    date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);