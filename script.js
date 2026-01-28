// DOM Elements
const chatContainer = document.getElementById('chat-container');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// Constants
const STORAGE_KEY = 'chat_messages';
const TURN_COUNT_KEY = 'turn_count';
const MAX_TURNS = 3;

// State
let turnCount = parseInt(localStorage.getItem(TURN_COUNT_KEY) || '0');

// Functions
function loadMessages() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        // In a real app we might load history differently, 
        // for now we stick to the hardcoded welcome message + session behavior.
        // If we want persistent history across reloads:
        // chatContainer.innerHTML = saved; 
        // But the prompt says "No Database", "Browser localStorage only".
        // Let's simpler: Just keep turn count to enforce limit.
    }
}

function appendMessage(text, sender) {
    const div = document.createElement('div');
    div.classList.add('message', sender);
    div.innerText = text;
    chatContainer.appendChild(div);
    scrollToBottom();
}

function scrollToBottom() {
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function showPremiumOption() {
    const div = document.createElement('div');
    div.className = 'action-card';
    div.innerHTML = `
        <h3>전문가의 상세 가이드가 필요하신가요?</h3>
        <p>더 깊이 있는 수리 정보와 견적은 유료 상담으로 제공됩니다.</p>
        <button class="premium-btn" onclick="trackClick()">고급 수리 가이드 받기</button>
    `;
    chatContainer.appendChild(div);
    scrollToBottom();

    // Disable input
    userInput.disabled = true;
    userInput.placeholder = "무료 상담 횟수가 초과되었습니다.";
    sendBtn.disabled = true;
}

// Global function for onclick
window.trackClick = function () {
    console.log('Premium button clicked');
    alert('결제 페이지로 이동합니다 (스모크 테스트)');
    // Here you would redirect to Toss/KakaoPay
    // window.location.href = "YOUR_PAYMENT_LINK";
}

async function handleSend() {
    const text = userInput.value.trim();
    if (!text) return;

    // 1. Add User Message
    appendMessage(text, 'user');
    userInput.value = '';

    // 2. Increment Turn
    turnCount++;
    localStorage.setItem(TURN_COUNT_KEY, turnCount);

    // 3. Check Limit
    if (turnCount > MAX_TURNS) {
        // Imitate a short delay then show premium block WITHOUT API call
        setTimeout(() => {
            showPremiumOption();
        }, 500);
        return;
    }

    // 4. API Call (Mocked for now as requested UI/Logic first)
    showTyping();

    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
        });

        const data = await response.json();
        removeTyping();
        appendMessage(data.reply, 'bot');

    } catch (e) {
        removeTyping();
        console.error(e);
        appendMessage("죄송합니다. 서버 연결에 문제가 생겼습니다.", 'bot');
    }
}

let typingDiv = null;

function showTyping() {
    typingDiv = document.createElement('div');
    typingDiv.className = 'message bot typing-indicator';
    typingDiv.innerHTML = '<span></span><span></span><span></span>';
    chatContainer.appendChild(typingDiv);
    scrollToBottom();
}

function removeTyping() {
    if (typingDiv) {
        typingDiv.remove();
        typingDiv = null;
    }
}

// Event Listeners
sendBtn.addEventListener('click', handleSend);
userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSend();
});

// Init
// if (turnCount > MAX_TURNS) {
//    showPremiumOption();
// }
