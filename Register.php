<?php
// Register.html 파일의 시작 부분에 추가 (Register.php로 파일명 변경 필요)
session_start();
?>
<!DOCTYPE html>
<html lang="ko">
<head>
    <!-- 기존 head 내용 -->
</head>
<body>
    <div class="signup-container">
        <!-- 메시지 표시 영역 추가 -->
        <?php if(isset($_SESSION['error'])): ?>
            <div class="alert alert-danger">
                <?php 
                    echo $_SESSION['error']; 
                    unset($_SESSION['error']);
                ?>
            </div>
        <?php endif; ?>
        
        <?php if(isset($_SESSION['success'])): ?>
            <div class="alert alert-success">
                <?php 
                    echo $_SESSION['success']; 
                    unset($_SESSION['success']);
                ?>
            </div>
        <?php endif; ?>
        
        <?php if(isset($_SESSION['success'])): ?>
    ...
<?php endif; ?>

<!-- 여기부터 아래 코드 삽입 -->
<form action="register_process.php" method="POST">
    <input type="text" name="email" placeholder="이메일" required>
    <input type="password" name="password" placeholder="비밀번호" required>
    <input type="password" name="confirm_password" placeholder="비밀번호 확인" required>
    <input type="text" name="name" placeholder="이름" required>
    <input type="text" name="phone" placeholder="전화번호" required>
    <input type="text" name="zipcode" placeholder="우편번호" required>
    <input type="text" name="address" placeholder="주소" required>
    <input type="text" name="addressDetail" placeholder="상세주소" required>
    <label><input type="checkbox" name="term3"> 마케팅 수신 동의 (선택)</label>
    <button type="submit">회원가입</button>
</form>