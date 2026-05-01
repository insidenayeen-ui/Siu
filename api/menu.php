<?php
require_once __DIR__ . '/../db.php';

header('Content-Type: application/json; charset=utf-8');

try {
    $result = $conn->query("SELECT id, name, price, category, image, description FROM menu_items ORDER BY id");
    $menu = [];

    while ($row = $result->fetch_assoc()) {
        $menu[] = $row;
    }

    echo json_encode(['success' => true, 'menu' => $menu]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Failed to load menu data.']);
}
