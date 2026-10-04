--changeset fwiecha:002-add-totp-to-users
ALTER TABLE users ADD COLUMN totp_secret VARCHAR(64);
ALTER TABLE users ADD COLUMN is_totp_enabled BOOLEAN NOT NULL DEFAULT FALSE;
--rollback ALTER TABLE users DROP COLUMN totp_secret;
--rollback ALTER TABLE users DROP COLUMN is_totp_enabled;