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
$id = !empty($data['id']) ? $data['id']*1 : '';

$pdo->query("delete from sub_round where company_id = '{$company_id}' and sub_round_id = '{$id}'");
$pdo->query("delete from product_count where company_id = '{$company_id}' and sub_round_id = '{$id}'");

$answer['success'] = 1;
$answer['message'] = 'Delete sub round';

exit(json_encode($answer));
?>