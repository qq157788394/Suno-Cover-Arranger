/**
 * 模型标签映射表 — 索引顺序与模型输出维度对应
 * 所有标签名已经过 Essentia 官方元数据 + MTG-Jamendo 标注数据核对
 */

/** MSD-MusiCNN 50 标签 */
export const GENRE_LABELS = [
  'rock', 'pop', 'alternative', 'indie', 'electronic',
  'female vocalists', 'dance', '00s', 'alternative rock', 'jazz',
  'beautiful', 'metal', 'chillout', 'male vocalists', 'classic rock',
  'soul', 'indie rock', 'Mellow', 'electronica', '80s',
  'folk', '90s', 'chill', 'instrumental', 'punk',
  'oldies', 'blues', 'hard rock', 'ambient', 'acoustic',
  'experimental', 'female vocalist', 'guitar', 'Hip-Hop', '70s',
  'party', 'country', 'easy listening', 'sexy', 'catchy',
  'funk', 'electro', 'heavy metal', 'Progressive rock', '60s',
  'rnb', 'indie pop', 'sad', 'House', 'happy',
];

/** 二分类标签 [负类, 正类] */
export const BINARY_LABELS: Record<string, [string, string]> = {
  mood_happy:      ['non_happy', 'happy'],
  mood_sad:        ['non_sad', 'sad'],
  mood_relaxed:    ['non_relaxed', 'relaxed'],
  mood_aggressive: ['non_aggressive', 'aggressive'],
  mood_acoustic:   ['non_acoustic', 'acoustic'],
  mood_electronic: ['non_electronic', 'electronic'],
  mood_party:      ['non_party', 'party'],
  danceability:    ['not_danceable', 'danceable'],
};

/** 多分类标签 */
export const MULTICLASS_LABELS: Record<string, string[]> = {
  // GTZAN benchmark (Tzanetakis 2001), 10 genres — 来源: MTG-Jamendo 标注
  genre_tzanetakis: ['Blues', 'Classical', 'Country', 'Disco', 'Hip Hop', 'Jazz', 'Metal', 'Pop', 'Reggae', 'Rock'],
  // 电子风格子分类 — 来源: MTG-Jamendo 标注, "ambeint" 校正为 "Ambient"
  genre_electronic: ['Ambient', 'Drum & Bass', 'House', 'Techno', 'Trance'],
  // UrbanSound8K 环境声音分类 — 来源: urbansound8k 数据集官方 10 类
  urbansound8k:     ['Air Conditioner', 'Car Horn', 'Children Playing', 'Dog Bark',
                     'Drilling', 'Engine Idling', 'Gun Shot', 'Jackhammer', 'Siren', 'Street Music'],
};

/** 获取模型标签 */
export function getLabels(modelName: string, numClasses: number): string[] {
  if (modelName === 'genre') return GENRE_LABELS.slice(0, numClasses);
  if (BINARY_LABELS[modelName]) return BINARY_LABELS[modelName];
  if (MULTICLASS_LABELS[modelName]) return MULTICLASS_LABELS[modelName];
  return Array.from({ length: numClasses }, (_, i) => `class_${i}`);
}
