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

$nome = $_POST['userName'] ?? '';
$email = $_POST['userEmail'] ?? '';
$senha = $_POST['userPassword'] ?? '';
$status = $_POST['userStatus'] ?? 'ativo';

// Validações
if (empty($nome) || empty($email) || empty($senha)) {
    echo json_encode(['success' => false, 'message' => 'Todos os campos são obrigatórios']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Email inválido']);
    exit;
}

if (strlen($senha) < 6) {
    echo json_encode(['success' => false, 'message' => 'A senha deve ter pelo menos 6 caracteres']);
    exit;
}

try {
    $pdo = conectarBanco();
    
    // Verificar se o email já existe
    $stmt = $pdo->prepare("SELECT id FROM usuarios WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        echo json_encode(['success' => false, 'message' => 'Este email já está em uso']);
        exit;
    }
    
    // Criar o usuário
    $senha_hash = password_hash($senha, PASSWORD_DEFAULT);
    $stmt = $pdo->prepare("INSERT INTO usuarios (nome, email, senha, status, primeiro_login) VALUES (?, ?, ?, ?, TRUE)");
    $stmt->execute([$nome, $email, $senha_hash, $status]);
    
    echo json_encode(['success' => true, 'message' => 'Usuário criado com sucesso']);
    
} catch(Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Erro interno do servidor']);
}
?>

