<?php
require_once 'config.php';

header('Content-Type: application/json');

// Verificar se o usuário está logado
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Não autenticado']);
    exit;
}

try {
    $pdo = conectarBanco();
    
    // Construir query com filtros
    $where_conditions = [];
    $params = [];
    
    // Filtro por status
    if (isset($_GET['status']) && !empty($_GET['status'])) {
        $where_conditions[] = "status = ?";
        $params[] = $_GET['status'];
    }
    
    // Filtro por busca (nome ou email)
    if (isset($_GET['search']) && !empty($_GET['search'])) {
        $where_conditions[] = "(nome LIKE ? OR email LIKE ?)";
        $search_term = '%' . $_GET['search'] . '%';
        $params[] = $search_term;
        $params[] = $search_term;
    }
    
    $where_clause = '';
    if (!empty($where_conditions)) {
        $where_clause = 'WHERE ' . implode(' AND ', $where_conditions);
    }
    
    $sql = "SELECT id, nome, email, status, data_cadastro, tentativas_login FROM usuarios $where_clause ORDER BY data_cadastro DESC";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'users' => $users
    ]);
    
} catch(Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Erro interno do servidor']);
}
?>

