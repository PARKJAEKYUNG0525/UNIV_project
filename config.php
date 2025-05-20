<?php
// config.php - 데이터베이스 연결 설정

// 데이터베이스 접속 정보
$db_host = 'localhost';       // 데이터베이스 호스트
$db_user = 'cleanuser';       // 데이터베이스 사용자 이름
$db_password = 'securepass';  // 데이터베이스 비밀번호
$db_name = 'clean4u_db';      // 데이터베이스 이름

// 데이터베이스 연결
$conn = new mysqli($db_host, $db_user, $db_password, $db_name);

// 연결 확인
if ($conn->connect_error) {
    die("데이터베이스 연결 실패: " . $conn->connect_error);
}

// 문자셋 설정 (한글 처리를 위해 필요)
$conn->set_charset("utf8mb4");

// 연결 성공 메시지
//echo "데이터베이스 연결 성공!";
?>
