CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id         CHAR(36)    NOT NULL PRIMARY KEY,
    user_id    CHAR(36)    NOT NULL,
    token_hash CHAR(64)    NOT NULL,
    expires_at DATETIME    NOT NULL,
    used_at    DATETIME    NULL,
    created_at DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_prt_token_hash (token_hash),
    KEY idx_prt_user (user_id)
);
