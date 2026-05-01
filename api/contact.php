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
$email = trim($payload['email'] ?? '');
$message = trim($payload['message'] ?? '');

if (!$name || !$email || !$message) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Please fill in all required fields.']);
    exit;
}

try {
    $stmt = $conn->prepare("INSERT INTO contacts (name, email, message, created_at) VALUES (?, ?, ?, NOW())");
    $stmt->bind_param('sss', $name, $email, $message);
    $stmt->execute();

    echo json_encode(['success' => true, 'message' => 'Thank you! Your message has been received.']);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Unable to save your message.']);
}
