// 소셜 로그인 설정
const socialLoginConfig = {
  kakao: {
      clientId: 'eb31f1aa06b7c681b90bd683dd14d439',
      redirectUri: 'http://localhost:5500/oauth/callback/callback.html?provider=kakao',
      authUrl: 'https://kauth.kakao.com/oauth/authorize',
      scope: 'profile_nickname' // 카카오 권한 범위
  },
  naver: {
      clientId: 'yWFqynV5khawkoFw5L36',
      redirectUri: 'http://localhost:5500/oauth/callback/callback.html?provider=naver',
      authUrl: 'https://nid.naver.com/oauth2.0/authorize',
      state: generateState() // CSRF 방지를 위한 상태 값
  },
  google: {
      clientId: '248080204580-l8sb8c8n5rpp6fad2rjmidpb7riv5igj.apps.googleusercontent.com',
      redirectUri: 'http://localhost:5500/oauth/callback/callback.html?provider=google',
      authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
      scope: 'email profile' // 구글 권한 범위
  }
};

// CSRF 방지를 위한 상태 생성 함수
function generateState() {
  const randomString = Math.random().toString(36).substring(2, 12);
  const state = randomString + new Date().getTime();
  // 네이버 로그인 상태를 세션 스토리지에 저장
  sessionStorage.setItem('naverState', state);
  return state;
}

// 소셜 로그인 버튼 이벤트 리스너 설정
document.addEventListener('DOMContentLoaded', function() {
  // 카카오 로그인 초기화
  if (typeof Kakao !== 'undefined') {
      Kakao.init(socialLoginConfig.kakao.clientId);
      console.log("Kakao SDK initialized:", Kakao.isInitialized());
  }
  
  // 카카오 로그인 버튼
  document.querySelector('.social-icon.kakao').addEventListener('click', function(e) {
      e.preventDefault();
      
      if (typeof Kakao === 'undefined') {
          console.error('Kakao SDK가 로드되지 않았습니다.');
          alert('카카오 로그인을 사용할 수 없습니다. 잠시 후 다시 시도해주세요.');
          return;
      }
      
      const kakaoConfig = socialLoginConfig.kakao;
      const kakaoAuthUrl = `${kakaoConfig.authUrl}?client_id=${kakaoConfig.clientId}&redirect_uri=${encodeURIComponent(kakaoConfig.redirectUri)}&response_type=code&scope=${kakaoConfig.scope}`;
      
      console.log("카카오 로그인 URL:", kakaoAuthUrl);
      window.location.href = kakaoAuthUrl;
  });
  
  // 네이버 로그인 버튼
  document.querySelector('.social-icon.naver').addEventListener('click', function(e) {
      e.preventDefault();
      
      const naverConfig = socialLoginConfig.naver;
      const state = naverConfig.state;
      const naverAuthUrl = `${naverConfig.authUrl}?client_id=${naverConfig.clientId}&redirect_uri=${encodeURIComponent(naverConfig.redirectUri)}&response_type=code&state=${state}`;
      
      console.log("네이버 로그인 URL:", naverAuthUrl);
      window.location.href = naverAuthUrl;
  });
  
  // 구글 로그인 버튼
  document.querySelector('.social-icon.google').addEventListener('click', function(e) {
      e.preventDefault();
      
      const googleConfig = socialLoginConfig.google;
      const googleAuthUrl = `${googleConfig.authUrl}?client_id=${googleConfig.clientId}&redirect_uri=${encodeURIComponent(googleConfig.redirectUri)}&response_type=code&scope=${encodeURIComponent(googleConfig.scope)}&access_type=offline`;
      
      console.log("구글 로그인 URL:", googleAuthUrl);
      window.location.href = googleAuthUrl;
  });
  
  // 테스트 계정 생성
  createTestAccount();
});

