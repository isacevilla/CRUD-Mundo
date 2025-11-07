<?php
require_once 'config.php';

header('Content-Type: application/json');

if (isset($_SESSION['user_id'])) {
    echo json_encode([
        'authenticated' => true,
        'user_id' => $_SESSION['user_id'],
        'user_name' => $_SESSION['user_name'],
        'user_email' => $_SESSION['user_email'],
        'is_admin' => $_SESSION['is_admin']
    ]);
} else {
    echo json_encode(['authenticated' => false]);
}
?>

