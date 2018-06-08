CREATE DATABASE IF NOT EXISTS gamedb;

CREATE TABLE characters (
	id MEDIUMINT NOT NULL AUTO_INCREMENT,
	playerID MEDIUMINT NOT NULL,
	name VARCHAR(255) NOT NULL,
	class VARCHAR(255) NOT NULL,
  strength MEDIUMINT NOT NULL,
  dexterity MEDIUMINT NOT NULL,
  constitution MEDIUMINT NOT NULL,
  intelligence MEDIUMINT NOT NULL,
  wisdom MEDIUMINT NOT NULL,
  charisma MEDIUMINT NOT NULL,
  age MEDIUMINT,
  gender VARCHAR(6),
  experience MEDIUMINT,
	headSlot MEDIUMINT,
	chestSlot MEDIUMINT,
	bootSlot MEDIUMINT,
	spellSlot1 MEDIUMINT,
	spellSlot2 MEDIUMINT,
	PRIMARY KEY (playerID)
);

DROP TABLE IF EXISTS `items`;

CREATE TABLE `items`(
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `price` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `rarity` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

/*INSERT INTO test VALUES (NULL, "Test Succeeded");
*/

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
