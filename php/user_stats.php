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
    
    // Total de usuários
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM usuarios");
    $total = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
    
    // Usuários ativos
    $stmt = $pdo->query("SELECT COUNT(*) as active FROM usuarios WHERE status = 'ativo'");
    $active = $stmt->fetch(PDO::FETCH_ASSOC)['active'];
    
    // Usuários bloqueados
    $stmt = $pdo->query("SELECT COUNT(*) as blocked FROM usuarios WHERE status = 'bloqueado'");
    $blocked = $stmt->fetch(PDO::FETCH_ASSOC)['blocked'];
    
    // Novos usuários hoje
    $stmt = $pdo->query("SELECT COUNT(*) as new_today FROM usuarios WHERE DATE(data_cadastro) = CURDATE()");
    $new_today = $stmt->fetch(PDO::FETCH_ASSOC)['new_today'];
    
    echo json_encode([
        'success' => true,
        'stats' => [
            'total' => $total,
            'active' => $active,
            'blocked' => $blocked,
            'new_today' => $new_today
        ]
    ]);
    
} catch(Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Erro interno do servidor']);
}
?>

