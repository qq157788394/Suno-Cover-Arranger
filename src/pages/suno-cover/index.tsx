import { CopyOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import {
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Form,
  Input,
  message,
  Row,
  Select,
  Space,
  Typography,
} from 'antd';
import React, { useEffect, useState } from 'react';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

// 定义参考歌曲类型
interface ReferenceSong {
  title: string;
  artist?: string;
}

// 定义输入数据类型
interface GenerateRequest {
  apiKey: string;
  song_language: string;
  target_artist: string;
  reference_songs: ReferenceSong[];
  style_note?: string;
  extra_note?: string;
  lyrics_raw: string;
  rememberApiKey?: boolean;
}

const SunoCover: React.FC = () => {
  // 表单实例
  const [form] = Form.useForm<GenerateRequest>();

  // 状态管理
  const [loading, setLoading] = useState(false);
  const [stylesResult, setStylesResult] = useState('');
  const [lyricsResult, setLyricsResult] = useState('');
  const [isApiKeyVisible, setIsApiKeyVisible] = useState(false);

  // 从localStorage加载API Key
  useEffect(() => {
    const savedApiKey = localStorage.getItem('deepseekApiKey');
    if (savedApiKey) {
      form.setFieldsValue({
        apiKey: savedApiKey,
        rememberApiKey: true,
      });
    }
  }, [form]);

  // 生成用户提示模板
  const generateUserPrompt = (values: GenerateRequest): string => {
    // 歌曲语言映射
    const languageMap: Record<string, string> = {
      Mandarin: 'Mandarin Chinese',
      Cantonese: 'Cantonese',
      Minnan: 'Minnan',
      English: 'English',
      Korean: 'Korean',
      Japanese: 'Japanese',
      Other: 'Other',
    };

    // 生成参考歌曲块
    const referenceSongsBlock =
      values.reference_songs.length > 0
        ? values.reference_songs
            .map(
              (song) =>
                `${song.title} by ${song.artist || values.target_artist}`,
            )
            .join('\n')
        : 'None';

    // 填充模板
    return `You are generating Suno "Styles" and "Lyrics" prompts for a COVER version of a song. Read all the information below carefully and then produce the final output strictly following the system rules and the format requirements.

------------------------------
[1] Song language and context
------------------------------

- Song language: ${languageMap[values.song_language] || 'Other'} .
- The lyrics are provided in this language and MUST be preserved exactly.
- This is a COVER version, not an original composition. You should shape the sound to match the target artist and references below.

------------------------------
[2] Target artist and references
------------------------------

- Target cover artist (user input, may be in Chinese or another language):
  "${values.target_artist}"

- Reference songs from the user (if any):
  ${referenceSongsBlock}

These names indicate the general style, vocal approach, and arrangement flavor you should lean toward. You do NOT need to describe these songs explicitly, but your Styles and section attributes should feel consistent with this artist and these references.

------------------------------
[3] User style notes (free-form, for your understanding only)
------------------------------

The user has provided extra style notes in their own words (often Chinese). You may use these notes to refine dynamics, emotion curve, and arrangement choices, but they are NOT additional lyrics.

- User style note (may be empty):
  "${values.style_note || ''}"

- Extra note (may be empty, can include scene / audience / platform, etc.):
  "${values.extra_note || ''}"

You can understand these notes in any language, but you MUST still output Styles and all [Key: Value] attributes in English.

------------------------------
[4] User lyrics (DO NOT MODIFY)
------------------------------

Below are the complete lyrics provided by the user, with their own section labels and line breaks. They may use Chinese labels such as 【主歌】、【副歌】 or non-standard English labels like [verse], [chorus], etc.

You MUST:
- Keep all lyric lines exactly as they are.
- Use these labels only to infer your standardized section labels.
- NOT copy these raw labels into your final output; instead, replace them with standardized English labels such as [Verse 1], [Chorus], [Bridge], [Intro], etc.

Here are the raw lyrics:

${values.lyrics_raw}

------------------------------
[5] Your output task
------------------------------

Now, using everything above and following the system rules, you MUST:

1) Generate the "Styles" section in English
- A single paragraph of 800–900 characters (hard limit 1000).
- It should describe the overall sound of this COVER version, taking into account:
  - The song language: ${languageMap[values.song_language] || 'Other'} .
  - The target artist: ${values.target_artist}.
  - The reference songs (if any).
  - The user style notes and extra note.
- Mention genre / style, vocal character, dynamic contour, instrumentation, arrangement, and production / space feel.

2) Generate the "Lyrics" section as an attribute list
- Split the song into logical sections using standardized English labels in square brackets:
  [Intro], [Verse 1], [Verse 2], [Pre-Chorus], [Chorus], [Chorus 2], [Bridge], [Interlude], [Outro], etc.
- For each section:
  - Create 2–4 attribute lines in the form [Key: Value], using English Keys (Vocal, Dynamics, Instrument, Texture, Mood, Arrangement, etc.) and concise English Values.
  - Then paste the original lyric lines for that section exactly as provided, without any change.
- For purely instrumental sections (no lyrics), only write the attributes and make it clear there is no vocal.

------------------------------
[6] Output format (VERY IMPORTANT)
------------------------------

Return your answer in EXACTLY this Markdown structure and nothing else:

### Styles
\`\`\`text
Characters: <N>
(put the Styles paragraph here in English, MUST be under 900 characters)
\`\`\`

### Lyrics
\`\`\`text
(put the full Lyrics attribute list here, with all sections, attributes, and original lyrics)
\`\`\`

Do NOT add any extra headings, explanations, or comments outside this format.`;
  };

  // 调用DeepSeek API
  const callDeepSeekAPI = async (values: GenerateRequest) => {
    setLoading(true);

    try {
      const systemPrompt = `You are a senior Suno prompt engineer. Your job is to generate high-quality "Styles" and "Lyrics" prompts for cover songs in Suno (v3/v4/v5), especially for Chinese and East Asian songs (Mandarin, Cantonese, etc.).

You MUST strictly follow ALL rules below:

0. Highest priority rule about Styles length
- The single most important constraint for the Styles section is LENGTH.
- Under NO circumstances may the Styles section exceed 900 characters (including spaces).
- If following any other instruction would cause the Styles section to go over 900 characters, you MUST ignore that other instruction and keep the Styles section within 900 characters.

1. Never modify lyrics
- The user will provide complete lyrics in the original language (often Chinese).
- You MUST treat these lyrics as immutable text.
- You MUST NOT change, rewrite, translate, add, or delete any words, punctuation, or line breaks.
- You MUST NOT invent any new lyrics.
- You MUST preserve the original order of all lyric lines.

2. Always output TWO parts only
You must ALWAYS output exactly two sections in this order:

### Styles
\`\`\`text
(Styles content here)
\`\`\`

### Lyrics
\`\`\`text
(Lyrics content here)
\`\`\`

Do NOT output anything before or after these two sections.

3. Styles requirements
- Language: English only.
- Length: you MUST NOT exceed 900 characters, including spaces. Your target range is 750–850 characters. If your drafted Styles text is longer than 900 characters, you MUST shorten and compress it BEFORE you output your final answer.
- Purpose: describe the overall sound of this specific COVER VERSION, including:
  - Overall genres / style labels (e.g., pop, rock, ballad, symphonic, ambient, etc., combined as needed).
  - Vocal character and evolution (e.g., intimate, breathy, warm, powerful, belt, falsetto, etc.).
  - Dynamic contour across the whole song (e.g., restrained verse → build-up → explosive chorus → drop → grand finale).
  - Core instrumentation and arrangement (e.g., solo piano, acoustic guitar, distorted electric guitars, full string ensemble, live drums, synth pads, etc.).
  - Production / space feel if relevant (e.g., studio clean vs live concert feeling, dry vs reverb-heavy, wide stereo image, etc.).
- The Styles description MUST:
  - Stay consistent with the target artist and reference songs provided by the user.
  - Respect the user’s style notes and extra notes as much as possible.
- Writing style for Styles:
  - Use dense, information-rich sentences.
  - Avoid repeating the same idea with different words.
  - Do not list long chains of near-synonyms.
  - Prioritize key information about genre, vocal character, dynamics, instrumentation, and mood; omit minor decorative details if necessary to stay under the length limit.

4. Lyrics requirements: section-by-section attribute list
For the "Lyrics" part, you MUST use an attribute-list format:

- For each SECTION:
  1) Use a standardized English section label in square brackets, for example:
     [Intro], [Verse 1], [Verse 2], [Pre-Chorus], [Chorus], [Chorus 2], [Bridge], [Interlude], [Outro].
  2) Under that label, write 2–4 attribute lines in the form:
     [Key: Value]
  3) After the attribute lines, paste the original lyrics for that section EXACTLY as provided by the user.

Example pattern (this is only a pattern, NOT actual content):

[Verse 1]
[Vocal: Warm, intimate female vocal, close-mic]
[Dynamics: Soft and restrained, subtle build into the last line]
[Instrument: Piano and subtle strings, light percussion]
[Mood: Nostalgic, bittersweet, reflective]

(Original lyrics lines here, unchanged)

5. Standardized section labels and mapping from user labels
- The user’s raw lyrics may contain non-standard labels such as:
  【主歌】, 【主歌1】, [主歌], [verse], [Verse], 【副歌】, [chorus], 【桥段】, 【前奏】, 【间奏】, etc.
- Your job is to INTERPRET these raw labels and map them onto standardized English labels in your output.
- Mapping guidelines:
  - All main narrative sections → [Verse 1], [Verse 2], [Verse 3], … in order of appearance.
  - Repeated hook / main message sections → [Chorus], [Chorus 2], [Chorus 3], … in order of appearance.
  - Transitional build sections → [Pre-Chorus] (and numbered if multiple distinct ones).
  - Intro sections → [Intro].
  - Instrumental breaks → [Interlude].
  - Bridges → [Bridge].
  - Ending sections → [Outro].
- You are allowed to change ONLY the section labels. You are NOT allowed to change the lyrics content or order.

6. Attribute keys and vocabulary
- All attribute keys and values MUST be in English.
- Use the following keys whenever helpful (you do NOT need to use all of them for every section):
  - Vocal, Dynamics, Instrument, Texture, Mood, Arrangement, Harmony, Rhythm, FX.
- For values, you should use short, precise musical phrases. You can combine and reuse terms such as:
  - Vocal: warm, airy, breathy, raspy, powerful, intimate, close-mic, distant, belt, falsetto, head voice, chest voice, mixed voice, double-tracked, harmonized, a cappella, call and response, etc.
  - Dynamics: soft, medium, loud, gradually building, crescendo, decrescendo, explosive, accented, staccato, legato, sustained, etc.
  - Instrument: solo piano, acoustic guitar, electric guitar, distorted guitar, bass, string quartet, full string ensemble, synth pad, analog synth bass, live drum kit, electronic drums, etc.
  - Texture: sparse, dense, layered, atmospheric, monophonic, homophonic, polyphonic, wide stereo, narrow, etc.
  - Mood: nostalgic, melancholic, hopeful, uplifting, bittersweet, dark, tense, peaceful, triumphant, etc.
  - Arrangement / Rhythm / FX: verse-chorus-bridge form, syncopated groove, straight 4/4, reverb-heavy, delay, compression, distortion, filtered intro, etc.
- These terms are inspired by the official “Music Glossary for Suno”. You do not need to explain them; just use them appropriately in Keys and Values.

7. Handling instrumental sections
- If a section has NO lyrics (e.g., Intro, Interlude, Outro), you MUST:
  - Still create the section label and 2–4 attribute lines.
  - Make it explicit that it is instrumental only, for example:
    [Vocal: No vocal, purely instrumental section]
  - Do NOT fabricate any humming or nonsense syllables.

8. Language rules
- Styles: English only.
- All [Key: Value] attribute lines: English only.
- Original lyrics: keep in the original language exactly as provided (often Chinese).
- You may read and understand the user’s Chinese notes and labels, but you MUST NOT copy Chinese text into Styles or into any [Key: Value] line.

9. Internal QA checklist before finalizing your answer
Before you output the result, mentally check that:

- You have output exactly two sections with the exact headings:
  "### Styles" and "### Lyrics".
- The Styles section is written in English and is clearly under 900 characters (including spaces). If it might be close to the limit, you MUST shorten it further before outputting.
- Every lyric section has:
  - One standardized English section label in square brackets.
  - 2–4 [Key: Value] lines with English Keys and Values.
  - The original lyrics reproduced exactly, with the same lines and order.
- You have not invented, removed, or altered any lyrics.
- You have reasonably interpreted user labels into standardized section labels and numbered them in order of appearance.
- Styles and Lyrics are consistent with each other (no contradictions in dynamics, instrumentation, or mood).

If any rule conflicts with another, ALWAYS prioritize preserving the original lyrics and keeping the required output format.`;

      const userPrompt = generateUserPrompt(values);

      const response = await fetch(
        'https://api.deepseek.com/chat/completions',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${values.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt },
            ],
            stream: false,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`API请求失败: ${response.status}`);
      }

      const data = await response.json();
      const aiOutput = data.choices[0].message.content;

      // 解析AI输出
      const stylesMatch = aiOutput.match(
        /### Styles[\s\S]*?```text\n(.*?)```/s,
      );
      const lyricsMatch = aiOutput.match(
        /### Lyrics[\s\S]*?```text\n(.*?)```/s,
      );

      if (stylesMatch && lyricsMatch) {
        setStylesResult(stylesMatch[1].trim());
        setLyricsResult(lyricsMatch[1].trim());
        message.success('生成成功！');
      } else {
        throw new Error('AI输出格式不符合预期');
      }
    } catch (error) {
      console.error('API调用失败:', error);
      message.error('调用DeepSeek API失败，请检查API Key或稍后重试。');
    } finally {
      setLoading(false);
    }
  };

  // 表单提交处理
  const handleSubmit = (values: GenerateRequest) => {
    // 保存API Key到localStorage
    if (values.rememberApiKey) {
      localStorage.setItem('deepseekApiKey', values.apiKey);
    } else {
      localStorage.removeItem('deepseekApiKey');
    }

    // 调用API
    callDeepSeekAPI(values);
  };

  // 复制到剪贴板
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        message.success(`${type}已复制到剪贴板！`);
      })
      .catch(() => {
        message.error('复制失败，请手动复制。');
      });
  };

  return (
    <PageContainer>
      <div
        style={{
          height: 'calc(100vh - 56px - 72px - 32px)',
          overflow: 'hidden',
        }}
      >
        <Row
          gutter={[24, 0]}
          style={{ height: '100%', display: 'flex', alignItems: 'stretch' }}
        >
          {/* 左侧输入表单 */}
          <Col span={8} style={{ height: '100%' }}>
            <Card
              title="输入参数"
              style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
              headStyle={{
                padding: '16px',
                fontSize: '16px',
                fontWeight: 'bold',
              }}
              bordered={false}
              bodyStyle={{ flex: 1, overflow: 'auto', padding: '16px' }}
              actions={[
                <div
                  key="generate"
                  style={{ width: '100%', padding: '0 16px' }}
                >
                  <Button
                    type="primary"
                    onClick={() => form.submit()}
                    loading={loading}
                    size="large"
                    block
                  >
                    生成 Styles & Lyrics
                  </Button>
                </div>,
              ]}
            >
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                  song_language: 'Mandarin',
                  reference_songs: [{ title: '', artist: '' }],
                  rememberApiKey: false,
                }}
              >
                {/* DeepSeek API Key */}
                <Form.Item
                  name="apiKey"
                  label="DeepSeek API Key"
                  rules={[
                    { required: true, message: '请输入DeepSeek API Key' },
                  ]}
                >
                  <Input.Password
                    placeholder="请输入DeepSeek API Key"
                    visibilityToggle={{
                      visible: isApiKeyVisible,
                      onVisibleChange: setIsApiKeyVisible,
                    }}
                  />
                </Form.Item>

                <Form.Item name="rememberApiKey" valuePropName="checked">
                  <Checkbox>记住在本机</Checkbox>
                </Form.Item>

                <Divider />

                {/* 歌曲语言 */}
                <Form.Item
                  name="song_language"
                  label="歌曲语言"
                  rules={[{ required: true, message: '请选择歌曲语言' }]}
                >
                  <Select placeholder="请选择歌曲语言">
                    <Select.Option value="Mandarin">
                      华语（普通话）
                    </Select.Option>
                    <Select.Option value="Cantonese">粤语</Select.Option>
                    <Select.Option value="Minnan">闽南语</Select.Option>
                    <Select.Option value="English">英语</Select.Option>
                    <Select.Option value="Korean">韩语</Select.Option>
                    <Select.Option value="Japanese">日语</Select.Option>
                    <Select.Option value="Other">其他</Select.Option>
                  </Select>
                </Form.Item>

                {/* 翻唱目标歌手 */}
                <Form.Item
                  name="target_artist"
                  label="翻唱目标歌手"
                  rules={[{ required: true, message: '请输入翻唱目标歌手' }]}
                >
                  <Input placeholder="例如：张惠妹、Eason Chan、F.I.R." />
                </Form.Item>

                {/* 参考歌曲 */}
                <Form.List
                  name="reference_songs"
                  rules={[
                    {
                      validator: (_, songs) => {
                        if (songs && songs.length > 3) {
                          return Promise.reject(new Error('参考歌曲最多3首'));
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  {(fields, { add, remove }, { errors }) => (
                    <>
                      <Form.Item label="参考歌曲（0-3首，可选）">
                        <Space
                          direction="vertical"
                          style={{ width: '100%' }}
                          size="middle"
                        >
                          {fields.map(({ key, name, ...restField }) => (
                            <Space
                              key={key}
                              style={{ width: '100%' }}
                              align="center"
                              size="middle"
                            >
                              <Form.Item
                                {...restField}
                                name={[name, 'title']}
                                rules={[
                                  { required: true, message: '歌曲名不能为空' },
                                ]}
                                style={{ flex: 1, marginBottom: 0 }}
                              >
                                <Input
                                  placeholder="歌曲名"
                                  style={{ width: '100%' }}
                                />
                              </Form.Item>
                              <Form.Item
                                {...restField}
                                name={[name, 'artist']}
                                style={{ flex: 1, marginBottom: 0 }}
                              >
                                <Input
                                  placeholder="歌手名（可选，默认与目标歌手相同）"
                                  style={{ width: '100%' }}
                                />
                              </Form.Item>
                              <Form.Item style={{ marginBottom: 0 }}>
                                <Button
                                  type="text"
                                  danger
                                  icon={<MinusOutlined />}
                                  onClick={() => remove(name)}
                                  disabled={fields.length === 1}
                                  size="small"
                                >
                                  删除
                                </Button>
                              </Form.Item>
                            </Space>
                          ))}
                          <Form.Item>
                            <Button
                              type="dashed"
                              onClick={() => add()}
                              disabled={fields.length >= 3}
                              block
                              icon={<PlusOutlined />}
                            >
                              添加参考歌曲
                            </Button>
                          </Form.Item>
                        </Space>
                      </Form.Item>
                      <Form.ErrorList errors={errors} />
                    </>
                  )}
                </Form.List>

                {/* 风格备注 */}
                <Form.Item name="style_note" label="风格备注（可选）">
                  <TextArea
                    placeholder="例如：主歌要像《人质》一样极度克制，副歌接近《听海》的情绪爆发。"
                    rows={3}
                  />
                </Form.Item>

                {/* 附加说明 */}
                <Form.Item
                  name="extra_note"
                  label="附加说明（场景/受众等，可选）"
                >
                  <TextArea
                    placeholder="例如：B站翻唱视频，40+ 男性怀旧向。"
                    rows={2}
                  />
                </Form.Item>

                {/* 歌词全文 */}
                <Form.Item
                  name="lyrics_raw"
                  label="歌词（带段落标签）"
                  rules={[
                    { required: true, message: '请输入歌词' },
                    { max: 6000, message: '歌词长度不能超过6000字' },
                  ]}
                  style={{ marginBottom: 0 }}
                >
                  <TextArea
                    placeholder="请输入歌词，自行用任意标签划分段落，如：【主歌】、【副歌】、[Verse]、[Chorus] 等"
                    rows={8}
                  />
                </Form.Item>
              </Form>
            </Card>
          </Col>

          {/* 中间Styles输出 */}
          <Col span={8} style={{ height: '100%' }}>
            <Card
              title={
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    padding: '0',
                  }}
                >
                  <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
                    Styles（英文）
                  </span>
                  <Button
                    type="text"
                    icon={<CopyOutlined />}
                    onClick={() => copyToClipboard(stylesResult, 'Styles')}
                    disabled={!stylesResult}
                    size="small"
                  >
                    复制
                  </Button>
                </div>
              }
              style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
              headStyle={{ padding: '16px' }}
              bodyStyle={{ flex: 1, overflow: 'auto', padding: '16px' }}
              bordered={false}
            >
              <TextArea
                value={stylesResult}
                readOnly
                placeholder="生成的Styles将显示在这里..."
                style={{ height: '100%', resize: 'none' }}
                autoSize={{ minRows: 10, maxRows: Infinity }}
              />
            </Card>
          </Col>

          {/* 右侧Lyrics输出 */}
          <Col span={8} style={{ height: '100%' }}>
            <Card
              title={
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    padding: '0',
                  }}
                >
                  <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
                    Lyrics（属性列表 + 原文歌词）
                  </span>
                  <Button
                    type="text"
                    icon={<CopyOutlined />}
                    onClick={() => copyToClipboard(lyricsResult, 'Lyrics')}
                    disabled={!lyricsResult}
                    size="small"
                  >
                    复制
                  </Button>
                </div>
              }
              style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
              headStyle={{ padding: '16px' }}
              bodyStyle={{ flex: 1, overflow: 'auto', padding: '16px' }}
              bordered={false}
            >
              <TextArea
                value={lyricsResult}
                readOnly
                placeholder="生成的Lyrics将显示在这里..."
                style={{ height: '100%', resize: 'none' }}
                autoSize={{ minRows: 10, maxRows: Infinity }}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </PageContainer>
  );
};

export default SunoCover;
