DROP TABLE IF EXISTS location_rating;
DROP TABLE IF EXISTS location_sections;
DROP TABLE IF EXISTS trips;
DROP TABLE IF EXISTS chat;
DROP TABLE IF EXISTS friendships;
DROP TABLE IF EXISTS locations;
DROP TABLE IF EXISTS codes;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      age INT,
      location VARCHAR(255),
      picture VARCHAR,
      description TEXT,
      experience INT,
      grade_comfort VARCHAR(255),
      grade_max VARCHAR(255),
      login_type VARCHAR(255) NOT NULL DEFAULT 'local',
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_online TIMESTAMP
);

CREATE TABLE locations (
      id SERIAL PRIMARY KEY,
      continent VARCHAR(255) NOT NULL,
      country VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL UNIQUE,
      picture text,
      infos text,
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
      from_min DATE,
      from_max DATE,
      until_min DATE,
      until_max DATE,
      comment TEXT,
      picture TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chat (
      id SERIAL PRIMARY KEY,
      sender INT REFERENCES users(id) NOT NULL,
      recipient INT NOT NULL,
      trip_origin INT,
      trip_target INT,
      location_id INT,
      location_topic text,
      read_by_recipient boolean default false,
      text TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE location_rating (
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(id) NOT NULL,
      location_id INT REFERENCES locations(id) NOT NULL,
      rate INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE location_sections (
      id SERIAL PRIMARY KEY,
      location_id INT REFERENCES locations(id) NOT NULL,
      creator_id INT REFERENCES users(id) NOT NULL,
      rate_up INT[],
      rate_down INT[],
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      last_updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

