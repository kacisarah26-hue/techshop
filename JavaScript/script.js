// Données des produits (tableau JavaScript)
const products = [
    { id: 1, name: "iPhone 15 Pro", category: "smartphone", price: 1199, description: "Le dernier iPhone avec puce A17 Pro" },
    { id: 2, name: "Samsung Galaxy S24", category: "smartphone", price: 1099, description: "Smartphone Android haut de gamme" },
    { id: 3, name: "MacBook Pro M3", category: "ordinateur", price: 1999, description: "Ordinateur portable Apple" },
    { id: 4, name: "Dell XPS 15", category: "ordinateur", price: 1599, description: "PC portable ultra-performant" },
    { id: 5, name: "AirPods Pro 2", category: "accessoire", price: 279, description: "Écouteurs Bluetooth avec réduction de bruit" },
    { id: 6, name: "Souris Logitech MX", category: "accessoire", price: 89, description: "Souris sans fil ergonomique" },
    { id: 7, name: "Google Pixel 8", category: "smartphone", price: 799, description: "Smartphone avec meilleur appareil photo" },
    { id: 8, name: "ASUS ROG Strix", category: "ordinateur", price: 1799, description: "PC gamer puissant" }
];

// Liste des utilisateurs (authentification simulée)
let users = JSON.parse(localStorage.getItem('techshop_users')) || [];

// Panier (localStorage)
let cart = JSON.parse(localStorage.getItem('techshop_cart')) || [];

// === Menu burger ===
document.addEventListener('DOMContentLoaded', () => {
    const burger = document.querySelector('.burger');
    if (burger) {
        burger.addEventListener('click', () => {
            document.querySelector('.nav-links').classList.toggle('active');
        });
    }
    
    // Charger les produits si on est sur la page produits
    if (document.getElementById('productsGrid')) {
        displayProducts(products);
        setupFilters();
    }
    
    // Afficher le panier si on est sur la page commande
    if (document.getElementById('cartItems')) {
        displayCart();
    }
    
    // Gestion de l'inscription
    if (document.getElementById('inscriptionForm')) {
        setupInscription();
    }
    
    // Gestion de la connexion
    if (document.getElementById('connexionForm')) {
        setupConnexion();
    }
    
    // Gestion de la commande
    if (document.getElementById('orderForm')) {
        setupOrderForm();
    }
});

// === Affichage des produits ===
function displayProducts(productsToShow) {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    productsToShow.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-category">${getCategoryName(product.category)}</p>
                <p class="product-description">${product.description}</p>
                <p class="product-price">${product.price} €</p>
                <button class="add-to-cart" data-id="${product.id}">Ajouter au panier</button>
            </div>
        `;
        grid.appendChild(card);
    });
    
    // Ajouter les événements d'ajout au panier
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.id);
            addToCart(productId);
        });
    });
}

function getCategoryName(category) {
    const categories = {
        'smartphone': '📱 Smartphone',
        'ordinateur': '💻 Ordinateur',
        'accessoire': '🎧 Accessoire'
    };
    return categories[category] || category;
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        localStorage.setItem('techshop_cart', JSON.stringify(cart));
        alert(`${product.name} ajouté au panier !`);
        
        // Mettre à jour l'affichage du panier si on est sur la page commande
        if (document.getElementById('cartItems')) {
            displayCart();
        }
    }
}

function setupFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const category = btn.dataset.category;
            if (category === 'all') {
                displayProducts(products);
            } else {
                const filtered = products.filter(p => p.category === category);
                displayProducts(filtered);
            }
        });
    });
}

function displayCart() {
    const cartContainer = document.getElementById('cartItems');
    const cartTotalSpan = document.getElementById('cartTotal');
    
    if (!cartContainer) return;
    
    if (cart.length === 0) {
        cartContainer.innerHTML = '<p class="empty-cart">Votre panier est vide. Ajoutez des produits depuis la page Produits.</p>';
        if (cartTotalSpan) cartTotalSpan.textContent = '0 €';
        return;
    }
    
    cartContainer.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div>
                <strong>${item.name}</strong>
                <br>
                ${item.price} € x ${item.quantity}
            </div>
            <div>
                ${itemTotal} €
                <button class="remove-item" data-id="${item.id}" style="margin-left: 10px; background: #e74c3c; color: white; border: none; border-radius: 5px; padding: 2px 8px; cursor: pointer;">✕</button>
            </div>
        `;
        cartContainer.appendChild(cartItem);
    });
    
    if (cartTotalSpan) cartTotalSpan.textContent = total + ' €';
    
    // Ajouter les événements de suppression
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(btn.dataset.id);
            cart = cart.filter(item => item.id !== id);
            localStorage.setItem('techshop_cart', JSON.stringify(cart));
            displayCart();
        });
    });
}

