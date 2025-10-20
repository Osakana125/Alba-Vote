# Alba VOTE - リアルタイム版セットアップガイド

## 概要
複数のブラウザやデバイスでリアルタイムに動作するAlba VOTEアプリケーションです。
Firebase を使用してデータをクラウドに保存し、リアルタイム同期を実現します。

## 機能
- 🔐 Firebase Authentication による認証
- ☁️ Firestore によるクラウドデータ保存
- ⚡ リアルタイム同期（複数ブラウザ対応）
- 📊 評価データの永続化
- 👥 複数ユーザーの同時利用

## セットアップ手順

### 1. Firebaseプロジェクトの作成

1. [Firebase Console](https://console.firebase.google.com/) にアクセス
2. 「プロジェクトを追加」をクリック
3. プロジェクト名を入力（例: `alba-vote`）
4. Google Analytics は不要なので無効化してOK
5. 「プロジェクトを作成」をクリック

### 2. Firestore Database の有効化

1. 左メニューから「Firestore Database」を選択
2. 「データベースの作成」をクリック
3. **「テストモードで開始」**を選択（開発用）
4. ロケーションを「asia-northeast1 (Tokyo)」に設定
5. 「有効にする」をクリック

### 3. Authentication の有効化

1. 左メニューから「Authentication」を選択
2. 「始める」をクリック
3. 「Sign-in method」タブを開く
4. 「匿名」を選択して「有効にする」をオンに
5. 「保存」をクリック

### 4. Firebase設定情報の取得

1. 左メニューから「プロジェクトの設定」（⚙️アイコン）を選択
2. 「全般」タブの「マイアプリ」セクションで「</>」(Web)アイコンをクリック
3. アプリのニックネームを入力（例: `Alba VOTE Web`）
4. 「Firebase Hosting」はチェック不要
5. 「アプリを登録」をクリック
6. 表示される `firebaseConfig` オブジェクトをコピー

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "alba-vote-xxxxx.firebaseapp.com",
  projectId: "alba-vote-xxxxx",
  storageBucket: "alba-vote-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

### 5. アプリケーションへの設定

`firebase-app.html` を開いて、以下の部分を書き換えます：

```javascript
// TODO: Firebase Console で作成した設定情報に置き換えてください
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",              // ← ここを書き換え
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 6. アプリの起動

1. `firebase-app.html` をブラウザで開く
2. ユーザーを選択してログイン
3. 感謝メッセージを送信

### 7. リアルタイム動作の確認

1. **別のブラウザ**または**シークレットモード**で同じHTMLファイルを開く
2. 別のユーザーでログイン
3. 一方のブラウザで感謝メッセージを送信
4. **もう一方のブラウザでリアルタイムに表示される**ことを確認！

## データ構造

### users コレクション
```javascript
{
  id: "tanaka",
  name: "田中太郎",
  role: "キッチンスタッフ",
  avatar: "👨‍🍳",
  color: "bg-blue-500",
  createdAt: Timestamp
}
```

### thanks コレクション
```javascript
{
  from: {
    id: "tanaka",
    name: "田中太郎",
    avatar: "👨‍🍳",
    color: "bg-blue-500"
  },
  to: {
    id: "suzuki",
    name: "鈴木花子",
    avatar: "👩‍💼",
    color: "bg-pink-500"
  },
  evaluations: [
    { category: "responsibility", level: 3 },
    { category: "cooperation", level: 2 }
  ],
  totalLevel: 5,
  comment: "いつもありがとう！",
  timestamp: Timestamp
}
```

## セキュリティルール（本番環境用）

開発が終わったら、Firestoreのセキュリティルールを設定してください：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // ユーザーは読み取り専用
    match /users/{userId} {
      allow read: if true;
      allow write: if false; // 管理者のみ
    }
    
    // 感謝メッセージ
    match /thanks/{thanksId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if false;
    }
  }
}
```

## トラブルシューティング

### タイムラインが表示されない
- Firebase Consoleでデータが保存されているか確認
- ブラウザのコンソールでエラーを確認
- `firebaseConfig` が正しく設定されているか確認

### リアルタイム更新が動作しない
- Firestoreのテストモードが有効か確認
- ネットワーク接続を確認
- ブラウザをリロード

### 認証エラーが出る
- Authentication で「匿名」認証が有効になっているか確認
- `authDomain` が正しく設定されているか確認

## ローカル版との違い

| 項目 | ローカル版 (app.html) | リアルタイム版 (firebase-app.html) |
|------|---------------------|----------------------------------|
| データ保存 | localStorage | Firestore (クラウド) |
| 複数ブラウザ | ❌ 別々のデータ | ✅ 同期される |
| リアルタイム更新 | ❌ なし | ✅ 自動更新 |
| データ永続化 | ブラウザのみ | クラウド |
| インターネット | 不要 | 必要 |

## 次のステップ

- [ ] ユーザー登録機能の追加
- [ ] プロフィール編集機能
- [ ] 通知機能
- [ ] 画像アップロード
- [ ] モバイルアプリ化（PWA）

## ライセンス
MIT License
