        // FAQ 토글 기능
        document.querySelectorAll('.faq-question').forEach(question => {
            question.addEventListener('click', () => {
                const answer = question.nextElementSibling;
                const isOpen = answer.style.display === 'block';
                
                answer.style.display = isOpen ? 'none' : 'block';
                question.querySelector('span:last-child').textContent = isOpen ? '+' : '-';
            });
        });

        // 초기 상태에서는 답변 숨기기
        document.querySelectorAll('.faq-answer').forEach(answer => {
            answer.style.display = 'none';
        });

        // 폼 제출 처리
        document.querySelector('form').addEventListener('submit', function(e) {
            e.preventDefault();
            alert('지원서가 성공적으로 제출되었습니다. 검토 후 연락드리겠습니다.');
        });