<?php
require_once 'config.php';

// 1. 기존 사용자 계정 목록 표시
echo "<h3>현재 사용자 계정 목록</h3>";
$result = $conn->query("SELECT id, email, name FROM users");

if ($result->num_rows > 0) {
    echo "<table border='1'>
          <tr><th>ID</th><th>이메일</th><th>이름</th><th>작업</th></tr>";
    
    while ($row = $result->fetch_assoc()) {
        echo "<tr>
              <td>" . $row['id'] . "</td>
              <td>" . $row['email'] . "</td>
              <td>" . $row['name'] . "</td>
              <td><a href='?reset_id=" . $row['id'] . "'>이 계정 비밀번호 재설정</a></td>
              </tr>";
    }
    echo "</table>";
} else {
    echo "사용자 계정이 없습니다.";
}

// 2. 선택한 사용자의 비밀번호 재설정
if (isset($_GET['reset_id'])) {
    $id = $_GET['reset_id'];
    $new_password = "password123"; // 모든 계정의 비밀번호를 이것으로 재설정
    $hash = password_hash($new_password, PASSWORD_DEFAULT);
    
    $stmt = $conn->prepare("UPDATE users SET password = ? WHERE id = ?");
    $stmt->bind_param("si", $hash, $id);
    
    if ($stmt->execute()) {
        echo "<div style='color:green; margin-top:15px;'>
              ID " . $id . " 계정의 비밀번호가 재설정되었습니다.<br>
              새 비밀번호: " . $new_password . "
              </div>";
    } else {
        echo "<div style='color:red; margin-top:15px;'>
              비밀번호 재설정 실패: " . $stmt->error . "</div>";
    }
}
?>

<h3>로그인 테스트</h3>
<form method="post" action="">
    <div>
        <label>이메일:</label>
        <input type="email" name="email" required>
    </div>
    <div style="margin-top:10px;">
        <label>비밀번호:</label>
        <input type="password" name="password" required>
    </div>
    <div style="margin-top:10px;">
        <button type="submit" name="login">로그인 테스트</button>
    </div>
</form>

<?php
// 3. 로그인 테스트
if (isset($_POST['login'])) {
    $email = $_POST['email'];
    $password = $_POST['password'];
    
    $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    
    if ($user && password_verify($password, $user['password'])) {
        echo "<div style='color:green; margin-top:15px;'>
              로그인 성공!<br>
              사용자 이름: " . $user['name'] . "<br>
              이메일: " . $user['email'] . "
              </div>";
    } else {
        echo "<div style='color:red; margin-top:15px;'>
              로그인 실패: 이메일 또는 비밀번호가 틀렸습니다.</div>";
        
        // 디버그 정보
        if ($user) {
            echo "<div style='color:blue; margin-top:5px; font-size:small;'>
                  저장된 해시: " . $user['password'] . "<br>
                  비밀번호 검증 결과: " . (password_verify($password, $user['password']) ? "성공" : "실패") . "
                  </div>";
        } else {
            echo "<div style='color:blue; margin-top:5px; font-size:small;'>
                  해당 이메일의 사용자를 찾을 수 없음</div>";
        }
    }
}
?>