// ==========================
// FOOD DATA
// ==========================
let foodData = [
    {
        id: 1,
        name: "Margherita Pizza",
        price: 12.99,
        category: "pizza",
        image: "images/margherita.png",
        description: "Classic pizza with tomato sauce, mozzarella, and basil"
    },
    {
        id: 2,
        name: "Pepperoni Pizza",
        price: 14.99,
        category: "pizza",
        image: "images/pepperoni.jpg",
        description: "Pizza topped with pepperoni and mozzarella cheese"
    },
    {
        id: 3,
        name: "Cheeseburger",
        price: 9.99,
        category: "burger",
        image: "images/cheeseburger.jpg",
        description: "Juicy beef burger with cheese, lettuce, and tomato"
    },
    {
        id: 4,
        name: "Chicken Burger",
        price: 10.99,
        category: "burger",
        image: "images/chickenburger.jpg",
        description: "Grilled chicken breast with special sauce"
    },
    {
        id: 5,
        name: "Club Sandwich",
        price: 8.99,
        category: "sandwich",
        image: "images/clubsandwich.jpg",
        description: "Triple-decker sandwich with turkey, bacon, and vegetables"
    },
    {
        id: 6,
        name: "Veggie Sandwich",
        price: 7.99,
        category: "sandwich",
        image: "images/veggie.jpg",
        description: "Fresh vegetables with hummus and sprouts"
    }
];

// ==========================
// CART
// ==========================
let cart = [];

// ==========================
// DOM ELEMENTS
// ==========================
let floatingCart;
let floatingCartCount;
let cartLink;
let cartModal;
let closeCart;
let cartItems;
let cartTotal;
let cartCount;
let featuredFoods;
let checkoutBtn;

// ==========================
// INIT
// ==========================
document.addEventListener('DOMContentLoaded', function () {

    // Assign DOM elements
    floatingCart    = document.getElementById("floatingCart");
    floatingCartCount = document.getElementById("floatingCartCount");
    cartLink        = document.getElementById('cartLink');
    cartModal       = document.getElementById('cartModal');
    closeCart       = document.getElementById('closeCart');
    cartItems       = document.getElementById('cartItems');
    cartTotal       = document.getElementById('cartTotal');
    cartCount       = document.querySelector('.cart-count');
    featuredFoods   = document.getElementById('featuredFoods');
    checkoutBtn     = document.getElementById('checkoutBtn');

    loadCartFromLocalStorage();
    updateCartUI();

    // -- Menu page: handle ?category= URL param --
    const params   = new URLSearchParams(window.location.search);
    const category = params.get("category");

    if (document.getElementById("menuFoods")) {
        displayMenuFoods(category || 'all');
        setupFilterButtons();

        if (category) {
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.category === category);
            });
        }
    }

    if (featuredFoods) {
        displayFeaturedFoods();
    }

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !message) {
                alert('Please fill in all fields before submitting.');
                return;
            }

            alert('This site is currently running without a backend. Please email bbla@barakahbitesla.com if you want a response.');
            contactForm.reset();
        });
    }

    // -- Cart link in nav --
    if (cartLink) {
        cartLink.addEventListener('click', function (e) {
            e.preventDefault();
            openCart();
        });
    }

    // -- Floating cart --
    if (floatingCart) {
        floatingCart.addEventListener('click', function () {
            openCart();
        });
    }

    // -- Close cart modal --
    if (closeCart) {
        closeCart.addEventListener('click', closeCartModal);
    }

    // -- Checkout button → open order form --
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function () {
            if (cart.length === 0) {
                alert("Your cart is empty!");
                return;
            }
            // Close the cart modal first
            closeCartModal();

            const modal = document.getElementById("orderFormModal");
            if (modal) {
                modal.style.display = "flex";
            } else {
                // Should never happen now that every page has the modal,
                // but guard just in case
                alert("Order form not found. Please reload the page.");
            }
        });
    }

    // -- BUG FIX: closeForm button was never wired up --
    const closeFormBtn = document.getElementById("closeForm");
    if (closeFormBtn) {
        closeFormBtn.addEventListener('click', function () {
            const modal = document.getElementById("orderFormModal");
            if (modal) modal.style.display = "none";
        });
    }

    // -- BUG FIX: sendWhatsApp had NO event listener at all --
    const sendWhatsAppBtn = document.getElementById("sendWhatsApp");
    if (sendWhatsAppBtn) {
        sendWhatsAppBtn.addEventListener('click', async function () {
            const name    = document.getElementById("custName").value.trim();
            const phone   = document.getElementById("custPhone").value.trim();
            const address = document.getElementById("custAddress").value.trim();

            if (!name || !phone || !address) {
                alert("Please fill in all fields before sending.");
                return;
            }

            if (cart.length === 0) {
                alert("Your cart is empty!");
                return;
            }

            const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

            // Build order summary for WhatsApp
            let orderText = `🍔 *New Order - Barakah Bites La*\n\n`;
            orderText += `👤 *Name:* ${name}\n`;
            orderText += `📞 *Phone:* ${phone}\n`;
            orderText += `📍 *Address:* ${address}\n\n`;
            orderText += `🛒 *Order Details:*\n`;

            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                orderText += `  • ${item.name} x${item.quantity} = $${itemTotal.toFixed(2)}\n`;
            });

            orderText += `\n💰 *Total: $${total.toFixed(2)}*`;

            const whatsappNumber = "19494268220";
            const encodedMessage = encodeURIComponent(orderText);
            const whatsappURL    = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

            cart = [];
            saveCartToLocalStorage();
            updateCartUI();

            const modal = document.getElementById("orderFormModal");
            if (modal) modal.style.display = "none";

            window.open(whatsappURL, "_blank");
        });
    }

    // -- Close modals when clicking outside them --
    window.addEventListener('click', function (event) {
        if (event.target === cartModal) {
            closeCartModal();
        }
        const orderModal = document.getElementById("orderFormModal");
        if (event.target === orderModal) {
            orderModal.style.display = "none";
        }
    });

    // -- Mobile hamburger menu --
    const menuToggle = document.getElementById("menuToggle");
    const navLinks   = document.getElementById("navLinks");
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function () {
            navLinks.classList.toggle('active');
        });
    }
});

