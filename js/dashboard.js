document.addEventListener('DOMContentLoaded', function() {
    // Verificar se o usuário está logado
    checkAuthentication();
    
    // Carregar dados iniciais
    loadUserStats();
    loadUsers();
    
    // Configurar eventos
    setupEventListeners();
});

function checkAuthentication() {
    // Verificar se há sessão ativa
    fetch('../php/check_session.php')
        .then(response => response.json())
        .then(data => {
            if (!data.authenticated) {
                window.location.href = '../html/login.html';
                return;
            }
            
            // Atualizar informações do usuário na sidebar
            document.getElementById('userName').textContent = data.user_name;
            document.getElementById('userInitials').textContent = getInitials(data.user_name);
        })
        .catch(error => {
            console.error('Erro ao verificar autenticação:', error);
            window.location.href = '../html/login.html';
        });
}

function getInitials(name) {
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().substring(0, 2);
}

function loadUserStats() {
    fetch('../php/user_stats.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById('totalUsers').textContent = data.stats.total;
                document.getElementById('activeUsers').textContent = data.stats.active;
                document.getElementById('blockedUsers').textContent = data.stats.blocked;
                document.getElementById('newUsersToday').textContent = data.stats.new_today;
            }
        })
        .catch(error => {
            console.error('Erro ao carregar estatísticas:', error);
        });
}

function loadUsers() {
    fetch('../php/get_users.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayUsers(data.users);
            } else {
                console.error('Erro ao carregar usuários:', data.message);
            }
        })
        .catch(error => {
            console.error('Erro ao carregar usuários:', error);
        });
}

function displayUsers(users) {
    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = '';
    
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.nome}</td>
            <td>${user.email}</td>
            <td><span class="status-badge status-${user.status}">${user.status}</span></td>
            <td>${formatDate(user.data_cadastro)}</td>
            <td>${user.tentativas_login}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-action btn-edit" onclick="editUser(${user.id})">Editar</button>
                    ${user.status === 'bloqueado' ? 
                        `<button class="btn-action btn-unlock" onclick="unlockUser(${user.id})">Desbloquear</button>` : 
                        ''
                    }
                    <button class="btn-action btn-delete" onclick="deleteUser(${user.id})">Excluir</button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'});
}

function setupEventListeners() {
    // Formulário de usuário
    document.getElementById('userForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveUser();
    });
    
    // Navegação da sidebar
    document.querySelectorAll('.nav-item a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remover classe active de todos os itens
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Adicionar classe active ao item clicado
            this.parentElement.classList.add('active');
            
            // Aqui você pode implementar a navegação entre seções
            const section = this.getAttribute('data-section');
            console.log('Navegando para seção:', section);
        });
    });
}

function openAddUserModal() {
    document.getElementById('modalTitle').textContent = 'Adicionar Usuário';
    document.getElementById('userForm').reset();
    document.getElementById('userId').value = '';
    document.getElementById('userPasswordInput').required = true;
    document.getElementById('userModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function editUser(userId) {
    // Buscar dados do usuário
    fetch(`../php/get_user.php?id=${userId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const user = data.user;
                
                document.getElementById('modalTitle').textContent = 'Editar Usuário';
                document.getElementById('userId').value = user.id;
                document.getElementById('userNameInput').value = user.nome;
                document.getElementById('userEmailInput').value = user.email;
                document.getElementById('userStatusInput').value = user.status;
                document.getElementById('userPasswordInput').value = '';
                document.getElementById('userPasswordInput').required = false;
                
                document.getElementById('userModal').style.display = 'block';
                document.body.style.overflow = 'hidden';
            } else {
                alert('Erro ao carregar dados do usuário: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Erro ao carregar usuário:', error);
            alert('Erro ao carregar dados do usuário!');
        });
}

function saveUser() {
    const formData = new FormData(document.getElementById('userForm'));
    const userId = document.getElementById('userId').value;
    
    const url = userId ? '../php/update_user.php' : '../php/create_user.php';
    
    fetch(url, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(userId ? 'Usuário atualizado com sucesso!' : 'Usuário criado com sucesso!');
            closeUserModal();
            loadUsers();
            loadUserStats();
        } else {
            alert('Erro ao salvar usuário: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Erro ao salvar usuário:', error);
        alert('Erro ao salvar usuário!');
    });
}

function deleteUser(userId) {
    showConfirmModal(
        'Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.',
        () => {
            fetch('../php/delete_user.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: userId })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Usuário excluído com sucesso!');
                    loadUsers();
                    loadUserStats();
                } else {
                    alert('Erro ao excluir usuário: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Erro ao excluir usuário:', error);
                alert('Erro ao excluir usuário!');
            });
        }
    );
}

function unlockUser(userId) {
    showConfirmModal(
        'Tem certeza que deseja desbloquear este usuário?',
        () => {
            fetch('../php/unlock_user.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: userId })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Usuário desbloqueado com sucesso!');
                    loadUsers();
                    loadUserStats();
                } else {
                    alert('Erro ao desbloquear usuário: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Erro ao desbloquear usuário:', error);
                alert('Erro ao desbloquear usuário!');
            });
        }
    );
}

function closeUserModal() {
    document.getElementById('userModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function showConfirmModal(message, onConfirm) {
    document.getElementById('confirmMessage').textContent = message;
    document.getElementById('confirmBtn').onclick = () => {
        onConfirm();
        closeConfirmModal();
    };
    document.getElementById('confirmModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeConfirmModal() {
    document.getElementById('confirmModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function filterUsers() {
    const statusFilter = document.getElementById('statusFilter').value;
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    const params = new URLSearchParams();
    if (statusFilter) params.append('status', statusFilter);
    if (searchTerm) params.append('search', searchTerm);
    
    fetch(`../php/get_users.php?${params.toString()}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displayUsers(data.users);
            }
        })
        .catch(error => {
            console.error('Erro ao filtrar usuários:', error);
        });
}

function searchUsers() {
    filterUsers();
}

function logout() {
    showConfirmModal(
        'Tem certeza que deseja sair?',
        () => {
            fetch('../php/logout.php', {
                method: 'POST'
            })
            .then(() => {
                window.location.href = '../html/login.html';
            })
            .catch(error => {
                console.error('Erro ao fazer logout:', error);
                window.location.href = '../html/login.html';
            });
        }
    );
}

// Fechar modais ao clicar fora deles
window.onclick = function(event) {
    const userModal = document.getElementById('userModal');
    const confirmModal = document.getElementById('confirmModal');
    
    if (event.target === userModal) {
        closeUserModal();
    }
    
    if (event.target === confirmModal) {
        closeConfirmModal();
    }
}

