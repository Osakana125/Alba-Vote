// 現在のユーザー情報を取得
const currentUser = JSON.parse(localStorage.getItem('currentUser'));

// ログインチェック
if (!currentUser) {
  window.location.href = '../login/index.html';
}

// ユーザー名表示
document.getElementById('user-name').textContent = `${currentUser.name} さん`;

// ユーザーリスト（送り先選択用）
const allUsers = [
  { id: 'tanaka', name: '田中 太郎', avatar: '田' },
  { id: 'suzuki', name: '鈴木 花子', avatar: '鈴' },
  { id: 'sato', name: '佐藤 健', avatar: '佐' }
];

// 送り先セレクトボックスを生成（自分以外）
const recipientSelect = document.getElementById('recipient');
allUsers.forEach(user => {
  if (user.id !== currentUser.id) {
    const option = document.createElement('option');
    option.value = user.id;
    option.textContent = user.name;
    recipientSelect.appendChild(option);
  }
});

// 評価カテゴリー名のマッピング
const categoryNames = {
  responsibility: '責任感',
  cooperation: '協調性',
  initiative: '主体性',
  communication: 'コミュニケーション',
  improvement: '向上心'
};

// レベルボタンの選択処理
document.querySelectorAll('.level-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.level-btn').forEach(b => b.classList.remove('selected'));
    this.classList.add('selected');
    this.querySelector('input').checked = true;
  });
});

// 感謝データをlocalStorageから取得
function getThanksData() {
  const data = localStorage.getItem('thanksData');
  return data ? JSON.parse(data) : [];
}

// 感謝データを保存
function saveThanksData(data) {
  localStorage.setItem('thanksData', JSON.stringify(data));
}

// 初期データの生成（初回のみ）
function initializeThanksData() {
  const existingData = getThanksData();
  if (existingData.length === 0) {
    const sampleData = [
      {
        id: Date.now() - 3600000,
        from: { id: 'suzuki', name: '鈴木 花子', avatar: '鈴' },
        to: { id: 'tanaka', name: '田中 太郎', avatar: '田' },
        category: 'cooperation',
        level: 2,
        comment: '忙しい時に手伝ってくれて助かりました！',
        timestamp: Date.now() - 3600000
      },
      {
        id: Date.now() - 7200000,
        from: { id: 'sato', name: '佐藤 健', avatar: '佐' },
        to: { id: 'suzuki', name: '鈴木 花子', avatar: '鈴' },
        category: 'communication',
        level: 3,
        comment: 'お客様への対応が素晴らしかったです。勉強になりました。',
        timestamp: Date.now() - 7200000
      },
      {
        id: Date.now() - 10800000,
        from: { id: 'tanaka', name: '田中 太郎', avatar: '田' },
        to: { id: 'sato', name: '佐藤 健', avatar: '佐' },
        category: 'responsibility',
        level: 2,
        comment: '最後まで丁寧に仕事をしていて素晴らしいです。',
        timestamp: Date.now() - 10800000
      }
    ];
    saveThanksData(sampleData);
  }
}

// 時間表示のフォーマット
function formatTime(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) {
    return `${minutes}分前`;
  } else if (hours < 24) {
    return `${hours}時間前`;
  } else {
    return `${days}日前`;
  }
}

// 感謝リストを表示
function displayThanksList() {
  const thanksData = getThanksData();
  const thanksList = document.getElementById('thanks-list');
  
  // 最新の10件を表示
  const recentThanks = thanksData.slice(-10).reverse();
  
  if (recentThanks.length === 0) {
    thanksList.innerHTML = '<p style="text-align: center; color: var(--gray-500); padding: 2rem;">まだ感謝のメッセージがありません</p>';
    return;
  }

  thanksList.innerHTML = recentThanks.map(thanks => `
    <div class="thanks-item">
      <div class="thanks-header">
        <div class="thanks-avatar">${thanks.from.avatar}</div>
        <div class="thanks-info">
          <div class="thanks-name">${thanks.from.name} → ${thanks.to.name}</div>
          <div class="thanks-time">${formatTime(thanks.timestamp)}</div>
        </div>
      </div>
      <div class="thanks-category">${categoryNames[thanks.category]}</div>
      <div class="thanks-comment">${thanks.comment || '（コメントなし）'}</div>
      <div class="thanks-level">
        ${'⭐'.repeat(thanks.level)} Lv.${thanks.level}
      </div>
    </div>
  `).join('');
}

// モーダル開閉
function openSendModal() {
  document.getElementById('send-modal').classList.add('active');
}

function closeSendModal() {
  document.getElementById('send-modal').classList.remove('active');
  document.getElementById('thanks-form').reset();
  document.querySelectorAll('.level-btn').forEach(b => b.classList.remove('selected'));
}

// フォーム送信処理
document.getElementById('thanks-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const recipientId = document.getElementById('recipient').value;
  const category = document.getElementById('category').value;
  const level = parseInt(document.querySelector('input[name="level"]:checked').value);
  const comment = document.getElementById('comment').value;

  const recipient = allUsers.find(u => u.id === recipientId);

  const newThanks = {
    id: Date.now(),
    from: {
      id: currentUser.id,
      name: currentUser.name,
      avatar: currentUser.avatar
    },
    to: {
      id: recipient.id,
      name: recipient.name,
      avatar: recipient.avatar
    },
    category: category,
    level: level,
    comment: comment,
    timestamp: Date.now()
  };

  const thanksData = getThanksData();
  thanksData.push(newThanks);
  saveThanksData(thanksData);

  closeSendModal();
  displayThanksList();

  // 送信成功メッセージ
  alert(`✨ ${recipient.name}さんに感謝を送りました！`);
});

// 初期化
initializeThanksData();
displayThanksList();