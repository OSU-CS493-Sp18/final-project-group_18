

CREATE DATABASE IF NOT EXISTS gamedb;

DROP TABLE IF EXISTS players;

CREATE TABLE players(
  id int NOT NULL AUTO_INCREMENT,
  name varchar(255),
  username varchar(32) NOT NULL,
  password varchar(255) NOT NULL,
  email varchar(255) NOT NULL,
  PRIMARY KEY(ID),
  UNIQUE(username),
  UNIQUE(email)
  )ENGINE = InnoDB;

CREATE TABLE spells (
	id MEDIUMINT NOT NULL AUTO_INCREMENT,
	ownerID MEDIUMINT,
	name VARCHAR(255) NOT NULL,
	cost MEDIUMINT NOT NULL,
	damage MEDIUMINT,
	school VARCHAR(255),
	PRIMARY KEY (id)
);

INSERT INTO player VALUES (NULL, "Bob", "bob", "encrypted", "email@email.com");
INSERT INTO spell VALUES (NULL, 1, "Fireball", 5, 10, "Fire");

SET Foreign_Key_checks=1;
