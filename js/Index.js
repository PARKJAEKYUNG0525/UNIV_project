// 슬라이더 기능
document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;
    
    // 첫 번째 슬라이드 활성화
    slides[0].classList.add('active');
    
    // 슬라이드 자동 전환
    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }
    
    // 5초마다 슬라이드 전환
    setInterval(nextSlide, 5000);
    
    // 서비스 예약 기능
    window.bookService = function(serviceName) {
        const modal = document.createElement('div');
        modal.classList.add('modal');
        
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-button">&times;</span>
                <h2>${serviceName} 예약</h2>
                <form id="booking-form">
                    <input type="text" placeholder="이름" required>
                    <input type="tel" placeholder="전화번호" required>
                    <input type="email" placeholder="이메일" required>
                    <input type="date" placeholder="날짜" required>
                    <select required>
                        <option value="">시간 선택</option>
                        <option value="09:00">오전 9:00</option>
                        <option value="12:00">오후 12:00</option>
                        <option value="15:00">오후 3:00</option>
                        <option value="18:00">오후 6:00</option>
                    </select>
                    <textarea placeholder="특별 요청사항"></textarea>
                    <button type="submit" class="btn">예약 확인</button>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // 모달 닫기 버튼
        const closeButton = modal.querySelector('.close-button');
        closeButton.addEventListener('click', function() {
            document.body.removeChild(modal);
        });
        
        // 모달 외부 클릭 시 닫기
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                document.body.removeChild(modal);
            }
        });
        
        // 폼 제출 이벤트
        const form = modal.querySelector('#booking-form');
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            alert(`${serviceName} 예약이 성공적으로 접수되었습니다. 확인 메일을 발송해 드리겠습니다.`);
            document.body.removeChild(modal);
        });
    };
    
    // 스크롤 애니메이션
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.feature, .service, .review-item');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.classList.add('fade-in');
            }
        });
    };
    
    // 스크롤 이벤트 리스너 추가
    window.addEventListener('scroll', animateOnScroll);
    // 초기 로드 시에도 애니메이션 실행
    animateOnScroll();
});

// 모달 스타일 추가
const style = document.createElement('style');
style.textContent = `
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;
    }
    
    .modal-content {
        background-color: white;
        padding: 30px;
        border-radius: 10px;
        max-width: 500px;
        width: 90%;
        position: relative;
    }
    
    .close-button {
        position: absolute;
        top: 10px;
        right: 15px;
        font-size: 24px;
        cursor: pointer;
    }
    
    #booking-form {
        display: flex;
        flex-direction: column;
    }
    
    #booking-form input,
    #booking-form select,
    #booking-form textarea {
        margin-bottom: 15px;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 5px;
    }
    
    #booking-form textarea {
        height: 100px;
        resize: vertical;
    }
    
    .fade-in {
        animation: fadeIn 0.8s ease forwards;
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

document.head.appendChild(style);

// 로그인 상태 확인 및 UI 업데이트 함수
function checkLoginStatus() {
    // 로컬 스토리지에서 사용자 데이터 가져오기
    const userDataStr = localStorage.getItem('userData');
    
    if (userDataStr) {
        try {
            const userData = JSON.parse(userDataStr);
            
            // 로그인 상태이면 네비게이션 메뉴 업데이트
            if (userData.isLoggedIn) {
                updateNavigationForLoggedIn(userData);
                return true;
            }
        } catch (error) {
            console.error('사용자 데이터 파싱 오류:', error);
            // 오류 발생 시 로컬 스토리지 데이터 삭제
            localStorage.removeItem('userData');
        }
    }
    
    // 로그인 상태가 아니거나 오류 발생 시 기본 네비게이션 표시
    updateNavigationForLoggedOut();
    return false;
}

// 로그인 상태일 때 네비게이션 업데이트
function updateNavigationForLoggedIn(userData) {
    const navList = document.querySelector('nav ul');
    
    // 로그인 메뉴 아이템 찾기
    const loginItem = navList.querySelector('li:last-child');
    
    if (loginItem) {
        // 로그인 메뉴 대신 드롭다운 메뉴로 변경
        loginItem.innerHTML = `
            <div class="user-menu">
                <span class="user-name">${userData.name}</span>
                <div class="dropdown-menu">
                    <a href="mypage.html">마이페이지</a>
                    <a href="reservations.html">예약 내역</a>
                    <a href="#" id="logout-button">로그아웃</a>
                </div>
            </div>
        `;
        
        // 로그아웃 버튼에 이벤트 리스너 추가
        const logoutButton = document.getElementById('logout-button');
        if (logoutButton) {
            logoutButton.addEventListener('click', function(e) {
                e.preventDefault();
                logout();
            });
        }
        
        // 사용자 메뉴 드롭다운 토글 이벤트 추가
        const userMenu = document.querySelector('.user-menu');
        if (userMenu) {
            userMenu.addEventListener('click', function(e) {
                this.classList.toggle('active');
            });
            
            // 문서 클릭 시 드롭다운 메뉴 닫기
            document.addEventListener('click', function(e) {
                if (!userMenu.contains(e.target)) {
                    userMenu.classList.remove('active');
                }
            });
        }
    }
}

// 로그아웃 상태일 때 네비게이션 업데이트
function updateNavigationForLoggedOut() {
    const navList = document.querySelector('nav ul');
    const lastItem = navList.querySelector('li:last-child');
    
    // 마지막 항목이 로그인 버튼이 아니면 변경
    if (lastItem && lastItem.querySelector('a').getAttribute('href') !== 'login.html') {
        lastItem.innerHTML = '<a href="login.html">로그인</a>';
    }
}

// 로그아웃 함수
function logout() {
    // 로컬 스토리지에서 사용자 데이터 삭제
    localStorage.removeItem('userData');
    
    // 네비게이션 업데이트
    updateNavigationForLoggedOut();
    
    alert('로그아웃되었습니다.');
    
    // 홈페이지로 리다이렉트
    window.location.href = 'index.html';
}

// 페이지 로드 시 로그인 상태 확인
document.addEventListener('DOMContentLoaded', function() {
    // 기존 DOMContentLoaded 이벤트 핸들러가 있으므로 주의 필요
    // 로그인 상태 확인 및 UI 업데이트
    checkLoginStatus();
});

// 스크롤 시 헤더 배경색 변경
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 10) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// 섹션 스크롤 기능
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        window.scrollTo({
            top: section.offsetTop - 80,
            behavior: 'smooth'
        });
    }
}

// 스크롤 이벤트 리스너
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        scrollToSection(targetId);
    });
});

// 옵션 카드 이벤트 리스너
document.querySelectorAll('.option-card').forEach(card => {
    card.addEventListener('click', function() {
        this.classList.toggle('selected');
    });
});

// 연락처 폼 제출 이벤트
document.querySelector('.contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('문의가 성공적으로 접수되었습니다. 빠른 시일 내에 답변 드리겠습니다.');
    this.reset();
});