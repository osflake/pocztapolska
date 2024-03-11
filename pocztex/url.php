<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
//$content = array();
$content ="";
$cont = array(
    1 => "https://en-testwebapi2.poczta-polska.pl/nadaj/#/nadawanie/rodzaj-paczki"
);

foreach ($cont as $key => $val){
    //$content[$key] = file_get_contents($val);
    //$content .= "<h1>".$key."</h2>";
    $content .= file_get_contents($val);
}
//    $content = str_replace("td","div",$content);
//    $content = str_replace("tr","div",$content);
//    $content = str_replace("</tr>","",$content);

//print_r ($content);
//echo $content;
echo json_encode(array("tresc" => $content,"nr" => $_GET));
//echo json_encode($content);

?>