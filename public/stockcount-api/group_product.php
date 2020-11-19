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

// group qty
$commandGroup = "SELECT *, SUM(qty) AS total FROM product_count WHERE company_id = '{$company_id}' AND sub_round_id = :id GROUP BY product_id";
$sth = $pdo->prepare($commandGroup); $sth->execute([':id' => $id]); $result = $sth->fetchAll(PDO::FETCH_ASSOC);

$productGroup = $result;


// delete
$commandDelete = "DELETE FROM product_count WHERE company_id = '{$company_id}' AND sub_round_id = :id";
$sth = $pdo->prepare($commandDelete); $sth->execute([':id' => $id]); 

$sql = "INSERT INTO  product_count (`company_id`, `sub_round_id`, `product_id`, `product_name`, `qty`) VALUES ";

$exe = [];
$i	 = 0;


foreach( $productGroup as $item ){
    $sql .= ($i==0)?"":",";
    $sql .= "('{$company_id}', '{$id}', :product_id{$i}, :product_name{$i}, :qty{$i})";
    $exe  = array_merge($exe,array(
                ":product_id{$i}" 	=> $item["product_id"],
                ":product_name{$i}" 	 	=> $item["product_name"],			
                ":qty{$i}" 	 	=> $item["total"]			
            ));
    $i++;
}

$sth = $pdo->prepare($sql);
$sth->execute($exe);




$answer['success'] = 1;
$answer['message'] = 'GROUP Qty';

exit(json_encode($answer));
?>