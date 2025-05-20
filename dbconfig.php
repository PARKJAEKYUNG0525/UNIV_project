<?php
// 데이터베이스 연결 정보
$servername = "localhost";
$username = "root";         // MySQL 기본 사용자명 (XAMPP 기본값)
$password = "";             // XAMPP의 기본 MySQL 비밀번호는 비어있음
$dbname = "user";           // 수정: users → user (기존에 있는 데이터베이스 이름)

try {
    $conn = new PDO("mysql:host=".$servername.";port=3308;".$dbname, $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->exec("set names utf8mb4");
    echo "DB 연결 성공";
} catch(PDOException $e) {
    echo "Connection failed: ". $e->getMessage();
}
?>