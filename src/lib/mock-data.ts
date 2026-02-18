export interface User {
  id: string
  nickname: string
  email: string
  ageGroup: string
  reductionReason: string
  rank: 'beginner' | 'regular' | 'expert' | 'master'
  points: number
  isDeviceOwner: boolean
  avatarUrl?: string
  createdAt: string
}

export interface Recipe {
  id: string
  userId: string
  userNickname: string
  userAvatar?: string
  title: string
  category: string
  tags: string[]
  ingredients: { name: string; amount: string }[]
  steps: string[]
  estimatedSalt: number
  imageUrl: string
  views: number
  avgRating: number
  ratingCount: number
  isOfficial: boolean
  currentLevel?: number
  stimulusQuality?: string
  createdAt: string
}

export interface Spot {
  id: string
  userId: string
  userNickname: string
  placeId: string
  name: string
  address: string
  lat: number
  lng: number
  category: string
  saltLevel: 'low' | 'medium' | 'high'
  menuItems: { name: string; description: string; saltLevel: 'low' | 'medium' | 'high' }[]
  imageUrl: string
  avgRating: number
  ratingCount: number
  createdAt: string
}

export interface Rating {
  id: string
  userId: string
  userNickname: string
  userAvatar?: string
  targetType: 'recipe' | 'spot'
  targetId: string
  score: number
  comment: string
  createdAt: string
}

export interface SupportTicket {
  id: string
  userId: string
  category: string
  content: string
  status: 'pending' | 'in_progress' | 'resolved'
  response?: string
  createdAt: string
}

// Test accounts (テストアカウント)
export const testAccounts = [
  {
    id: 'user-1',
    email: 'test@umaina.jp',
    password: 'test1234',
    nickname: '健一',
    ageGroup: '60代',
    reductionReason: '慢性腎臓病（CKD）',
    rank: 'regular' as const,
    points: 280,
    isDeviceOwner: true,
    deviceNumber: 'UMN-2025-001234',
    createdAt: '2025-10-15',
  },
  {
    id: 'user-2',
    email: 'demo@umaina.jp',
    password: 'demo1234',
    nickname: '美香',
    ageGroup: '50代',
    reductionReason: '高血圧',
    rank: 'expert' as const,
    points: 650,
    isDeviceOwner: false,
    deviceNumber: null,
    createdAt: '2025-08-20',
  },
  {
    id: 'user-3',
    email: 'owner@umaina.jp',
    password: 'owner1234',
    nickname: '太郎',
    ageGroup: '40代',
    reductionReason: '予防・健康維持',
    rank: 'master' as const,
    points: 1250,
    isDeviceOwner: true,
    deviceNumber: 'UMN-2025-005678',
    createdAt: '2025-06-01',
  },
]

// Valid device numbers (有効なデバイス番号)
export const validDeviceNumbers = [
  'UMN-2025-001234',
  'UMN-2025-005678',
  'UMN-2025-009999',
  'UMN-2025-012345',
  'UMN-2025-067890',
]

// Mock current user
export const mockCurrentUser: User = {
  id: 'user-1',
  nickname: '健一',
  email: 'test@umaina.jp',
  ageGroup: '60代',
  reductionReason: '慢性腎臓病（CKD）',
  rank: 'regular',
  points: 280,
  isDeviceOwner: true,
  avatarUrl: undefined,
  createdAt: '2025-10-15',
}

