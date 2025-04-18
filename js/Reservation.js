// FAQ 기능 추가
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // 현재 활성화된 FAQ 닫기
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // 현재 클릭한 아이템 토글
            item.classList.toggle('active');
        });
    });
});

// 기존 코드
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    section.scrollIntoView({ behavior: 'smooth' });
}

window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 0) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

function toggleMenu() {
    const navUl = document.querySelector("nav ul");
    navUl.classList.toggle("show");
}

    // 서비스 상세 정보 표시 함수
    function showService(serviceType) {
        // 모든 서비스 카드 숨기기
        const allServices = document.querySelectorAll('.service-detail');
        allServices.forEach(service => {
          service.classList.remove('active');
        });
        
        // 선택된 카드만 표시
        const selectedService = document.getElementById(serviceType + '-service');
        if (selectedService) {
          selectedService.classList.add('active');
        }
        
        // 옵션 카드 활성화 상태 변경
        const allOptions = document.querySelectorAll('.s-option-card');
        allOptions.forEach(option => {
          option.classList.remove('active');
        });
        
        // 클릭한 옵션 카드 활성화
        event.currentTarget.classList.add('active');
      }
      
      // 페이지 로드 시 첫 번째 서비스 표시
      window.onload = function() {
        const firstOption = document.querySelector('.s-option-card');
        if (firstOption) {
          firstOption.click();
        }
      };

// 예약 폼 기능
document.addEventListener('DOMContentLoaded', function() {
    // 서비스 카드 클릭 이벤트 처리
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('click', function() {
            // 예약 섹션으로 스크롤
            document.getElementById('reservation').scrollIntoView({ behavior: 'smooth' });
            
            // 선택한 서비스 유형 설정
            const serviceType = this.querySelector('h2').textContent.trim();
            const serviceSelect = document.getElementById('service-type');
            
            // 서비스 유형에 따라 select 옵션 선택
            switch(serviceType) {
                case '1회 청소':
                    serviceSelect.value = 'one-time';
                    break;
                case '정기 청소':
                    serviceSelect.value = 'regular';
                    break;
                case '구역 청소':
                    serviceSelect.value = 'area';
                    break;
            }
        });
    });
    
    // 구역 선택 클릭 이벤트
    const areaOptions = document.querySelectorAll('#section2 .option-card');
    areaOptions.forEach(option => {
        option.addEventListener('click', function() {
            // 현재 선택된 옵션 토글
            this.classList.toggle('selected');
        });
    });
    
    // 추가 서비스 선택 클릭 이벤트
    const additionalOptions = document.querySelectorAll('#section3 .extra-card');
    additionalOptions.forEach(option => {
        option.addEventListener('click', function() {
            // 현재 선택된 옵션 토글
            this.classList.toggle('selected');
            
            // 예약 폼의 해당 체크박스 선택/해제
            const optionText = this.textContent.trim();
            const checkbox = document.querySelector(`input[name="additional"][value="${getValueFromText(optionText)}"]`);
            if (checkbox) {
                checkbox.checked = this.classList.contains('selected');
            }
        });
    });
    
    // 옵션 텍스트를 value 값으로 변환
    function getValueFromText(text) {
        const valueMap = {
            '냉장고 청소': 'fridge',
            '창틀 청소': 'window',
            '세탁': 'laundry',
            '다림질': 'ironing',
            '쓰레기 배출': 'trash',
            '기상 알림': 'alarm'
        };
        return valueMap[text] || text.toLowerCase().replace(/\s+/g, '-');
    }
    
    // 예약 폼 제출 처리
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // 폼 유효성 검사
            if (validateForm()) {
                // 여기에 예약 데이터 처리 코드 추가 (API 호출 등)
                showConfirmationMessage();
                this.reset();
            }
        });
    }
    
    // 폼 유효성 검사 함수
    function validateForm() {
        const requiredFields = bookingForm.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('error');
                isValid = false;
            } else {
                field.classList.remove('error');
            }
        });
        
        return isValid;
    }
    
    // 확인 메시지 표시 함수
    function showConfirmationMessage() {
        const confirmationMsg = document.createElement('div');
        confirmationMsg.className = 'confirmation-message';
        confirmationMsg.textContent = '예약이 성공적으로 접수되었습니다. 곧 담당자가 연락드릴 예정입니다.';
        
        bookingForm.parentNode.insertBefore(confirmationMsg, bookingForm.nextSibling);
        
        // 5초 후 메시지 제거
        setTimeout(() => {
            confirmationMsg.remove();
        }, 5000);
    }
});