// ==========================
// FEATURED FOODS
// ==========================
function displayFeaturedFoods() {
    if (!featuredFoods) return;

    featuredFoods.innerHTML = '';
    const featuredItems = foodData.slice(0, 3);

    featuredItems.forEach(food => {
        const foodCard = document.createElement('div');
        foodCard.className = 'food-card';

        foodCard.innerHTML = `
            <img src="${food.image}" alt="${food.name}">
            <div class="food-info">
                <h3>${food.name}</h3>
                <p>${food.description}</p>
                <span class="price">$${food.price.toFixed(2)}</span>
                <button class="add-to-cart" data-id="${food.id}">Add to Cart</button>
            </div>
        `;

        featuredFoods.appendChild(foodCard);
    });

    attachCartButtons();
}

// ==========================
// MENU FOODS
// ==========================
function displayMenuFoods(category = 'all') {
    const menuFoods = document.getElementById('menuFoods');
    if (!menuFoods) return;

    menuFoods.innerHTML = '';

    const filtered = category === 'all'
        ? foodData
        : foodData.filter(f => f.category === category);

    filtered.forEach(food => {
        const foodCard = document.createElement('div');
        foodCard.className = 'food-card';

        foodCard.innerHTML = `
            <img src="${food.image}" alt="${food.name}">
            <div class="food-info">
                <h3>${food.name}</h3>
                <p>${food.description}</p>
                <span class="price">$${food.price.toFixed(2)}</span>
                <button class="add-to-cart" data-id="${food.id}">Add to Cart</button>
            </div>
        `;

        menuFoods.appendChild(foodCard);
    });

    attachCartButtons();
}

// ==========================
// CART BUTTONS
// ==========================
function attachCartButtons() {
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', function () {
            const id = parseInt(this.getAttribute('data-id'));
            addToCart(id);
        });
    });
}

// ==========================
// ADD TO CART
// ==========================
function addToCart(foodId) {
    const food = foodData.find(f => f.id === foodId);
    if (!food) return;

    const existing = cart.find(item => item.id === foodId);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({
            id:       food.id,
            name:     food.name,
            price:    food.price,
            image:    food.image,
            quantity: 1
        });
    }

    saveCartToLocalStorage();
    updateCartUI();
}

// ==========================
// UPDATE CART UI
// ==========================
function updateCartUI() {
    const totalItems = cart.reduce((a, b) => a + b.quantity, 0);

    if (cartCount)        cartCount.textContent        = totalItems;
    if (floatingCartCount) floatingCartCount.textContent = totalItems;

    if (!cartItems || !cartTotal) return;

    if (cart.length === 0) {
        cartItems.innerHTML    = '<p class="empty-cart-message">Your cart is empty</p>';
        cartTotal.textContent  = '0.00';
        return;
    }

    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const div = document.createElement('div');
        div.className = 'cart-item';

        div.innerHTML = `
            <div class="item-info">
                <h4>${item.name}</h4>
                <p class="item-price">$${item.price.toFixed(2)}</p>
            </div>
            <div class="item-quantity">
                <button class="quantity-btn" onclick="changeQty(${item.id}, -1)">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn" onclick="changeQty(${item.id}, 1)">+</button>
            </div>
            <p class="item-price">$${itemTotal.toFixed(2)}</p>
            <button class="remove-item" onclick="removeItem(${item.id})">×</button>
        `;

        cartItems.appendChild(div);
    });

    cartTotal.textContent = total.toFixed(2);
}

// ==========================
// QUANTITY & REMOVE
// ==========================
window.changeQty = function (id, change) {
    const item = cart.find(i => i.id === id);
    if (!item) return;

    item.quantity += change;
    if (item.quantity <= 0) {
        cart = cart.filter(i => i.id !== id);
    }

    saveCartToLocalStorage();
    updateCartUI();
};

window.removeItem = function (id) {
    cart = cart.filter(i => i.id !== id);
    saveCartToLocalStorage();
    updateCartUI();
};

// ==========================
// CART MODAL
// ==========================
function openCart() {
    if (cartModal) cartModal.style.display = 'flex';
}

function closeCartModal() {
    if (cartModal) cartModal.style.display = 'none';
}

// ==========================
// LOCAL STORAGE
// ==========================
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCartFromLocalStorage() {
    const data = localStorage.getItem('cart');
    if (data) cart = JSON.parse(data);
}

// ==========================
// FILTER BUTTONS
// ==========================
function setupFilterButtons() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            displayMenuFoods(this.dataset.category);
        });
    });
}

// ==========================
// FLOATING CART
// ==========================
document.addEventListener("click", function (e) {
    if (e.target.closest("#floatingCart")) {
        openCart();
    }
});