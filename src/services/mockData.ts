/**
 * 模拟数据服务模块
 * 负责提供模拟生成所需的固定数据和逻辑
 * 用于开发环境下的功能测试，避免频繁调用真实API
 */

// 固定的Styles内容
export const MOCK_STYLES = `Symphonic Pop-Rock, Mandopop, Baroque Pop-Rock, J-Rock Influence, Heavy distorted guitars over symphonic orchestration, Sophisticated Chord Progressions. Breathy Female Vocals, Clear Emotive Tone, Soaring High Notes, Sustained High Notes, Moderate Vibrato, Introspective to Powerful. Theatrical, Epic.
INTRO: Cinematic atmosphere, slow build up, high strings ensemble in lyrical counterpoint over classical piano arpeggios and warm pad.
VERSE: Breathy female vocals (introspective tone), delicate piano, acoustic guitar arpeggios, light percussion.
PRE-CHORUS: Emotional crescendo, dramatic build-up.
CHORUS: Powerful belting vocals, sustained high notes, richly stacked harmonies, heavy distorted guitars + power chords, high strings unison counterpoint, fast driving cinematic drums, huge wall of sound.
INTERLUDE: Lyrical electric guitar solo trading melodies with high strings.
BRIDGE: Emotional climax, building high tension.
OUTRO: Fading out with piano arpeggio and soft strings.`;

// 固定的Lyrics内容
export const MOCK_LYRICS = `[Intro Chorus]
[Arrangement: Ethereal atmosphere, Cold Open]
[Instrument: Classical Grand Piano only, No Drums, No Guitar]
[Dynamics: mp, emotional and intimate]
Forever Forever
无论你走到哪
也要在同一片天空下发光
Forever Forever
把徬徨的心都点亮
拥抱彼此的模样
永恒回忆就像恒星不忘

[Instrumental Hook]
[Arrangement: Sudden Energy Explosion, J-Rock Influence]
[Instrument: Heavy Distorted Guitars, High Strings Ensemble, Driving Rock Drums]
[Dynamics: ff, Epic Start]

[Verse 1]
[Vocal: Breathy female vocals, Introspective tone, Near microphone]
[Instrument: Minimalist Piano, Broken Chords, Bass pulse enters]
[Dynamics: p, gentle storytelling]
流星划过喧扰穹苍
可曾回应谁的愿望
我已走到儿时的远方
却遗失了自己的模样

[Verse 2]
[Vocal: Clear emotive tone, slightly stronger presence]
[Arrangement: Building up]
[Instrument: Acoustic Guitar Strumming, Piano high notes, Light Snare]
[Dynamics: mp -> mf, flowing]
梦想逐渐增加重量
我们是否不再幻想
用尽整个青春去荒唐
也用整个人生去飞翔

[Chorus 1]
[Vocal: Power belting, Sustained high notes, Layered Harmonies]
[Texture: Wall of Sound, Symphonic Rock]
[Instrument: Heavy Distorted Guitars (Power Chords), High Strings Unison Counterpoint, Bright Piano Octaves]
[Dynamics: f, explosive release]
Forever Forever
无论你走到哪
也要在同一片天空下发光
Forever Forever
把徬徨的心都点亮
拥抱彼此的模样
永恒回忆就像恒星不忘

[Instrumental Interlude]
[Arrangement: J-Rock influence, soaring atmosphere]
[Instrument: Lyrical electric guitar solo trading melodies with High Strings Section (Duel)]
[Dynamics: ff]

[Verse 3]
[Vocal: Clear emotive tone, emotional friction]
[Instrument: Acoustic Guitar Strumming dominant, String Staccato Rhythm, Piano counter-melody]
[Dynamics: mf, driving rhythm]
庆幸这场别来无恙
沉默里藏着太多话
岁月从不放过谁脸庞
却也在心中留下宝藏

[Verse 4]
[Vocal: High tension, dramatic delivery, Double Tracking]
[Arrangement: Orchestral Swell, Strings Tremolo]
[Instrument: Intense Strumming, Heavy Piano Chords, Snare Rolls]
[Dynamics: mf -> f, dramatic push]
烟火再次绽放辉煌
失落瞳孔倒映希望
每当前路风横雨又狂
让我再陪你展开翅膀

[Chorus 2]
[Vocal: Intense belting, Richly Stacked Harmonies]
[Texture: Dense Wall of Sound]
[Instrument: Heavy Distorted Guitars, High Strings Unison Counterpoint, Crash Cymbals]
[Dynamics: ff, Driving Power]
Forever Forever
无论你走到哪
也要在同一片天空下发光
Forever Forever
把徬徨的心都点亮
拥抱彼此的模样
永恒回忆就像恒星不忘

[Grand Chorus]
[Vocal: Ultimate high notes, Choir Backing, Octave Doubles, High Pitch Ad-libs]
[Arrangement: Explosive anthemic grand finale chorus]
[Instrument: Maximum Distorted Wall, Soaring Strings Melody, Bright Piano Glissando, Full Orchestra]
[Dynamics: fff, Anthemic, Epic Finale]
Forever Forever
无论你走到哪
也要在同一片天空下发光
Forever Forever
把徬徨的心都点亮
重回最好的时光
永恒回忆就像恒星不忘

[Instrumental Outro]
[Arrangement: Fading out]
[Instrument: Piano Arpeggios, Soft Strings]
[Dynamics: Diminuendo, pp]`;

/**
 * 模拟生成函数
 * 模拟调用DeepSeek API的过程，延迟15秒后返回固定的模拟数据
 * @returns Promise<{ styles: string; lyrics: string }> 包含模拟生成的Styles和Lyrics
 */
export const mockGenerate = async (): Promise<{ styles: string; lyrics: string }> => {
  // 模拟5秒延迟
  await new Promise(resolve => setTimeout(resolve, 5000));
  return {
    styles: MOCK_STYLES,
    lyrics: MOCK_LYRICS
  };
};
