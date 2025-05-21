<?php

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");  // 모든 도메인 허용 (개발용)
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    exit(0);
}

header("Access-Control-Allow-Origin: *");  // 모든 도메인 허용 (개발용)
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

session_start();
require_once 'config.php';

header('Content-Type: application/json');

$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

if (!$email || !$password) {
    echo json_encode(['success' => false, 'message' => '이메일과 비밀번호를 입력해주세요.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => '유효한 이메일 주소를 입력해주세요.']);
    exit;
}

$stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'DB 쿼리 준비 실패']);
    exit;
}
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if ($user) {
    // 로그인 검증 로직 수정
    $login_success = false;
    
    // 비밀번호가 해시된 경우
    if (str_starts_with($user['password'], '$2y$')) {
        if (password_verify($password, $user['password'])) {
            $login_success = true;
        }
    } 
    // 비밀번호가 평문인 경우
    else {
        if ($password === $user['password']) {
            $login_success = true;
        }
    }
    
    if ($login_success) {
        // 로그인 성공
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['email'] = $user['email'];

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
    }
} else {
    // 이메일 없을 때도 비밀번호 검증 시도 (타이밍 공격 방지)
    password_verify($password, '$2y$10$usesomesillystringforsalt$');
    echo json_encode(['success' => false, 'message' => '이메일 또는 비밀번호가 틀렸습니다.']);
}

exit;