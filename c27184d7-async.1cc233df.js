(("undefined"!=typeof globalThis?globalThis:self)["makoChunk_suno-cover-arranger"]=("undefined"!=typeof globalThis?globalThis:self)["makoChunk_suno-cover-arranger"]||[]).push([["c27184d7"],{c27184d7:function(e,t,r){r.d(t,"__esModule",{value:!0}),r.e(t,{default:function(){return ev;}});var a=r("777fffbe"),s=r("852bbaa9"),n=r("c1fced07"),i=r("47efa787"),o=r("43c9c291"),l=r("10291165"),c=r("dcdb5ae1"),u=r("a4b768e0"),d=a._(u),h=r("e636436e"),g=a._(h),m=r("07efe2d3"),y=a._(m),p=r("ccf5e343"),f=r("d6eb4b7e"),b=a._(f),v=r("1edb9701"),S=a._(v),x=r("067db9e2"),w=s._(x),T=r("2da967b9"),C=r("733a5525"),_=r("5e05ad83"),E=r("d9a7ed30"),I=r("5f3872c2"),A=a._(I),N=r("f5f9d856"),k=r("99d3dfcb"),P=r("901004a9");let R=["wrap","nowrap","wrap-reverse"],O=["flex-start","flex-end","start","end","center","space-between","space-around","space-evenly","stretch","normal","left","right"],V=["center","start","end","flex-start","flex-end","self-start","self-end","baseline","normal","stretch"],M=(e,t)=>{let r=!0===t.wrap?"wrap":t.wrap;return{[`${e}-wrap-${r}`]:r&&R.includes(r)};},L=(e,t)=>{let r={};return V.forEach(a=>{r[`${e}-align-${a}`]=t.align===a;}),r[`${e}-align-stretch`]=!t.align&&!!t.vertical,r;},F=(e,t)=>{let r={};return O.forEach(a=>{r[`${e}-justify-${a}`]=t.justify===a;}),r;},j=(e,t)=>(0,C.clsx)({...M(e,t),...L(e,t),...F(e,t)}),D=e=>{let{componentCls:t}=e;return{[t]:{display:"flex",margin:0,padding:0,"&-vertical":{flexDirection:"column"},"&-rtl":{direction:"rtl"},"&:empty":{display:"none"}}};},U=e=>{let{componentCls:t}=e;return{[t]:{"&-gap-small":{gap:e.flexGapSM},"&-gap-middle":{gap:e.flexGap},"&-gap-large":{gap:e.flexGapLG}}};},Y=e=>{let{componentCls:t}=e,r={};return R.forEach(e=>{r[`${t}-wrap-${e}`]={flexWrap:e};}),r;},$=e=>{let{componentCls:t}=e,r={};return V.forEach(e=>{r[`${t}-align-${e}`]={alignItems:e};}),r;},G=e=>{let{componentCls:t}=e,r={};return O.forEach(e=>{r[`${t}-justify-${e}`]={justifyContent:e};}),r;};var B=(0,k.genStyleHooks)("Flex",e=>{let{paddingXS:t,padding:r,paddingLG:a}=e,s=(0,P.mergeToken)(e,{flexGapSM:t,flexGap:r,flexGapLG:a});return[D(s),U(s),Y(s),$(s),G(s)];},()=>({}),{resetStyle:!1});let H=w.default.forwardRef((e,t)=>{let{prefixCls:r,rootClassName:a,className:s,style:n,flex:i,gap:o,vertical:l,orientation:c,component:u="div",children:d,...h}=e,{flex:g,direction:m,getPrefixCls:y}=w.default.useContext(N.ConfigContext),p=y("flex",r),[f,b]=B(p),[,v]=(0,E.useOrientation)(c,l??(null==g?void 0:g.vertical)),S=(0,C.clsx)(s,a,null==g?void 0:g.className,p,f,b,j(p,e),{[`${p}-rtl`]:"rtl"===m,[`${p}-gap-${o}`]:(0,_.isPresetSize)(o),[`${p}-vertical`]:v}),x={...null==g?void 0:g.style,...n};return(0,A.default)(i)&&(x.flex=i),(0,A.default)(o)&&!(0,_.isPresetSize)(o)&&(x.gap=o),w.default.createElement(u,{ref:t,className:S,style:x,...(0,T.omit)(h,["justify","wrap","align"])},d);});var z=r("c444fa52"),K=a._(z),q=r("09b6fc98"),W=a._(q),J=r("bfb13af0"),X=a._(J),Z=r("e69718f6"),Q=a._(Z),ee=r("b451d38c"),et=a._(ee),er=r("d5126294"),ea=r("44faacdd");let es=`You are a senior Suno prompt engineer. Your job is to generate high-quality "Styles" and "Lyrics" prompts for cover songs in Suno (v5), especially for Chinese and East Asian songs (Mandarin, Cantonese, etc.).

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
You must ALWAYS output exactly two sections in this order:### Styles
\`\`\`text
(Styles content here)
\`\`\`

### Lyrics
\`\`\`text
(Lyrics content here)
\`\`\`Do NOT output anything before or after these two sections.

3. Styles requirements
- Language: English only.
- Length: you MUST NOT exceed 900 characters, including spaces. Your target range is 750\u{2013}850 characters. If your drafted Styles text is longer than 900 characters, you MUST shorten and compress it BEFORE you output your final answer.
- Purpose: describe the overall sound of this specific COVER VERSION, including:
  - Overall genres / style labels (e.g., pop, rock, ballad, symphonic, ambient, etc., combined as needed).
  - Vocal character and evolution (e.g., intimate, breathy, warm, powerful, belt, falsetto, etc.).
  - Dynamic contour across the whole song (e.g., restrained verse \u{2192} build-up \u{2192} explosive chorus \u{2192} drop \u{2192} grand finale).
  - Core instrumentation and arrangement (e.g., solo piano, acoustic guitar, distorted electric guitars, full string ensemble, live drums, synth pads, etc.).
  - Production / space feel if relevant (e.g., studio clean vs live concert feeling, dry vs reverb-heavy, wide stereo image, etc.).
- The Styles description MUST:
  - Stay consistent with the target artist and reference songs provided by the user.
  - Respect the user\u{2019}s style notes and extra notes as much as possible.
- Writing style for Styles:
  - Use dense, information-rich sentences.
  - Avoid repeating the same idea with different words.
  - Do not list long chains of near-synonyms.
  - Prioritize key information about genre, vocal character, dynamics, instrumentation, and mood; omit minor decorative details if necessary to stay under the length limit.
  - Strictly prohibited from including any names of reference singers or vocalists of reference songs, including stage names and real names.

4. Lyrics requirements: section-by-section attribute list
For the "Lyrics" part, you MUST use an attribute-list format:

- For each SECTION:
  1) Use a standardized English section label in square brackets, for example:
     [Intro], [Verse 1], [Verse 2], [Pre-Chorus], [Chorus], [Chorus 2], [Bridge], [Interlude], [Outro].
  2) Under that label, write 2\u{2013}4 attribute lines in the form:
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
- The user\u{2019}s raw lyrics may contain non-standard labels such as:
  \u{3010}\u{4E3B}\u{6B4C}\u{3011}, \u{3010}\u{4E3B}\u{6B4C}1\u{3011}, [\u{4E3B}\u{6B4C}], [verse], [Verse], \u{3010}\u{526F}\u{6B4C}\u{3011}, [chorus], \u{3010}\u{6865}\u{6BB5}\u{3011}, \u{3010}\u{524D}\u{594F}\u{3011}, \u{3010}\u{95F4}\u{594F}\u{3011}, etc.
- Your job is to INTERPRET these raw labels and map them onto standardized English labels in your output.
- Mapping guidelines:
  - All main narrative sections \u{2192} [Verse 1], [Verse 2], [Verse 3], \u{2026} in order of appearance.
  - Repeated hook / main message sections \u{2192} [Chorus], [Chorus 2], [Chorus 3], \u{2026} in order of appearance.
  - Transitional build sections \u{2192} [Pre-Chorus] (and numbered if multiple distinct ones).
  - Intro sections \u{2192} [Intro].
  - Instrumental breaks \u{2192} [Interlude].
  - Bridges \u{2192} [Bridge].
  - Ending sections \u{2192} [Outro].
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
- These terms are inspired by the official \u{201C}Music Glossary for Suno\u{201D}. You do not need to explain them; just use them appropriately in Keys and Values.

7. Handling instrumental sections
- If a section has NO lyrics (e.g., Intro, Interlude, Outro), you MUST:
  - Still create the section label and 2\u{2013}4 attribute lines.
  - Make it explicit that it is instrumental only, for example:
    [Vocal: No vocal, purely instrumental section]
  - Do NOT fabricate any humming or nonsense syllables.

8. Language rules
- Styles: English only.
- All [Key: Value] attribute lines: English only.
- Original lyrics: keep in the original language exactly as provided (often Chinese).
- You may read and understand the user\u{2019}s Chinese notes and labels, but you MUST NOT copy Chinese text into Styles or into any [Key: Value] line.

9. Internal QA checklist before finalizing your answer
Before you output the result, mentally check that:

- You have output exactly two sections with the exact headings:
  "### Styles" and "### Lyrics".
- The Styles section is written in English and is clearly under 900 characters (including spaces). If it might be close to the limit, you MUST shorten it further before outputting.
- Every lyric section has:
  - One standardized English section label in square brackets.
  - 2\u{2013}4 [Key: Value] lines with English Keys and Values.
  - The original lyrics reproduced exactly, with the same lines and order.
- You have not invented, removed, or altered any lyrics.
- You have reasonably interpreted user labels into standardized English labels and numbered them in order of appearance.
- Styles and Lyrics are consistent with each other (no contradictions in dynamics, instrumentation, or mood).

If any rule conflicts with another, ALWAYS prioritize preserving the original lyrics and keeping the required output format.`,en=`You are generating Suno "Styles" and "Lyrics" prompts for a COVER version of a song. Read all the information below carefully and then produce the final output strictly following the system rules and the format requirements.

------------------------------
[1] Song language and context
------------------------------

- Song language: {fullLanguageName} .
- The lyrics are provided in this language and MUST be preserved exactly.
- This is a COVER version, not an original composition. You should shape the sound to match the target artist and references below.

------------------------------
[2] Target artist and references
------------------------------

- Target cover artist (user input, may be in Chinese or another language):
  "{targetArtist}"

- Reference songs from the user (if any):
  {referenceSongsBlock}

These names indicate the general style, vocal approach, and arrangement flavor you should lean toward. You do NOT need to describe these songs explicitly, but your Styles and section attributes should feel consistent with this artist and these references.

------------------------------
[3] User style notes (free-form, for your understanding only)
------------------------------

The user has provided extra style notes in their own words (often Chinese). You may use these notes to refine dynamics, emotion curve, and arrangement choices, but they are NOT additional lyrics.

- User style note (may be empty):
  "{styleNote}"

- Extra note (may be empty, can include scene / audience / platform, etc.):
  "{extraNote}"

You can understand these notes in any language, but you MUST still output Styles and all [Key: Value] attributes in English.

------------------------------
[4] User lyrics (DO NOT MODIFY)
------------------------------

Below are the complete lyrics provided by the user, with their own section labels and line breaks. They may use Chinese labels such as \u{3010}\u{4E3B}\u{6B4C}\u{3011}\u{3001}\u{3010}\u{526F}\u{6B4C}\u{3011} or non-standard English labels like [verse], [chorus], etc.

You MUST:
- Keep all lyric lines exactly as they are.
- Use these labels only to infer your standardized section labels.
- NOT copy these raw labels into your final output; instead, replace them with standardized English labels such as [Verse 1], [Chorus], [Bridge], [Intro], etc.

Here are the raw lyrics:

{lyricsRaw}

------------------------------
[5] Your output task
------------------------------

Now, using everything above and following the system rules, you MUST:

1) Generate the "Styles" section in English
- A single paragraph of 800\u{2013}900 characters (hard limit 1000).
- It should describe the overall sound of this COVER version, taking into account:
  - The song language: {fullLanguageName} .
  - The target artist: {targetArtist}.
  - The reference songs (if any).
  - The user style notes and extra note.
- Mention genre / style, vocal character, dynamic contour, instrumentation, arrangement, and production / space feel.

2) Generate the "Lyrics" section as an attribute list
- Split the song into logical sections using standardized English labels in square brackets:
  [Intro], [Verse 1], [Verse 2], [Pre-Chorus], [Chorus], [Chorus 2], [Bridge], [Interlude], [Outro], etc.
- For each section:
  - Create 2\u{2013}4 attribute lines in the form [Key: Value], using English Keys (Vocal, Dynamics, Instrument, Texture, Mood, Arrangement, etc.) and concise English Values.
  - Then paste the original lyric lines for that section exactly as provided, without any change.
- For purely instrumental sections (no lyrics), only write the attributes and make it clear there is no vocal.

------------------------------
[6] Output format (VERY IMPORTANT)
------------------------------

Return your answer in EXACTLY this Markdown structure and nothing else:

### Styles
\`\`\`text
(put the Styles paragraph here in English, MUST be under 900 characters)
\`\`\`

### Lyrics
\`\`\`text
(put the full Lyrics attribute list here, with all sections, attributes, and original lyrics)
\`\`\`

Do NOT add any extra headings, explanations, or comments outside this format.`;var ei=r("d5881563"),eo=r("2a1b6bf4"),el=r("e236400f");let ec=`Symphonic Pop-Rock, Mandopop, Baroque Pop-Rock, J-Rock Influence, Heavy distorted guitars over symphonic orchestration, Sophisticated Chord Progressions. Breathy Female Vocals, Clear Emotive Tone, Soaring High Notes, Sustained High Notes, Moderate Vibrato, Introspective to Powerful. Theatrical, Epic.
INTRO: Cinematic atmosphere, slow build up, high strings ensemble in lyrical counterpoint over classical piano arpeggios and warm pad.
VERSE: Breathy female vocals (introspective tone), delicate piano, acoustic guitar arpeggios, light percussion.
PRE-CHORUS: Emotional crescendo, dramatic build-up.
CHORUS: Powerful belting vocals, sustained high notes, richly stacked harmonies, heavy distorted guitars + power chords, high strings unison counterpoint, fast driving cinematic drums, huge wall of sound.
INTERLUDE: Lyrical electric guitar solo trading melodies with high strings.
BRIDGE: Emotional climax, building high tension.
OUTRO: Fading out with piano arpeggio and soft strings.`,eu=`[Intro Chorus]
[Arrangement: Ethereal atmosphere, Cold Open]
[Instrument: Classical Grand Piano only, No Drums, No Guitar]
[Dynamics: mp, emotional and intimate]
Forever Forever
\u{65E0}\u{8BBA}\u{4F60}\u{8D70}\u{5230}\u{54EA}
\u{4E5F}\u{8981}\u{5728}\u{540C}\u{4E00}\u{7247}\u{5929}\u{7A7A}\u{4E0B}\u{53D1}\u{5149}
Forever Forever
\u{628A}\u{5FAC}\u{5FA8}\u{7684}\u{5FC3}\u{90FD}\u{70B9}\u{4EAE}
\u{62E5}\u{62B1}\u{5F7C}\u{6B64}\u{7684}\u{6A21}\u{6837}
\u{6C38}\u{6052}\u{56DE}\u{5FC6}\u{5C31}\u{50CF}\u{6052}\u{661F}\u{4E0D}\u{5FD8}

[Instrumental Hook]
[Arrangement: Sudden Energy Explosion, J-Rock Influence]
[Instrument: Heavy Distorted Guitars, High Strings Ensemble, Driving Rock Drums]
[Dynamics: ff, Epic Start]

[Verse 1]
[Vocal: Breathy female vocals, Introspective tone, Near microphone]
[Instrument: Minimalist Piano, Broken Chords, Bass pulse enters]
[Dynamics: p, gentle storytelling]
\u{6D41}\u{661F}\u{5212}\u{8FC7}\u{55A7}\u{6270}\u{7A79}\u{82CD}
\u{53EF}\u{66FE}\u{56DE}\u{5E94}\u{8C01}\u{7684}\u{613F}\u{671B}
\u{6211}\u{5DF2}\u{8D70}\u{5230}\u{513F}\u{65F6}\u{7684}\u{8FDC}\u{65B9}
\u{5374}\u{9057}\u{5931}\u{4E86}\u{81EA}\u{5DF1}\u{7684}\u{6A21}\u{6837}

[Verse 2]
[Vocal: Clear emotive tone, slightly stronger presence]
[Arrangement: Building up]
[Instrument: Acoustic Guitar Strumming, Piano high notes, Light Snare]
[Dynamics: mp -> mf, flowing]
\u{68A6}\u{60F3}\u{9010}\u{6E10}\u{589E}\u{52A0}\u{91CD}\u{91CF}
\u{6211}\u{4EEC}\u{662F}\u{5426}\u{4E0D}\u{518D}\u{5E7B}\u{60F3}
\u{7528}\u{5C3D}\u{6574}\u{4E2A}\u{9752}\u{6625}\u{53BB}\u{8352}\u{5510}
\u{4E5F}\u{7528}\u{6574}\u{4E2A}\u{4EBA}\u{751F}\u{53BB}\u{98DE}\u{7FD4}

[Chorus 1]
[Vocal: Power belting, Sustained high notes, Layered Harmonies]
[Texture: Wall of Sound, Symphonic Rock]
[Instrument: Heavy Distorted Guitars (Power Chords), High Strings Unison Counterpoint, Bright Piano Octaves]
[Dynamics: f, explosive release]
Forever Forever
\u{65E0}\u{8BBA}\u{4F60}\u{8D70}\u{5230}\u{54EA}
\u{4E5F}\u{8981}\u{5728}\u{540C}\u{4E00}\u{7247}\u{5929}\u{7A7A}\u{4E0B}\u{53D1}\u{5149}
Forever Forever
\u{628A}\u{5FAC}\u{5FA8}\u{7684}\u{5FC3}\u{90FD}\u{70B9}\u{4EAE}
\u{62E5}\u{62B1}\u{5F7C}\u{6B64}\u{7684}\u{6A21}\u{6837}
\u{6C38}\u{6052}\u{56DE}\u{5FC6}\u{5C31}\u{50CF}\u{6052}\u{661F}\u{4E0D}\u{5FD8}

[Instrumental Interlude]
[Arrangement: J-Rock influence, soaring atmosphere]
[Instrument: Lyrical electric guitar solo trading melodies with High Strings Section (Duel)]
[Dynamics: ff]

[Verse 3]
[Vocal: Clear emotive tone, emotional friction]
[Instrument: Acoustic Guitar Strumming dominant, String Staccato Rhythm, Piano counter-melody]
[Dynamics: mf, driving rhythm]
\u{5E86}\u{5E78}\u{8FD9}\u{573A}\u{522B}\u{6765}\u{65E0}\u{6059}
\u{6C89}\u{9ED8}\u{91CC}\u{85CF}\u{7740}\u{592A}\u{591A}\u{8BDD}
\u{5C81}\u{6708}\u{4ECE}\u{4E0D}\u{653E}\u{8FC7}\u{8C01}\u{8138}\u{5E9E}
\u{5374}\u{4E5F}\u{5728}\u{5FC3}\u{4E2D}\u{7559}\u{4E0B}\u{5B9D}\u{85CF}

[Verse 4]
[Vocal: High tension, dramatic delivery, Double Tracking]
[Arrangement: Orchestral Swell, Strings Tremolo]
[Instrument: Intense Strumming, Heavy Piano Chords, Snare Rolls]
[Dynamics: mf -> f, dramatic push]
\u{70DF}\u{706B}\u{518D}\u{6B21}\u{7EFD}\u{653E}\u{8F89}\u{714C}
\u{5931}\u{843D}\u{77B3}\u{5B54}\u{5012}\u{6620}\u{5E0C}\u{671B}
\u{6BCF}\u{5F53}\u{524D}\u{8DEF}\u{98CE}\u{6A2A}\u{96E8}\u{53C8}\u{72C2}
\u{8BA9}\u{6211}\u{518D}\u{966A}\u{4F60}\u{5C55}\u{5F00}\u{7FC5}\u{8180}

[Chorus 2]
[Vocal: Intense belting, Richly Stacked Harmonies]
[Texture: Dense Wall of Sound]
[Instrument: Heavy Distorted Guitars, High Strings Unison Counterpoint, Crash Cymbals]
[Dynamics: ff, Driving Power]
Forever Forever
\u{65E0}\u{8BBA}\u{4F60}\u{8D70}\u{5230}\u{54EA}
\u{4E5F}\u{8981}\u{5728}\u{540C}\u{4E00}\u{7247}\u{5929}\u{7A7A}\u{4E0B}\u{53D1}\u{5149}
Forever Forever
\u{628A}\u{5FAC}\u{5FA8}\u{7684}\u{5FC3}\u{90FD}\u{70B9}\u{4EAE}
\u{62E5}\u{62B1}\u{5F7C}\u{6B64}\u{7684}\u{6A21}\u{6837}
\u{6C38}\u{6052}\u{56DE}\u{5FC6}\u{5C31}\u{50CF}\u{6052}\u{661F}\u{4E0D}\u{5FD8}

[Grand Chorus]
[Vocal: Ultimate high notes, Choir Backing, Octave Doubles, High Pitch Ad-libs]
[Arrangement: Explosive anthemic grand finale chorus]
[Instrument: Maximum Distorted Wall, Soaring Strings Melody, Bright Piano Glissando, Full Orchestra]
[Dynamics: fff, Anthemic, Epic Finale]
Forever Forever
\u{65E0}\u{8BBA}\u{4F60}\u{8D70}\u{5230}\u{54EA}
\u{4E5F}\u{8981}\u{5728}\u{540C}\u{4E00}\u{7247}\u{5929}\u{7A7A}\u{4E0B}\u{53D1}\u{5149}
Forever Forever
\u{628A}\u{5FAC}\u{5FA8}\u{7684}\u{5FC3}\u{90FD}\u{70B9}\u{4EAE}
\u{91CD}\u{56DE}\u{6700}\u{597D}\u{7684}\u{65F6}\u{5149}
\u{6C38}\u{6052}\u{56DE}\u{5FC6}\u{5C31}\u{50CF}\u{6052}\u{661F}\u{4E0D}\u{5FD8}

[Instrumental Outro]
[Arrangement: Fading out]
[Instrument: Piano Arpeggios, Soft Strings]
[Dynamics: Diminuendo, pp]`,ed=async()=>(await new Promise(e=>setTimeout(e,5e3)),{styles:ec,lyrics:eu});var eh=r("3d140868");let eg={songName:[{required:!0,message:"\u8BF7\u586B\u5199\u6B4C\u66F2\u540D\u79F0"},{max:100,message:"\u6B4C\u66F2\u540D\u79F0\u4E0D\u80FD\u8D85\u8FC7 100 \u4E2A\u5B57\u7B26"},{pattern:/^[\u4e00-\u9fa5a-zA-Z0-9\s\-_（）《》【】]+$/,message:"\u6B4C\u66F2\u540D\u79F0\u53EA\u80FD\u5305\u542B\u4E2D\u6587\u3001\u82F1\u6587\u3001\u6570\u5B57\u3001\u7A7A\u683C\u548C\u5E38\u7528\u7B26\u53F7"}],artistName:[{required:!0,message:"\u8BF7\u586B\u5199\u6A21\u4EFF\u7684\u827A\u672F\u5BB6\u59D3\u540D"},{max:50,message:"\u827A\u672F\u5BB6\u59D3\u540D\u4E0D\u80FD\u8D85\u8FC7 50 \u4E2A\u5B57\u7B26"},{pattern:/^[\u4e00-\u9fa5a-zA-Z\s·•]+$/,message:"\u827A\u672F\u5BB6\u59D3\u540D\u53EA\u80FD\u5305\u542B\u4E2D\u6587\u3001\u82F1\u6587\u3001\u7A7A\u683C\u548C\u95F4\u9694\u7B26"}],referenceSongTitle:[{required:!0,message:"\u6B4C\u66F2\u540D\u79F0\u4E0D\u80FD\u4E3A\u7A7A"},{max:50,message:"\u6B4C\u66F2\u540D\u79F0\u4E0D\u80FD\u8D85\u8FC7 50 \u4E2A\u5B57\u7B26"}],referenceSongArtist:[{max:30,message:"\u6F14\u5531\u8005\u540D\u79F0\u4E0D\u80FD\u8D85\u8FC7 30 \u4E2A\u5B57\u7B26"}],lyrics:[{required:!0,message:"\u8BF7\u8F93\u5165\u6BB5\u843D\u4E0E\u6B4C\u8BCD"},{min:10,message:"\u6B4C\u8BCD\u5185\u5BB9\u81F3\u5C11\u9700\u8981 10 \u4E2A\u5B57\u7B26"},{max:2e3,message:"\u6BB5\u843D\u6B4C\u8BCD\u957F\u5EA6\u4E0D\u80FD\u8D85\u8FC7 2000 \u5B57"},{validator:(e,t)=>t?/[【】[\]<>（）]/.test(t)?Promise.resolve():Promise.reject(Error("\u5EFA\u8BAE\u4F7F\u7528\u3010\u4E3B\u6B4C\u3011\u3001\u3010\u526F\u6B4C\u3011\u7B49\u6807\u8BB0\u5212\u5206\u6BB5\u843D")):Promise.resolve()}],language:[{required:!0,message:"\u8BF7\u9009\u62E9\u6B4C\u66F2\u8BED\u8A00"}]},em={songName:{showCount:!0,maxLength:100},artistName:{showCount:!0,maxLength:50},referenceSongTitle:{showCount:!0,maxLength:50},referenceSongArtist:{showCount:!0,maxLength:30},lyrics:{showCount:!0,autoSize:{minRows:10,maxRows:12}}},ey=async e=>{try{if(!e)return[];if(Array.isArray(e))return e.filter(e=>e&&"object"==typeof e&&e.title&&"string"==typeof e.title).map(e=>({title:e.title||"",artist:e.artist||""}));if("string"==typeof e)try{let t=JSON.parse(e);if(Array.isArray(t))return t.filter(e=>e&&"object"==typeof e&&e.title&&"string"==typeof e.title).map(e=>({title:e.title||"",artist:e.artist||""}));}catch(e){}return[];}catch(e){return[];}},ep=async e=>{let t={song_name:"",song_language:"Mandarin",target_artist:"",style_note:"",lyrics_raw:"",extra_note:"",reference_songs:[]},r="",a="";if(!e)return{formValues:t,hasRecord:!1,stylesResult:r,lyricsResult:a};try{let s=await el.db.getPromptRecord(parseInt(e,10));if(!s)return W.default.error("\u8BB0\u5F55\u4E0D\u5B58\u5728"),{formValues:t,hasRecord:!1,stylesResult:r,lyricsResult:a};let n=await ey(s.user_input.reference_songs);return Object.assign(t,{song_name:s.user_input.song_name||"",song_language:s.user_input.song_language||"Mandarin",target_artist:s.user_input.target_singer||"",style_note:s.user_input.style_description||"",lyrics_raw:s.user_input.lyrics||"",extra_note:s.user_input.scene||"",reference_songs:n.length>0?n:[{title:"",artist:""}]}),s.ai_result&&(r=s.ai_result.styles||"",a=s.ai_result.lyrics||""),{formValues:t,hasRecord:!0,stylesResult:r,lyricsResult:a};}catch(e){return W.default.error("\u6570\u636E\u52A0\u8F7D\u5931\u8D25"),{formValues:t,hasRecord:!1,stylesResult:r,lyricsResult:a};}};class ef{static buildUserPrompt(e){let{target_artist:t,lyrics_raw:r,song_language:a,reference_songs:s,style_note:n,extra_note:i}=e,o=this.getFullLanguageName(a),l=this.formatReferenceSongs(s,t);return en.replace("{fullLanguageName}",o).replace("{targetArtist}",t).replace("{referenceSongsBlock}",l).replace("{styleNote}",n||"").replace("{extraNote}",i||"").replace("{lyricsRaw}",r);}static getFullLanguageName(e){return({Mandarin:"Mandarin Chinese",Cantonese:"Cantonese Chinese",English:"English",Japanese:"Japanese",Korean:"Korean",Spanish:"Spanish",French:"French",German:"German"})[e]||e;}static formatReferenceSongs(e,t){return e&&0!==e.length?e.filter(e=>e.title).map(e=>{let r=e.artist&&e.artist!==t?` by ${e.artist}`:"";return`- "${e.title}"${r}`;}).join("\n  "):"None provided.";}}class eb{static parseResponse(e){try{let t=e.trim(),r=t.match(/### Styles[\s\S]*?(?=### Lyrics|$)/),a=t.match(/### Lyrics[\s\S]*/),s="",n="";return r&&(s=(s=r[0].replace(/### Styles/,"").trim()).replace(/```text\s*([\s\S]*?)\s*```/,"$1").trim()),a&&(n=(n=a[0].replace(/### Lyrics/,"").trim()).replace(/```text\s*([\s\S]*?)\s*```/,"$1").trim()),{styles:s,lyrics:n,timestamp:new Date().toISOString()};}catch(t){return console.error("\u54CD\u5E94\u89E3\u6790\u5931\u8D25:",t),{styles:e.trim(),lyrics:"",timestamp:new Date().toISOString()};}}}let ev=()=>{let[e,t]=W.default.useMessage(),{apiKey:r,model:a,checkApiKey:s,shouldShowAlert:u,navigateToSettings:h}=(0,ei.useApiKey)(),[m]=K.default.useForm(),f=(0,w.useRef)(null),[v]=(0,p.useSearchParams)(),[x,T]=(0,w.useState)(!1),[C,_]=(0,w.useState)(""),[E,I]=(0,w.useState)(""),[A,N]=(0,w.useState)(!1),k=(0,w.useCallback)(async(t,r,s=!1)=>{let n=JSON.stringify((Array.isArray(t.reference_songs)?t.reference_songs:[]).filter(e=>(null==e?void 0:e.title)&&"string"==typeof e.title)),i=t.song_language||"Mandarin",o=t.target_artist||"\u672A\u77E5\u827A\u672F\u5BB6",l=t.lyrics_raw||"\u65E0\u6B4C\u8BCD",c={user_id:1,user_input:{song_name:t.song_name,song_language:i,target_singer:o,reference_songs:n,style_description:t.style_note||"",lyrics:l,scene:t.extra_note||""},ai_result:{styles:r.styles,lyrics:r.lyrics,model:s?"mock":a}},u=await el.db.createPromptRecord(c);return e.success("\u8BB0\u5F55\u5DF2\u6210\u529F\u4FDD\u5B58"),u;},[a,e]);(0,w.useEffect)(()=>{(async()=>{let e=v.get("recordId"),{formValues:t,hasRecord:r,stylesResult:a,lyricsResult:s}=await ep(e);r&&(_(a||""),I(s||"")),m.setFieldsValue(t),N(!0);})();},[v,m]);let P=(0,w.useCallback)(async t=>{if(s()){T(!0);try{let s=eo.AIProviderFactory.createProvider(a),n=ef.buildUserPrompt(t),i=await s.generate({api_key:r,system_prompt:es,user_prompt:n,business_type:ea.BusinessType.ARRANGEMENT});if(!i.success)throw Error(i.error||"AI\u751F\u6210\u5931\u8D25");let o=eb.parseResponse(i.content);_(o.styles),I(o.lyrics),e.success("\u63D0\u793A\u8BCD\u5DF2\u6210\u529F\u751F\u6210\uFF01"),await k(t,o,!1);}catch(r){let t=r instanceof Error?r.message:`\u{8C03}\u{7528} ${a} API \u{5931}\u{8D25}\u{FF0C}\u{8BF7}\u{68C0}\u{67E5} API Key \u{6216}\u{7A0D}\u{540E}\u{518D}\u{8BD5}\u{3002}`;e.error(t);}finally{T(!1);}}},[s,r,a,e]),R=(0,w.useCallback)(async()=>{T(!0);try{let t=m.getFieldsValue(),r=await ed();_(r.styles),I(r.lyrics),e.success("\u6A21\u62DF\u751F\u6210\u5DF2\u5B8C\u6210"),await k(t,r,!0);}catch(t){e.error("\u6A21\u62DF\u751F\u6210\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5");}finally{T(!1);}},[m,e]),O=(0,w.useCallback)(()=>{R();},[R]);return(0,n.jsxs)(n.Fragment,{children:[t,(0,n.jsxs)(i.PageContainer,{children:[(0,n.jsx)(er.ApiKeyAlert,{visible:u,onNavigateToSettings:h}),(0,n.jsx)(et.default,{spinning:x,fullscreen:!0,size:"large"}),(0,n.jsxs)(X.default,{gutter:[24,0],children:[(0,n.jsx)(S.default,{xxl:8,xl:8,lg:12,md:24,sm:24,xs:24,children:(0,n.jsx)(o.ProCard,{title:(0,n.jsx)("span",{onClick:O,style:{cursor:"pointer"},children:"\u7FFB\u5531\u914D\u7F6E"}),style:{height:"100%"},children:A?(0,n.jsxs)(l.ProForm,{form:m,layout:"vertical",onFinish:P,submitter:{render:()=>(0,n.jsx)(H,{vertical:!0,gap:"small",style:{marginTop:16},children:(0,n.jsx)(b.default,{type:"primary",onClick:()=>m.submit(),loading:x,size:"large",block:!0,children:"\u751F\u6210\u63D0\u793A\u8BCD"})})},children:[(0,n.jsx)(g.default,{name:"song_name",label:"\u6B4C\u66F2\u540D\u79F0",placeholder:"\u8BF7\u8F93\u5165\u6B4C\u66F2\u540D\u79F0\uFF0C\u4EC5\u4F5C\u4E3A\u8BB0\u5F55\u65B9\u4FBF\u67E5\u8BE2",rules:eg.songName,fieldProps:em.songName}),(0,n.jsx)(d.default,{name:"song_language",label:"\u6B4C\u66F2\u8BED\u8A00",placeholder:"\u8BF7\u9009\u62E9\u6B4C\u66F2\u8BED\u8A00",rules:eg.language,options:[{value:"Mandarin",label:"\u534E\u8BED\uFF08\u666E\u901A\u8BDD\uFF09"},{value:"Cantonese",label:"\u7CA4\u8BED"},{value:"Minnan",label:"\u95FD\u5357\u8BED"},{value:"English",label:"\u82F1\u8BED"},{value:"Korean",label:"\u97E9\u8BED"},{value:"Japanese",label:"\u65E5\u8BED"},{value:"Other",label:"\u5176\u4ED6"}]}),(0,n.jsx)(g.default,{name:"target_artist",label:"\u60F3\u6A21\u4EFF\u54EA\u4F4D\u827A\u672F\u5BB6\uFF1F",placeholder:"\u4F8B\u5982\uFF1A\u5F20\u60E0\u59B9\u3001\u9648\u5955\u8FC5\u3001\u5468\u6770\u4F26\u7B49",rules:eg.artistName,fieldProps:em.artistName}),(0,n.jsx)(c.ProFormList,{actionRef:f,name:"reference_songs",label:"\u53C2\u8003\u6B4C\u66F2\uFF08\u53EF\u9009\uFF0C\u6700\u591A 3 \u9996\uFF09",initialValue:[{title:"",artist:""}],creatorButtonProps:{creatorButtonText:"\u6DFB\u52A0\u53C2\u8003\u6B4C\u66F2",type:"dashed",block:!0},deleteIconProps:{tooltipText:"\u5220\u9664\u8BE5\u53C2\u8003\u6B4C\u66F2"},copyIconProps:!1,max:3,children:e=>(0,n.jsxs)(Q.default,{style:{width:"100%"},children:[(0,n.jsx)(g.default,{name:"title",placeholder:"\u6B4C\u66F2\u540D",rules:eg.referenceSongTitle,fieldProps:{style:{width:"100%"},...em.referenceSongTitle}}),(0,n.jsx)(g.default,{name:"artist",placeholder:"\u6F14\u5531\u8005\uFF08\u53EF\u9009\uFF09",rules:eg.referenceSongArtist,fieldProps:{style:{width:"100%"},...em.referenceSongArtist}})]},e.name)}),(0,n.jsx)(y.default,{name:"style_note",label:"\u98CE\u683C\u5907\u6CE8\uFF08\u53EF\u9009\uFF09",placeholder:"\u4F8B\u5982\uFF1A\u4E3B\u6B4C\u8981\u50CF\u300A\u4EBA\u8D28\u300B\u4E00\u6837\u6781\u5EA6\u514B\u5236\uFF0C\u526F\u6B4C\u63A5\u8FD1\u300A\u542C\u6D77\u300B\u7684\u60C5\u7EEA\u7206\u53D1\u3002",fieldProps:{showCount:!0,rows:3}}),(0,n.jsx)(y.default,{name:"extra_note",label:"\u7279\u6B8A\u8BF4\u660E\uFF08\u5982\u573A\u666F\u3001\u53D7\u4F17\u7B49\uFF0C\u53EF\u9009\uFF09",placeholder:"\u4F8B\u5982\uFF1A\u6F14\u5531\u4F1A\u73B0\u573A\u7248\u3001\u5F55\u97F3\u5BA4\u7248\u672C\u7B49",fieldProps:{showCount:!0,rows:3}}),(0,n.jsx)(y.default,{name:"lyrics_raw",label:"\u6BB5\u843D\u4E0E\u6B4C\u8BCD",placeholder:"\u8BF7\u586B\u5199\u6B4C\u8BCD\uFF0C\u5E76\u4F7F\u7528\u4EFB\u610F\u6807\u7B7E\u5212\u5206\u6BB5\u843D\uFF0C\u4F8B\u5982\uFF1A\u3010\u4E3B\u6B4C\u3011\u3001\u3010\u526F\u6B4C\u3011\u3001[Verse]\u3001[Chorus] \u7B49",rules:eg.lyrics,fieldProps:em.lyrics})]}):(0,n.jsx)("div",{style:{textAlign:"center",padding:"40px 0"},children:(0,n.jsx)(et.default,{size:"large"})})})}),(0,n.jsx)(S.default,{xxl:8,xl:8,lg:6,md:12,sm:12,xs:12,children:(0,n.jsx)(er.ResultCard,{title:"Styles \u63D0\u793A\u8BCD\uFF08\u53EF\u76F4\u63A5\u590D\u5236\u7528\u4E8E Suno\uFF09",value:C,onCopy:()=>(0,eh.copyToClipboard)(C,"Styles")})}),(0,n.jsx)(S.default,{xxl:8,xl:8,lg:6,md:12,sm:12,xs:12,children:(0,n.jsx)(er.ResultCard,{title:"Lyrics \u63D0\u793A\u8BCD\uFF08\u53EF\u76F4\u63A5\u590D\u5236\u7528\u4E8E Suno\uFF09",value:E,onCopy:()=>(0,eh.copyToClipboard)(E,"Lyrics")})})]})]})]});};}}]);
//# sourceMappingURL=c27184d7-async.1cc233df.js.map