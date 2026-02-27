-- =====================================================
-- umaiNa Seed Data
-- Generated from src/lib/mock-data.ts
-- =====================================================
--
-- Fixed UUIDs for seed users:
--   user-1 (健一): 00000000-0000-0000-0000-000000000001
--   user-2 (美香): 00000000-0000-0000-0000-000000000002
--   user-3 (太郎): 00000000-0000-0000-0000-000000000003
--   user-4 (花子): 00000000-0000-0000-0000-000000000004
--   user-5 (次郎): 00000000-0000-0000-0000-000000000005
--   admin  (umaiNa公式): 00000000-0000-0000-0000-000000000006
-- =====================================================

-- =====================================================
-- Step 1: Disable RLS on all tables
-- =====================================================
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.spots DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings DISABLE ROW LEVEL SECURITY;

-- =====================================================
-- Step 2: Drop FK constraints temporarily
-- =====================================================
-- profiles references auth.users(id)
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_pkey CASCADE;
ALTER TABLE public.profiles ADD PRIMARY KEY (id);

-- recipes references profiles(id)
ALTER TABLE public.recipes DROP CONSTRAINT IF EXISTS recipes_user_id_fkey;

-- spots references profiles(id)
ALTER TABLE public.spots DROP CONSTRAINT IF EXISTS spots_user_id_fkey;

-- ratings references profiles(id)
ALTER TABLE public.ratings DROP CONSTRAINT IF EXISTS ratings_user_id_fkey;

-- =====================================================
-- Step 3: Insert seed profiles
-- =====================================================
INSERT INTO public.profiles (id, nickname, email, age_group, reduction_reason, rank, points, is_device_owner, device_number, created_at) VALUES
  ('00000000-0000-0000-0000-000000000001', '健一', 'test@umaina.jp', '60代', '慢性腎臓病（CKD）', 'regular', 280, TRUE, 'UMN-2025-001234', '2025-10-15T00:00:00+09:00'),
  ('00000000-0000-0000-0000-000000000002', '美香', 'demo@umaina.jp', '50代', '高血圧', 'expert', 650, FALSE, NULL, '2025-08-20T00:00:00+09:00'),
  ('00000000-0000-0000-0000-000000000003', '太郎', 'owner@umaina.jp', '40代', '予防・健康維持', 'master', 1250, TRUE, 'UMN-2025-005678', '2025-06-01T00:00:00+09:00'),
  ('00000000-0000-0000-0000-000000000004', '花子', 'hanako@umaina.jp', '30代', '予防・健康維持', 'beginner', 50, FALSE, NULL, '2025-11-01T00:00:00+09:00'),
  ('00000000-0000-0000-0000-000000000005', '次郎', 'jiro@umaina.jp', '50代', '高血圧', 'beginner', 30, FALSE, NULL, '2025-12-01T00:00:00+09:00'),
  ('00000000-0000-0000-0000-000000000006', 'umaiNa公式', 'admin@umaina.jp', '', '', 'master', 9999, TRUE, NULL, '2025-01-01T00:00:00+09:00');

