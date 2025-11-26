// 출근 현황 계산
const firstWorkDay = new Date('2025-10-20');
const today = new Date();

// 오늘 날짜 표시
const todayDateElement = document.getElementById('todayDate');
const year = today.getFullYear();
const month = today.getMonth() + 1;
const day = today.getDate();
todayDateElement.textContent = `${year}년 ${month}월 ${day}일`;

// 총 근무일수 계산 (밀리초 차이를 일수로 변환)
const diffTime = Math.abs(today - firstWorkDay);
const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1은 첫날 포함
document.getElementById('totalDays').textContent = diffDays;

// 현재 시간 및 퇴근까지 남은 시간 업데이트
function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    document.getElementById('currentTime').textContent = `${hours}:${minutes}:${seconds}`;

    // 퇴근 시간 (19:00)까지 남은 시간 계산
    const endOfWork = new Date();
    endOfWork.setHours(19, 0, 0, 0);

    const diff = endOfWork - now;

    if (diff > 0) {
        const hoursLeft = Math.floor(diff / (1000 * 60 * 60));
        const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secondsLeft = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById('remainingTime').textContent = `${hoursLeft}시간 ${minutesLeft}분 ${secondsLeft}초`;
    } else {
        document.getElementById('remainingTime').textContent = '퇴근 시간이 지났습니다! 🎉';
    }
}

// 1초마다 시간 업데이트
updateTime();
setInterval(updateTime, 1000);

// DOM 요소
const cardGrid = document.getElementById('cardGrid');
const workStatusBox = document.getElementById('workStatusBox');
const mainBottomSection = document.getElementById('mainBottomSection');
const addCardModal = document.getElementById('addCardModal');
const closeModal = document.getElementById('closeModal');
const addCardForm = document.getElementById('addCardForm');
const searchInput = document.getElementById('searchInput');
const categoryBtns = document.querySelectorAll('.category-btn');
const logoText = document.getElementById('logoText');

// To Do 관련 요소
const addScheduleBtn = document.getElementById('addScheduleBtn');
const addTodoModal = document.getElementById('addTodoModal');
const closeTodoModal = document.getElementById('closeTodoModal');
const addTodoForm = document.getElementById('addTodoForm');
const scheduleList = document.getElementById('scheduleList');

let addCardBtn = null; // 동적으로 생성될 버튼
let isMainScreen = true; // 메인 화면 상태 추적

// To Do 추가 모달 열기/닫기
addScheduleBtn.addEventListener('click', () => {
    addTodoModal.classList.add('active');
});

closeTodoModal.addEventListener('click', () => {
    addTodoModal.classList.remove('active');
});

addTodoModal.addEventListener('click', (e) => {
    if (e.target === addTodoModal) {
        addTodoModal.classList.remove('active');
    }
});

// To Do 추가
addTodoForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const timeValue = document.getElementById('todoTime').value;
    const todoTitle = document.getElementById('todoTitle').value;

    // 시간을 AM/PM 형식으로 변환
    const [hours, minutes] = timeValue.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
    const formattedTime = `${String(displayHour).padStart(2, '0')}:${minutes} ${ampm}`;

    // 새 To Do 아이템 생성
    const todoItem = document.createElement('div');
    todoItem.className = 'schedule-item';
    todoItem.innerHTML = `
        <div class="schedule-time">${formattedTime}</div>
        <div class="schedule-title">${todoTitle}</div>
    `;

    // To Do List에 추가
    scheduleList.appendChild(todoItem);

    // 폼 초기화 및 모달 닫기
    addTodoForm.reset();
    addTodoModal.classList.remove('active');

    // 애니메이션
    todoItem.style.animation = 'fadeInUp 0.5s ease-out';
});

// Home 로고 클릭 이벤트 - 메인 화면으로 복귀
logoText.addEventListener('click', () => {
    // 모든 카테고리 버튼에서 active 제거
    categoryBtns.forEach(btn => btn.classList.remove('active'));

    // 메인 화면 상태로 설정
    isMainScreen = true;

    // 출근 현황 박스와 하단 섹션 보이기
    workStatusBox.classList.remove('hidden');
    mainBottomSection.classList.remove('hidden');

    // 카드 그리드 비우기
    cardGrid.innerHTML = '';
    addCardBtn = null;

    // 검색 초기화
    searchInput.value = '';
});

// 카테고리 한글 이름
const categoryNames = {
    lge: 'LGE',
    momq: '맘큐',
    side: 'Side Project',
    meeting: 'Meeting',
    etc: '기타'
};

// 카테고리 아이콘
const defaultIcons = {
    lge: '🏢',
    momq: '👶',
    side: '🚀',
    meeting: '📅',
    etc: '📌'
};

// 모달 열기/닫기
function openAddCardModal() {
    addCardModal.classList.add('active');
}

