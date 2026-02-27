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

// Salt savings mock data (until real tracking exists)
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
