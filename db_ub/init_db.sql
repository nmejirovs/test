CREATE DATABASE IF NOT EXISTS `testdb` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
CREATE TABLE  IF NOT EXISTS `testdb`.`users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;
INSERT INTO `testdb`.`users`
(`id`,
`username`)
VALUES
(1, 'testuser'),
(2, 'testblogger');
CREATE USER  IF NOT EXISTS 'test'@'%' IDENTIFIED BY '3aCu4ewu';
GRANT ALL PRIVILEGES ON *.* TO 'test'@'%' IDENTIFIED BY '3aCu4ewu';