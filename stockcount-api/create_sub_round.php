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
$id         = !empty($data['id']) ? $data['id']*1 : 0;
$name       = !empty($data['name']) ? $data['name'] : '';

$sql = "insert into sub_round set company_id = '{$company_id}', round_id = '{$id}', name = :name";
$sth = $pdo->prepare($sql); $sth->execute([':name' => $name]);

$answer['success'] = 1;
$answer['message'] = 'Create sub round';

exit(json_encode($answer));
?>