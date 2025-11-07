<?php
require_once 'config.php';

header('Content-Type: application/json');

// Verificar se o usuário está logado
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Não autenticado']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Método não permitido']);
    exit;
}

// Ler dados JSON
$input = json_decode(file_get_contents('php://input'), true);
$userId = $input['userId'] ?? '';

if (empty($userId)) {
    echo json_encode(['success' => false, 'message' => 'ID do usuário não fornecido']);
    exit;
}

// Não permitir que o usuário delete a si mesmo
if ($userId == $_SESSION['user_id']) {
    echo json_encode(['success' => false, 'message' => 'Você não pode deletar sua própria conta']);
    exit;
}

try {
    $pdo = conectarBanco();
    
    // Verificar se o usuário existe
    $stmt = $pdo->prepare("SELECT id, email FROM usuarios WHERE id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$user) {
        echo json_encode(['success' => false, 'message' => 'Usuário não encontrado']);
        exit;
    }
    
    // Não permitir deletar o administrador principal
    if ($user['email'] === 'admin@perfume.com') {
        echo json_encode(['success' => false, 'message' => 'Não é possível deletar o administrador principal']);
        exit;
    }
    
    // Deletar o usuário
    $stmt = $pdo->prepare("DELETE FROM usuarios WHERE id = ?");
    $stmt->execute([$userId]);
    
    echo json_encode(['success' => true, 'message' => 'Usuário deletado com sucesso']);
    
} catch(Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Erro interno do servidor']);
}
?>