// 로그인 성공 후 처리 함수 (회원가입 또는 로그인 처리)
function handleSocialLoginSuccess(userData) {
  // 회원가입 또는 로그인 처리 로직
  // 실제로는 서버에 요청을 보내 처리해야 함
  localStorage.setItem('currentUser', JSON.stringify(userData));
  
  // 회원가입 성공 알림 및 메인 페이지로 이동
  alert(`${userData.name}님, 환영합니다! 로그인이 완료되었습니다.`);
  window.location.href = 'index.html';
}

// 전체 약관 동의 처리
document.getElementById('all-terms').addEventListener('change', function() {
  const checkboxes = document.querySelectorAll('.terms-item input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
      checkbox.checked = this.checked;
  });
});

// 개별 약관 체크 시 전체 약관 체크박스 상태 업데이트
const individualTerms = document.querySelectorAll('.terms-item input[type="checkbox"]:not(#all-terms)');
individualTerms.forEach(term => {
  term.addEventListener('change', function() {
      const allChecked = Array.from(individualTerms).every(t => t.checked);
      document.getElementById('all-terms').checked = allChecked;
  });
});

// 회원가입 폼 제출 이벤트 리스너
document.querySelector('.signup-form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  // 필수 입력 필드 값 가져오기
  const email = document.querySelector('input[type="email"]').value;
  const password = document.querySelector('input[type="password"]').value;
  const passwordConfirm = document.querySelectorAll('input[type="password"]')[1].value;
  const name = document.querySelector('input[placeholder="이름"]').value;
  const phone = document.querySelector('input[type="tel"]').value;
  const zipcode = document.getElementById('zipcode').value;
  const address = document.getElementById('address').value;
  const addressDetail = document.getElementById('addressDetail').value;
  
  // 필수 약관 동의 확인
  const term1Checked = document.getElementById('term1').checked;
  const term2Checked = document.getElementById('term2').checked;
  const marketingConsent = document.getElementById('term3').checked;
  
  // 유효성 검사
  let isValid = true;
  
  // 이메일 유효성 검사
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
      document.querySelector('input[type="email"]').parentElement.classList.add('error');
      isValid = false;
  } else {
      document.querySelector('input[type="email"]').parentElement.classList.remove('error');
  }
  
  // 비밀번호 유효성 검사
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  if (!passwordRegex.test(password)) {
      document.querySelector('input[type="password"]').parentElement.classList.add('error');
      isValid = false;
  } else {
      document.querySelector('input[type="password"]').parentElement.classList.remove('error');
  }
  
  // 비밀번호 확인
  if (password !== passwordConfirm) {
      document.querySelectorAll('input[type="password"]')[1].parentElement.classList.add('error');
      isValid = false;
  } else {
      document.querySelectorAll('input[type="password"]')[1].parentElement.classList.remove('error');
  }
  
  // 휴대폰 번호 유효성 검사
  const phoneRegex = /^01[016789]\d{7,8}$/;
  if (!phoneRegex.test(phone)) {
      document.querySelector('input[type="tel"]').parentElement.classList.add('error');
      isValid = false;
  } else {
      document.querySelector('input[type="tel"]').parentElement.classList.remove('error');
  }
  
  // 주소 확인
  if (!zipcode || !address || !addressDetail) {
      alert('주소를 모두 입력해주세요.');
      isValid = false;
  }
  
  // 필수 약관 동의 확인
  if (!term1Checked || !term2Checked) {
      alert('필수 약관에 동의해주세요.');
      isValid = false;
  }
  
  if (!isValid) {
      return;
  }
  
  // 이메일 중복 확인 (로컬 스토리지에 저장된 사용자 정보 확인)
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const isExistingUser = users.some(user => user.email === email);
  
  if (isExistingUser) {
      alert('이미 가입된 이메일입니다. 다른 이메일을 사용해주세요.');
      return;
  }
  
  // 사용자 정보 객체 생성
  const newUser = {
      email,
      password, // 실제 서비스에서는 암호화하여 저장해야 합니다.
      name,
      phone,
      address: {
          zipcode,
          address,
          addressDetail
      },
      marketingConsent,
      joinDate: new Date().toISOString()
  };
  
  // 사용자 정보 저장
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  
  // 회원가입 성공 메시지 및 로그인 페이지로 이동
  alert(`${name}님, 환영합니다! 회원가입이 완료되었습니다.`);
  window.location.href = 'login.html';
});

