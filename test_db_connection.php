<?php
require_once 'config.php';

if ($conn->ping()) {
    echo "데이터베이스 연결 성공!";
    
    // 테이블 확인
    $result = $conn->query("SHOW TABLES");
    if ($result) {
        echo "<br>데이터베이스 테이블 목록:<br>";
        while ($row = $result->fetch_row()) {
            echo "- " . $row[0] . "<br>";
        }
    }
    
    // users 테이블 확인
    $result = $conn->query("SELECT COUNT(*) as count FROM users");
    if ($result) {
        $row = $result->fetch_assoc();
        echo "<br>users 테이블에 " . $row['count'] . "개의 계정이 있습니다.";
    } else {
        echo "<br>users 테이블 조회 실패: " . $conn->error;
    }

    // 계정 정보 출력
    echo "<br><br>[계정 정보 목록]<br>";
    $result = $conn->query("SELECT id, email, name, password FROM users");
    if ($result) {
        while ($user = $result->fetch_assoc()) {
            echo "- ID: {$user['id']}, Email: {$user['email']}, Name: {$user['name']}, Password: {$user['password']}<br>";
        }
    } else {
        echo "<br>계정 정보 조회 실패: " . $conn->error;
    }
    
} else {
    echo "데이터베이스 연결 실패: " . $conn->error;
}
?>
