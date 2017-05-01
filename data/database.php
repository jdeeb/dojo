<?php
error_reporting(E_ALL ^ E_DEPRECATED);
$db_host = "localhost";
$db_user = "dojo";
$db_pass = "dojo";
$db_name = "dojocontacts";

//Connect to MySQL
$conn = mysql_connect($db_host, $db_user, $db_pass);
//Select database
mysql_select_db($db_name, $conn);
?>