// 추가 스타일 동적 적용
const styleElement = document.createElement('style');
styleElement.textContent = `
    .selected {
        background-color: #3498db !important;
        transform: translateY(-5px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }
    
    .error {
        border-color: #ff6b6b !important;
    }
    
    .confirmation-message {
        background-color: #4CAF50;
        color: white;
        padding: 15px;
        border-radius: 8px;
        margin-top: 20px;
        text-align: center;
        animation: fadeIn 0.5s;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(styleElement);

// 서비스 유형별 옵션 선택 기능 //
document.addEventListener('DOMContentLoaded', function() {
    // 서비스 유형 선택 필드
    const serviceTypeSelect = document.getElementById('service-type');
    
    // 추가 옵션 컨테이너
    const regularOptions = document.getElementById('regular-options');
    const areaOptions = document.getElementById('area-options');
    
    // 서비스 유형 변경 이벤트 리스너
    if (serviceTypeSelect) {
        serviceTypeSelect.addEventListener('change', function() {
            // 모든 추가 옵션 숨기기
            regularOptions.style.display = 'none';
            areaOptions.style.display = 'none';
            
            // 선택한 서비스 유형에 따라 해당 옵션 표시
            const selectedValue = this.value;
            
            if (selectedValue === 'regular') {
                // 정기 청소 선택 시
                regularOptions.style.display = 'block';
                
                // 청소 간격 필드를 필수로 설정
                const intervalSelect = document.getElementById('cleaning-interval');
                if (intervalSelect) intervalSelect.required = true;
                
            } else if (selectedValue === 'area') {
                // 구역 청소 선택 시
                areaOptions.style.display = 'block';
                
                // 하나 이상의 체크박스가 선택되었는지 확인하는 유효성 검사는
                // 폼 제출 시 별도로 처리해야 합니다.
            }
            
            // 애니메이션 효과를 위한 스타일 추가 (선택 사항)
            if (selectedValue === 'regular' || selectedValue === 'area') {
                // 슬라이드 다운 애니메이션 효과 (CSS 트랜지션으로 구현 가능)
                const visibleOptions = selectedValue === 'regular' ? regularOptions : areaOptions;
                visibleOptions.style.opacity = '0';
                visibleOptions.style.maxHeight = '0';
                
                // 요소가 DOM에 추가된 후 애니메이션 적용
                setTimeout(() => {
                    visibleOptions.style.transition = 'opacity 0.3s ease, max-height 0.5s ease';
                    visibleOptions.style.opacity = '1';
                    visibleOptions.style.maxHeight = '500px'; // 충분히 큰 값
                }, 10);
            }
        });
    }
});

// 폼 제출 시 유효성 검사
const bookingForm = document.getElementById('booking-form');
if (bookingForm) {
    bookingForm.addEventListener('submit', function(event) {
        const serviceType = document.getElementById('service-type').value;
        
        // 구역 청소를 선택했는데 아무 구역도 선택하지 않은 경우
        if (serviceType === 'area') {
            const areaCheckboxes = document.querySelectorAll('input[name="area"]:checked');
            if (areaCheckboxes.length === 0) {
                event.preventDefault(); // 폼 제출 중지
                alert('최소 하나 이상의 청소 구역을 선택해주세요.');
            }
        }
    });
}