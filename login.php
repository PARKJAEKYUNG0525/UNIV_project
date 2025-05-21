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

// 디버깅을 위해 들어온 데이터 확인
$input = file_get_contents('php://input');
$posted_data = $_POST;

// POST 데이터 확인
$email = isset($_POST['email']) ? $_POST['email'] : '';
$password = isset($_POST['password']) ? $_POST['password'] : '';

// 폼 데이터가 없으면 JSON 입력 확인
if (empty($email) || empty($password)) {
    $json_data = json_decode($input, true);
    if ($json_data) {
        $email = $json_data['email'] ?? '';
        $password = $json_data['password'] ?? '';
    }
}

if (!$email || !$password) {
    echo json_encode([
        'success' => false, 
        'message' => '이메일과 비밀번호를 입력해주세요.',
        'debug' => [
            'post' => $posted_data,
            'input' => $input
        ]
    ]);
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
    // 디버깅 정보 수집 (프로덕션에서는 제거하세요)
    $debug_info = [
        'user_found' => true,
        'stored_password' => substr($user['password'], 0, 10) . '...',
        'password_length' => strlen($user['password']),
        'is_hashed' => (substr($user['password'], 0, 4) === '$2y$')
    ];
    
    $login_success = false;
    
    // PHP 7.x 호환을 위해 str_starts_with 대신 substr 사용
    if (substr($user['password'], 0, 4) === '$2y$') {
        // 해시된 비밀번호
        if (password_verify($password, $user['password'])) {
            $login_success = true;
            $debug_info['verify_method'] = 'hash_verified';
        } else {
            $debug_info['verify_method'] = 'hash_failed';
        }
    } else {
        // 평문 비밀번호
        if ($password === $user['password']) {
            $login_success = true;
            $debug_info['verify_method'] = 'plain_match';
        } else {
            $debug_info['verify_method'] = 'plain_failed';
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
        echo json_encode([
            'success' => false, 
            'message' => '이메일 또는 비밀번호가 틀렸습니다.',
            'debug' => $debug_info
        ]);
    }
} else {
    // 이메일 없을 때도 비밀번호 검증 시도 (타이밍 공격 방지)
    password_verify($password, '$2y$10$usesomesillystringforsalt$');
    echo json_encode([
        'success' => false, 
        'message' => '이메일 또는 비밀번호가 틀렸습니다.',
        'debug' => ['user_found' => false]
    ]);
}

exit;