// === Inscription avec validation RegEx ===
function setupInscription() {
    const form = document.getElementById('inscriptionForm');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nom = document.getElementById('nom').value.trim();
        const email = document.getElementById('email').value.trim();
        const telephone = document.getElementById('telephone').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        let isValid = true;
        
        // Validation nom (au moins 2 lettres)
        const nomRegex = /^[A-Za-zÀ-ÿ\s]{2,}$/;
        if (!nomRegex.test(nom)) {
            document.getElementById('nomError').textContent = 'Nom invalide (minimum 2 caractères)';
            isValid = false;
        } else {
            document.getElementById('nomError').textContent = '';
        }
        
        // Validation email
        const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
        if (!emailRegex.test(email)) {
            document.getElementById('emailError').textContent = 'Email invalide';
            isValid = false;
        } else {
            document.getElementById('emailError').textContent = '';
        }
        
        // Validation téléphone (10 chiffres)
        const telRegex = /^[0-9]{10}$/;
        if (!telRegex.test(telephone)) {
            document.getElementById('telError').textContent = 'Téléphone invalide (10 chiffres)';
            isValid = false;
        } else {
            document.getElementById('telError').textContent = '';
        }
        
        // Validation mot de passe (min 8, 1 maj, 1 chiffre)
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(password)) {
            document.getElementById('passwordError').textContent = 'Minimum 8 caractères, 1 majuscule et 1 chiffre';
            isValid = false;
        } else {
            document.getElementById('passwordError').textContent = '';
        }
        
        if (password !== confirmPassword) {
            document.getElementById('confirmError').textContent = 'Les mots de passe ne correspondent pas';
            isValid = false;
        } else {
            document.getElementById('confirmError').textContent = '';
        }
        
        if (isValid) {
            // Vérifier si l'utilisateur existe déjà
            if (users.find(u => u.email === email)) {
                alert('Cet email est déjà utilisé');
                return;
            }
            
            users.push({ nom, email, telephone, password });
            localStorage.setItem('techshop_users', JSON.stringify(users));
            alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
            window.location.href = 'connexion.html';
        }
    });
}

// === Connexion ===
function setupConnexion() {
    const form = document.getElementById('connexionForm');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            localStorage.setItem('techshop_current_user', JSON.stringify(user));
            document.getElementById('connexionMessage').innerHTML = '<div class="success-message">Connexion réussie ! Redirection...</div>';
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 1500);
        } else {
            document.getElementById('connexionMessage').innerHTML = '<div class="error-message-global">Email ou mot de passe incorrect</div>';
        }
    });
}

// === Validation du formulaire de commande ===
function setupOrderForm() {
    const form = document.getElementById('orderForm');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (cart.length === 0) {
            alert('Votre panier est vide. Ajoutez des produits avant de commander.');
            return;
        }
        
        const adresse = document.getElementById('adresse').value.trim();
        const codePostal = document.getElementById('codePostal').value.trim();
        const ville = document.getElementById('ville').value.trim();
        
        let isValid = true;
        
        if (adresse.length < 5) {
            document.getElementById('adresseError').textContent = 'Adresse trop courte';
            isValid = false;
        } else {
            document.getElementById('adresseError').textContent = '';
        }
        
        const cpRegex = /^[0-9]{5}$/;
        if (!cpRegex.test(codePostal)) {
            document.getElementById('codePostalError').textContent = 'Code postal invalide (5 chiffres)';
            isValid = false;
        } else {
            document.getElementById('codePostalError').textContent = '';
        }
        
        if (ville.length < 2) {
            document.getElementById('villeError').textContent = 'Ville invalide';
            isValid = false;
        } else {
            document.getElementById('villeError').textContent = '';
        }
        
        if (isValid) {
            const currentUser = JSON.parse(localStorage.getItem('techshop_current_user'));
            if (!currentUser) {
                alert('Vous devez être connecté pour passer commande');
                window.location.href = 'connexion.html';
                return;
            }
            
            alert('Commande validée avec succès ! Merci pour votre achat.');
            cart = [];
            localStorage.setItem('techshop_cart', JSON.stringify(cart));
            displayCart();
            form.reset();
        }
    });
}