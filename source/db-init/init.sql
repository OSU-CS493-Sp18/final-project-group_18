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
	PRIMARY KEY (id)
);

INSERT INTO player VALUES (NULL, "Bob", "bob", "encrypted", "email@email.com");
INSERT INTO spell VALUES (NULL, 1, "Fireball", 5, 10, "Fire");

SET Foreign_Key_checks=1;
