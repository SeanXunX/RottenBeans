-- Your SQL goes here
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(64) UNIQUE NOT NULL,
    password VARCHAR(128) NOT NULL, -- MD5
    real_name VARCHAR(64) NOT NULL,
    employee_id INTEGER NOT NULL,
    gender VARCHAR(8) NOT NULL, -- "male" or "female"
    age INTEGER NOT NULL,
    is_super BOOLEAN NOT NULL DEFAULT FALSE
);
