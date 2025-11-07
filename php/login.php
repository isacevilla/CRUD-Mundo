<?php
require_once 'config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
  
    if (isset($_POST['action']) && $_POST['action'] === 'change_password') {
        if (!isset($_SESSION['user_id'])) {
            echo json_encode(['success' => false, 'message' => 'Usuário não autenticado']);
            exit;
        }
        
        $nova_senha = $_POST['nova_senha'];
        $user_id = $_SESSION['user_id'];
        
        try {
            $pdo = conectarBanco();
            
       
            $stmt = $pdo->prepare("UPDATE usuarios SET senha = ?, primeiro_login = FALSE WHERE id = ?");
            $stmt->execute([password_hash($nova_senha, PASSWORD_DEFAULT), $user_id]);
            
            echo json_encode(['success' => true, 'message' => 'Senha alterada com sucesso']);
            exit;
            
        } catch(Exception $e) {
            echo json_encode(['success' => false, 'message' => 'Erro interno do servidor']);
            exit;
        }
    }
    

    $email = $_POST['email'] ?? '';
    $senha = $_POST['senha'] ?? '';
    
    if (empty($email) || empty($senha)) {
        echo json_encode(['success' => false, 'message' => 'Email e senha são obrigatórios']);
        exit;
    }
    
    try {
        $pdo = conectarBanco();
        
    
        $stmt = $pdo->prepare("SELECT * FROM usuarios WHERE email = ?");
        $stmt->execute([$email]);
        $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$usuario) {
            echo json_encode(['success' => false, 'message' => 'Credenciais inválidas']);
            exit;
        }
        
      
        if ($usuario['status'] === 'bloqueado') {
            echo json_encode(['success' => false, 'message' => 'Conta bloqueada. Entre em contato com o administrador.']);
            exit;
        }
        
      
        if ($usuario['status'] === 'inativo') {
            echo json_encode(['success' => false, 'message' => 'Conta inativa. Entre em contato com o administrador.']);
            exit;
        }
        

        if (password_verify($senha, $usuario['senha']) || $senha === $usuario['senha']) {
            // Login bem-sucedido - resetar tentativas
            $stmt = $pdo->prepare("UPDATE usuarios SET tentativas_login = 0 WHERE id = ?");
            $stmt->execute([$usuario['id']]);
            
    
            $_SESSION['user_id'] = $usuario['id'];
            $_SESSION['user_name'] = $usuario['nome'];
            $_SESSION['user_email'] = $usuario['email'];
            $_SESSION['is_admin'] = ($usuario['email'] === 'admin@perfume.com');
            
 
            if ($usuario['primeiro_login']) {
                echo json_encode([
                    'success' => true, 
                    'first_login' => true,
                    'message' => 'Primeiro login detectado'
                ]);
            } else {
        
                if ($usuario['email'] === 'admin@perfume.com') {
                    echo json_encode([
                        'success' => true, 
                        'first_login' => false,
                        'redirect' => '../html/dashboard.html'
                    ]);
                } else {
                    echo json_encode([
                        'success' => true, 
                        'first_login' => false,
                        'redirect' => '../homepage.html'
                    ]);
                }
            }
            
        } else {
        
            $novas_tentativas = $usuario['tentativas_login'] + 1;
            
            if ($novas_tentativas >= 3) {
            
                $stmt = $pdo->prepare("UPDATE usuarios SET tentativas_login = ?, status = 'bloqueado' WHERE id = ?");
                $stmt->execute([$novas_tentativas, $usuario['id']]);
                
                echo json_encode([
                    'success' => false, 
                    'message' => 'Conta bloqueada após 3 tentativas incorretas. Entre em contato com o administrador.'
                ]);
            } else {
             
                $stmt = $pdo->prepare("UPDATE usuarios SET tentativas_login = ? WHERE id = ?");
                $stmt->execute([$novas_tentativas, $usuario['id']]);
                
                $tentativas_restantes = 3 - $novas_tentativas;
                echo json_encode([
                    'success' => false, 
                    'message' => "Credenciais inválidas. Você tem mais {$tentativas_restantes} tentativa(s)."
                ]);
            }
        }
        
    } catch(Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Erro interno do servidor']);
    }
    
} else {
    echo json_encode(['success' => false, 'message' => 'Método não permitido']);
}
?>
