SET Foreign_Key_checks=0;

CREATE DATABASE IF NOT EXISTS gamedb;

CREATE TABLE player (
  id int NOT NULL AUTO_INCREMENT,
  name varchar(255),
  username varchar(32) NOT NULL,
  password varchar(32) NOT NULL,
  email varchar(255) NOT NULL,
  PRIMARY KEY(ID),
  UNIQUE(username),
  UNIQUE(email)
);

CREATE TABLE spell (
	id MEDIUMINT NOT NULL AUTO_INCREMENT,
	ownerID MEDIUMINT,
	name VARCHAR(255) NOT NULL,
	cost MEDIUMINT NOT NULL,
	damage MEDIUMINT,
	school VARCHAR(255),
	PRIMARY KEY (id),
	FOREIGN KEY (ownerID) REFERENCES player (id)
);

INSERT INTO player VALUES (NULL, "Bob", "bob", "encrypted", "email@email.com");
INSERT INTO spell VALUES (NULL, 1, "Fireball", 5, 10, "Fire");

SET Foreign_Key_checks=1;
