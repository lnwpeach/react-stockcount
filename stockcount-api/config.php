<?php

$host       = 'localhost';
$db_type    = 'mysql';
$db         = 'stockcount';
$username   = 'root';
$password   = '';

$pdo = new PDO("{$db_type}:host={$host};dbname={$db};charset=utf8", $username, $password);
?>