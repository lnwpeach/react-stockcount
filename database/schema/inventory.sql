CREATE TABLE `inventory` (
  `inventory_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `company_id` int(11) unsigned DEFAULT NULL,
  `user_id` int(11) unsigned DEFAULT NULL,
  `date` date DEFAULT NULL,
  `product_id` varchar(255) DEFAULT NULL,
  `product_name` tinytext NOT NULL,
  `price` double NOT NULL COMMENT 'มูลค่าสินค้าทั้งหมด (ราคา x จำนวน)',
  `buy` decimal(18,6) NOT NULL DEFAULT 0.000000 COMMENT 'จำนวนซื้อ',
  `sell` decimal(18,6) NOT NULL DEFAULT 0.000000 COMMENT 'จำนวนขาย',
  `po` double NOT NULL,
  `create_dt` timestamp NOT NULL DEFAULT current_timestamp(),
  `engine_type` varchar(50) NOT NULL DEFAULT '' COMMENT 'เช่น invoice_id, transaction_id, bill_id',
  `engine_reference` int(11) DEFAULT NULL,
  `status` varchar(10) NOT NULL DEFAULT 'show',
  `note` tinytext NOT NULL,
  `warehouse` varchar(50) NOT NULL,
  `usage_status` varchar(20) NOT NULL DEFAULT '0' COMMENT 'จำนวนที่ใช้ = done คือ ใช้หมดละ',
  `department` varchar(50) NOT NULL,
  `cost` double unsigned NOT NULL COMMENT 'ค่าเฉลี่ยต้นทุนขายจาก avg_cost หรือ std_cost ต่อหน่วย',
  `so` double NOT NULL,
  `serial` varchar(255) NOT NULL COMMENT 'serial / lot',
  `reconcile` date NOT NULL DEFAULT '9999-12-31',
  `anchor` varchar(150) NOT NULL,
  `bom_status` int(1) NOT NULL COMMENT '0 = ธรรมดา / 1 มาจาก BOM',
  `bom_history_id` int(11) unsigned NOT NULL DEFAULT 0,
  `bom_type` varchar(6) NOT NULL DEFAULT '' COMMENT 'from/to/source',
  `warehouse_id` int(10) unsigned NOT NULL,
  `warehouse_status` int(1) unsigned NOT NULL COMMENT '0 = รอรับ | 1 = มีการรับแล้ว | 2 = เอารายการออกไป',
  `warehouse_receive` double unsigned NOT NULL,
  `warehouse_withdraw` double unsigned NOT NULL,
  `warehouse_accept` date NOT NULL,
  `adjust_id` int(10) unsigned NOT NULL,
  `adjusted_price` double unsigned NOT NULL COMMENT 'ต้นทุนหลังปรับปรุง คือ ราคาต่อหน่วย x จำนวน',
  `approve_status` varchar(4) NOT NULL COMMENT '_ = nothing, yes = approved, no = unapproved, wait = wait, lock = มีการ process แล้วห้ามแก้',
  `contact_id` int(11) unsigned NOT NULL,
  `expire` date NOT NULL,
  `fifo` decimal(18,6) NOT NULL,
  `import_id` int(10) unsigned NOT NULL,
  `lot` varchar(40) NOT NULL,
  `number_id` int(11) unsigned NOT NULL,
  `number_status` double NOT NULL DEFAULT 0,
  `perpetual_status` double NOT NULL DEFAULT 0,
  `project` varchar(50) NOT NULL,
  `salesman` varchar(50) NOT NULL,
  `size` varchar(10) NOT NULL,
  `vat` double NOT NULL COMMENT 'ภาษีมูลค่าเพิ่ม (VAT ต่อหน่วย x จำนวน)',
  PRIMARY KEY (`inventory_id`),
  KEY `company_id` (`company_id`),
  KEY `product_id` (`product_id`),
  KEY `engine_reference` (`engine_reference`),
  KEY `company_id_serial_product_id` (`company_id`,`serial`,`product_id`),
  KEY `company_id_serial` (`company_id`,`serial`),
  KEY `bom_history_id` (`bom_history_id`),
  KEY `company_id_warehouse_status` (`company_id`,`warehouse_status`),
  KEY `warehouse_id` (`warehouse_id`),
  KEY `adjust_id` (`adjust_id`),
  KEY `company_id_date` (`company_id`,`date`),
  KEY `company_id_product_id` (`company_id`,`product_id`),
  KEY `engine_type_engine_reference` (`engine_type`,`engine_reference`),
  KEY `import_id` (`import_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;