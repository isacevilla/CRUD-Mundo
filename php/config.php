<?php
// Configurações do banco de dados
define('DB_HOST', 'localhost');
define('DB_NAME', 'perfume_store');
define('DB_USER', 'root');
define('DB_PASS', '');

// Função para conectar ao banco de dados
function conectarBanco() {
    try {
        $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8", DB_USER, DB_PASS);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $pdo;
    } catch(PDOException $e) {
        die("Erro na conexão: " . $e->getMessage());
    }
}

// Iniciar sessão se não estiver iniciada
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}
?>

