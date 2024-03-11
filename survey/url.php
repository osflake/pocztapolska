<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
//$content = array();

$val = "surveys/".$_GET['name'].".html";
$content = file_get_contents($val);

//return $content;
echo json_encode(array("content" => $content));

?>