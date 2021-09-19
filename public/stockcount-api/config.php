<?php

$host       = 'localhost';
$db_type    = 'mysql';
$db         = 'stockcount';
$username   = 'root';
$password   = '12345878';

$pdo = new PDO("{$db_type}:host={$host};dbname={$db};charset=utf8", $username, $password);
?>