// Mock recipes
export const mockRecipes: Recipe[] = [
  {
    id: 'recipe-1',
    userId: 'user-2',
    userNickname: '美香',
    title: '出汁香る減塩味噌汁',
    category: '汁物',
    tags: ['出汁', '和食', '簡単'],
    ingredients: [
      { name: '昆布', amount: '5cm' },
      { name: 'かつお節', amount: '10g' },
      { name: '減塩味噌', amount: '大さじ1' },
      { name: '豆腐', amount: '1/4丁' },
      { name: 'わかめ', amount: '適量' },
      { name: '水', amount: '400ml' },
    ],
    steps: [
      '水に昆布を入れ、30分ほど浸けておく',
      '中火にかけ、沸騰直前で昆布を取り出す',
      'かつお節を加え、1分ほど煮出してこす',
      '豆腐を小さく切って加え、温まったら減塩味噌を溶き入れる',
      'わかめを加えて完成',
    ],
    estimatedSalt: 0.8,
    imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80',
    views: 1250,
    avgRating: 4.8,
    ratingCount: 89,
    isOfficial: false,
    createdAt: '2025-12-10',
  },
  {
    id: 'recipe-2',
    userId: 'user-3',
    userNickname: '太郎',
    title: 'レモン風味の塩鮭',
    category: '主菜',
    tags: ['酸味', '魚', '簡単'],
    ingredients: [
      { name: '甘塩鮭', amount: '1切れ' },
      { name: 'レモン汁', amount: '大さじ1' },
      { name: 'オリーブオイル', amount: '小さじ1' },
      { name: '黒こしょう', amount: '少々' },
      { name: 'パセリ', amount: '適量' },
    ],
    steps: [
      '鮭を水で洗い、キッチンペーパーで水気を拭く',
      'オーブンまたはグリルで焼く',
      '焼き上がったらレモン汁をかける',
      'オリーブオイルを回しかけ、黒こしょうとパセリを散らす',
    ],
    estimatedSalt: 1.2,
    imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80',
    views: 890,
    avgRating: 4.5,
    ratingCount: 56,
    isOfficial: false,
    createdAt: '2025-12-05',
  },
  {
    id: 'recipe-3',
    userId: 'admin',
    userNickname: 'umaiNa公式',
    title: '【公式】香味野菜たっぷり炒め',
    category: '主菜',
    tags: ['香味', '野菜', 'デバイス推奨'],
    ingredients: [
      { name: '鶏もも肉', amount: '150g' },
      { name: 'にんにく', amount: '2片' },
      { name: '生姜', amount: '1かけ' },
      { name: 'ネギ', amount: '1本' },
      { name: 'ピーマン', amount: '2個' },
      { name: '醤油', amount: '小さじ1' },
      { name: 'ごま油', amount: '大さじ1' },
    ],
    steps: [
      '鶏肉を一口大に切る',
      'にんにく、生姜をみじん切りにする',
      'フライパンにごま油を熱し、にんにくと生姜を炒める',
      '鶏肉を加えて火が通るまで炒める',
      '野菜を加え、醤油で味を整える',
    ],
    estimatedSalt: 0.9,
    imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&q=80',
    views: 2100,
    avgRating: 4.9,
    ratingCount: 145,
    isOfficial: true,
    currentLevel: 3,
    stimulusQuality: '塩味増強',
    createdAt: '2025-11-20',
  },
  {
    id: 'recipe-4',
    userId: 'user-4',
    userNickname: '花子',
    title: 'トマトの酸味で楽しむパスタ',
    category: '主食',
    tags: ['酸味', '洋食', 'パスタ'],
    ingredients: [
      { name: 'パスタ', amount: '80g' },
      { name: 'トマト缶（無塩）', amount: '1/2缶' },
      { name: 'にんにく', amount: '1片' },
      { name: 'オリーブオイル', amount: '大さじ1' },
      { name: 'バジル', amount: '適量' },
      { name: '黒こしょう', amount: '少々' },
    ],
    steps: [
      'パスタを茹でる（塩は入れない）',
      'にんにくをみじん切りにし、オリーブオイルで炒める',
      'トマト缶を加えて煮詰める',
      '茹でたパスタを和え、バジルと黒こしょうで仕上げる',
    ],
    estimatedSalt: 0.5,
    imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80',
    views: 670,
    avgRating: 4.3,
    ratingCount: 34,
    isOfficial: false,
    createdAt: '2025-12-08',
  },
  {
    id: 'recipe-5',
    userId: 'admin',
    userNickname: 'umaiNa公式',
    title: '【公式】電気味覚で楽しむ白身魚のソテー',
    category: '主菜',
    tags: ['魚', 'デバイス推奨', '洋食'],
    ingredients: [
      { name: '白身魚（タラ等）', amount: '1切れ' },
      { name: 'バター', amount: '10g' },
      { name: 'レモン', amount: '1/4個' },
      { name: 'ディル', amount: '適量' },
      { name: '小麦粉', amount: '適量' },
    ],
    steps: [
      '魚に軽く小麦粉をまぶす',
      'バターを溶かしたフライパンで両面を焼く',
      'レモンを絞り、ディルを添える',
      'デバイスレベル4で塩味を補強',
    ],
    estimatedSalt: 0.4,
    imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80',
    views: 1800,
    avgRating: 4.7,
    ratingCount: 98,
    isOfficial: true,
    currentLevel: 4,
    stimulusQuality: '塩味増強＋旨味',
    createdAt: '2025-11-25',
  },
  {
    id: 'recipe-6',
    userId: 'user-5',
    userNickname: '次郎',
    title: '香り豊かな減塩チャーハン',
    category: '主食',
    tags: ['香味', '中華', 'ごはん'],
    ingredients: [
      { name: 'ご飯', amount: '茶碗1杯' },
      { name: '卵', amount: '1個' },
      { name: 'ネギ', amount: '1/2本' },
      { name: '生姜', amount: '少々' },
      { name: '醤油', amount: '小さじ1/2' },
      { name: 'ごま油', amount: '大さじ1' },
    ],
    steps: [
      '卵を溶いておく',
      'ネギと生姜をみじん切りにする',
      'フライパンにごま油を熱し、卵を炒める',
      'ご飯を加えてパラパラになるまで炒める',
      'ネギ、生姜を加え、醤油で香り付け',
    ],
    estimatedSalt: 0.7,
    imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&q=80',
    views: 540,
    avgRating: 4.4,
    ratingCount: 28,
    isOfficial: false,
    createdAt: '2025-12-12',
  },
]

