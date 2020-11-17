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
$product_id = !empty($data['product_id']) ? $data['product_id'] : '';
$qty = !empty($data['qty']) ? $data['qty']*1 : 0;

$sql = "SELECT * 
        from inventory_summary 
        where 
            company_id = '{$company_id}' and 
            (
                product_id = :product_id or
                sell_barcode = :product_id or
                buy_barcode = :product_id
            )";
$sth = $pdo->prepare($sql); $sth->execute(['product_id' => $product_id]);
$result = $sth->fetch(PDO::FETCH_ASSOC);

if(!$result) {
    $answer['message'] = "Product ID not found";
    exit(json_encode($answer));
} 

$sql = "INSERT into product_count 
        set 
            company_id = '{$company_id}', 
            sub_round_id = '{$sub_round_id}', 
            product_id = :product_id, 
            product_name = :product_name, 
            qty = '{$qty}'";
$sth = $pdo->prepare($sql); 
$sth->execute(['product_id' => $result['product_id'], 'product_name' => $result['product_name']]);

$answer['result'] = $result;
$answer['success'] = 1;
$answer['message'] = 'Search product';
exit(json_encode($answer));
?>