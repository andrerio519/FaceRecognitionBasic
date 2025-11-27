<?php
// register.php - Versi dengan simpan foto
header('Content-Type: application/json');
require_once 'config.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['name']) || !isset($data['descriptor']) || !isset($data['photo'])) {
    echo json_encode(['success' => false, 'message' => 'Data tidak lengkap']);
    exit;
}

$name = $data['name'];
$descriptor = json_encode($data['descriptor']);
$photoBase64 = $data['photo'];

// Buat folder uploads jika belum ada
$uploadDir = 'uploads/';
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

// Decode base64 dan simpan foto
$photoData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $photoBase64));
$filename = uniqid('face_') . '.jpg';
$filepath = $uploadDir . $filename;

if (!file_put_contents($filepath, $photoData)) {
    echo json_encode(['success' => false, 'message' => 'Gagal menyimpan foto']);
    exit;
}

try {
    $stmt = $pdo->prepare("INSERT INTO users (name, face_descriptor, photo_path) VALUES (?, ?, ?)");
    $stmt->execute([$name, $descriptor, $filepath]);

    echo json_encode([
        'success' => true,
        'message' => 'Registrasi berhasil',
        'id' => $pdo->lastInsertId(),
        'photo_path' => $filepath
    ]);
} catch (PDOException $e) {
    // Hapus foto jika gagal insert ke database
    if (file_exists($filepath)) {
        unlink($filepath);
    }
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
