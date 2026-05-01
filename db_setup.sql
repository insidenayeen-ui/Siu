CREATE DATABASE IF NOT EXISTS mydb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE mydb;

CREATE TABLE IF NOT EXISTS menu_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    image VARCHAR(255) NOT NULL,
    description TEXT NOT NULL
);

INSERT IGNORE INTO menu_items (id, name, price, category, image, description) VALUES
(1, 'Margherita Pizza', 12.99, 'pizza', 'images/margherita.png', 'Classic pizza with tomato sauce, mozzarella, and basil'),
(2, 'Pepperoni Pizza', 14.99, 'pizza', 'images/pepperoni.jpg', 'Pizza topped with pepperoni and mozzarella cheese'),
(3, 'Cheeseburger', 9.99, 'burger', 'images/cheeseburger.jpg', 'Juicy beef burger with cheese, lettuce, and tomato'),
(4, 'Chicken Burger', 10.99, 'burger', 'images/chickenburger.jpg', 'Grilled chicken breast with special sauce'),
(5, 'Club Sandwich', 8.99, 'sandwich', 'images/clubsandwich.jpg', 'Triple-decker sandwich with turkey, bacon, and vegetables'),
(6, 'Veggie Sandwich', 7.99, 'sandwich', 'images/veggie.jpg', 'Fresh vegetables with hummus and sprouts');

CREATE TABLE IF NOT EXISTS contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_address TEXT NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    created_at DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    item_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);
