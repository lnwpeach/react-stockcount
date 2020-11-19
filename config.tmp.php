<?php

$db_server      = 'localhost';
$db_type        = 'mysql';
$db_database    = 'stockcount';
$db_user        = 'root';
$db_pass        = '';

$pdo = new PDO("{$db_type}:host={$db_server};dbname={$db_database};charset=utf8", $db_user, $db_pass);
?>