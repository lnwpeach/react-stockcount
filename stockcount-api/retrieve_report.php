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
$id = !empty($data['round_id']) ? $data['round_id']*1 : 0;

$temp = "report_".time();

if(true){

    $sql = "CREATE TEMPORARY TABLE `$temp` (
              `report_id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
              `company_id` int NOT NULL,
              `product_id` varchar(100) NOT NULL,
              `product_name` varchar(100) NOT NULL,
              `actual` decimal(20,2) NOT NULL,
              `system` decimal(20,2) NOT NULL,
              `round_id` int NOT NULL,
              `sub_round_id` int NOT NULL
            );";
    $pdo->query($sql);
}

    $sql = "insert into `$temp` (company_id, product_id, product_name, system, actual, sub_round_id, round_id)
            select company_id, product_id, product_name, ifnull((buy-sell),0) as system, 0, 0, 0
            from inventory  
            where 
                company_id = '{$company_id}'
            ";
    $pdo->query($sql);
    
    $sql = "insert into `$temp` (company_id, product_id, product_name, system, actual, sub_round_id, round_id)
            select a.company_id, a.product_id, a.product_name, 0, a.qty, a.sub_round_id, b.round_id 
            from product_count a 
            left join sub_round b on
                a.company_id = b.company_id and
                a.sub_round_id = b.sub_round_id 
            where 
                a.company_id = '{$company_id}' and
                b.round_id = '{$id}'
            ";
    $pdo->query($sql);

    $sql = "select report_id, product_id, product_name, sum(actual) as sum_actual, sum(system) as sum_system, 
                   (sum(actual)-sum(system)) as sum_diff   
            from `$temp` 
            where 
                  company_id = '{$company_id}' 
            group by product_id  
            order by sum_actual DESC limit 100;";
    $result = $pdo->query($sql)->fetchAll(PDO::FETCH_ASSOC);

$answer['result'] = $result;
$answer['txt'] = $sql;
$answer['success'] = 1;
$answer['message'] = 'Retrieve round';

exit(json_encode($answer));
?>