CREATE TABLE guildnotifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    guildid_fk_guilds INTEGER REFERENCES guilds(id) ON DELETE CASCADE,
    sender_fk_users INTEGER REFERENCES users(id) ON DELETE CASCADE,
    reciever_fk_users INTEGER REFERENCES users(id) ON DELETE CASCADE,
    notf_type TEXT,
    date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);