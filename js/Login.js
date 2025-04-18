document.querySelector('.login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // 폼 데이터 가져오기
    const email = this.querySelector('input[type="text"]').value;
    const password = this.querySelector('input[type="password"]').value;
    const rememberMe = document.getElementById('remember').checked;

    // 간단한 유효성 검사
    if (!email || !password) {
        alert('이메일과 비밀번호를 모두 입력해주세요.');
        return;
    }

    // 실제 서비스에서는 서버로 로그인 요청을 보내야 합니다.
    // 여기서는 로컬 스토리지를 사용한 간단한 로그인 구현
    
    // 로컬 스토리지에 사용자 정보 저장 (개발용)
    // 실제 서비스에서는 서버에서 인증 후 토큰을 발급받아 저장해야 합니다.
    const userData = {
        email: email,
        name: email.split('@')[0], // 이메일에서 아이디 부분만 추출하여 이름으로 사용
        isLoggedIn: true,
        loginTime: new Date().toISOString(),
        loginMethod: 'email'
    };
    
    // 로컬 스토리지에 데이터 저장
    localStorage.setItem('userData', JSON.stringify(userData));
    
    // 홈페이지로 리다이렉트
    alert('로그인되었습니다.');
    window.location.href = 'index.html';
});

// 비밀번호 찾기 기능 (현재는 더미 기능)
document.querySelector('.forgot-password').addEventListener('click', function(e) {
    e.preventDefault();
    alert('비밀번호 찾기 기능은 현재 개발 중입니다.');

});

// 소셜 로그인 설정 및 초기화
const socialLoginConfig = {
    kakao: {
        clientId: 'eb31f1aa06b7c681b90bd683dd14d439', // 발급받은 REST API 키
        redirectUri: 'http://localhost:5500/oauth/callback/callback.html?provider=kakao',
        authUrl: 'https://kauth.kakao.com/oauth/authorize'
    },
    naver: {
        clientId: 'yWFqynV5khawkoFw5L36',   // 발급받은 클라이언트 ID
        redirectUri: 'http://localhost:5500/oauth/callback/callback.html?provider=naver',
        authUrl: 'https://nid.naver.com/oauth2.0/authorize',
        state: Math.random().toString(36).substring(2)
    },
    google: {
        clientId: '248080204580-l8sb8c8n5rpp6fad2rjmidpb7riv5igj.apps.googleusercontent.com', // 발급받은 클라이언트 ID
        redirectUri: 'http://localhost:5500/oauth/callback/callback.html?provider=google',
        authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
        scope: 'email profile'
    }
};

// 카카오 로그인 초기화 및 처리
function initKakaoLogin() {
    // 카카오 SDK를 동적으로 로드
    const script = document.createElement('script');
    script.src = 'https://developers.kakao.com/sdk/js/kakao.js';
    script.async = true;
    
    script.onload = function() {
        // Kakao SDK 초기화
        Kakao.init(socialLoginConfig.kakao.clientId);
        console.log("Kakao SDK initialized:", Kakao.isInitialized());
    };
    
    document.head.appendChild(script);
}

// 네이버 로그인 초기화
function initNaverLogin() {
    const script = document.createElement('script');
    script.src = 'https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.2.js';
    script.async = true;
    document.head.appendChild(script);
}

// 구글 로그인 초기화
function initGoogleLogin() {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    document.head.appendChild(script);
}

// 로딩 표시기 생성
function createLoadingIndicator(provider) {
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'social-loading';
    loadingIndicator.style.position = 'fixed';
    loadingIndicator.style.top = '0';
    loadingIndicator.style.left = '0';
    loadingIndicator.style.width = '100%';
    loadingIndicator.style.height = '100%';
    loadingIndicator.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    loadingIndicator.style.display = 'flex';
    loadingIndicator.style.flexDirection = 'column';
    loadingIndicator.style.alignItems = 'center';
    loadingIndicator.style.justifyContent = 'center';
    loadingIndicator.style.zIndex = '9999';
    
    const spinner = document.createElement('div');
    spinner.className = 'spinner';
    spinner.style.border = '4px solid rgba(255, 255, 255, 0.3)';
    spinner.style.borderRadius = '50%';
    spinner.style.borderTop = '4px solid #ffffff';
    spinner.style.width = '40px';
    spinner.style.height = '40px';
    spinner.style.animation = 'spin 1s linear infinite';
    
    const message = document.createElement('p');
    message.textContent = `${provider} 로그인 처리 중...`;
    message.style.color = '#ffffff';
    message.style.marginTop = '20px';
    message.style.fontFamily = 'Noto Sans KR, sans-serif';
    
    loadingIndicator.appendChild(spinner);
    loadingIndicator.appendChild(message);
    
    // 애니메이션 스타일 추가
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(loadingIndicator);
    return loadingIndicator;
}


// 소셜 로그인 함수
function initiateSocialLogin(provider) {
    if (provider === 'kakao') {
        // 카카오 SDK가 로드되었는지 확인
        if (typeof Kakao !== 'undefined' && Kakao.isInitialized()) {
            // SDK를 사용한 로그인
            Kakao.Auth.authorize({
                redirectUri: socialLoginConfig.kakao.redirectUri,
                throughTalk: true // 카카오톡을 통한 로그인 활성화
            });
        } else {
            // SDK 없이 URL로 직접 로그인
            const config = socialLoginConfig[provider];
            const authUrl = config.authUrl;
            const params = new URLSearchParams({
                client_id: config.clientId,
                redirect_uri: config.redirectUri,
                response_type: 'code'
            });
            window.location.href = `${authUrl}?${params.toString()}`;
        }
        return;
    }
    
    const config = socialLoginConfig[provider];
    if (!config) {
        console.error(`Provider ${provider} is not configured.`);
        return;
    }

    // OAuth 요청 URL 생성
    let authUrl = config.authUrl;
    const params = new URLSearchParams({
        client_id: config.clientId,
        redirect_uri: config.redirectUri,
        response_type: 'code'
    });

    // 추가 파라미터 설정
    if (provider === 'google') {
        params.append('scope', config.scope);
    } else if (provider === 'naver') {
        params.append('state', config.state);
        // 네이버 로그인 상태를 세션 스토리지에 저장
        sessionStorage.setItem('naverState', config.state);
    }

    // 최종 URL로 리다이렉트
    window.location.href = `${authUrl}?${params.toString()}`;
}

// 소셜 로그인 버튼 이벤트 처리
document.querySelectorAll('.social-icon').forEach(icon => {
    icon.addEventListener('click', function(e) {
        e.preventDefault();
        
        let provider = '';
        if (this.classList.contains('kakao')) {
            provider = 'kakao';
        } else if (this.classList.contains('naver')) {
            provider = 'naver';
        } else if (this.classList.contains('google')) {
            provider = 'google';
        }
        
        if (provider) {
            try {
                initiateSocialLogin(provider);
            } catch (error) {
                console.error(`Error initiating ${provider} login:`, error);
                alert(`${provider} 로그인 중 오류가 발생했습니다. 나중에 다시 시도해주세요.`);
            }
        }
    });
});



// 페이지 로드 시 초기화 및 콜백 처리
document.addEventListener('DOMContentLoaded', function() {
    // 로그인 초기화
    initKakaoLogin();
    initNaverLogin();
    initGoogleLogin();

});