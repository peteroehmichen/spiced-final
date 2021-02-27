DROP TABLE IF EXISTS trips;
DROP TABLE IF EXISTS chat;
DROP TABLE IF EXISTS friendships;
DROP TABLE IF EXISTS locations;
DROP TABLE IF EXISTS codes;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      first VARCHAR(255) NOT NULL,
      last VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      age INT,
      location VARCHAR(255),
      picture VARCHAR,
      description TEXT,
      experience INT,
      grade_comfort VARCHAR(255),
      grade_max VARCHAR(255),
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_online TIMESTAMP
);

CREATE TABLE locations (
      id SERIAL PRIMARY KEY,
      continent INT NOT NULL,
      country INT NOT NULL,
      name VARCHAR(255) NOT NULL UNIQUE,
      rate_1 INT,
      rate_2 INT,
      rate_3 INT,
      rate_4 INT,
      rate_5 INT,
      sport BOOLEAN,
      trad BOOLEAN,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_edit TIMESTAMP
);

CREATE TABLE codes (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) NOT NULL,
      code VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE friendships (
      id SERIAL PRIMARY KEY,
      sender INT REFERENCES users(id) NOT NULL,
      recipient INT REFERENCES users(id) NOT NULL,
      confirmed BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE trips (
      id SERIAL PRIMARY KEY,
      location_id INT REFERENCES locations(id) NOT NULL,
      person INT REFERENCES users(id) NOT NULL,
      from_min TIMESTAMP,
      from_max TIMESTAMP,
      until_min TIMESTAMP,
      until_max TIMESTAMP,
      comment TEXT NOT  NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chat (
      id SERIAL PRIMARY KEY,
      sender INT REFERENCES users(id) NOT NULL,
      recipient INT NOT NULL,
      text TEXT NOT  NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);