<!-- <?php
// login.php

require_once 'config.php'; // DB 연결 설정 파일 포함

header('Content-Type: application/json');

$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

if (!$email || !$password) {
    echo json_encode(['success' => false, 'message' => '이메일과 비밀번호를 입력해주세요.']);
    exit;
}

$stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if ($user && password_verify($password, $user['password'])) {
    echo json_encode([
        'success' => true,
        'userData' => [
            'email' => $user['email'],
            'name' => $user['name'],
            'isLoggedIn' => true,
            'loginTime' => date('c'),
            'loginMethod' => 'email'
        ]
    ]);
} else {
    echo json_encode(['success' => false, 'message' => '이메일 또는 비밀번호가 틀렸습니다.']);
} -->
