SET Foreign_Key_checks=0;

DROP TABLE IF EXISTS test;

CREATE TABLE test(
  ID int NOT NULL AUTO_INCREMENT,
  message text,
  PRIMARY KEY(ID)
)ENGINE = InnoDB;

INSERT INTO test VALUES (NULL, "Test Succeeded");

SET Foreign_Key_checks=1;
