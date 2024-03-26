<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
// print_r("MAMA");
$val = $_GET['plik'].".html";
// echo "<pre>";
// print_r($_GET);
// echo "</pre>";

$content = file_get_contents($val);

$cont = array(
    "[ID]" => "PX6006281818",
    
    "[T_P_DATA_ZDARZ]" => date("d.m.Y"),
    "[T_P_CZAS_ZDARZ]" => date("h:i"),

    "[T_PNI_NAZWA_DO]" => "Pocztex AUTOMAT",
    "[T_PNI_ADRES_DO]" => "ul. Powstańców 3, Kraków",
    "[T_PNI_GPS_DO]" => "49.9304963,19.9497555",
    
    "[T_PNI_NAZWA]" => "Pocztex AUTOMAT",
    "[T_PNI_ADRES]" => "ul. Powstańców 3, Kraków",
    "[T_PNI_URL]" => "ul.+Powstańców+3,+Kraków",
    "[T_PNI_GPS]" => "49.9304963,19.9497555",

    "[T_URZAD_ZDARZ]" => "UP Warszawa 33, ul. Rodziny Hiszoańskich 8, Warszawa",
    "[T_URZAD_URL]" => "Up+Warszawa+33,ul.+Rodziny+Hiszpańskich+8,Warszawa",
    "[T_URZAD_GPS]" => "49.9304963,19.9497555",

    "[T_NADAWCA]" => "Tani Ciuszek WSPÓLNICY",
    "[T_KWOTA_POBRAN]" => "(kwota pobrania: 120,20 zł)",
    "[POBRANIE_EMAIL]" => "(kwota pobrania: 120,20 zł)",
    "[T_KWOTA_W_AUTO]" => "<p>Kwotę pobranie opłacisz bezpośrednio w terminalu w automacie paczkowym.</p>",
    "[T_KWOTA_W_INF]" => "<p>Kwotę pobrania opłacisz przy odbiorze gotówką lub kartą</p>",
    "[T_KWOTA_KURIER]" => "<p>Kwotę pobranie opłacisz bezpośrednio u Kuriera za pośrednictwem terminalu lub gotówką.</p>",
    "[T_KWOTA_W_AWIZ]" => "<p>Kwotę pobrania opłacisz bezpośrednio w wybranym punkcie w kartą, BLIK lub gotówką.</p>",
   
    "[T_TEL_KUR]" => "<p>Telefon do kuriera: <strong><a style='color: #d50000;' href='tel:+48500600700'>500600700</a></strong></p>",
    "[T_P_DATA_DO]" =>"28.03.2024",
    "[T_P_GODZ_DO]" => "21:37",
    "[DATA_PRZE_7_K]" => "04.04.2024",
    "[KOD_ODBIORU]" => "662891",
    "[TPODZIEKOWANIE]" => '<img alt="eMonitoring Pocztex" src="./header/T_PODZIEKOWANIE.jpg" style="width: 100%;border:0;" />',
    "[TAWIZACJA]" => '<img alt="eMonitoring Pocztex" src="./header/T_AWIZACJA.jpg" style="width: 100%;border:0;" />',
    "[PXKURIER]" => '<img alt="eMonitoring Pocztex" src="./header/T_KURIER.jpg" style="width: 100%;border:0;" />',
    "[PXMULTINAD]" => '<img alt="eMonitoring Pocztex" src="./header/T_NADANIE.jpg" style="width: 100%;border:0;" />',
    "[PXAPMODB]" => '<img alt="eMonitoring Pocztex" src="./header/T_AUTOMAT.jpg" style="width: 100%;border:0;" />',
    "[PXAPK]" => '<img alt="eMonitoring Pocztex" src="./footer/aplikacja3.jpg" style="width: 100%; box-shadow: 2px 4px 5px #ccc" />',
    "[PXOPINIA]" => '<img alt="eMonitoring Pocztex" src="./footer/opinia.jpg" style="width: 100%;box-shadow: 2px 4px 5px #ccc" />',
    "[PXAUTOLOGO]" => '<img src="./ZPO/pocztex.png" style="height:40px; margin:2%; vertical-align: middle; "/>'
);
if($_GET['podmiana'] == "false"){
 foreach ($cont as $key => $val){
    $content = str_replace($key,$val,$content);
 }
}
//print_r ($content);
//return $content;
echo json_encode(array("tresc" => $content, "params" => $cont));
//echo json_encode($content);

?>