document.addEventListener('DOMContentLoaded', function() {
    // Verificar se o usuário está logado
    checkUserSession();
    
    // Configurar eventos
    setupEventListeners();
    
    // Inicializar funcionalidades
    initializeSearch();
    initializeCart();
    initializeProductCards();
});

function checkUserSession() {
    // Verificar se há sessão ativa (opcional - pode ser removido se não quiser verificação)
    // Esta função pode ser usada para personalizar a experiência do usuário logado
    const isLoggedIn = sessionStorage.getItem('user_logged_in');
    
    if (isLoggedIn) {
        updateHeaderForLoggedUser();
    }
}

function updateHeaderForLoggedUser() {
    // Atualizar links do header para usuário logado
    const headerLinks = document.querySelectorAll('.header-link');
    headerLinks.forEach(link => {
        if (link.textContent === 'INICIAR SESSÃO') {
            link.textContent = 'MINHA CONTA';
            link.href = '#account';
        }
    });
}

function setupEventListeners() {
    // Busca
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    
    if (searchInput && searchBtn) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        searchBtn.addEventListener('click', performSearch);
    }
    
    // Navegação
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Remover classe active de todos os links
            navLinks.forEach(l => l.classList.remove('active'));
            // Adicionar classe active ao link clicado
            this.classList.add('active');
        });
    });
    
    // Botões de compra
    const buyButtons = document.querySelectorAll('.buy-btn');
    buyButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productCard = this.closest('.product-card');
            const productTitle = productCard.querySelector('.product-title').textContent;
            addToCart(productTitle);
        });
    });
    
    // Links do header
    const headerLinks = document.querySelectorAll('.header-link');
    headerLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.textContent === 'INICIAR SESSÃO') {
                e.preventDefault();
                window.location.href = 'login.html';
            } else if (this.textContent === 'CADASTRE-SE') {
                e.preventDefault();
                showRegisterModal();
            }
        });
    });
}

function initializeSearch() {
    // Funcionalidade de busca (simulada)
    window.performSearch = function() {
        const searchTerm = document.querySelector('.search-input').value.trim();
        
        if (searchTerm) {
            // Simular busca
            showSearchResults(searchTerm);
        }
    };
}

function showSearchResults(searchTerm) {
    // Filtrar produtos baseado no termo de busca
    const productCards = document.querySelectorAll('.product-card');
    let foundProducts = 0;
    
    productCards.forEach(card => {
        const title = card.querySelector('.product-title').textContent.toLowerCase();
        const isVisible = title.includes(searchTerm.toLowerCase());
        
        if (isVisible) {
            card.style.display = 'block';
            foundProducts++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Mostrar mensagem se nenhum produto foi encontrado
    if (foundProducts === 0) {
        showNoResultsMessage(searchTerm);
    } else {
        hideNoResultsMessage();
    }
}

function showNoResultsMessage(searchTerm) {
    // Remover mensagem anterior se existir
    hideNoResultsMessage();
    
    const productsGrid = document.querySelector('.products-grid');
    const noResultsDiv = document.createElement('div');
    noResultsDiv.className = 'no-results-message';
    noResultsDiv.innerHTML = `
        <div style="text-align: center; padding: 60px 20px; color: #b8b8b8;">
            <h3 style="color: #d4af37; margin-bottom: 15px;">Nenhum produto encontrado</h3>
            <p>Não encontramos produtos para "${searchTerm}"</p>
            <button onclick="clearSearch()" style="margin-top: 20px; background: linear-gradient(135deg, #d4af37, #f4d03f); border: none; padding: 10px 20px; border-radius: 8px; color: #1a1a1a; font-weight: 600; cursor: pointer;">
                Ver todos os produtos
            </button>
        </div>
    `;
    
    productsGrid.parentNode.insertBefore(noResultsDiv, productsGrid);
}

function hideNoResultsMessage() {
    const noResultsMessage = document.querySelector('.no-results-message');
    if (noResultsMessage) {
        noResultsMessage.remove();
    }
}

function clearSearch() {
    document.querySelector('.search-input').value = '';
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.style.display = 'block';
    });
    hideNoResultsMessage();
}

function initializeCart() {
    // Inicializar carrinho
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartCount(cart.length);
    
    // Evento de clique no ícone do carrinho
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', function() {
            showCartModal();
        });
    }
}

function addToCart(productTitle) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Verificar se o produto já está no carrinho
    const existingItem = cart.find(item => item.title === productTitle);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            title: productTitle,
            quantity: 1,
            addedAt: new Date().toISOString()
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount(cart.length);
    
    // Mostrar feedback visual
    showAddToCartFeedback(productTitle);
}

function updateCartCount(count) {
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = count;
    }
}

function showAddToCartFeedback(productTitle) {
    // Criar notificação temporária
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #d4af37, #f4d03f);
            color: #1a1a1a;
            padding: 15px 20px;
            border-radius: 10px;
            font-weight: 600;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        ">
            ✓ Produto adicionado ao carrinho!
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remover após 3 segundos
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function showCartModal() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }
    
    let cartHTML = '<h3>Itens no Carrinho:</h3><ul>';
    cart.forEach(item => {
        cartHTML += `<li>${item.title} (Quantidade: ${item.quantity})</li>`;
    });
    cartHTML += '</ul>';
    
    // Simular modal do carrinho
    const modal = document.createElement('div');
    modal.innerHTML = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        ">
            <div style="
                background: #2d2d2d;
                padding: 30px;
                border-radius: 15px;
                max-width: 500px;
                width: 90%;
                color: white;
            ">
                ${cartHTML}
                <div style="margin-top: 20px; text-align: center;">
                    <button onclick="this.closest('div').parentNode.remove()" style="
                        background: linear-gradient(135deg, #d4af37, #f4d03f);
                        border: none;
                        padding: 10px 20px;
                        border-radius: 8px;
                        color: #1a1a1a;
                        font-weight: 600;
                        cursor: pointer;
                        margin-right: 10px;
                    ">Fechar</button>
                    <button onclick="clearCart(); this.closest('div').parentNode.remove();" style="
                        background: #666;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 8px;
                        color: white;
                        font-weight: 600;
                        cursor: pointer;
                    ">Limpar Carrinho</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function clearCart() {
    localStorage.removeItem('cart');
    updateCartCount(0);
}

function showRegisterModal() {
    alert('Funcionalidade de cadastro será implementada em breve!');
}

function initializeProductCards() {
    // Adicionar efeitos de hover e animações aos cards
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach((card, index) => {
        // Animação de entrada escalonada
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
        
        // Efeito de hover personalizado
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Adicionar CSS para animações
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .cart-notification {
        animation: slideInRight 0.3s ease;
    }
    
    .product-card {
        transition: all 0.3s ease !important;
    }
`;
document.head.appendChild(style);

// Função global para limpar busca (chamada pelo botão)
window.clearSearch = clearSearch;
