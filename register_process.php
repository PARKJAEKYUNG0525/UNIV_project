<?php
// register_process.php - 회원가입 처리

// 세션 시작
session_start();

// 데이터베이스 연결 파일 포함
require_once 'config.php';

// POST 요청인지 확인
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // 폼에서 전송된 데이터 받기
    $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
    $password = $_POST['password'];
    $confirm_password = $_POST['confirm_password'];
    $name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING);
    $phone = filter_input(INPUT_POST, 'phone', FILTER_SANITIZE_STRING);
    $zipcode = filter_input(INPUT_POST, 'zipcode', FILTER_SANITIZE_STRING);
    $address = filter_input(INPUT_POST, 'address', FILTER_SANITIZE_STRING);
    $address_detail = filter_input(INPUT_POST, 'addressDetail', FILTER_SANITIZE_STRING);
    $marketing_agree = isset($_POST['term3']) ? 1 : 0;
    
    // 필수 필드 검증
    if (empty($email) || empty($password) || empty($name) || empty($phone) || 
        empty($zipcode) || empty($address) || empty($address_detail)) {
        $_SESSION['error'] = "모든 필수 항목을 입력해주세요.";
        header("Location: Register.html");
        exit();
    }
    
    // 이메일 형식 검증
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $_SESSION['error'] = "유효한 이메일 주소를 입력해주세요.";
        header("Location: Register.html");
        exit();
    }
    
    // 비밀번호 검증 (8자 이상, 영문/숫자/특수문자 포함)
    if (strlen($password) < 8 || !preg_match('/[A-Za-z]/', $password) || 
        !preg_match('/[0-9]/', $password) || !preg_match('/[^A-Za-z0-9]/', $password)) {
        $_SESSION['error'] = "비밀번호는 8자 이상이며, 영문, 숫자, 특수문자를 포함해야 합니다.";
        header("Location: Register.html");
        exit();
    }
    
    // 비밀번호 확인 일치 검증
    if ($password !== $confirm_password) {
        $_SESSION['error'] = "비밀번호가 일치하지 않습니다.";
        header("Location: Register.html");
        exit();
    }
    
    // 이메일 중복 확인
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $_SESSION['error'] = "이미 등록된 이메일 주소입니다.";
        header("Location: Register.html");
        exit();
    }
    
    // 비밀번호 해싱
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    
    // 데이터베이스에 사용자 정보 저장
    $stmt = $conn->prepare("INSERT INTO users (email, password, name, phone, zipcode, address, address_detail, marketing_agree) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sssssssi", $email, $hashed_password, $name, $phone, $zipcode, $address, $address_detail, $marketing_agree);
    
    if ($stmt->execute()) {
        // 회원가입 성공
        $_SESSION['success'] = "회원가입이 완료되었습니다. 로그인해주세요.";
        header("Location: login.html");
        exit();
    } else {
        // 회원가입 실패
        $_SESSION['error'] = "회원가입 중 오류가 발생했습니다. 다시 시도해주세요.";
        header("Location: Register.html");
        exit();
    }
    
    $stmt->close();
} else {
    // GET 요청일 경우 회원가입 페이지로 리다이렉트
    header("Location: Register.html");
    exit();
}

$conn->close();
?>