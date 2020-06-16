CREATE TABLE `sub_round` (
  `sub_round_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `company_id` int(10) unsigned NOT NULL,
  `round_id` int(10) unsigned NOT NULL,
  `name` varchar(100) NOT NULL,
  `create_dt` date NOT NULL,
  PRIMARY KEY (`sub_round_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;