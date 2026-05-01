<?php
require_once __DIR__ . '/../db.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

$payload = json_decode(file_get_contents('php://input'), true);
$name = trim($payload['name'] ?? '');
$phone = trim($payload['phone'] ?? '');
$address = trim($payload['address'] ?? '');
$items = $payload['items'] ?? [];
$total = floatval($payload['total'] ?? 0);

if (!$name || !$phone || !$address || !is_array($items) || count($items) === 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Please provide name, phone, address, and at least one order item.']);
    exit;
}

try {
    $stmt = $conn->prepare("INSERT INTO orders (customer_name, customer_phone, customer_address, total, created_at) VALUES (?, ?, ?, ?, NOW())");
    $stmt->bind_param('sssd', $name, $phone, $address, $total);
    $stmt->execute();
    $orderId = $conn->insert_id;

    $itemStmt = $conn->prepare("INSERT INTO order_items (order_id, item_id, name, quantity, price) VALUES (?, ?, ?, ?, ?)");
    foreach ($items as $item) {
        $itemId = intval($item['id'] ?? 0);
        $itemName = trim($item['name'] ?? '');
        $quantity = intval($item['quantity'] ?? 0);
        $price = floatval($item['price'] ?? 0);

        if ($itemId <= 0 || !$itemName || $quantity <= 0) {
            continue;
        }

        $itemStmt->bind_param('iisid', $orderId, $itemId, $itemName, $quantity, $price);
        $itemStmt->execute();
    }

    echo json_encode(['success' => true, 'order_id' => $orderId, 'message' => 'Order saved successfully.']);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Unable to save your order.']);
}