// cardGrid 클릭 이벤트 위임 (동적으로 생성되는 버튼 처리)
cardGrid.addEventListener('click', (e) => {
    const addCard = e.target.closest('.add-card');
    if (addCard) {
        openAddCardModal();
    }
});

closeModal.addEventListener('click', () => {
    addCardModal.classList.remove('active');
});

addCardModal.addEventListener('click', (e) => {
    if (e.target === addCardModal) {
        addCardModal.classList.remove('active');
    }
});

// 카드 추가
addCardForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('cardTitle').value;
    const category = document.getElementById('cardCategory').value;
    const icon = document.getElementById('cardIcon').value || defaultIcons[category];
    const content = document.getElementById('cardContent').value;
    const tags = document.getElementById('cardTags').value;
    const link = document.getElementById('cardLink').value || '#';

    const card = createCard(title, category, icon, content, tags, link);

    // addCardBtn이 있으면 그 앞에 삽입, 없으면 그냥 추가
    if (addCardBtn) {
        cardGrid.insertBefore(card, addCardBtn);
    } else {
        cardGrid.appendChild(card);
    }

    addCardForm.reset();
    addCardModal.classList.remove('active');

    // 애니메이션
    card.style.animation = 'fadeInUp 0.5s ease-out';
});

// 카드 생성 함수
function createCard(title, category, icon, content, tags, link) {
    const card = document.createElement('div');
    card.className = 'card';
    card.setAttribute('data-category', category);

    const today = new Date().toISOString().split('T')[0];
    const tagArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    const tagsHTML = tagArray.map(tag => `<span class="tag">${tag}</span>`).join('');

    card.innerHTML = `
        <div class="card-category">${categoryNames[category]}</div>
        <div class="card-header">
            <div class="card-icon">${icon}</div>
            <h3 class="card-title">${title}</h3>
        </div>
        <div class="card-content">${content}</div>
        <div class="card-tags">${tagsHTML}</div>
        <div class="card-footer">
            <div class="card-date">📅 ${today}</div>
            <a href="${link}" class="card-link">자세히 보기 →</a>
        </div>
    `;

    return card;
}

// 카테고리 필터링
categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        categoryBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const category = btn.getAttribute('data-category');
        const cards = document.querySelectorAll('.card:not(.add-card)');

        // 메인 화면 상태 해제
        isMainScreen = false;

        if (category === 'all') {
            // 전체 카테고리: 출근 현황과 하단 섹션 숨기기, 모든 카드 보이기
            workStatusBox.classList.add('hidden');
            mainBottomSection.classList.add('hidden');

            // 모든 카드 표시
            cards.forEach(card => {
                card.style.display = 'block';
            });

            // 새 카드 추가 버튼 생성
            if (!addCardBtn) {
                addCardBtn = document.createElement('div');
                addCardBtn.className = 'add-card';
                addCardBtn.innerHTML = `
                    <div class="add-card-icon">+</div>
                    <div class="add-card-text">새 카드 추가</div>
                `;
                cardGrid.appendChild(addCardBtn);
            }
        } else {
            // 특정 카테고리: 출근 현황과 하단 섹션 숨기기, 해당 카테고리 카드만 보이기
            workStatusBox.classList.add('hidden');
            mainBottomSection.classList.add('hidden');

            // 기존 카드 필터링
            cards.forEach(card => {
                if (card.getAttribute('data-category') === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });

            // 새 카드 추가 버튼이 없으면 생성
            if (!addCardBtn) {
                addCardBtn = document.createElement('div');
                addCardBtn.className = 'add-card';
                addCardBtn.innerHTML = `
                    <div class="add-card-icon">+</div>
                    <div class="add-card-text">새 카드 추가</div>
                `;
                cardGrid.appendChild(addCardBtn);
            }
        }
    });
});

// 검색 기능 (문법 오류 수정됨)
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const cards = document.querySelectorAll('.card:not(.add-card)');

    cards.forEach(card => {
        const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
        const content = card.querySelector('.card-content')?.textContent.toLowerCase() || '';
        const tags = Array.from(card.querySelectorAll('.tag'))
            .map(tag => tag.textContent.toLowerCase())
            .join(' ');

        if (title.includes(searchTerm) || content.includes(searchTerm) || tags.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
});

// localStorage에 카드 저장 (선택적 기능)
function saveCards() {
    const cards = Array.from(document.querySelectorAll('.card:not(.add-card)')).map(card => ({
        title: card.querySelector('.card-title').textContent,
        category: card.getAttribute('data-category'),
        icon: card.querySelector('.card-icon').textContent,
        content: card.querySelector('.card-content').textContent,
        tags: Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent).join(', '),
        link: card.querySelector('.card-link').href,
        date: card.querySelector('.card-date').textContent.replace('📅 ', '')
    }));

    // Note: localStorage is not available in Claude.ai artifacts
    // This function is provided as a reference for use in external environments
    console.log('Cards to save:', cards);
}