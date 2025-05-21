<?php
require_once 'config.php';

// 테스트 사용자 정보
$email = 'test@example.com';
$password = 'password123';
$name = '테스트 사용자';

// 비밀번호 해싱
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

// 기존 사용자가 있는지 확인
$check_stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
$check_stmt->bind_param("s", $email);
$check_stmt->execute();
$result = $check_stmt->get_result();

if ($result->num_rows > 0) {
    // 기존 사용자가 있으면 업데이트
    $update_stmt = $conn->prepare("UPDATE users SET password = ?, name = ? WHERE email = ?");
    $update_stmt->bind_param("sss", $hashed_password, $name, $email);
    
    if ($update_stmt->execute()) {
        echo "테스트 사용자 정보가 업데이트되었습니다.<br>";
        echo "이메일: $email<br>";
        echo "비밀번호: password123<br>";
        echo "이름: $name<br>";
    } else {
        echo "오류: " . $update_stmt->error;
    }
    $update_stmt->close();
} else {
    // 새 사용자 추가
    $insert_stmt = $conn->prepare("INSERT INTO users (email, password, name) VALUES (?, ?, ?)");
    $insert_stmt->bind_param("sss", $email, $hashed_password, $name);
    
    if ($insert_stmt->execute()) {
        echo "테스트 사용자가 성공적으로 추가되었습니다.<br>";
        echo "이메일: $email<br>";
        echo "비밀번호: password123<br>";
        echo "이름: $name<br>";
    } else {
        echo "오류: " . $insert_stmt->error;
    }
    $insert_stmt->close();
}

$check_stmt->close();
$conn->close();
?>