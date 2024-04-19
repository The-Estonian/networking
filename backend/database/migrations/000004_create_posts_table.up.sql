CREATE TABLE posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_fk_users INTEGER REFERENCES users(id) ON DELETE CASCADE,
    post_title TEXT NOT NULL,
    post_content TEXT NOT NULL,
    post_image TEXT,
    privacy_fk_posts_privacy INTEGER REFERENCES posts_privacy(id) ON DELETE CASCADE,
    date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO posts (user_fk_users, post_title, post_content, post_image, privacy_fk_posts_privacy) VALUES (1, "default post title", "default post content", "defaultPost.jpg", 1);