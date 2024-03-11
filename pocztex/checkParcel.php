<?php
// create & initialize a curl session

$data = ($_POST['data'])? $_POST['data'] : json_encode($_GET);

$jsonData = '{"number":"PX6427306785","language":"X1"}';

//$associativeArray = json_decode($json, true);

// echo urlencode( json_encode($jsonData));


$url = "https://uss.poczta-polska.pl/uss/v1.1/tracking/checkmail";
 
//initialize CURL
$ch = curl_init();

//setup json data and using json_encode() encode it into JSON string
// $data = array(
// 'number' => 'PX6427306785',
// 'language' => 'X1'
// );
//$new_data = json_encode($data);
$new_data = json_encode($data);

//options for curl
$array_options = array(
    
//set the url option
CURLOPT_URL=>$url,
    
//switches the request type from get to post
CURLOPT_POST=>true,
    
//attach the encoded string in the post field using CURLOPT_POSTFIELDS
CURLOPT_POSTFIELDS=>$data,
    
//setting curl option RETURNTRANSFER to true 
//so that it returns the response
//instead of outputting it 
CURLOPT_RETURNTRANSFER=>true,
    
//Using the CURLOPT_HTTPHEADER set the Content-Type to application/json
CURLOPT_HTTPHEADER=>array('Content-Type:application/json','api-key:BiGwVG2XHvXY+kPwJVPA8gnKchOFsyy39Thkyb1wAiWcKLQ1ICyLiCrxj1+vVGC+kQk3k0b74qkmt5/qVIzo7lTfXhfgJ72Iyzz05wH2XZI6AgXVDciX7G2jLCdoOEM6XegPsMJChiouWS2RZuf3eOXpK5RPl8Sy4pWj+b07MLg=.Mjg0Q0NFNzM0RTBERTIwOTNFOUYxNkYxMUY1NDZGMTA0NDMwQUIyRjg4REUxMjk5NDAyMkQ0N0VCNDgwNTc1NA==.b24415d1b30a456cb8ba187b34cb6a86')
);

// echo "setting multiple options using curl_setopt_array";
curl_setopt_array($ch,$array_options);

// echo "using curl_exec() is used to execute the POST request";
$output = curl_exec($ch);

// echo "VAR DUMP";
//var_dump($output);

curl_close($ch);
// echo "<pre>";
//echo $response = json_decode($output, true);
//echo json_decode($output,false);
echo $output;
//return $response = json_decode($_POST, true);
// echo "</pre>";