-- =====================================================
-- Step 4: Insert seed recipes
-- =====================================================
INSERT INTO public.recipes (user_id, user_nickname, title, category, tags, ingredients, steps, estimated_salt, image_url, views, avg_rating, rating_count, is_official, current_level, stimulus_quality, created_at) VALUES
-- recipe-1: 出汁香る減塩味噌汁
(
  '00000000-0000-0000-0000-000000000002',
  '美香',
  '出汁香る減塩味噌汁',
  '汁物',
  '["出汁", "和食", "簡単"]'::jsonb,
  '[{"name": "昆布", "amount": "5cm"}, {"name": "かつお節", "amount": "10g"}, {"name": "減塩味噌", "amount": "大さじ1"}, {"name": "豆腐", "amount": "1/4丁"}, {"name": "わかめ", "amount": "適量"}, {"name": "水", "amount": "400ml"}]'::jsonb,
  '["水に昆布を入れ、30分ほど浸けておく", "中火にかけ、沸騰直前で昆布を取り出す", "かつお節を加え、1分ほど煮出してこす", "豆腐を小さく切って加え、温まったら減塩味噌を溶き入れる", "わかめを加えて完成"]'::jsonb,
  0.8,
  'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80',
  1250,
  4.8,
  89,
  FALSE,
  NULL,
  NULL,
  '2025-12-10T00:00:00+09:00'
),
-- recipe-2: レモン風味の塩鮭
(
  '00000000-0000-0000-0000-000000000003',
  '太郎',
  'レモン風味の塩鮭',
  '主菜',
  '["酸味", "魚", "簡単"]'::jsonb,
  '[{"name": "甘塩鮭", "amount": "1切れ"}, {"name": "レモン汁", "amount": "大さじ1"}, {"name": "オリーブオイル", "amount": "小さじ1"}, {"name": "黒こしょう", "amount": "少々"}, {"name": "パセリ", "amount": "適量"}]'::jsonb,
  '["鮭を水で洗い、キッチンペーパーで水気を拭く", "オーブンまたはグリルで焼く", "焼き上がったらレモン汁をかける", "オリーブオイルを回しかけ、黒こしょうとパセリを散らす"]'::jsonb,
  1.2,
  'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&q=80',
  890,
  4.5,
  56,
  FALSE,
  NULL,
  NULL,
  '2025-12-05T00:00:00+09:00'
),
-- recipe-3: 【公式】香味野菜たっぷり炒め
(
  '00000000-0000-0000-0000-000000000006',
  'umaiNa公式',
  '【公式】香味野菜たっぷり炒め',
  '主菜',
  '["香味", "野菜", "デバイス推奨"]'::jsonb,
  '[{"name": "鶏もも肉", "amount": "150g"}, {"name": "にんにく", "amount": "2片"}, {"name": "生姜", "amount": "1かけ"}, {"name": "ネギ", "amount": "1本"}, {"name": "ピーマン", "amount": "2個"}, {"name": "醤油", "amount": "小さじ1"}, {"name": "ごま油", "amount": "大さじ1"}]'::jsonb,
  '["鶏肉を一口大に切る", "にんにく、生姜をみじん切りにする", "フライパンにごま油を熱し、にんにくと生姜を炒める", "鶏肉を加えて火が通るまで炒める", "野菜を加え、醤油で味を整える"]'::jsonb,
  0.9,
  'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&q=80',
  2100,
  4.9,
  145,
  TRUE,
  3,
  '塩味増強',
  '2025-11-20T00:00:00+09:00'
),
-- recipe-4: トマトの酸味で楽しむパスタ
(
  '00000000-0000-0000-0000-000000000004',
  '花子',
  'トマトの酸味で楽しむパスタ',
  '主食',
  '["酸味", "洋食", "パスタ"]'::jsonb,
  '[{"name": "パスタ", "amount": "80g"}, {"name": "トマト缶（無塩）", "amount": "1/2缶"}, {"name": "にんにく", "amount": "1片"}, {"name": "オリーブオイル", "amount": "大さじ1"}, {"name": "バジル", "amount": "適量"}, {"name": "黒こしょう", "amount": "少々"}]'::jsonb,
  '["パスタを茹でる（塩は入れない）", "にんにくをみじん切りにし、オリーブオイルで炒める", "トマト缶を加えて煮詰める", "茹でたパスタを和え、バジルと黒こしょうで仕上げる"]'::jsonb,
  0.5,
  'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80',
  670,
  4.3,
  34,
  FALSE,
  NULL,
  NULL,
  '2025-12-08T00:00:00+09:00'
),
-- recipe-5: 【公式】電気味覚で楽しむ白身魚のソテー
(
  '00000000-0000-0000-0000-000000000006',
  'umaiNa公式',
  '【公式】電気味覚で楽しむ白身魚のソテー',
  '主菜',
  '["魚", "デバイス推奨", "洋食"]'::jsonb,
  '[{"name": "白身魚（タラ等）", "amount": "1切れ"}, {"name": "バター", "amount": "10g"}, {"name": "レモン", "amount": "1/4個"}, {"name": "ディル", "amount": "適量"}, {"name": "小麦粉", "amount": "適量"}]'::jsonb,
  '["魚に軽く小麦粉をまぶす", "バターを溶かしたフライパンで両面を焼く", "レモンを絞り、ディルを添える", "デバイスレベル4で塩味を補強"]'::jsonb,
  0.4,
  'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&q=80',
  1800,
  4.7,
  98,
  TRUE,
  4,
  '塩味増強＋旨味',
  '2025-11-25T00:00:00+09:00'
),
-- recipe-6: 香り豊かな減塩チャーハン
(
  '00000000-0000-0000-0000-000000000005',
  '次郎',
  '香り豊かな減塩チャーハン',
  '主食',
  '["香味", "中華", "ごはん"]'::jsonb,
  '[{"name": "ご飯", "amount": "茶碗1杯"}, {"name": "卵", "amount": "1個"}, {"name": "ネギ", "amount": "1/2本"}, {"name": "生姜", "amount": "少々"}, {"name": "醤油", "amount": "小さじ1/2"}, {"name": "ごま油", "amount": "大さじ1"}]'::jsonb,
  '["卵を溶いておく", "ネギと生姜をみじん切りにする", "フライパンにごま油を熱し、卵を炒める", "ご飯を加えてパラパラになるまで炒める", "ネギ、生姜を加え、醤油で香り付け"]'::jsonb,
  0.7,
  'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&q=80',
  540,
  4.4,
  28,
  FALSE,
  NULL,
  NULL,
  '2025-12-12T00:00:00+09:00'
);

