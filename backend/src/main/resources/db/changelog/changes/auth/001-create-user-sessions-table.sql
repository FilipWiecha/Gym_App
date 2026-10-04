--liquibase formatted sql

--changeset fwiecha:001-create-user-sessions
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY,
    refresh_token VARCHAR(512) NOT NULL UNIQUE,
    user_agent VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    last_active_at TIMESTAMP WITH TIME ZONE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_revoked BOOLEAN NOT NULL DEFAULT FALSE,
    user_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY(user_id) REFERENCES users(id)
);

--rollback DROP TABLE user_sessions;