// 입력 필드 유효성 검사 (예시)
const emailInput = document.querySelector('input[type="email"]');
emailInput.addEventListener('blur', function() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = emailRegex.test(this.value);
  
  if (!isValid && this.value) {
      this.parentElement.classList.add('error');
  } else {
      this.parentElement.classList.remove('error');
  }
});

// 비밀번호 검사 (예시)
const passwordInput = document.querySelector('input[type="password"]');
passwordInput.addEventListener('blur', function() {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  const isValid = passwordRegex.test(this.value);
  
  if (!isValid && this.value) {
      this.parentElement.classList.add('error');
  } else {
      this.parentElement.classList.remove('error');
  }
});

// 로컬 테스트용 임시 함수
function testPostcodeSearch() {
  // 테스트 데이터
  const testData = {
    zonecode: '14097',
    address: '경기 안양시 만안구 성결대학로 테스트 주소',
    addressEnglish: 'Test Address, Manan-gu, Anyang-si, Korea'
  };
  
  // 주소 데이터 설정
  document.getElementById('zipcode').value = testData.zonecode;
  document.getElementById('address').value = testData.address;
  document.getElementById('addressDetail').focus();
  
  console.log('테스트 데이터가 입력되었습니다.');
}

// 우편번호 검색 버튼 클릭 이벤트 처리
document.getElementById('search-zipcode').addEventListener('click', function() {
  // 로컬 환경에서는 테스트 함수 사용, 서버 환경에서는 실제 서비스 사용
  if (window.location.protocol === 'file:') {
    console.log('로컬 환경에서 실행 중입니다. 테스트 함수를 사용합니다.');
    testPostcodeSearch();
  } else {
    console.log('서버 환경에서 실행 중입니다. 다음 우편번호 서비스를 사용합니다.');
    // 다음 우편번호 서비스 실행
    new daum.Postcode({
      oncomplete: function(data) {
        document.getElementById('zipcode').value = data.zonecode;
        document.getElementById('address').value = data.address;
        document.getElementById('addressDetail').focus();
      }
    }).open();
  }
});

// 로그인 체크 함수 (로그인 여부 확인)
function checkLoginStatus() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  return currentUser !== null;
}

// 로그아웃 함수
function logout() {
  localStorage.removeItem('currentUser');
  window.location.href = 'index.html';
}

// 로그인 함수
function login(email, password) {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
      // 비밀번호는 제외하고 사용자 정보 저장
      const { password, ...userWithoutPassword } = user;
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      return true;
  }
  
  return false;
}

// 현재 로그인한 사용자 정보 가져오기
function getCurrentUser() {
  return JSON.parse(localStorage.getItem('currentUser'));
}

// 로컬 스토리지에 기본 사용자 계정 생성 (테스트용)
function createTestAccount() {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  
  // 테스트 계정이 없는 경우에만 생성
  if (!users.some(user => user.email === 'test@example.com')) {
      const testUser = {
          email: 'test@example.com',
          password: 'Test1234!',
          name: '테스트 사용자',
          phone: '01012345678',
          address: {
              zipcode: '12345',
              address: '서울시 테스트구 테스트동',
              addressDetail: '123-456'
          },
          marketingConsent: true,
          joinDate: new Date().toISOString()
      };
      
      users.push(testUser);
      localStorage.setItem('users', JSON.stringify(users));
      console.log('테스트 계정이 생성되었습니다. 이메일: test@example.com, 비밀번호: Test1234!');
  }
}