-- =====================================================
-- Step 5: Insert seed spots
-- =====================================================
INSERT INTO public.spots (user_id, user_nickname, place_id, name, address, lat, lng, category, salt_level, menu_items, image_url, avg_rating, rating_count, created_at) VALUES
-- spot-1: だし茶漬け えん 東京駅店
(
  '00000000-0000-0000-0000-000000000001',
  '健一',
  'place-1',
  'だし茶漬け えん 東京駅店',
  '東京都千代田区丸の内1-9-1',
  35.6812,
  139.7671,
  '和食',
  'low',
  '[{"name": "鯛だし茶漬け", "description": "上品な鯛の出汁が効いた茶漬け", "saltLevel": "low"}, {"name": "梅だし茶漬け", "description": "酸味でさっぱり楽しめる", "saltLevel": "low"}]'::jsonb,
  'https://images.unsplash.com/photo-1553621042-f6e147245754?w=800&q=80',
  4.6,
  42,
  '2025-11-01T00:00:00+09:00'
),
-- spot-2: soup stock tokyo 新宿店
(
  '00000000-0000-0000-0000-000000000002',
  '美香',
  'place-2',
  'soup stock tokyo 新宿店',
  '東京都新宿区新宿3-38-1',
  35.6896,
  139.7006,
  'スープ',
  'medium',
  '[{"name": "オマール海老のビスク", "description": "海老の旨味が凝縮", "saltLevel": "medium"}, {"name": "ボルシチ", "description": "野菜の甘みが引き立つ", "saltLevel": "low"}]'::jsonb,
  'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80',
  4.4,
  38,
  '2025-11-15T00:00:00+09:00'
),
-- spot-3: おぼんdeごはん 渋谷店
(
  '00000000-0000-0000-0000-000000000003',
  '太郎',
  'place-3',
  'おぼんdeごはん 渋谷店',
  '東京都渋谷区宇田川町21-1',
  35.6595,
  139.6998,
  '定食',
  'low',
  '[{"name": "野菜たっぷり定食", "description": "新鮮野菜をふんだんに使用", "saltLevel": "low"}, {"name": "焼き魚定食", "description": "素材の味を活かした一品", "saltLevel": "low"}]'::jsonb,
  'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80',
  4.7,
  56,
  '2025-10-20T00:00:00+09:00'
),
-- spot-4: MUJI Diner 銀座
(
  '00000000-0000-0000-0000-000000000004',
  '花子',
  'place-4',
  'MUJI Diner 銀座',
  '東京都中央区銀座3-3-5',
  35.6721,
  139.7636,
  'カフェ',
  'low',
  '[{"name": "素材を生かした定食", "description": "無印良品ならではの素朴な味", "saltLevel": "low"}, {"name": "季節の野菜プレート", "description": "旬の野菜を楽しめる", "saltLevel": "low"}]'::jsonb,
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
  4.5,
  67,
  '2025-09-10T00:00:00+09:00'
),
-- spot-5: 蕎麦処 あさひ
(
  '00000000-0000-0000-0000-000000000005',
  '次郎',
  'place-5',
  '蕎麦処 あさひ',
  '東京都文京区本郷3-19-7',
  35.7089,
  139.7600,
  '蕎麦',
  'medium',
  '[{"name": "もりそば", "description": "香り高い十割蕎麦", "saltLevel": "low"}, {"name": "天ぷらそば", "description": "サクサクの天ぷらと共に", "saltLevel": "medium"}]'::jsonb,
  'https://images.unsplash.com/photo-1519984388953-d2406bc725e1?w=800&q=80',
  4.3,
  29,
  '2025-11-25T00:00:00+09:00'
),
-- spot-6: サブウェイ サンシャインシティアルパ店
(
  '00000000-0000-0000-0000-000000000001',
  '健一',
  'place-6',
  'サブウェイ サンシャインシティアルパ店',
  '東京都豊島区東池袋3-1-1 サンシャインシティアルパ1F',
  35.7292,
  139.7193,
  'サンドイッチ',
  'low',
  '[{"name": "ベジーデライト", "description": "新鮮野菜たっぷりのヘルシーサンド（塩分1.5g）", "saltLevel": "low"}, {"name": "えびアボカド", "description": "ぷりぷり海老とアボカドの組み合わせ（塩分1.7g）", "saltLevel": "medium"}, {"name": "ツナ", "description": "定番ツナサンド（塩分1.9g）", "saltLevel": "medium"}, {"name": "BLT", "description": "ベーコン・レタス・トマトの王道（塩分1.9g）", "saltLevel": "medium"}, {"name": "ローストビーフ", "description": "ジューシーなローストビーフ（塩分2.4g）", "saltLevel": "medium"}]'::jsonb,
  'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=800&q=80',
  4.1,
  35,
  '2026-01-10T00:00:00+09:00'
),
-- spot-7: いきなりステーキ 新宿2丁目店
(
  '00000000-0000-0000-0000-000000000002',
  '美香',
  'place-7',
  'いきなりステーキ 新宿2丁目店',
  '東京都新宿区新宿2-5-11 千寿新宿ビル',
  35.6908,
  139.7073,
  'ステーキ',
  'low',
  '[{"name": "ヒレカットステーキ 100g", "description": "柔らかヒレ肉を手軽に（塩分1.2g）", "saltLevel": "low"}, {"name": "赤身！肩ロースステーキ 150g", "description": "赤身の旨味が凝縮（塩分1.6g）", "saltLevel": "medium"}, {"name": "ワイルドステーキ 150g", "description": "食べ応え抜群の看板メニュー（塩分1.6g）", "saltLevel": "medium"}, {"name": "リブロースステーキ 150g", "description": "脂の甘みが楽しめる（塩分1.6g）", "saltLevel": "medium"}, {"name": "特選ヒレステーキ 150g", "description": "最上級の柔らかさ（塩分1.6g）", "saltLevel": "medium"}]'::jsonb,
  'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800&q=80',
  4.3,
  48,
  '2026-01-08T00:00:00+09:00'
),
-- spot-8: そば太鼓亭 高槻城東店
(
  '00000000-0000-0000-0000-000000000003',
  '太郎',
  'place-8',
  'そば太鼓亭 高槻城東店',
  '大阪府高槻市城東町1-15',
  34.8459,
  135.6172,
  '蕎麦',
  'low',
  '[{"name": "白ごはん", "description": "炊きたてのご飯（塩分0.0g）", "saltLevel": "low"}, {"name": "福徳いなり", "description": "ふっくらお揚げのいなり寿司（塩分0.3g）", "saltLevel": "low"}, {"name": "梅むすび（海苔）", "description": "梅の酸味が爽やかなおむすび（塩分0.7g）", "saltLevel": "low"}, {"name": "山とろ丼", "description": "とろろたっぷりのヘルシー丼（塩分1.9g）", "saltLevel": "medium"}, {"name": "カレー丼", "description": "和風だしのカレー丼（塩分2.5g）", "saltLevel": "medium"}]'::jsonb,
  'https://images.unsplash.com/photo-1519984388953-d2406bc725e1?w=800&q=80',
  4.4,
  31,
  '2026-01-12T00:00:00+09:00'
),
-- spot-9: 大阪王将 東京日本橋店
(
  '00000000-0000-0000-0000-000000000004',
  '花子',
  'place-9',
  '大阪王将 東京日本橋店',
  '東京都中央区日本橋1-3-13 東京建物日本橋ビルB1階',
  35.6839,
  139.7744,
  '中華',
  'low',
  '[{"name": "元祖焼餃子 3個", "description": "パリッとジューシーな看板メニュー（塩分1.5g）", "saltLevel": "low"}, {"name": "にんにく肉肉餃子", "description": "ガツンとにんにくの効いた餃子（塩分2.4g）", "saltLevel": "medium"}, {"name": "元祖焼餃子 6個", "description": "餃子をたっぷり楽しめる（塩分3.1g）", "saltLevel": "high"}, {"name": "五目炒飯", "description": "具だくさんの炒飯（塩分5.8g）", "saltLevel": "high"}, {"name": "中華丼", "description": "あんかけたっぷりの中華丼（塩分7.4g）", "saltLevel": "high"}]'::jsonb,
  'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800&q=80',
  3.8,
  22,
  '2026-01-05T00:00:00+09:00'
),
-- spot-10: 大戸屋ごはん処 新丸の内センタービル店
(
  '00000000-0000-0000-0000-000000000005',
  '次郎',
  'place-10',
  '大戸屋ごはん処 新丸の内センタービル店',
  '東京都千代田区丸の内1-6-2 新丸の内センタービルディング3F',
  35.6825,
  139.7650,
  '定食',
  'high',
  '[{"name": "大戸屋ランチ", "description": "日替わりのバランス定食（塩分4.2g）", "saltLevel": "high"}, {"name": "すけそう鱈と野菜の黒酢あん", "description": "黒酢の酸味でさっぱり（塩分4.3g）", "saltLevel": "high"}, {"name": "鶏と野菜の黒酢あん", "description": "人気No.1の黒酢あんかけ（塩分4.9g）", "saltLevel": "high"}, {"name": "しまほっけともろみチキンの炭火焼き", "description": "炭火焼きの香ばしさ（塩分5.1g）", "saltLevel": "high"}, {"name": "豚肩ロースの生姜焼き", "description": "すりおろし生しょうがたっぷり（塩分5.5g）", "saltLevel": "high"}]'::jsonb,
  'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80',
  3.5,
  19,
  '2026-01-15T00:00:00+09:00'
),
-- spot-11: ガスト 新宿三丁目店
(
  '00000000-0000-0000-0000-000000000001',
  '健一',
  'place-11',
  'ガスト 新宿三丁目店',
  '東京都新宿区新宿3-17-4 レミナビル4F',
  35.6917,
  139.7030,
  'ファミレス',
  'low',
  '[{"name": "山盛りポテトフライ", "description": "シンプルな塩味のポテト（塩分1.0g）", "saltLevel": "low"}, {"name": "チキテキスパイス焼き", "description": "スパイス香るチキンステーキ（塩分1.0g）", "saltLevel": "low"}, {"name": "チーズINハンバーグ", "description": "とろけるチーズが絶品（塩分2.4g）", "saltLevel": "medium"}, {"name": "レモンチキンソテー バジルソース", "description": "レモンの爽やかさとバジルの香り（塩分2.4g）", "saltLevel": "medium"}, {"name": "ジューシー若鶏グリル 大葉おろし", "description": "大葉おろしであっさり（塩分3.4g）", "saltLevel": "high"}]'::jsonb,
  'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80',
  4.0,
  44,
  '2026-01-20T00:00:00+09:00'
),
-- spot-12: カレーハウスCoCo壱番屋 JR秋葉原駅昭和通り口店
(
  '00000000-0000-0000-0000-000000000002',
  '美香',
  'place-12',
  'カレーハウスCoCo壱番屋 JR秋葉原駅昭和通り口店',
  '東京都千代田区神田平河町4番地 渡辺ビル1階',
  35.6983,
  139.7731,
  'カレー',
  'medium',
  '[{"name": "甘口ポークカレー", "description": "まろやかな甘口カレー（塩分2.5g）", "saltLevel": "medium"}, {"name": "ビーフカレー", "description": "牛肉の旨味が溶け込むカレー（塩分3.1g）", "saltLevel": "high"}, {"name": "ポークカレー", "description": "定番のポークカレー（塩分3.4g）", "saltLevel": "high"}, {"name": "ココイチベジカレー", "description": "野菜たっぷりのカレー（塩分3.8g）", "saltLevel": "high"}, {"name": "ロースカツカレー", "description": "サクサクカツとカレーの定番（塩分4.3g）", "saltLevel": "high"}]'::jsonb,
  'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80',
  3.6,
  27,
  '2026-01-18T00:00:00+09:00'
),
-- spot-13: マクドナルド 新宿西口店
(
  '00000000-0000-0000-0000-000000000003',
  '太郎',
  'place-13',
  'マクドナルド 新宿西口店',
  '東京都新宿区西新宿1-17-1',
  35.6931,
  139.6990,
  'ファストフード',
  'low',
  '[{"name": "マックフライポテト（M）", "description": "定番のフライドポテト（塩分0.7g）", "saltLevel": "low"}, {"name": "ハンバーガー", "description": "シンプルな定番バーガー（塩分1.4g）", "saltLevel": "low"}, {"name": "フィレオフィッシュ", "description": "白身魚フライのバーガー（塩分1.6g）", "saltLevel": "medium"}, {"name": "チーズバーガー", "description": "とろけるチーズが美味しい（塩分1.9g）", "saltLevel": "medium"}, {"name": "ビッグマック", "description": "2枚のパティと特製ソース（塩分2.7g）", "saltLevel": "medium"}]'::jsonb,
  'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80',
  4.0,
  52,
  '2026-01-22T00:00:00+09:00'
),
-- spot-14: 吉野家 西新宿1丁目店
(
  '00000000-0000-0000-0000-000000000004',
  '花子',
  'place-14',
  '吉野家 西新宿1丁目店',
  '東京都新宿区西新宿1-19-11',
  35.6930,
  139.6980,
  '牛丼',
  'low',
  '[{"name": "から揚げ 1個", "description": "サクッとジューシーな唐揚げ（塩分0.7g）", "saltLevel": "low"}, {"name": "ハムエッグ納豆定食", "description": "朝食にぴったりの定食（塩分2.6g）", "saltLevel": "medium"}, {"name": "焼魚牛小鉢定食", "description": "焼魚と牛小鉢のセット（塩分3.6g）", "saltLevel": "high"}, {"name": "塩さば牛小鉢定食", "description": "塩さばと牛小鉢のセット（塩分3.6g）", "saltLevel": "high"}, {"name": "から揚げお新香定食", "description": "唐揚げにお新香付き（塩分4.4g）", "saltLevel": "high"}]'::jsonb,
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
  3.9,
  38,
  '2026-01-25T00:00:00+09:00'
),
-- spot-15: すき家 東京駅京橋店
(
  '00000000-0000-0000-0000-000000000005',
  '次郎',
  'place-15',
  'すき家 東京駅京橋店',
  '東京都中央区京橋1-1-9 レオ八重洲ビル1F',
  35.6785,
  139.7710,
  '牛丼',
  'medium',
  '[{"name": "牛丼（並盛）", "description": "定番の牛丼（塩分2.5g）", "saltLevel": "medium"}, {"name": "わさび山かけ牛丼（並盛）", "description": "わさびと山芋のさっぱり牛丼（塩分2.7g）", "saltLevel": "medium"}, {"name": "ねぎ玉牛丼（並盛）", "description": "ねぎと玉子の牛丼（塩分3.3g）", "saltLevel": "high"}, {"name": "鬼おろしポン酢牛丼（並盛）", "description": "大根おろしとポン酢でさっぱり（塩分3.5g）", "saltLevel": "high"}, {"name": "とろ～り3種のチーズ牛丼（並盛）", "description": "3種チーズがとろける（塩分3.6g）", "saltLevel": "high"}]'::jsonb,
  'https://images.unsplash.com/photo-1555126634-323283e090fa?w=800&q=80',
  3.7,
  33,
  '2026-01-28T00:00:00+09:00'
);

-- =====================================================
-- Step 6: Re-add FK constraints (NOT VALID to skip validation of existing rows)
-- =====================================================
ALTER TABLE public.profiles ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE NOT VALID;
ALTER TABLE public.recipes ADD CONSTRAINT recipes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE NOT VALID;
ALTER TABLE public.spots ADD CONSTRAINT spots_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE NOT VALID;
ALTER TABLE public.ratings ADD CONSTRAINT ratings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE NOT VALID;

-- =====================================================
-- Step 7: Re-enable RLS on all tables
-- =====================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- Done! Seed data has been inserted.
-- =====================================================
-- Summary:
--   6 profiles (3 test users + 2 additional users + 1 admin)
--   6 recipes  (2 official + 4 community)
--   15 spots   (various restaurants across Tokyo and Osaka)
-- =====================================================
