// ==========================
// FOOD DATA
// ==========================
const foodData = [
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
// DOM ELEMENTS (SAFE)
// ==========================
const cartLink = document.getElementById('cartLink');
const cartModal = document.getElementById('cartModal');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.querySelector('.cart-count');
const featuredFoods = document.getElementById('featuredFoods');
const checkoutBtn = document.getElementById('checkoutBtn');

// ==========================
// INIT
// ==========================
document.addEventListener('DOMContentLoaded', function () {

    loadCartFromLocalStorage();
    updateCartUI();
    const params = new URLSearchParams(window.location.search);
const category = params.get("category");

if (category && document.getElementById("menuFoods")) {
    displayMenuFoods(category);
}

    if (featuredFoods) {
        displayFeaturedFoods();
    }

    if (document.getElementById('menuFoods')) {
        displayMenuFoods();
        setupFilterButtons();
    }

    if (cartLink) {
        cartLink.addEventListener('click', function (e) {
            e.preventDefault();
            openCart();
        });
    }

    if (closeCart) {
        closeCart.addEventListener('click', closeCartModal);
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', checkout);
    }

    window.addEventListener('click', function (event) {
        if (event.target === cartModal) {
            closeCartModal();
        }
    });

});

// ==========================
// DISPLAY FEATURED FOODS
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
// DISPLAY MENU FOODS
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
// ATTACH CART BUTTONS
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
            id: food.id,
            name: food.name,
            price: food.price,
            image: food.image,
            quantity: 1
        });
    }

    saveCartToLocalStorage();
    updateCartUI();

    alert(`${food.name} added to cart!`);
}

// ==========================
// UPDATE CART UI
// ==========================
function updateCartUI() {
    if (cartCount) {
        cartCount.textContent = cart.reduce((a, b) => a + b.quantity, 0);
    }

    if (!cartItems || !cartTotal) return;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart-message">Your cart is empty</p>';
        cartTotal.textContent = '0.00';
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
                <p>$${item.price.toFixed(2)}</p>
            </div>

            <div class="item-quantity">
                <button onclick="changeQty(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="changeQty(${item.id}, 1)">+</button>
            </div>

            <p>$${itemTotal.toFixed(2)}</p>

            <button onclick="removeItem(${item.id})">×</button>
        `;

        cartItems.appendChild(div);
    });

    cartTotal.textContent = total.toFixed(2);
}

// ==========================
// CHANGE QUANTITY
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

// ==========================
// REMOVE ITEM
// ==========================
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
// CHECKOUT
// ==========================
function checkout() {
    if (cart.length === 0) {
        alert("Cart is empty!");
        return;
    }

    const form = document.getElementById("orderFormModal");
    form.style.display = "flex";
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
// FILTER MENU
// ==========================
function setupFilterButtons() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function () {

            document.querySelectorAll('.filter-btn')
                .forEach(b => b.classList.remove('active'));

            this.classList.add('active');

            displayMenuFoods(this.dataset.category);
        });
    });
}
document.getElementById("sendWhatsApp").addEventListener("click", function () {

    const name = document.getElementById("custName").value;
    const phoneInput = document.getElementById("custPhone").value;
    const address = document.getElementById("custAddress").value;

    if (!name || !phoneInput || !address) {
        alert("Please fill all fields!");
        return;
    }

    let message = "🧾 *Barakah Bites La Order*\n\n";

    let total = 0;

    cart.forEach(item => {
        let itemTotal = item.price * item.quantity;
        total += itemTotal;

        message += `🍔 ${item.name}\n`;
        message += `${item.quantity} x $${item.price.toFixed(2)} = $${itemTotal.toFixed(2)}\n\n`;
    });

    message += "----------------------\n";
    message += `💰 *Total: $${total.toFixed(2)}*\n\n`;

    message += "📍 Delivery Info:\n";
    message += `Name: ${name}\n`;
    message += `Phone: ${phoneInput}\n`;
    message += `Address: ${address}\n`;

    const whatsappNumber = "19494268220"; // your US number

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");

    cart = [];
    saveCartToLocalStorage();
    updateCartUI();

    document.getElementById("orderFormModal").style.display = "none";
});
document.getElementById("closeForm").addEventListener("click", function () {
    document.getElementById("orderFormModal").style.display = "none";
});
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle) {
    menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });
}