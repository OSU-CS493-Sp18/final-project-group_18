SET Foreign_Key_checks=0;

DROP TABLE IF EXISTS players;

CREATE TABLE players(
  id int NOT NULL AUTO_INCREMENT,
  name varchar(255),
  username varchar(32) NOT NULL,
  password varchar(32) NOT NULL,
  email varchar(255) NOT NULL,
  PRIMARY KEY(ID),
  UNIQUE(username),
  UNIQUE(email)
)ENGINE = InnoDB;

SET Foreign_Key_checks=1;
