<?php
require_once 'config.php';

header('Content-Type: application/json');

// Destruir a sessão
session_destroy();

echo json_encode(['success' => true, 'message' => 'Logout realizado com sucesso']);
?>

