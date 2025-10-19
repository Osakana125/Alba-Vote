// 現在のユーザー情報を取得
const currentUser = JSON.parse(localStorage.getItem('currentUser'));

// ログインチェック
if (!currentUser) {
  window.location.href = '../login/index.html';
}

// 評価カテゴリー名のマッピング
const categoryNames = {
  responsibility: '責任感',
  cooperation: '協調性',
  initiative: '主体性',
  communication: 'コミュニケーション',
  improvement: '向上心'
};

// 感謝データを取得
function getThanksData() {
  const data = localStorage.getItem('thanksData');
  return data ? JSON.parse(data) : [];
}

// 現在のユーザーが受け取った評価を取得
function getReceivedEvaluations() {
  const thanksData = getThanksData();
  return thanksData.filter(thanks => thanks.to.id === currentUser.id);
}

// 現在のユーザーが送った感謝を取得
function getSentThanks() {
  const thanksData = getThanksData();
  return thanksData.filter(thanks => thanks.from.id === currentUser.id);
}

// カテゴリー別スコアを計算
function calculateCategoryScores() {
  const received = getReceivedEvaluations();
  const scores = {
    responsibility: 0,
    cooperation: 0,
    initiative: 0,
    communication: 0,
    improvement: 0
  };

  received.forEach(evaluation => {
    scores[evaluation.category] += evaluation.level;
  });

  return scores;
}

// 総合スコアを計算
function calculateTotalScore() {
  const received = getReceivedEvaluations();
  return received.reduce((sum, evaluation) => sum + evaluation.level, 0);
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

// 統計情報を表示
function displayStats() {
  const received = getReceivedEvaluations();
  const sent = getSentThanks();
  const totalScore = calculateTotalScore();

  document.getElementById('total-score').textContent = totalScore;
  document.getElementById('received-count').textContent = received.length;
  document.getElementById('sent-count').textContent = sent.length;
}

// カテゴリー別スコアを表示
function displayCategoryScores() {
  const scores = calculateCategoryScores();
  const container = document.getElementById('category-scores');

  container.innerHTML = Object.entries(categoryNames).map(([key, name]) => `
    <div class="category-item">
      <div class="category-name">${name}</div>
      <div class="category-score">${scores[key]}</div>
    </div>
  `).join('');
}

// レーダーチャートを作成
function createRadarChart() {
  const scores = calculateCategoryScores();
  const ctx = document.getElementById('radarChart').getContext('2d');

  new Chart(ctx, {
    type: 'radar',
    data: {
      labels: Object.values(categoryNames),
      datasets: [{
        label: 'スコア',
        data: Object.values(scores),
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(59, 130, 246, 1)'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        r: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });
}

// 受け取った評価リストを表示
function displayEvaluationList() {
  const received = getReceivedEvaluations();
  const evaluationList = document.getElementById('evaluation-list');

  if (received.length === 0) {
    evaluationList.innerHTML = '<p style="text-align: center; color: var(--gray-500); padding: 2rem;">まだ評価を受け取っていません</p>';
    return;
  }

  // 最新順に並び替え
  const sortedReceived = received.slice().reverse();

  evaluationList.innerHTML = sortedReceived.map(evaluation => `
    <div class="evaluation-item">
      <div class="evaluation-header">
        <div class="evaluation-avatar">${evaluation.from.avatar}</div>
        <div class="evaluation-info">
          <div class="evaluation-name">${evaluation.from.name}</div>
          <div class="evaluation-time">${formatTime(evaluation.timestamp)}</div>
        </div>
      </div>
      <div class="evaluation-category">${categoryNames[evaluation.category]}</div>
      <div class="evaluation-comment">${evaluation.comment || '（コメントなし）'}</div>
      <div class="evaluation-level">
        ${'⭐'.repeat(evaluation.level)} Lv.${evaluation.level}
      </div>
    </div>
  `).join('');
}

// 初期化
displayStats();
displayCategoryScores();
displayEvaluationList();
createRadarChart();