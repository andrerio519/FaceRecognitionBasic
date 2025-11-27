<?php
// recognize.php
header('Content-Type: application/json');
require_once 'config.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['descriptor'])) {
    echo json_encode(['success' => false, 'message' => 'Descriptor tidak ditemukan']);
    exit;
}

$inputDescriptor = $data['descriptor'];

try {
    $stmt = $pdo->query("SELECT id, name, face_descriptor FROM users");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $bestMatch = null;
    $minDistance = PHP_FLOAT_MAX;
    $threshold = 0.6; // Threshold untuk match

    foreach ($users as $user) {
        $storedDescriptor = json_decode($user['face_descriptor'], true);
        $distance = euclideanDistance($inputDescriptor, $storedDescriptor);

        if ($distance < $minDistance && $distance < $threshold) {
            $minDistance = $distance;
            $bestMatch = $user;
        }
    }

    if ($bestMatch) {
        echo json_encode([
            'success' => true,
            'match' => true,
            'user' => ['id' => $bestMatch['id'], 'name' => $bestMatch['name']],
            'distance' => $minDistance
        ]);
    } else {
        echo json_encode(['success' => true, 'match' => false, 'message' => 'Wajah tidak dikenali']);
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

function euclideanDistance($arr1, $arr2)
{
    $sum = 0;
    for ($i = 0; $i < count($arr1); $i++) {
        $sum += pow($arr1[$i] - $arr2[$i], 2);
    }
    return sqrt($sum);
}
?>