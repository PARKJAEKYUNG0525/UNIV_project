<?php
session_start();
require_once 'config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // 트랜잭션 시작 (자동 커밋 해제)
    $conn->autocommit(false);

    $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
    $password = $_POST['password'];
    $confirm_password = $_POST['confirm_password'];
    $name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING);
    $phone = filter_input(INPUT_POST, 'phone', FILTER_SANITIZE_STRING);
    $zipcode = filter_input(INPUT_POST, 'zipcode', FILTER_SANITIZE_STRING);
    $address = filter_input(INPUT_POST, 'address', FILTER_SANITIZE_STRING);
    $address_detail = filter_input(INPUT_POST, 'addressDetail', FILTER_SANITIZE_STRING);
    $marketing_agree = isset($_POST['term3']) ? 1 : 0;

    if (empty($email) || empty($password) || empty($name) || empty($phone) || 
        empty($zipcode) || empty($address) || empty($address_detail)) {
        $_SESSION['error'] = "모든 필수 항목을 입력해주세요.";
        header("Location: Register.php");
        exit();
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $_SESSION['error'] = "유효한 이메일 주소를 입력해주세요.";
        header("Location: Register.php");
        exit();
    }

    if (strlen($password) < 8 || !preg_match('/[A-Za-z]/', $password) || 
        !preg_match('/[0-9]/', $password) || !preg_match('/[^A-Za-z0-9]/', $password)) {
        $_SESSION['error'] = "비밀번호는 8자 이상이며, 영문, 숫자, 특수문자를 포함해야 합니다.";
        header("Location: Register.php");
        exit();
    }

    if ($password !== $confirm_password) {
        $_SESSION['error'] = "비밀번호가 일치하지 않습니다.";
        header("Location: Register.php");
        exit();
    }

    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $_SESSION['error'] = "이미 등록된 이메일 주소입니다.";
        header("Location: Register.php");
        exit();
    }

    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $conn->prepare("INSERT INTO users (email, password, name, phone, zipcode, address, address_detail, marketing_agree) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sssssssi", $email, $hashed_password, $name, $phone, $zipcode, $address, $address_detail, $marketing_agree);

    if ($stmt->execute()) {
        $conn->commit();
        $_SESSION['success'] = "회원가입이 완료되었습니다. 로그인해주세요.";
        header("Location: login.html");
        exit();
    } else {
        $conn->rollback();
        $_SESSION['error'] = "회원가입 중 오류가 발생했습니다. 다시 시도해주세요. 에러: " . $stmt->error;
        header("Location: Register.php");
        exit();
    }

    $stmt->close();
} else {
    header("Location: Register.php");
    exit();
}

$conn->close();
?>
