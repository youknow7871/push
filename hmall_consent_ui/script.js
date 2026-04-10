document.addEventListener('DOMContentLoaded', () => {
    const bottomSheet = document.getElementById('bottomSheet');
    const overlay = document.getElementById('overlay');
    const btnAccept = document.getElementById('btnAccept');
    const btnReject = document.getElementById('btnReject');
    const consentLink = document.getElementById('consentLink');

    const closeSheet = (action) => {
        // Disable buttons immediately to prevent double-click
        btnAccept.disabled = true;
        btnReject.disabled = true;
        
        // Add classes to hide
        bottomSheet.classList.add('closed');
        overlay.classList.add('hide');
        
        // Wait for animation to finish
        setTimeout(() => {
            if (action === 'accept') {
                alert('맞춤형 마케팅 수신 동의가 완료되었습니다. 쇼핑 혜택을 기대해주세요!');
            } else if (action === 'reject') {
                alert('다음에 안내해 드립니다.');
            }
            
            // For prototype testing purposes: Reset state after viewing alert
            bottomSheet.classList.remove('closed');
            overlay.classList.remove('hide');
            btnAccept.disabled = false;
            btnReject.disabled = false;
            
        }, 400); // Wait 400ms matching transition duration
    };

    btnAccept.addEventListener('click', () => {
        closeSheet('accept');
    });

    btnReject.addEventListener('click', () => {
        closeSheet('reject');
    });

    consentLink.addEventListener('click', (e) => {
        e.preventDefault();
        alert('이용 동의 상세 안내 페이지로 이동합니다.');
    });
    
    // Allow closing sheet by clicking overlay (common pattern)
    overlay.addEventListener('click', () => {
        closeSheet('reject');
    });
});
