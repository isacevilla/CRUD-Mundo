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

$userId = $_POST['userId'] ?? '';
$nome = $_POST['userName'] ?? '';
$email = $_POST['userEmail'] ?? '';
$senha = $_POST['userPassword'] ?? '';
$status = $_POST['userStatus'] ?? 'ativo';

// Validações
if (empty($userId) || empty($nome) || empty($email)) {
    echo json_encode(['success' => false, 'message' => 'Campos obrigatórios não preenchidos']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Email inválido']);
    exit;
}

if (!empty($senha) && strlen($senha) < 6) {
    echo json_encode(['success' => false, 'message' => 'A senha deve ter pelo menos 6 caracteres']);
    exit;
}

try {
    $pdo = conectarBanco();
    
    // Verificar se o usuário existe
    $stmt = $pdo->prepare("SELECT id FROM usuarios WHERE id = ?");
    $stmt->execute([$userId]);
    if (!$stmt->fetch()) {
        echo json_encode(['success' => false, 'message' => 'Usuário não encontrado']);
        exit;
    }
    
    // Verificar se o email já está em uso por outro usuário
    $stmt = $pdo->prepare("SELECT id FROM usuarios WHERE email = ? AND id != ?");
    $stmt->execute([$email, $userId]);
    if ($stmt->fetch()) {
        echo json_encode(['success' => false, 'message' => 'Este email já está em uso por outro usuário']);
        exit;
    }
    
    // Atualizar o usuário
    if (!empty($senha)) {
        // Atualizar com nova senha
        $senha_hash = password_hash($senha, PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("UPDATE usuarios SET nome = ?, email = ?, senha = ?, status = ? WHERE id = ?");
        $stmt->execute([$nome, $email, $senha_hash, $status, $userId]);
    } else {
        // Atualizar sem alterar a senha
        $stmt = $pdo->prepare("UPDATE usuarios SET nome = ?, email = ?, status = ? WHERE id = ?");
        $stmt->execute([$nome, $email, $status, $userId]);
    }
    
    echo json_encode(['success' => true, 'message' => 'Usuário atualizado com sucesso']);
    
} catch(Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Erro interno do servidor']);
}
?>

