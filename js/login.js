document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const firstLoginModal = document.getElementById('firstLoginModal');
    const changePasswordForm = document.getElementById('changePasswordForm');
    
    // Interceptar o envio do formulário de login
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        
        fetch('../php/login.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                if (data.first_login) {
                    showFirstLoginModal();
                } else {
                    window.location.href = '../html/dashboard.html';
                }
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao fazer login!');
        });
    });
    
    // Adicionar efeitos de hover aos botões
    const buttons = document.querySelectorAll('.login-btn, .change-password-btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Adicionar efeitos aos inputs
    const inputs = document.querySelectorAll('input');
    
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });
    
    // Verificar se é primeiro login (simulação - será implementado no PHP)
    function checkFirstLogin() {
        // Esta função será chamada pelo PHP se for primeiro login
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('first_login') === 'true') {
            showFirstLoginModal();
        }
    }
    
    function showFirstLoginModal() {
        firstLoginModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    function hideFirstLoginModal() {
        firstLoginModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    // Validação do formulário de alteração de senha
    changePasswordForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const novaSenha = document.getElementById('novaSenha').value;
        const confirmarSenha = document.getElementById('confirmarSenha').value;
        
        if (novaSenha !== confirmarSenha) {
            alert('As senhas não coincidem!');
            return;
        }
        
        if (novaSenha.length < 6) {
            alert('A senha deve ter pelo menos 6 caracteres!');
            return;
        }
        
        // Enviar dados para o PHP
        const formData = new FormData();
        formData.append('nova_senha', novaSenha);
        formData.append('action', 'change_password');
        
        fetch('../php/login.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Senha alterada com sucesso!');
                hideFirstLoginModal();
                window.location.href = '../html/dashboard.html';
            } else {
                alert('Erro ao alterar senha: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao alterar senha!');
        });
    });
    
    // Animação de entrada da página
    const loginCard = document.querySelector('.login-card');
    loginCard.style.opacity = '0';
    loginCard.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
        loginCard.style.transition = 'all 0.6s ease';
        loginCard.style.opacity = '1';
        loginCard.style.transform = 'translateY(0)';
    }, 100);
    
    // Verificar primeiro login ao carregar a página
    checkFirstLogin();
    
    // Adicionar efeito de partículas douradas (opcional)
    createGoldenParticles();
});

function createGoldenParticles() {
    const particleCount = 20;
    const background = document.querySelector('.background');
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '2px';
        particle.style.height = '2px';
        particle.style.background = '#d4af37';
        particle.style.borderRadius = '50%';
        particle.style.opacity = Math.random() * 0.5;
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animation = `float ${3 + Math.random() * 4}s ease-in-out infinite`;
        particle.style.animationDelay = Math.random() * 2 + 's';
        
        background.appendChild(particle);
    }
}

// Adicionar CSS para animação das partículas
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.3;
        }
        50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 0.8;
        }
    }
`;
document.head.appendChild(style);

