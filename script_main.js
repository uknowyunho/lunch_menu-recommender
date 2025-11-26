// 출근 현황 계산
const firstWorkDay = new Date('2025-10-20');
const today = new Date();

// 오늘 날짜 표시
const todayDateElement = document.getElementById('todayDate');
const year = today.getFullYear();
const month = today.getMonth() + 1;
const day = today.getDate();
todayDateElement.textContent = `${year}년 ${month}월 ${day}일`;

// 총 근무일수 계산 (평일만 계산)
function calculateWorkDays(startDate, endDate) {
    let count = 0;
    let currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
        const dayOfWeek = currentDate.getDay();
        // 월요일(1)부터 금요일(5)까지만 카운트
        if (dayOfWeek >= 1 && dayOfWeek <= 5) {
            count++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return count;
}

const workDays = calculateWorkDays(firstWorkDay, today);
document.getElementById('totalDays').textContent = workDays;

// 요일별 메시지
const dayMessages = {
    0: '🌞 일요일! 푹 쉬는 하루 되세요!',
    1: '💪 월요일! 새로운 한 주의 시작, 화이팅!',
    2: '🔥 화요일! 한 주의 페이스를 찾아가는 중!',
    3: '⚡ 수요일! 벌써 한 주의 중간, 조금만 더!',
    4: '🎉 목요일! 불금이 코앞, 힘내세요!',
    5: '🍻 금요일! 드디어 불금! 오늘만 버티면 주말!',
    6: '🎮 토요일! 주말의 첫날, 즐거운 하루!'
};

// 현재 시간 및 퇴근까지 남은 시간 업데이트
function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    document.getElementById('currentTime').textContent = `${hours}:${minutes}:${seconds}`;

    // 요일별 메시지 표시
    const dayOfWeek = now.getDay();
    document.getElementById('dayMessage').textContent = dayMessages[dayOfWeek];

    // 평일만 퇴근 시간 계산 (월~금)
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        // 출근 시간 (10:00 AM)
        const startWork = new Date();
        startWork.setHours(10, 0, 0, 0);

        // 퇴근 시간 (19:00)
        const endOfWork = new Date();
        endOfWork.setHours(19, 0, 0, 0);

        // 아직 출근 전
        if (now < startWork) {
            const diff = startWork - now;
            const hoursLeft = Math.floor(diff / (1000 * 60 * 60));
            const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const secondsLeft = Math.floor((diff % (1000 * 60)) / 1000);
            document.getElementById('remainingTime').textContent = `출근까지 ${hoursLeft}시간 ${minutesLeft}분 ${secondsLeft}초`;
        } 
        // 근무 중
        else if (now >= startWork && now < endOfWork) {
            const diff = endOfWork - now;
            const hoursLeft = Math.floor(diff / (1000 * 60 * 60));
            const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const secondsLeft = Math.floor((diff % (1000 * 60)) / 1000);
            document.getElementById('remainingTime').textContent = `${hoursLeft}시간 ${minutesLeft}분 ${secondsLeft}초`;
        } 
        // 퇴근 후
        else {
            document.getElementById('remainingTime').textContent = '퇴근 완료! 🎉';
        }
    } else {
        // 주말
        document.getElementById('remainingTime').textContent = '주말입니다! 😊';
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

// To Do 상세정보 모달
const todoDetailModal = document.getElementById('todoDetailModal');
const closeTodoDetailModal = document.getElementById('closeTodoDetailModal');

let addCardBtn = null;
let isMainScreen = true;
let todoItems = []; // To Do 아이템 저장

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

// To Do 상세정보 모달 닫기
closeTodoDetailModal.addEventListener('click', () => {
    todoDetailModal.classList.remove('active');
});

todoDetailModal.addEventListener('click', (e) => {
    if (e.target === todoDetailModal) {
        todoDetailModal.classList.remove('active');
    }
});

// 시간을 분으로 변환하는 함수 (정렬용)
function timeToMinutes(timeString) {
    const [hours, minutes] = timeString.split(':');
    return parseInt(hours) * 60 + parseInt(minutes);
}

// To Do 목록 다시 렌더링 (시간순 정렬)
function renderTodoList() {
    // 시간순으로 정렬
    todoItems.sort((a, b) => timeToMinutes(a.time24) - timeToMinutes(b.time24));
    
    // 목록 초기화
    scheduleList.innerHTML = '';
    
    // 정렬된 순서대로 다시 추가
    todoItems.forEach((item, index) => {
        const todoItem = document.createElement('div');
        todoItem.className = 'schedule-item';
        todoItem.setAttribute('data-index', index);
        todoItem.innerHTML = `
            <div class="schedule-time">${item.timeFormatted}</div>
            <div class="schedule-title">${item.title}</div>
        `;
        
        // 클릭 이벤트 추가
        todoItem.addEventListener('click', () => {
            showTodoDetail(item);
        });
        
        scheduleList.appendChild(todoItem);
        todoItem.style.animation = 'fadeInUp 0.5s ease-out';
    });
}

// To Do 상세정보 표시
function showTodoDetail(item) {
    document.getElementById('todoDetailTime').textContent = item.timeFormatted;
    document.getElementById('todoDetailTitle').textContent = item.title;
    document.getElementById('todoDetailDate').textContent = item.date;
    
    // 현재 시간과 비교하여 상태 표시
    const now = new Date();
    const itemTime = new Date();
    const [hours, minutes] = item.time24.split(':');
    itemTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    let status = '예정';
    if (now > itemTime) {
        status = '완료';
    } else if (now.getHours() === parseInt(hours) && now.getMinutes() === parseInt(minutes)) {
        status = '진행 중';
    }
    
    document.getElementById('todoDetailStatus').textContent = status;
    todoDetailModal.classList.add('active');
}

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

    // To Do 아이템 객체 생성
    const todoItem = {
        time24: timeValue,
        timeFormatted: formattedTime,
        title: todoTitle,
        date: `${year}년 ${month}월 ${day}일`
    };

    // 배열에 추가
    todoItems.push(todoItem);

    // 목록 다시 렌더링 (자동 정렬)
    renderTodoList();

    // 폼 초기화 및 모달 닫기
    addTodoForm.reset();
    addTodoModal.classList.remove('active');
});

