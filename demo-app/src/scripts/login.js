// ユーザーデータ
const users = {
  tanaka: {
    id: 'tanaka',
    name: '田中 太郎',
    role: 'アルバイトスタッフ',
    avatar: '田'
  },
  suzuki: {
    id: 'suzuki',
    name: '鈴木 花子',
    role: 'アルバイトスタッフ',
    avatar: '鈴'
  },
  sato: {
    id: 'sato',
    name: '佐藤 健',
    role: 'アルバイトスタッフ',
    avatar: '佐'
  }
};

// ログイン処理
function login(userId) {
  const user = users[userId];
  if (user) {
    // ユーザー情報をlocalStorageに保存
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    // ホーム画面にリダイレクト
    window.location.href = '../home/index.html';
  }
}