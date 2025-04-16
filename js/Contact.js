document.getElementById('inquiryForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('문의가 접수되었습니다. 빠른 시일 내에 답변 드리겠습니다.');
    this.reset();
});

