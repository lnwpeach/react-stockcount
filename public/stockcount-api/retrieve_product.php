<?php
include('config.php');
$answer = [ 'success' => 0, 'message' => '' ];
$data = file_get_contents('php://input');
if(empty($data)) {
    $answer['message'] = 'No data receieved';
    exit(json_encode($answer));
}
$data = json_decode($data, true);

// --------------------------

$company_id = !empty($data['company_id']) ? $data['company_id']*1 : 0;
$sub_round_id = !empty($data['sub_round_id']) ? $data['sub_round_id']*1 : 0;

$sql = "SELECT * 
        from product_count 
        where 
            company_id = '{$company_id}' and 
            sub_round_id = '{$sub_round_id}'";
$sth = $pdo->prepare($sql); $sth->execute();
$result = $sth->fetchAll(PDO::FETCH_ASSOC);

$answer['result'] = $result;
$answer['success'] = 1;
$answer['message'] = 'Retrieve product count';

exit(json_encode($answer));
?>