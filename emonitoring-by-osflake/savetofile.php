<?php
$myfile = fopen("ip.txt", "a") or die("Unable to open file!");
$txt = "{ 'ip': '".$_GET['ip']."', 'date' : '".date("Y.m.d H:i:s")."'}".PHP_EOL;
fwrite($myfile, $txt);
fclose($myfile);
echo $_GET['ip'];
?>