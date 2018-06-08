DROP TABLE IF EXISTS `items`;

CREATE TABLE `items`(
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `playerID` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `rarity` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

/*INSERT INTO test VALUES (NULL, "Test Succeeded");
*/