// Home 로고 클릭 이벤트
logoText.addEventListener('click', () => {
    categoryBtns.forEach(btn => btn.classList.remove('active'));
    isMainScreen = true;
    workStatusBox.classList.remove('hidden');
    mainBottomSection.classList.remove('hidden');
    cardGrid.innerHTML = '';
    addCardBtn = null;
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

// 모달 열기
function openAddCardModal() {
    addCardModal.classList.add('active');
}

// cardGrid 클릭 이벤트
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

    if (addCardBtn) {
        cardGrid.insertBefore(card, addCardBtn);
    } else {
        cardGrid.appendChild(card);
    }

    addCardForm.reset();
    addCardModal.classList.remove('active');
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

        isMainScreen = false;

        if (category === 'all') {
            workStatusBox.classList.add('hidden');
            mainBottomSection.classList.add('hidden');

            cards.forEach(card => {
                card.style.display = 'block';
            });

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
            workStatusBox.classList.add('hidden');
            mainBottomSection.classList.add('hidden');

            cards.forEach(card => {
                if (card.getAttribute('data-category') === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });

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

// 검색 기능
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const cards = document.querySelectorAll('.card:not(.add-card)');

    cards.forEach(card => {
        const titleElement = card.querySelector('.card-title');
        const contentElement = card.querySelector('.card-content');
        const title = titleElement ? titleElement.textContent.toLowerCase() : '';
        const content = contentElement ? contentElement.textContent.toLowerCase() : '';
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