const wheel = document.getElementById('wheel');
const spinBtn = document.getElementById('spinBtn');
const systemPopup = document.getElementById('systemPopup');
const resultPopup = document.getElementById('resultPopup');
const cancelBtn = document.getElementById('cancelBtn');
const allowBtn = document.getElementById('allowBtn');
const closeResultBtn = document.getElementById('closeResultBtn');
const resultTitle = document.getElementById('resultTitle');
const resultDesc = document.getElementById('resultDesc');

// Prizes definition
const slices = [
    { text: "1만원\n할인", value: 10000, type: "coupon", name: "1만원 할인쿠폰" },
    { text: "1천원\n적립", value: 1000, type: "points", name: "적립금 1,000원" },
    { text: "5천원\n할인", value: 5000, type: "coupon", name: "5천원 할인쿠폰" },
    { text: "1천원\n적립", value: 1000, type: "points", name: "적립금 1,000원" },
    { text: "5천원\n할인", value: 5000, type: "coupon", name: "5천원 할인쿠폰" },
    { text: "1천원\n적립", value: 1000, type: "points", name: "적립금 1,000원" }
];

// Add text to slices structurally
const anglePerSlice = 360 / slices.length;
slices.forEach((slice, i) => {
    const sliceEl = document.createElement('div');
    sliceEl.className = 'slice-text';
    
    // Position text: rotate then translate half height
    const rotateAngle = (i * anglePerSlice) + (anglePerSlice / 2);
    sliceEl.style.transform = `rotate(${rotateAngle}deg)`;
    sliceEl.innerHTML = `<span>${slice.text.replace('\n', '<br>')}</span>`;
    
    wheel.appendChild(sliceEl);
});

let currentRotation = 0;
let isSpinning = false;

// 1. Initial click shows the consent popup secretly acting as a "notification" popup
spinBtn.addEventListener('click', () => {
    if (isSpinning) return;
    systemPopup.classList.remove('hidden');
    spinBtn.classList.remove('pulse-anim');
});

// 2. If user cancels, hide popup
cancelBtn.addEventListener('click', () => {
    systemPopup.classList.add('hidden');
    spinBtn.classList.add('pulse-anim');
});

// 3. If user allows, this counts as pushing consent, and we start the wheel
allowBtn.addEventListener('click', () => {
    systemPopup.classList.add('hidden');
    startSpin();
});

function startSpin() {
    isSpinning = true;
    
    // Randomize the result. For demo, let's heavily weight 5천원 or 1천원, or just random
    // Actually, roulette logic:
    const randomSlice = Math.floor(Math.random() * slices.length);
    
    // Degrees to rotate to get the desired slice at the TOP (0 deg or 360 deg)
    // The top is 0deg. 
    // Wait, conic gradient starts from top center. 
    // The pointer is at top.
    
    // Basic rotation calculation:
    // We add 5 full spins (1800deg) + the target slice angle offset.
    // Target slice center is `(randomSlice * 60) + 30`.
    // To bring it to top (pointer), we need to rotate backwards by that angle.
    // So 360 - ((randomSlice * 60) + 30).
    const rotations = 5 * 360; 
    const offset = 360 - ((randomSlice * anglePerSlice) + (anglePerSlice / 2));
    
    currentRotation += rotations + offset;
    
    // Clean up currentRotation to avoid accumulating too much, but for transition we need it to strictly increase
    wheel.style.transform = `rotate(${currentRotation}deg)`;

    // Wait for transition to end
    setTimeout(() => {
        showResult(slices[randomSlice]);
        isSpinning = false;
        
        // Reset rotation internal math for next spin (though only 1 participation allowed)
        // currentRotation = currentRotation % 360; 
        
    }, 4200); // 4s transition + 0.2s buffer
}

function showResult(prize) {
    resultTitle.textContent = `축하합니다!`;
    resultDesc.textContent = `${prize.name}이(가)\n발급되었습니다! (사용기한: 3일 이내)`;
    
    // Format text with linebreaks
    resultDesc.innerHTML = resultDesc.textContent.replace('\n', '<br>');
    
    resultPopup.classList.remove('hidden');

    // Trigger Confetti
    if (typeof confetti === 'function') {
        confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#FF2B5E', '#FFFFFF', '#FFD700']
        });
    }
}

closeResultBtn.addEventListener('click', () => {
    resultPopup.classList.add('hidden');
    // Disable spin button after 1 use
    spinBtn.textContent = "참여 완료";
    spinBtn.style.opacity = "0.5";
    spinBtn.classList.remove('pulse-anim');
});

// --- Ticker Logic ---
const fakeWinners = [
    "김*선님 <span class='prize'>1만원 할인 당첨!</span> 🎉",
    "이*환님 <span class='prize'>5천원 할인 당첨!</span> 🎁",
    "박*지님 <span class='prize'>적립금 1천원 당첨!</span> ✨",
    "최*용님 <span class='prize'>5천원 할인 당첨!</span> 🎁",
    "정*아님 <span class='prize'>1만원 할인 당첨!</span> 🎉",
    "권*호님 <span class='prize'>적립금 1천원 당첨!</span> ✨",
    "이*미님 <span class='prize'>1만원 할인 당첨!</span> 🎉"
];

const tickerMove = document.getElementById('tickerMove');
if (tickerMove) {
    // Array duplication to ensure a smooth scrolling loop
    const tickerItems = [...fakeWinners, ...fakeWinners, ...fakeWinners, ...fakeWinners].map(
        text => `<div class="ticker-item">${text}</div>`
    ).join('');
    tickerMove.innerHTML = tickerItems;
}
