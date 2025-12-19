/**
 * 表单校验配置模块
 * 集中管理所有字段的校验规则和字段配置，提高可维护性和一致性
 */

/**
 * 统一的表单校验规则配置
 */
export const VALIDATION_RULES = {
  // 歌曲名称校验规则
  songName: [
    { required: true, message: '请填写歌曲名称' },
    { max: 100, message: '歌曲名称不能超过 100 个字符' },
    {
      pattern: /^[\u4e00-\u9fa5a-zA-Z0-9\s\-_（）《》【】]+$/,
      message: '歌曲名称只能包含中文、英文、数字、空格和常用符号',
    },
  ],

  // 艺术家姓名校验规则
  artistName: [
    { required: true, message: '请填写模仿的艺术家姓名' },
    { max: 50, message: '艺术家姓名不能超过 50 个字符' },
    {
      pattern: /^[\u4e00-\u9fa5a-zA-Z\s·•]+$/,
      message: '艺术家姓名只能包含中文、英文、空格和间隔符',
    },
  ],

  // 参考歌曲名称校验规则
  referenceSongTitle: [
    { required: true, message: '歌曲名称不能为空' },
    { max: 50, message: '歌曲名称不能超过 50 个字符' },
  ],

  // 参考歌曲艺术家校验规则
  referenceSongArtist: [{ max: 30, message: '演唱者名称不能超过 30 个字符' }],

  // 歌词校验规则
  lyrics: [
    { required: true, message: '请输入段落与歌词' },
    { min: 10, message: '歌词内容至少需要 10 个字符' },
    { max: 2000, message: '段落歌词长度不能超过 2000 字' },
    {
      validator: (_: any, value: string) => {
        if (!value) return Promise.resolve();

        // 检查是否包含段落标记
        const hasSectionMarkers = /[【】[\]<>（）]/.test(value);
        if (!hasSectionMarkers) {
          return Promise.reject(
            new Error('建议使用【主歌】、【副歌】等标记划分段落'),
          );
        }

        return Promise.resolve();
      },
    },
  ],

  // 语言选择校验规则
  language: [{ required: true, message: '请选择歌曲语言' }],
};

/**
 * 字段配置对象
 * 定义每个字段的通用属性配置
 */
export const FIELD_CONFIGS = {
  songName: {
    showCount: true,
    maxLength: 100,
  },
  artistName: {
    showCount: true,
    maxLength: 50,
  },
  referenceSongTitle: {
    showCount: true,
    maxLength: 50,
  },
  referenceSongArtist: {
    showCount: true,
    maxLength: 30,
  },
  lyrics: {
    showCount: true,
    autoSize: { minRows: 10, maxRows: 12 },
  },
};
