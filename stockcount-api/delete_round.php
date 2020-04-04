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

$sub_round = $pdo->query("select sub_round_id from sub_round where company_id = '{$company_id}' and round_id = '{$id}'")->fetchAll(PDO::FETCH_ASSOC);
$sub_round_ids = [];
foreach($sub_round as $item) {
    $sub_round_ids[] = $item['sub_round_id'];
}
$sub_round_ids = implode($sub_round_ids, ',');

$pdo->query("delete from round where company_id = '{$company_id}' and round_id = '{$id}'");
$pdo->query("delete from sub_round where company_id = '{$company_id}' and round_id = '{$id}'");
if($sub_round_ids)
    $pdo->query("delete from product_count where company_id = '{$company_id}' and sub_round_id in ({$sub_round_ids})");

$answer['success'] = 1;
$answer['message'] = 'Delete round';

exit(json_encode($answer));
?>