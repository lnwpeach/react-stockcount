CREATE TABLE `product_count` (
  `item_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `company_id` int(10) unsigned NOT NULL,
  `sub_round_id` int(10) unsigned NOT NULL,
  `product_id` varchar(100) NOT NULL,
  `product_name` text NOT NULL,
  `qty` int(11) NOT NULL,
  PRIMARY KEY (`item_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;