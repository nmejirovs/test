mysql -u root -p Aa123456! "CREATE DATABASE  IF NOT EXISTS `testdb` ;"
mysql -u root -p Aa123456! "CREATE TABLE  IF NOT EXISTS `testdb`.`users` (  `id` int(11) NOT NULL AUTO_INCREMENT,  `username` varchar(100) NOT NULL,  PRIMARY KEY (`id`),  UNIQUE KEY `username_UNIQUE` (`username`)) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;"
mysql -u root -p Aa123456! "CREATE USER 'test'@'%' IDENTIFIED BY '3aCu4ewu';"
mysql -u root -p Aa123456! "GRANT ALL PRIVILEGES ON *.* TO 'test'@'%' IDENTIFIED BY '3aCu4ewu';"