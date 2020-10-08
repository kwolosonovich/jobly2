DROP TABLE IF EXISTS companies
DROP TABLE IF EXISTS jobs
DROP TABLE IF EXISTS users


CREATE TABLE companies (
    handle TEXT PRIMARY KEY, 
    name TEXT NOT NULL UNIQUE, 
    num_employees INTEGER, 
    description TEXT, 
    logo_url TEXT
);

CREATE TABLE jobs (
    id SERIAL PRIMARY KEY, 
    title TEXT NOT NULL, 
    salary MONEY NOT NULL,
    equity FLOAT CHECK(equity <= 1.0),
    company_handle TEXT NOT NULL REFERENCES companies ON DELETE CASCADE,
    date_posted timestamp with time zone
);

CREATE TABLE users(
    username TEXT PRIMARY KEY,
    password TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    photo_url TEXT,
    is_admin BOOLEAN NOT NULL default FALSE,
    last_login_at timestamp with time zone
);