<?php
// Register.php 파일 (원래 Register.html이었는데, PHP로 바꿔야 세션 사용 가능)
session_start();
?>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>회원가입</title>
    <!-- 필요하면 CSS, JS 링크 추가 -->
</head>
<body>
    <div class="signup-container">
        <!-- 에러 메시지 -->
        <?php if(isset($_SESSION['error'])): ?>
            <div class="alert alert-danger">
                <?php 
                    echo htmlspecialchars($_SESSION['error']); 
                    unset($_SESSION['error']);
                ?>
            </div>
        <?php endif; ?>

        <!-- 성공 메시지 -->
        <?php if(isset($_SESSION['success'])): ?>
            <div class="alert alert-success">
                <?php 
                    echo htmlspecialchars($_SESSION['success']); 
                    unset($_SESSION['success']);
                ?>
            </div>
        <?php endif; ?>

        <!-- 회원가입 폼 -->
        <form action="register_process.php" method="POST">
            <input type="email" name="email" placeholder="이메일" required>
            <input type="password" name="password" placeholder="비밀번호" required>
            <input type="password" name="confirm_password" placeholder="비밀번호 확인" required>
            <input type="text" name="name" placeholder="이름" required>
            <input type="text" name="phone" placeholder="전화번호" required>
            <input type="text" name="zipcode" placeholder="우편번호" required>
            <input type="text" name="address" placeholder="주소" required>
            <input type="text" name="addressDetail" placeholder="상세주소" required>
            <label><input type="checkbox" name="term3" value="1"> 마케팅 수신 동의 (선택)</label>
            <button type="submit">회원가입</button>
        </form>
    </div>
</body>
</html>