// Mock spots
export const mockSpots: Spot[] = [
  {
    id: 'spot-1',
    userId: 'user-1',
    userNickname: '健一',
    placeId: 'place-1',
    name: 'だし茶漬け えん 東京駅店',
    address: '東京都千代田区丸の内1-9-1',
    lat: 35.6812,
    lng: 139.7671,
    category: '和食',
    saltLevel: 'low',
    menuItems: [
      { name: '鯛だし茶漬け', description: '上品な鯛の出汁が効いた茶漬け', saltLevel: 'low' },
      { name: '梅だし茶漬け', description: '酸味でさっぱり楽しめる', saltLevel: 'low' },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=800&q=80',
    avgRating: 4.6,
    ratingCount: 42,
    createdAt: '2025-11-01',
  },
  {
    id: 'spot-2',
    userId: 'user-2',
    userNickname: '美香',
    placeId: 'place-2',
    name: 'soup stock tokyo 新宿店',
    address: '東京都新宿区新宿3-38-1',
    lat: 35.6896,
    lng: 139.7006,
    category: 'スープ',
    saltLevel: 'medium',
    menuItems: [
      { name: 'オマール海老のビスク', description: '海老の旨味が凝縮', saltLevel: 'medium' },
      { name: 'ボルシチ', description: '野菜の甘みが引き立つ', saltLevel: 'low' },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80',
    avgRating: 4.4,
    ratingCount: 38,
    createdAt: '2025-11-15',
  },
  {
    id: 'spot-3',
    userId: 'user-3',
    userNickname: '太郎',
    placeId: 'place-3',
    name: 'おぼんdeごはん 渋谷店',
    address: '東京都渋谷区宇田川町21-1',
    lat: 35.6595,
    lng: 139.6998,
    category: '定食',
    saltLevel: 'low',
    menuItems: [
      { name: '野菜たっぷり定食', description: '新鮮野菜をふんだんに使用', saltLevel: 'low' },
      { name: '焼き魚定食', description: '素材の味を活かした一品', saltLevel: 'low' },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80',
    avgRating: 4.7,
    ratingCount: 56,
    createdAt: '2025-10-20',
  },
  {
    id: 'spot-4',
    userId: 'user-4',
    userNickname: '花子',
    placeId: 'place-4',
    name: 'MUJI Diner 銀座',
    address: '東京都中央区銀座3-3-5',
    lat: 35.6721,
    lng: 139.7636,
    category: 'カフェ',
    saltLevel: 'low',
    menuItems: [
      { name: '素材を生かした定食', description: '無印良品ならではの素朴な味', saltLevel: 'low' },
      { name: '季節の野菜プレート', description: '旬の野菜を楽しめる', saltLevel: 'low' },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
    avgRating: 4.5,
    ratingCount: 67,
    createdAt: '2025-09-10',
  },
  {
    id: 'spot-5',
    userId: 'user-5',
    userNickname: '次郎',
    placeId: 'place-5',
    name: '蕎麦処 あさひ',
    address: '東京都文京区本郷3-19-7',
    lat: 35.7089,
    lng: 139.7600,
    category: '蕎麦',
    saltLevel: 'medium',
    menuItems: [
      { name: 'もりそば', description: '香り高い十割蕎麦', saltLevel: 'low' },
      { name: '天ぷらそば', description: 'サクサクの天ぷらと共に', saltLevel: 'medium' },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1519984388953-d2406bc725e1?w=800&q=80',
    avgRating: 4.3,
    ratingCount: 29,
    createdAt: '2025-11-25',
  },
  {
    id: 'spot-6',
    userId: 'user-1',
    userNickname: '健一',
    placeId: 'place-6',
    name: 'サブウェイ サンシャインシティアルパ店',
    address: '東京都豊島区東池袋3-1-1 サンシャインシティアルパ1F',
    lat: 35.7292,
    lng: 139.7193,
    category: 'サンドイッチ',
    saltLevel: 'low',
    menuItems: [
      { name: 'ベジーデライト', description: '新鮮野菜たっぷりのヘルシーサンド（塩分1.5g）', saltLevel: 'low' },
      { name: 'えびアボカド', description: 'ぷりぷり海老とアボカドの組み合わせ（塩分1.7g）', saltLevel: 'medium' },
      { name: 'ツナ', description: '定番ツナサンド（塩分1.9g）', saltLevel: 'medium' },
      { name: 'BLT', description: 'ベーコン・レタス・トマトの王道（塩分1.9g）', saltLevel: 'medium' },
      { name: 'ローストビーフ', description: 'ジューシーなローストビーフ（塩分2.4g）', saltLevel: 'medium' },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=800&q=80',
    avgRating: 4.1,
    ratingCount: 35,
    createdAt: '2026-01-10',
  },
  {
    id: 'spot-7',
    userId: 'user-2',
    userNickname: '美香',
    placeId: 'place-7',
    name: 'いきなりステーキ 新宿2丁目店',
    address: '東京都新宿区新宿2-5-11 千寿新宿ビル',
    lat: 35.6908,
    lng: 139.7073,
    category: 'ステーキ',
    saltLevel: 'low',
    menuItems: [
      { name: 'ヒレカットステーキ 100g', description: '柔らかヒレ肉を手軽に（塩分1.2g）', saltLevel: 'low' },
      { name: '赤身！肩ロースステーキ 150g', description: '赤身の旨味が凝縮（塩分1.6g）', saltLevel: 'medium' },
      { name: 'ワイルドステーキ 150g', description: '食べ応え抜群の看板メニュー（塩分1.6g）', saltLevel: 'medium' },
      { name: 'リブロースステーキ 150g', description: '脂の甘みが楽しめる（塩分1.6g）', saltLevel: 'medium' },
      { name: '特選ヒレステーキ 150g', description: '最上級の柔らかさ（塩分1.6g）', saltLevel: 'medium' },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800&q=80',
    avgRating: 4.3,
    ratingCount: 48,
    createdAt: '2026-01-08',
  },
  {
    id: 'spot-8',
    userId: 'user-3',
    userNickname: '太郎',
    placeId: 'place-8',
    name: 'そば太鼓亭 高槻城東店',
    address: '大阪府高槻市城東町1-15',
    lat: 34.8459,
    lng: 135.6172,
    category: '蕎麦',
    saltLevel: 'low',
    menuItems: [
      { name: '白ごはん', description: '炊きたてのご飯（塩分0.0g）', saltLevel: 'low' },
      { name: '福徳いなり', description: 'ふっくらお揚げのいなり寿司（塩分0.3g）', saltLevel: 'low' },
      { name: '梅むすび（海苔）', description: '梅の酸味が爽やかなおむすび（塩分0.7g）', saltLevel: 'low' },
      { name: '山とろ丼', description: 'とろろたっぷりのヘルシー丼（塩分1.9g）', saltLevel: 'medium' },
      { name: 'カレー丼', description: '和風だしのカレー丼（塩分2.5g）', saltLevel: 'medium' },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1519984388953-d2406bc725e1?w=800&q=80',
    avgRating: 4.4,
    ratingCount: 31,
    createdAt: '2026-01-12',
  },
  {
    id: 'spot-9',
    userId: 'user-4',
    userNickname: '花子',
    placeId: 'place-9',
    name: '大阪王将 東京日本橋店',
    address: '東京都中央区日本橋1-3-13 東京建物日本橋ビルB1階',
    lat: 35.6839,
    lng: 139.7744,
    category: '中華',
    saltLevel: 'low',
    menuItems: [
      { name: '元祖焼餃子 3個', description: 'パリッとジューシーな看板メニュー（塩分1.5g）', saltLevel: 'low' },
      { name: 'にんにく肉肉餃子', description: 'ガツンとにんにくの効いた餃子（塩分2.4g）', saltLevel: 'medium' },
      { name: '元祖焼餃子 6個', description: '餃子をたっぷり楽しめる（塩分3.1g）', saltLevel: 'high' },
      { name: '五目炒飯', description: '具だくさんの炒飯（塩分5.8g）', saltLevel: 'high' },
      { name: '中華丼', description: 'あんかけたっぷりの中華丼（塩分7.4g）', saltLevel: 'high' },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800&q=80',
    avgRating: 3.8,
    ratingCount: 22,
    createdAt: '2026-01-05',
  },
  {
    id: 'spot-10',
    userId: 'user-5',
    userNickname: '次郎',
    placeId: 'place-10',
    name: '大戸屋ごはん処 新丸の内センタービル店',
    address: '東京都千代田区丸の内1-6-2 新丸の内センタービルディング3F',
    lat: 35.6825,
    lng: 139.7650,
    category: '定食',
    saltLevel: 'high',
    menuItems: [
      { name: '大戸屋ランチ', description: '日替わりのバランス定食（塩分4.2g）', saltLevel: 'high' },
      { name: 'すけそう鱈と野菜の黒酢あん', description: '黒酢の酸味でさっぱり（塩分4.3g）', saltLevel: 'high' },
      { name: '鶏と野菜の黒酢あん', description: '人気No.1の黒酢あんかけ（塩分4.9g）', saltLevel: 'high' },
      { name: 'しまほっけともろみチキンの炭火焼き', description: '炭火焼きの香ばしさ（塩分5.1g）', saltLevel: 'high' },
      { name: '豚肩ロースの生姜焼き', description: 'すりおろし生しょうがたっぷり（塩分5.5g）', saltLevel: 'high' },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80',
    avgRating: 3.5,
    ratingCount: 19,
    createdAt: '2026-01-15',
  },
  {
    id: 'spot-11',
    userId: 'user-1',
    userNickname: '健一',
    placeId: 'place-11',
    name: 'ガスト 新宿三丁目店',
    address: '東京都新宿区新宿3-17-4 レミナビル4F',
    lat: 35.6917,
    lng: 139.7030,
    category: 'ファミレス',
    saltLevel: 'low',
    menuItems: [
      { name: '山盛りポテトフライ', description: 'シンプルな塩味のポテト（塩分1.0g）', saltLevel: 'low' },
      { name: 'チキテキスパイス焼き', description: 'スパイス香るチキンステーキ（塩分1.0g）', saltLevel: 'low' },
      { name: 'チーズINハンバーグ', description: 'とろけるチーズが絶品（塩分2.4g）', saltLevel: 'medium' },
      { name: 'レモンチキンソテー バジルソース', description: 'レモンの爽やかさとバジルの香り（塩分2.4g）', saltLevel: 'medium' },
      { name: 'ジューシー若鶏グリル 大葉おろし', description: '大葉おろしであっさり（塩分3.4g）', saltLevel: 'high' },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80',
    avgRating: 4.0,
    ratingCount: 44,
    createdAt: '2026-01-20',
  },
  {
    id: 'spot-12',
    userId: 'user-2',
    userNickname: '美香',
    placeId: 'place-12',
    name: 'カレーハウスCoCo壱番屋 JR秋葉原駅昭和通り口店',
    address: '東京都千代田区神田平河町4番地 渡辺ビル1階',
    lat: 35.6983,
    lng: 139.7731,
    category: 'カレー',
    saltLevel: 'medium',
    menuItems: [
      { name: '甘口ポークカレー', description: 'まろやかな甘口カレー（塩分2.5g）', saltLevel: 'medium' },
      { name: 'ビーフカレー', description: '牛肉の旨味が溶け込むカレー（塩分3.1g）', saltLevel: 'high' },
      { name: 'ポークカレー', description: '定番のポークカレー（塩分3.4g）', saltLevel: 'high' },
      { name: 'ココイチベジカレー', description: '野菜たっぷりのカレー（塩分3.8g）', saltLevel: 'high' },
      { name: 'ロースカツカレー', description: 'サクサクカツとカレーの定番（塩分4.3g）', saltLevel: 'high' },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80',
    avgRating: 3.6,
    ratingCount: 27,
    createdAt: '2026-01-18',
  },
  {
    id: 'spot-13',
    userId: 'user-3',
    userNickname: '太郎',
    placeId: 'place-13',
    name: 'マクドナルド 新宿西口店',
    address: '東京都新宿区西新宿1-17-1',
    lat: 35.6931,
    lng: 139.6990,
    category: 'ファストフード',
    saltLevel: 'low',
    menuItems: [
      { name: 'マックフライポテト（M）', description: '定番のフライドポテト（塩分0.7g）', saltLevel: 'low' },
      { name: 'ハンバーガー', description: 'シンプルな定番バーガー（塩分1.4g）', saltLevel: 'low' },
      { name: 'フィレオフィッシュ', description: '白身魚フライのバーガー（塩分1.6g）', saltLevel: 'medium' },
      { name: 'チーズバーガー', description: 'とろけるチーズが美味しい（塩分1.9g）', saltLevel: 'medium' },
      { name: 'ビッグマック', description: '2枚のパティと特製ソース（塩分2.7g）', saltLevel: 'medium' },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80',
    avgRating: 4.0,
    ratingCount: 52,
    createdAt: '2026-01-22',
  },
  {
    id: 'spot-14',
    userId: 'user-4',
    userNickname: '花子',
    placeId: 'place-14',
    name: '吉野家 西新宿1丁目店',
    address: '東京都新宿区西新宿1-19-11',
    lat: 35.6930,
    lng: 139.6980,
    category: '牛丼',
    saltLevel: 'low',
    menuItems: [
      { name: 'から揚げ 1個', description: 'サクッとジューシーな唐揚げ（塩分0.7g）', saltLevel: 'low' },
      { name: 'ハムエッグ納豆定食', description: '朝食にぴったりの定食（塩分2.6g）', saltLevel: 'medium' },
      { name: '焼魚牛小鉢定食', description: '焼魚と牛小鉢のセット（塩分3.6g）', saltLevel: 'high' },
      { name: '塩さば牛小鉢定食', description: '塩さばと牛小鉢のセット（塩分3.6g）', saltLevel: 'high' },
      { name: 'から揚げお新香定食', description: '唐揚げにお新香付き（塩分4.4g）', saltLevel: 'high' },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
    avgRating: 3.9,
    ratingCount: 38,
    createdAt: '2026-01-25',
  },
  {
    id: 'spot-15',
    userId: 'user-5',
    userNickname: '次郎',
    placeId: 'place-15',
    name: 'すき家 東京駅京橋店',
    address: '東京都中央区京橋1-1-9 レオ八重洲ビル1F',
    lat: 35.6785,
    lng: 139.7710,
    category: '牛丼',
    saltLevel: 'medium',
    menuItems: [
      { name: '牛丼（並盛）', description: '定番の牛丼（塩分2.5g）', saltLevel: 'medium' },
      { name: 'わさび山かけ牛丼（並盛）', description: 'わさびと山芋のさっぱり牛丼（塩分2.7g）', saltLevel: 'medium' },
      { name: 'ねぎ玉牛丼（並盛）', description: 'ねぎと玉子の牛丼（塩分3.3g）', saltLevel: 'high' },
      { name: '鬼おろしポン酢牛丼（並盛）', description: '大根おろしとポン酢でさっぱり（塩分3.5g）', saltLevel: 'high' },
      { name: 'とろ～り3種のチーズ牛丼（並盛）', description: '3種チーズがとろける（塩分3.6g）', saltLevel: 'high' },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=800&q=80',
    avgRating: 3.7,
    ratingCount: 33,
    createdAt: '2026-01-28',
  },
]

// Mock ratings/comments
export const mockRatings: Rating[] = [
  {
    id: 'rating-1',
    userId: 'user-1',
    userNickname: '健一',
    targetType: 'recipe',
    targetId: 'recipe-1',
    score: 5,
    comment: '出汁がしっかり効いていて、減塩とは思えない美味しさでした！毎日でも食べたいです。',
    createdAt: '2025-12-15',
  },
  {
    id: 'rating-2',
    userId: 'user-3',
    userNickname: '太郎',
    targetType: 'recipe',
    targetId: 'recipe-1',
    score: 5,
    comment: '家族にも好評でした。減塩生活が楽しくなりそうです。',
    createdAt: '2025-12-14',
  },
  {
    id: 'rating-3',
    userId: 'user-4',
    userNickname: '花子',
    targetType: 'spot',
    targetId: 'spot-1',
    score: 4,
    comment: '出汁の風味が素晴らしく、満足感がありました。駅近で便利です。',
    createdAt: '2025-12-10',
  },
]

// Rank configuration
export const rankConfig = {
  beginner: { name: 'ビギナー', minPoints: 0, color: '#94A3B8' },
  regular: { name: 'レギュラー', minPoints: 100, color: '#3B82F6' },
  expert: { name: 'エキスパート', minPoints: 500, color: '#8B5CF6' },
  master: { name: 'マスター', minPoints: 1000, color: '#FFD700' },
}

// Point actions
export const pointActions = {
  recipePost: 50,
  spotPost: 30,
  rating: 5,
  comment: 10,
  helpful: 3,
}

// Salt savings mock data
export const mockSaltSavings = {
  thisMonth: 45,
  total: 180,
  dailyData: [
    { date: '1月16日', amount: 3.2 },
    { date: '1月17日', amount: 2.8 },
    { date: '1月18日', amount: 4.1 },
    { date: '1月19日', amount: 2.5 },
    { date: '1月20日', amount: 3.8 },
    { date: '1月21日', amount: 3.0 },
    { date: '1月22日', amount: 2.9 },
  ],
}

// Categories
export const recipeCategories = ['主菜', '副菜', '汁物', '主食', 'デザート']
export const recipeTags = ['出汁', '酸味', '香味', '和食', '洋食', '中華', '簡単', 'デバイス推奨']
export const spotCategories = ['和食', '洋食', '中華', '定食', 'カフェ', 'スープ', '蕎麦', 'イタリアン', 'サンドイッチ', 'ステーキ', 'ファミレス', 'カレー', 'ファストフード', '牛丼']

// Device guide content
export const deviceGuide = {
  sections: [
    {
      title: 'はじめての方へ',
      items: [
        { title: 'umaiNaデバイスの特徴', content: '電気味覚技術を活用し、少ない塩分でも塩味を感じることができる革新的なデバイスです。' },
        { title: '電気味覚の仕組み', content: '微弱な電流を舌に流すことで、塩味や酸味を増強する技術です。安全性は臨床試験で確認されています。' },
        { title: '安全な使い方', content: '1日の使用時間は30分以内を推奨します。ペースメーカーをお使いの方はご使用をお控えください。' },
      ],
    },
    {
      title: '基本操作',
      items: [
        { title: '電源の入れ方', content: '電源ボタンを2秒長押しすると起動します。LEDが青く点灯したら使用可能です。' },
        { title: '電流レベルの調整', content: 'サイドのダイヤルで1〜5のレベルを調整できます。まずはレベル1から始めてください。' },
        { title: '充電方法', content: '付属のUSB-Cケーブルで充電してください。フル充電まで約2時間です。' },
      ],
    },
    {
      title: '効果的な使い方',
      items: [
        { title: '料理別の推奨レベル', content: '汁物：レベル2〜3、焼き魚：レベル3〜4、サラダ：レベル1〜2が目安です。' },
        { title: 'よくある質問', content: 'Q: 電流を感じにくい場合は？ A: 舌を少し湿らせてからお試しください。' },
        { title: 'トラブルシューティング', content: '動作しない場合は、充電状態をご確認ください。それでも解決しない場合はサポートへお問い合わせください。' },
      ],
    },
  ],
}

// FAQ
export const faqItems = [
  { question: 'デバイスが動かないのですが？', answer: '充電が十分かご確認ください。フル充電後も動作しない場合は、リセットボタンを細いピンで5秒押してください。' },
  { question: '電流を感じないのですが？', answer: '舌を水で湿らせてからお試しください。また、電流レベルを上げてみてください。' },
  { question: '充電できないのですが？', answer: 'ケーブルの接続を確認し、別のUSBポートもお試しください。それでも充電できない場合はサポートへご連絡ください。' },
  { question: '使用中に違和感を感じます', answer: 'すぐに使用を中止し、電流レベルを下げてお試しください。違和感が続く場合は使用をお控えいただき、医師にご相談ください。' },
]
