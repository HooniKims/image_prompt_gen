(() => {
  const ROOT_ID = 'cipa-root';
  const DEFAULT_API_URL = 'https://image-prompt.alluser.site/api/image-prompt';
  const DEFAULT_API_KEY = '';
  const DEFAULT_LM_STUDIO_MODEL = 'google/gemma-4-e2b';
  const FALLBACK_LM_STUDIO_MODEL = 'google/gemma-4-e4b';
  const DEFAULT_REQUEST_TIMEOUT_MS = 90000;
  const FETCH_JSON_TIMEOUT_MS = 95000;
  const COMPLEX_PURPOSES = new Set(['storybook', 'comic_webtoon', 'image_series']);
  const HIDDEN_SUMMARY_KEYS = new Set(['subject']);
  const MAX_MOUNT_ATTEMPTS = 20;
  const MOUNT_RETRY_DELAY_MS = 250;
  const PURPOSES = [
    ['simple_image', '단순 이미지', true],
    ['education', '교육용 이미지', true],
    ['cardnews_infographic', '카드뉴스/인포그래픽', true],
    ['youtube_thumbnail', '유튜브 썸네일', true],
    ['class_slide', '수업자료 슬라이드', true],
    ['worksheet_illustration', '교재/활동지 삽화', false],
    ['storybook', '스토리북', true],
    ['comic_webtoon', '만화/웹툰', true],
    ['image_series', '여러 장 시리즈', true],
    ['instagram_feed', '인스타그램 피드', false],
    ['instagram_story', '인스타그램 스토리', false],
    ['a4_document', 'A4 문서', false],
    ['blog_cover', '블로그 대표 이미지', false],
    ['guide_notice', '학생/학부모 안내', false],
    ['sns_blog', 'SNS/블로그 이미지', false],
    ['character_background_prop', '캐릭터/배경/소품', false],
    ['custom', '직접 입력', false],
  ];
  const RATIOS = ['1:1', '16:9', '9:16', '4:5', '3:2', '2:3'];
  const OUTPUT_COUNTS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const STYLE_SAMPLE_DIR = 'assets/style-samples';
  const STYLE_CATEGORIES = [
    ['웹/UI·SaaS', [0, 4, 18, 26, 33, 42, 46, 48]],
    ['교육·설명', [2, 10, 20, 23, 28, 35, 37, 40]],
    ['카드뉴스·에디토리얼', [22, 29, 30, 32, 44, 47]],
    ['데이터·비교·컨설팅', [1, 27, 31, 34, 38]],
    ['일러스트·공예', [9, 11, 17, 19, 41]],
    ['레트로·코믹·팝', [3, 7, 12, 13, 14, 25, 39]],
    ['3D·아이소메트릭', [8, 16, 36]],
    ['시네마틱·미래형', [5, 6, 15, 21, 24, 43]],
  ];
  const FEATURED_STYLE_GROUPS = [
    { label: '웹/UI·SaaS', index: 0, hint: '웹서비스, 앱 소개, 모던 업무 화면에 적합' },
    { label: '교육·설명', index: 2, hint: '수업자료, 개념 설명, 학습용 이미지에 적합' },
    { label: '카드뉴스·에디토리얼', index: 29, hint: 'SNS 카드뉴스, 안내문, 정보 요약에 적합' },
    { label: '데이터·비교·컨설팅', index: 27, hint: 'Before/After, 리포트, 전략 슬라이드에 적합' },
    { label: '일러스트·공예', index: 20, hint: '밝고 친근한 삽화, 활동지, 블로그 이미지에 적합' },
    { label: '레트로·코믹·팝', index: 13, hint: '강한 인상, 만화 컷, 재미있는 표현에 적합' },
    { label: '3D·아이소메트릭', index: 41, hint: '입체적인 비즈니스 장면과 구조 설명에 적합' },
    { label: '시네마틱·미래형', index: 21, hint: 'SF, 기술, 몰입감 있는 장면 표현에 적합' },
  ];
  const STYLES = [
    ['벤토 그리드 스타일(모던 웹UI)', 'Bento grid UI layout, tech minimalist design, clean web interface, soft lighting, modern corporate aesthetic, vector flat style, UI/UX --ar 16:9'],
    ['비즈니스 미니멀 스타일', 'Minimalist timeline infographic, simple flat vector art, clean data visualization, geometric shapes, corporate color palette, white background, highly legible --ar 16:9'],
    ['칠판 스타일 (교육용 슬라이드)', 'Chalkboard sketch, educational diagram, white chalk on dark green board, hand-drawn aesthetic, arrows and mind maps, friendly and approachable tone'],
    ['일본 종이 만화책 스타일', 'Manga instructional comic panel, clean line art, monochrome with screentones, informative speech bubbles, office worker character, tutorial style, expressive'],
    ['뉴 모피즘 스타일 (모던 웹사이트)', 'Neumorphic tech schematic, soft UI, drop shadows, subtle gradients, clean tech blueprint, modern app interface, minimalist 3D layout'],
    ['바우하우스(현대 건축, 현대 미술) 스타일', 'Bauhaus aesthetic, geometric abstraction, primary colors (red, blue, yellow), strict grid, modern minimalist poster, clean typography layout'],
    ['네온/사이버 펑크 스타일', 'Neon noir technological scene, cyberpunk aesthetic, dark background with glowing neon accents, glowing data streams, highly detailed, futuristic'],
    ['도스 스타일(터미널, 녹색 텍스트)', 'Retro CRT monitor screen, Matrix green text on black background, glowing phosphor, terminal code, vintage hacker aesthetic, scanlines'],
    ['복셀(3차원 픽셀) 아트 스타일', 'Isometric voxel art, gamified office environment, highly detailed blocks, bright lighting, colorful pixel 3D, cute architectural diagram --ar 16:9'],
    ['클레이 애니메이션 스타일', 'Claymation style, tactile 3D illustration, cute office worker figurine, soft smooth lighting, playful stop-motion aesthetic, vibrant pastel colors'],
    ['식물학/과학 일러스트 스타일', 'Botanical scientific illustration, vintage field guide style, delicate line work, watercolor shading, highly detailed and precise'],
    ['카와이 스타일 / 파스텔 톤', 'Kawaii illustration, girly pastel colors, soft and fluffy aesthetic, cute minimalist characters, warm lighting, dreamlike'],
    ['레트로 팝 스타일', 'Retro pop art, playful aesthetic, 1980s Memphis design, bold outlines, vibrant flat colors, dynamic composition, energetic'],
    ['빈티지/액션 코믹스 스타일', 'Vintage action comic panel, 1960s comic book style, halftone dot textures, dramatic angles, bold typography, retro coloring'],
    ['레트로 코믹 액션 블루프린트', 'Retro-comic action blueprint, technical schematic drawing mixed with vintage comic art, blue and white colors, dynamic mechanical details'],
    ['역동적(하이 옥탄) 스타일 애니메이션', 'High-octane anime style, intense dynamic action, speed lines, high energy, dramatic lighting, vivid colors, epic perspective'],
    ['로코코(프랑스, 낭만적) 스타일', 'Elegant Rococo style, romantic ornate aesthetic, soft pastel oil painting, intricate gold floral details, vintage luxury'],
    ['플랫 코퍼레이트 일러스트', 'Corporate flat illustration, Alegria style, modern tech startup blog art, simplified vector characters working in office, minimal background, bright professional colors --ar 16:9'],
    ['글래스 모피즘 3D (투명) 스타일', '3D glassmorphism icons, frosted glass UI elements, modern tech aesthetic, soft studio lighting, clean white background, high-end corporate presentation style'],
    ['페이퍼 컷아웃 아트 스타일', 'Layered paper cutout art, conceptual office desk, soft shadows, pastel colored paper, clean and minimal storytelling, tactile texture --ar 16:9'],
    ['플랫 벡터 모션그래픽 스타일', 'Flat vector illustration, science channel aesthetic, vibrant deep space colors, clean minimalist background, educational infographic, highly detailed yet simplified --ar 16:9'],
    ['시네마틱 우주 SF 다큐멘터리 스타일', 'Cinematic 3D render of a space station orbiting a gas giant, hard sci-fi aesthetic, hyper-realistic, dramatic lighting, volumetric scattering, 8k resolution, space documentary style --ar 16:9'],
    ['뉴스레터 에디토리얼', 'Magazine editorial layout, modern business newsletter, elegant serif typography, two-column grid, muted earth tone palette, professional photography style --ar 16:9'],
    ['스케치노트 스타일', 'Sketchnote visual summary, hand-drawn icons and typography, black ink with color highlights, clean white background, educational mind map, conference note style --ar 16:9'],
    ['그라디언트 모던 커버', 'Abstract gradient background, modern corporate cover design, smooth color transitions, geometric light effects, premium minimalist aesthetic, clean title space --ar 16:9'],
    ['도트 픽셀 아트 2D', '16-bit retro pixel art, 2D side-scrolling game scene, office worker character, bright saturated colors, nostalgic game UI elements, clean pixel grid --ar 16:9'],
    ['SaaS 대시보드 인포그래픽', 'SaaS dashboard infographic, clean enterprise UI, cards and charts, modern workplace software aesthetic, white and blue corporate palette, minimal interface, high clarity, presentation-ready, vector UI illustration --ar 16:9'],
    ['Before / After 비교 카드형', 'Before and after comparison card layout, split screen infographic, clean corporate design, organized workflow transformation, minimal icons, white background, highly legible, business presentation style --ar 16:9'],
    ['화이트보드 전략 회의형 스타일', 'Whiteboard strategy meeting illustration, office team planning around a board, sticky notes and diagrams, modern business environment, clean semi-flat illustration, collaborative and intelligent tone --ar 16:9'],
    ['카드 뉴스형 정보 요약', 'Card news style explainer, modular information blocks, bold headings, clean Korean social media editorial aesthetic, minimal icons, bright background, business-friendly visual summary --ar 16:9'],
    ['서류 / 리서치 데스크 스타일', 'Research desk visualization, laptop with multiple documents and notes, clean analytical workspace, modern office desk, papers, charts and highlights, soft daylight, realistic editorial illustration --ar 16:9'],
    ['데이터 스토리텔링/광고 포스터', 'Data storytelling poster, one key metric highlighted, clean chart-driven composition, modern corporate poster design, bold typography, minimal geometric elements, presentation-friendly --ar 16:9'],
    ['프리미엄 컨설팅 슬라이드 스타일', 'Consulting deck visual, premium business slide aesthetic, clean layouts, subtle corporate color palette, sharp icons, minimal data elements, strategy presentation style, polished and executive-friendly --ar 16:9'],
    ['협업툴 메시지형 비주얼', 'Collaboration app scene, modern team messaging and document sharing interface, office productivity software aesthetic, clean floating windows, minimal UI, bright professional environment --ar 16:9'],
    ['포스트잇 문제 해결 맵', 'Sticky note problem solving map, colorful structured note clusters, clean workshop board, office ideation process, modern facilitation aesthetic, highly legible, visual thinking style --ar 16:9'],
    ['미니멀 라인 아트 다이어그램', 'Minimalist line art diagram, simple continuous black lines on off-white background, step-by-step process, clean UI/UX elements, highly legible, professional and elegant'],
    ['프리미엄 스톡 사진', 'Candid photography of a diverse corporate team reviewing a document together in a bright modern boardroom, authentic expression, shot on 35mm lens, shallow depth of field, soft natural lighting --ar 16:9'],
    ['핸드드로잉 노트북 필기', 'Hand-drawn notebook journal page, lined paper texture, ballpoint pen sketches and handwritten notes, casual margin doodles, highlighted key points, warm personal study aesthetic, authentic and relatable --ar 16:9'],
    ['아이소메트릭 플랫 인포그래픽', 'Isometric flat vector infographic, clean technical illustration, modern office workflow, soft gradient colors, organized layered structure, white background, professional and highly legible --ar 16:9'],
    ['듀오톤 그래픽 스타일', 'Duotone graphic design, two-tone color overlay on photography, bold modern contrast, Spotify cover art aesthetic, striking visual impact, clean composition, contemporary editorial style --ar 16:9'],
    ['스텝 바이 스텝 매뉴얼', 'Step-by-step instruction manual, IKEA assembly guide aesthetic, numbered sequential diagrams, simple line icons with color highlights, clean white background, universal pictogram style, highly functional and legible --ar 16:9'],
    ['3D 아이소메트릭 비즈니스 스타일', '3D isometric illustration, modern corporate workflow, clean office environment, soft clay render style, pastel and white color palette, highly detailed, soft studio lighting, tech business concept --ar 16:9'],
    ['모던 다크 모드 디자인', 'Sleek dark mode UI presentation background, subtle glowing gradients, deep black and dark gray palette, modern minimalist tech aesthetic, elegant and premium corporate style, clean negative space --ar 16:9'],
    ['디지털 마인드맵 / 노드 스타일', 'Abstract digital node network, glowing connecting lines and dots, clean data visualization concept, mind map aesthetic, modern deep tech background, soft glowing lights --ar 16:9'],
    ['볼드 타이포그래피', 'Bold typography poster design, Swiss style layout, massive clean sans-serif text layout, high contrast minimal colors, modern graphic design aesthetic, strong visual impact --ar 16:9'],
    ['폴라로이드 무드보드', 'Polaroid scrapbook layout on a wooden desk, aesthetic moodboard, sticky notes, scattered paper clips, candid team moments, warm soft lighting, nostalgic yet professional editorial style --ar 16:9'],
    ['디지털 태블릿 다이어리', 'Digital planner interface, iPad GoodNotes aesthetic, pastel highlighters, digital handwriting, habit tracker layout, cozy personal productivity workspace, clean minimal design --ar 16:9'],
    ['스위스 그리드 인포디자인', 'Swiss grid editorial design, ultra-clean modular layout, structured typography, asymmetric grid, modernist corporate poster, restrained color palette, highly legible, presentation-ready --ar 16:9'],
    ['포털형 카드 매거진', 'Portal-style card magazine layout, clean Korean editorial web design, modular content cards, bold headlines, soft neutral palette, user-friendly information hierarchy, modern media aesthetic --ar 16:9'],
  ];

  if (document.getElementById(ROOT_ID)) return;
  scheduleMount(1);

  function scheduleMount(attempt) {
    if (document.getElementById(ROOT_ID)) return;
    if (!document.documentElement || !document.body) {
      if (attempt < MAX_MOUNT_ATTEMPTS) setTimeout(() => scheduleMount(attempt + 1), MOUNT_RETRY_DELAY_MS);
      return;
    }
    queueMicrotask(() => mount(attempt));
  }

  async function mount(attempt = 1) {
    if (document.getElementById(ROOT_ID)) return;
    const host = document.createElement('div');
    host.id = ROOT_ID;
    try {
      const shadow = host.attachShadow({ mode: 'open' });
      shadow.innerHTML = template();
      document.documentElement.append(host);
      const app = new RuntimeApp(shadow);
      await app.init();
    } catch (error) {
      host.remove();
      console.warn('[CIPA] Failed to mount prompt assistant panel.', error);
      if (attempt < MAX_MOUNT_ATTEMPTS) setTimeout(() => scheduleMount(attempt + 1), MOUNT_RETRY_DELAY_MS);
    }
  }

  class RuntimeApp {
    constructor(root) {
      this.root = root;
      this.state = {
        site: detectSite(),
        showAll: false,
        purpose: 'simple_image',
        result: null,
        card: null,
        busy: false,
        toast: '',
        settings: {},
        cards: [],
        stylePickerOpen: false,
        stylePickerExpanded: false,
        selectedFeedback: '',
        improvementStatus: '',
        busyMode: '',
      };
    }

    async init() {
      this.state.settings = normalizeSettings(await read('settings', {
        apiUrl: DEFAULT_API_URL,
        apiKey: DEFAULT_API_KEY,
        model: DEFAULT_LM_STUDIO_MODEL,
        fallbackModel: FALLBACK_LM_STUDIO_MODEL,
        useExternalApi: false,
        onboardingDone: false,
        collapsed: false,
      }));
      await write('settings', this.state.settings);
      this.state.cards = await read('workCards', []);
      this.root.addEventListener('click', (event) => this.handleClick(event));
      this.root.addEventListener('input', (event) => {
        if (!event.target?.dataset.field) return;
        this.state[event.target.dataset.field] = event.target.value;
        if (event.target.dataset.field === 'feedback' && !this.state.busy) {
          this.state.selectedFeedback = '';
          this.state.improvementStatus = '';
          this.renderFeedbackControls();
        }
      });
      setInterval(() => {
        const site = detectSite();
        if (site !== this.state.site) {
          this.state.site = site;
          this.render();
        }
      }, 1200);
      this.render();
    }

    async handleClick(event) {
      const button = event.target?.closest('[data-action]');
      if (!button) return;
      const action = button.dataset.action;
      event.preventDefault();
      if (action === 'toggle') return this.toggle();
      if (action === 'more') {
        this.state.showAll = true;
        return this.render();
      }
      if (action === 'purpose') {
        this.state.purpose = button.dataset.value;
        return this.render();
      }
      if (action === 'style-toggle') {
        this.state.stylePickerOpen = !this.state.stylePickerOpen;
        if (this.state.stylePickerOpen) this.state.stylePickerExpanded = false;
        return this.render();
      }
      if (action === 'style-custom-apply') return this.applyCustomStyle();
      if (action === 'style-more') {
        this.state.stylePickerExpanded = true;
        return this.render();
      }
      if (action === 'style-select') {
        const styleName = button.dataset.value || STYLES[0][0];
        q(this.root, '[data-field="style"]').value = styleName;
        q(this.root, '[data-field="style"]').dataset.styleSource = 'preset';
        this.state.stylePickerOpen = false;
        return this.render();
      }
      if (action === 'generate') return this.generate();
      if (action === 'insert') return this.insert();
      if (action === 'copy') return this.copy();
      if (action === 'current') return this.loadCurrent();
      if (action === 'select-feedback') {
        if (this.state.busy) return;
        this.state.selectedFeedback = button.dataset.feedback || '';
        this.state.improvementStatus = '';
        this.setField('feedback', '');
        return this.render();
      }
      if (action === 'improve-custom') {
        if (this.state.busy) return;
        const feedback = this.improvementFeedback();
        if (!feedback) return this.toast('수정할 방향을 선택하거나 직접 입력해 주세요.');
        return this.improve(feedback);
      }
      if (action === 'history-use') return this.useHistoryCard(button.dataset.id);
      if (action === 'history-favorite') return this.toggleFavorite(button.dataset.id);
      if (action === 'history-delete') return this.deleteHistoryCard(button.dataset.id);
      if (action === 'onboarding') {
        this.state.settings.onboardingDone = true;
        await write('settings', this.state.settings);
        return this.render();
      }
      if (action === 'settings') {
        this.state.showSettings = !this.state.showSettings;
        return this.render();
      }
      if (action === 'save-settings') {
        this.state.settings.apiUrl = this.val('apiUrl') || DEFAULT_API_URL;
        this.state.settings.apiKey = this.val('apiKey');
        this.state.settings.model = this.val('model');
        this.state.settings.useExternalApi = this.checked('useExternalApi');
        await write('settings', this.state.settings);
        this.state.showSettings = false;
        return this.toast('설정을 저장했습니다.');
      }
      if (action === 'open-url') window.open(button.dataset.url, '_blank', 'noopener,noreferrer');
    }

    async toggle() {
      this.state.settings.collapsed = !this.state.settings.collapsed;
      await write('settings', this.state.settings);
      this.render();
    }

    input(action = 'generate', feedback = '') {
      const site = this.state.site === 'unsupported' ? this.val('targetSite') || 'chatgpt' : this.state.site;
      return {
        action,
        requestId: id('req'),
        targetSite: site,
        sourceText: this.val('idea'),
        idea: this.val('idea'),
        purpose: this.state.purpose,
        style: this.val('style') || '미니멀 벡터',
        ratio: this.val('ratio') || '1:1',
        quality: this.val('quality') || 'balanced',
        formatPreset: purposeFormatPreset(this.state.purpose),
        outputCount: normalizeOutputCount(this.val('outputCount') || 1),
        scenePlan: this.val('scenePlan'),
        consistencyNotes: this.val('consistencyNotes'),
        inImageText: this.val('inImageText'),
        audience: this.val('audience'),
        referenceMode: this.val('referenceMode') || 'none',
        advancedNotes: this.val('advancedNotes'),
        previousPrompt: this.state.result?.prompt,
        parentVersionId: this.state.result?.version?.id || null,
        feedback,
      };
    }

    applyCustomStyle() {
      const customStyle = this.val('customStyle').trim();
      if (!customStyle) return this.toast('직접 입력할 스타일을 적어 주세요.');
      const styleField = q(this.root, '[data-field="style"]');
      styleField.value = customStyle;
      styleField.dataset.styleSource = 'custom';
      this.state.stylePickerOpen = false;
      this.render();
    }

    async generate() {
      if (this.state.busy) return;
      const input = this.input();
      if (!input.idea && !input.inImageText) return this.toast('만들 이미지의 주제만 짧게 적어주세요.');
      this.state.busy = true;
      this.state.busyMode = 'generate';
      this.render();
      try {
        this.syncSettingsFromFields();
        const result = await requestPrompt(input, this.state.settings);
        const card = createCard(input, result);
        await saveCard(card);
        this.state.result = result;
        this.state.card = card;
        this.state.cards = await read('workCards', []);
        this.toast(this.state.settings.useExternalApi ? 'API로 프롬프트를 만들었습니다.' : '프롬프트를 만들었습니다.');
      } catch (error) {
        console.warn('[CIPA] prompt generation failed', error);
        this.toast(`API 연결 실패: ${humanError(error)}`);
      } finally {
        this.state.busy = false;
        this.state.busyMode = '';
        this.render();
      }
    }

    async improve(feedback) {
      if (this.state.busy || !this.state.result || !this.state.card) return;
      this.state.busy = true;
      this.state.busyMode = 'improve';
      this.state.improvementStatus = 'generating';
      this.render();
      try {
        this.syncSettingsFromFields();
        const result = await requestPrompt(this.input('improve', feedback), this.state.settings);
        this.state.card = appendVersion(this.state.card, result, feedback);
        await saveCard(this.state.card);
        this.state.result = result;
        this.state.cards = await read('workCards', []);
        this.state.selectedFeedback = '';
        this.state.improvementStatus = 'done';
        this.toast('API로 개선 버전을 만들었습니다.');
      } catch (error) {
        console.warn('[CIPA] prompt improvement failed', error);
        this.state.improvementStatus = '';
        this.toast(`API 연결 실패: ${humanError(error)}`);
      } finally {
        this.state.busy = false;
        this.state.busyMode = '';
        this.render();
      }
    }

    async insert() {
      if (!this.state.result?.prompt) return;
      const adapter = adapterFor(this.state.site);
      if (!adapter) return this.toast('ChatGPT 또는 Gemini 페이지에서만 자동 삽입할 수 있습니다.');
      const existing = adapter.get();
      let mode = 'overwrite';
      if (existing.trim()) {
        mode = await this.askInsertMode();
        if (mode === 'cancel') return;
      }
      try {
        const ok = await adapter.set(this.state.result.prompt, mode);
        if (!ok) throw new Error('verify failed');
        this.state.settings.collapsed = true;
        await write('settings', this.state.settings);
        this.toast('삽입 완료');
      } catch (error) {
        console.warn('[CIPA] insert failed', error);
        this.toast('삽입에 실패했습니다. 복사 버튼으로 붙여넣어 주세요.');
      }
    }

    async askInsertMode() {
      return new Promise((resolve) => {
        const dialog = this.root.querySelector('[data-insert-dialog]');
        dialog.hidden = false;
        const listener = (event) => {
          const mode = event.target?.closest('[data-insert-mode]')?.dataset.insertMode;
          if (!mode) return;
          dialog.hidden = true;
          dialog.removeEventListener('click', listener);
          resolve(mode);
        };
        dialog.addEventListener('click', listener);
      });
    }

    async copy() {
      await navigator.clipboard.writeText(this.state.result?.prompt || '');
      this.toast('프롬프트를 복사했습니다.');
    }

    async useHistoryCard(cardId) {
      const card = this.state.cards.find((item) => item.id === cardId);
      const version = currentVersion(card);
      if (!card || !version) return;
      this.state.purpose = card.options?.purpose || this.state.purpose;
      this.state.result = {
        ok: true,
        action: 'generate',
        targetSite: card.targetSite,
        prompt: version.prompt,
        summary: version.summary || {},
        suggestions: version.suggestions || [],
        version: { id: version.id, parentId: version.parentId ?? null, createdAt: version.createdAt },
        metadata: version.metadata || {},
      };
      this.state.card = card;
      this.setField('idea', card.sourceText || '');
      for (const field of ['style', 'ratio', 'quality', 'outputCount', 'inImageText', 'audience', 'referenceMode', 'scenePlan', 'consistencyNotes', 'advancedNotes']) {
        if (card.options?.[field] != null) this.setField(field, card.options[field]);
      }
      this.toast('최근 작업을 불러왔습니다.');
    }

    async toggleFavorite(cardId) {
      const cards = this.state.cards.map((card) => (card.id === cardId ? { ...card, favorite: !card.favorite, updatedAt: new Date().toISOString() } : card));
      await write('workCards', limitCards(cards));
      this.state.cards = await read('workCards', []);
      this.render();
    }

    async deleteHistoryCard(cardId) {
      await write('workCards', this.state.cards.filter((card) => card.id !== cardId));
      this.state.cards = await read('workCards', []);
      if (this.state.card?.id === cardId) {
        this.state.card = null;
        this.state.result = null;
      }
      this.render();
    }

    loadCurrent() {
      const adapter = adapterFor(this.state.site);
      if (!adapter) return this.toast('입력창을 찾지 못했습니다.');
      const idea = this.root.querySelector('[data-field="idea"]');
      idea.value = adapter.get();
      this.toast(idea.value ? '현재 입력창 내용을 가져왔습니다.' : '현재 입력창이 비어 있습니다.');
    }

    render() {
      const collapsed = Boolean(this.state.settings.collapsed);
      q(this.root, '[data-panel]').classList.toggle('is-collapsed', collapsed);
      q(this.root, '[data-floating]').hidden = !collapsed;
      q(this.root, '[data-body]').hidden = collapsed;
      q(this.root, '[data-site]').textContent = siteLabel(this.state.site);
      q(this.root, '[data-unsupported]').hidden = this.state.site !== 'unsupported';
      q(this.root, '[data-workflow]').hidden = this.state.site === 'unsupported';
      q(this.root, '[data-onboarding]').hidden = Boolean(this.state.settings.onboardingDone);
      q(this.root, '[data-settings-panel]').hidden = !this.state.showSettings;
      q(this.root, '[data-busy]').hidden = !this.state.busy;
      q(this.root, '[data-toast]').textContent = this.state.toast;
      this.renderPurposes();
      this.renderStyles();
      this.renderResult();
      this.renderHistory();
      this.fillDefaults();
      this.syncTargetSiteField();
      this.renderBusyControls();
      this.renderFeedbackControls();
    }

    renderPurposes() {
      const items = PURPOSES.filter(([, , featured]) => this.state.showAll || featured);
      q(this.root, '[data-purposes]').innerHTML = items
        .map(([value, label]) => `<button class="purpose ${this.state.purpose === value ? 'is-selected' : ''}" data-action="purpose" data-value="${value}">${label}</button>`)
        .join('');
      q(this.root, '[data-action="more"]').hidden = this.state.showAll;
    }

    renderStyles() {
      const selectedStyle = this.val('style') || STYLES[0][0];
      q(this.root, '[data-style-label]').textContent = selectedStyle;
      const picker = q(this.root, '[data-style-picker]');
      picker.hidden = !this.state.stylePickerOpen;
      const items = this.visibleStyles(selectedStyle);
      const moreButton = this.state.stylePickerExpanded
        ? ''
        : `<button class="style-more-button" data-action="style-more">전체 ${STYLES.length}개 스타일 보기</button>`;
      const customValue = !STYLES.some(([name]) => name === selectedStyle) ? selectedStyle : '';
      picker.innerHTML = `<div class="custom-style-panel" data-custom-style-panel>
        <label>직접 입력 스타일<input data-field="customStyle" value="${esc(customValue)}" placeholder="예: 어두운 SF 영화 포스터, 파란 네온 조명, 강한 대비"></label>
        <button type="button" data-action="style-custom-apply">적용</button>
      </div><div class="style-picker-note">${this.state.stylePickerExpanded ? '전체 스타일' : '대표 카테고리 8개'}</div>${items.map(([name, prompt, index, category, hint]) => {
        const selected = name === selectedStyle ? ' is-selected' : '';
        const sampleUrl = chrome.runtime.getURL(styleSamplePath(index));
        return `<button class="style-card${selected}" data-action="style-select" data-value="${esc(name)}">
          <img class="style-sample" src="${esc(sampleUrl)}" alt="${esc(name)} 샘플 이미지" loading="lazy">
          <span><em class="style-category">${esc(category)}</em><b>${index + 1}. ${esc(name)}</b><small>${esc(hint || prompt)}</small></span>
        </button>`;
      }).join('')}${moreButton}`;
    }

    visibleStyles(selectedStyle) {
      if (this.state.stylePickerExpanded) {
        return STYLES.map(([name, prompt], index) => [name, prompt, index, styleCategoryLabel(index), '']);
      }
      const items = FEATURED_STYLE_GROUPS.map(({ label, index, hint }) => [...STYLES[index], index, label, hint]);
      const featured = new Set(FEATURED_STYLE_GROUPS.map(({ index }) => index));
      const selectedIndex = STYLES.findIndex(([name]) => name === selectedStyle);
      if (selectedIndex >= 0 && !featured.has(selectedIndex)) {
        items.push([...STYLES[selectedIndex], selectedIndex, styleCategoryLabel(selectedIndex), '현재 선택한 스타일']);
      }
      return items;
    }

    renderResult() {
      const result = this.state.result;
      q(this.root, '[data-result]').hidden = !result;
      if (!result) return;
      q(this.root, '[data-prompt]').textContent = result.prompt;
      q(this.root, '[data-summary]').innerHTML = `<b>프롬프트 한글 설명</b><p data-prompt-translation>${esc(renderPromptTranslation(result))}</p>`;
      const suggestions = (result.suggestions || []).map(localizeSuggestion).filter(Boolean);
      q(this.root, '[data-suggestions]').innerHTML = localizedSuggestions(suggestions).map((item) => `<li>${esc(item)}</li>`).join('');
    }

    renderBusyControls() {
      const generateButton = q(this.root, '[data-generate-button]');
      if (generateButton) {
        generateButton.disabled = this.state.busy;
        generateButton.textContent = this.state.busyMode === 'generate' ? '프롬프트 생성중...' : '프롬프트 만들기';
      }
      const busy = q(this.root, '[data-busy]');
      if (busy) {
        busy.textContent = this.state.busyMode === 'improve'
          ? '수정사항을 반영하여 다시 프롬프트를 생성중입니다'
          : '생성 중...';
      }
    }

    renderFeedbackControls() {
      const form = q(this.root, '[data-feedback-form]');
      const textarea = q(this.root, '[data-field="feedback"]');
      const improving = this.state.improvementStatus === 'generating';
      const done = this.state.improvementStatus === 'done';
      form?.classList.toggle('is-improving', improving);
      form?.classList.toggle('is-done', done);
      this.root.querySelectorAll('[data-action="select-feedback"]').forEach((button) => {
        const selected = this.state.selectedFeedback && button.dataset.feedback === this.state.selectedFeedback;
        button.classList.toggle('is-selected-feedback', Boolean(selected));
        button.disabled = this.state.busy;
      });
      const improveButton = q(this.root, '[data-action="improve-custom"]');
      if (improveButton) improveButton.disabled = this.state.busy || !this.state.result;
      if (!textarea) return;
      textarea.disabled = improving;
      if (improving) textarea.value = '수정사항을 반영하여 다시 프롬프트를 생성중입니다';
      if (done) textarea.value = '수정이 완료되었습니다.';
    }

    renderHistory() {
      q(this.root, '[data-history]').innerHTML = this.state.cards
        .slice(0, 8)
        .map((card) => `<li>
          <button class="history-main" data-action="history-use" data-id="${esc(card.id)}">
            <span>${card.favorite ? '★ ' : ''}${esc(card.userTitle || card.title)}</span>
            <small>${esc(siteLabel(card.targetSite))} · v${card.versions?.length || 1}</small>
          </button>
          <button class="icon-button" title="즐겨찾기" data-action="history-favorite" data-id="${esc(card.id)}">${card.favorite ? '★' : '☆'}</button>
          <button class="icon-button" title="삭제" data-action="history-delete" data-id="${esc(card.id)}">×</button>
        </li>`)
        .join('');
    }

    fillDefaults() {
      setDefault(this.root, 'style', STYLES[0][0]);
      setDefault(this.root, 'ratio', '1:1');
      setDefault(this.root, 'quality', 'balanced');
      setDefault(this.root, 'outputCount', '1');
      setDefault(this.root, 'apiUrl', this.state.settings.apiUrl || DEFAULT_API_URL);
      setDefault(this.root, 'apiKey', this.state.settings.apiKey || DEFAULT_API_KEY);
      setDefault(this.root, 'model', this.state.settings.model || DEFAULT_LM_STUDIO_MODEL);
      setChecked(this.root, 'useExternalApi', Boolean(this.state.settings.useExternalApi));
    }

    syncTargetSiteField() {
      const target = q(this.root, '[data-field="targetSite"]');
      if (!target) return;
      target.value = this.state.site === 'unsupported' ? (target.value || 'chatgpt') : this.state.site;
    }

    syncSettingsFromFields() {
      this.state.settings.apiUrl = this.val('apiUrl') || this.state.settings.apiUrl || DEFAULT_API_URL;
      this.state.settings.apiKey = this.val('apiKey') || this.state.settings.apiKey || DEFAULT_API_KEY;
      this.state.settings.model = this.val('model') || this.state.settings.model || DEFAULT_LM_STUDIO_MODEL;
      this.state.settings.fallbackModel = FALLBACK_LM_STUDIO_MODEL;
      this.state.settings.useExternalApi = this.checked('useExternalApi');
      write('settings', this.state.settings);
    }

    val(field) {
      return q(this.root, `[data-field="${field}"]`)?.value?.trim() || '';
    }

    checked(field) {
      return Boolean(q(this.root, `[data-field="${field}"]`)?.checked);
    }

    setField(field, value) {
      const element = q(this.root, `[data-field="${field}"]`);
      if (element) element.value = value || '';
    }

    improvementFeedback() {
      const typed = this.val('feedback');
      if (typed && !isSystemFeedbackText(typed)) return typed;
      return this.state.selectedFeedback || '';
    }

    toast(message) {
      this.state.toast = message;
      this.render();
      clearTimeout(this.toastTimer);
      this.toastTimer = setTimeout(() => {
        this.state.toast = '';
        this.render();
      }, 3500);
    }
  }

  async function requestPrompt(input, settings) {
    if (!settings.useExternalApi) return fallbackResponse(input);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), Number(settings.timeoutMs || DEFAULT_REQUEST_TIMEOUT_MS));
    const apiUrl = settings.apiUrl || DEFAULT_API_URL;
    const openAICompatible = isOpenAIChatCompletionsEndpoint(apiUrl);
    const selectedModel = selectLmStudioModel(input);
    try {
      const models = openAICompatible
        ? uniqueModels([selectedModel, settings.model, FALLBACK_LM_STUDIO_MODEL])
        : [null];
      let lastError = null;

      for (const model of models) {
        try {
          const payload = await fetchJson(apiUrl, {
            headers: {
              'Content-Type': 'application/json',
              ...(settings.apiKey ? { 'X-API-Key': settings.apiKey } : {}),
            },
            body: JSON.stringify(openAICompatible ? openAIBody(input, model) : structuredBody(input, selectedModel)),
            signal: controller.signal,
          });
          return normalizeResponse(payload, input);
        } catch (error) {
          lastError = error;
          if (!openAICompatible || model === models[models.length - 1]) throw error;
          console.warn(`[CIPA] LM Studio model ${model} failed, trying fallback model.`, error);
        }
      }

      throw lastError || new Error('REQUEST_FAILED');
    } catch (error) {
      throw new Error(`Prompt API request failed: ${error.message || error}`);
    } finally {
      clearTimeout(timeout);
    }
  }

  function fetchJson(url, options) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('API request timed out after 95 seconds')), FETCH_JSON_TIMEOUT_MS);
      options.signal?.addEventListener('abort', () => {
        clearTimeout(timeout);
        reject(new Error('API request timed out after 95 seconds'));
      }, { once: true });

      chrome.runtime.sendMessage(
        {
          type: 'CIPA_FETCH_JSON',
          url,
          method: 'POST',
          headers: options.headers,
          body: options.body,
        },
        (response) => {
          clearTimeout(timeout);
          const runtimeError = chrome.runtime.lastError;
          if (runtimeError) {
            reject(new Error(runtimeError.message));
            return;
          }
          if (!response?.ok) {
            reject(new Error(response?.error || 'API request failed'));
            return;
          }
          resolve(response.payload);
        },
      );
    });
  }

  function isOpenAIChatCompletionsEndpoint(apiUrl) {
    try {
      return /\/v1\/chat\/completions\/?$/.test(new URL(apiUrl, location.href).pathname);
    } catch {
      return false;
    }
  }

  function uniqueModels(models) {
    return models.map((model) => String(model || '').trim()).filter((model, index, all) => model && all.indexOf(model) === index);
  }

  function selectLmStudioModel(input = {}) {
    const outputCount = normalizeOutputCount(input.outputCount || 1);
    const hasContinuityWork = Boolean(input.scenePlan || input.consistencyNotes || input.inImageText);
    const isComplex = input.quality === 'high'
      || outputCount > 1
      || COMPLEX_PURPOSES.has(input.purpose)
      || hasContinuityWork;
    return isComplex ? FALLBACK_LM_STUDIO_MODEL : DEFAULT_LM_STUDIO_MODEL;
  }

  function modelSelectionReason(input = {}) {
    if (input.quality === 'high') return 'high_quality';
    if (normalizeOutputCount(input.outputCount || 1) > 1) return 'multi_output';
    if (COMPLEX_PURPOSES.has(input.purpose)) return 'complex_purpose';
    if (input.scenePlan) return 'scene_plan';
    if (input.consistencyNotes) return 'consistency_notes';
    if (input.inImageText) return 'in_image_text';
    return 'default';
  }

  function normalizeSettings(settings = {}) {
    const next = {
      ...settings,
      apiUrl: settings.apiUrl || DEFAULT_API_URL,
      apiKey: settings.apiKey || DEFAULT_API_KEY,
      model: settings.model || DEFAULT_LM_STUDIO_MODEL,
      fallbackModel: settings.fallbackModel || FALLBACK_LM_STUDIO_MODEL,
      useExternalApi: Boolean(settings.useExternalApi),
    };
    if (isDirectLmStudioApiUrl(next.apiUrl)) next.apiUrl = DEFAULT_API_URL;
    return next;
  }

  function isDirectLmStudioApiUrl(apiUrl) {
    try {
      const { hostname } = new URL(apiUrl, location.href);
      return hostname === 'lm.alluser.site' || hostname === 'localhost' || hostname === '127.0.0.1';
    } catch {
      return false;
    }
  }

  function humanError(error) {
    const message = String(error?.message || error || '알 수 없는 오류').replace(/^Prompt API request failed:\s*/, '');
    if (/timed out/i.test(message)) {
      return '서버 응답이 오래 걸리고 있습니다. 잠시 후 다시 시도하거나 출력 개수나 품질을 낮춘 뒤 다시 시도해 주세요.';
    }
    return message;
  }

  function normalizeResponse(payload, input) {
    if (Array.isArray(payload?.choices)) return normalizeOpenAIResponse(payload, input);
    if (!payload || payload.ok !== true || typeof payload.prompt !== 'string' || !payload.prompt.trim()) throw new Error('MALFORMED_RESPONSE');
    return {
      ok: true,
      action: payload.action || input.action,
      targetSite: payload.targetSite || input.targetSite,
      prompt: enforcePromptContract(payload.prompt.trim(), input),
      promptKo: firstNonEmptyText(
        payload.promptKo,
        payload.koreanPrompt,
        payload.displayPromptKo,
        payload.summary?.promptKo,
        payload.summary?.koreanPrompt,
        payload.metadata?.promptKo,
      ),
      summary: {
        purpose: purposeLabel(input.purpose),
        formatPreset: formatPresetLabel(input.formatPreset),
        outputCount: `${input.outputCount}`,
        style: input.style,
        ratio: input.ratio,
        quality: input.quality,
        feedback: input.feedback,
        ...(payload.summary || {}),
        purposeGuidanceKo: purposeGuidanceKo(input),
        targetSite: payload.targetSite || input.targetSite,
      },
      suggestions: Array.isArray(payload.suggestions) ? payload.suggestions : [],
      version: {
        id: payload.version?.id || id('v'),
        parentId: payload.version?.parentId ?? input.parentVersionId ?? null,
        createdAt: payload.version?.createdAt || new Date().toISOString(),
      },
      metadata: {
        guideSet: Array.isArray(payload.metadata?.guideSet) ? payload.metadata.guideSet : [],
        containsProtectedKoreanText: Boolean(payload.metadata?.containsProtectedKoreanText),
        source: payload.metadata?.source || 'mac_mini',
        model: payload.metadata?.model,
      },
    };
  }

  function normalizeOpenAIResponse(payload, input) {
    const content = payload.choices?.[0]?.message?.content || payload.choices?.[0]?.text || '';
    const parsed = parseJsonFromText(content);
    if (parsed?.prompt) {
      return normalizeResponse(
        {
          ok: true,
          action: input.action,
          targetSite: input.targetSite,
          prompt: parsed.prompt,
          promptKo: parsed.promptKo || parsed.koreanPrompt || parsed.displayPromptKo,
          summary: { ...(parsed.summary || {}), formatPreset: formatPresetLabel(input.formatPreset), outputCount: `${input.outputCount}` },
          suggestions: parsed.suggestions || [],
          metadata: { ...(parsed.metadata || {}), source: 'lm_studio', model: payload.model },
        },
        input,
      );
    }
    if (!content.trim()) throw new Error('MALFORMED_RESPONSE');
    return normalizeResponse(
      {
        ok: true,
        action: input.action,
        targetSite: input.targetSite,
        prompt: content.trim(),
        summary: {
          purpose: purposeLabel(input.purpose),
          style: input.style,
          ratio: input.ratio,
          quality: input.quality,
          formatPreset: formatPresetLabel(input.formatPreset),
          outputCount: `${input.outputCount}`,
          feedback: input.feedback,
        },
        suggestions: ['외부 API의 응답을 프롬프트 본문으로 사용했습니다.'],
        metadata: { guideSet: ['lm-studio-openai-compatible'], source: 'lm_studio', model: payload.model },
      },
      input,
    );
  }

  function structuredBody(input, model) {
    return {
      action: input.action,
      requestId: input.requestId,
      targetSite: input.targetSite,
      sourceText: input.sourceText,
      displayLanguage: 'ko-KR',
      model,
      fallbackModel: FALLBACK_LM_STUDIO_MODEL,
      modelRouting: {
        defaultModel: DEFAULT_LM_STUDIO_MODEL,
        complexModel: FALLBACK_LM_STUDIO_MODEL,
        selectedModel: model,
        reason: modelSelectionReason(input),
      },
      options: input,
      previousPrompt: input.previousPrompt,
      feedback: input.feedback,
      parentVersionId: input.parentVersionId,
      client: {
        appVersion: '0.1.1',
        locale: 'ko-KR',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Seoul',
      },
    };
  }

  function openAIBody(input, model) {
    const system = [
      'You are an expert image-generation prompt writer.',
      'Return JSON only. Do not wrap it in markdown.',
      'JSON shape: {"prompt":"...","promptKo":"...","summary":{},"suggestions":[],"metadata":{}}.',
      'The prompt field must be written primarily in English.',
      'The promptKo field must explain or translate the generated prompt in natural Korean for display only.',
      'Any Korean text meant to appear inside the image must be preserved exactly and must not be translated.',
      'For storybook, comic/webtoon, or multi-image requests, return the prompt field as a numbered prompt pack with one independently usable image prompt per page, panel, or image.',
      'Keep repeated characters, locations, style, color palette, and key props consistent across the prompt pack when consistency notes are provided.',
      'Additional user notes may refine or override purpose-specific layout rules when the user explicitly asks for a different direction.',
    ].join(' ');
    const user = [
      `Action: ${input.action}`,
      `Target site: ${input.targetSite}`,
      `Purpose: ${purposeLabel(input.purpose)}`,
      `Output count: ${input.outputCount}`,
      `Format preset: ${formatPresetLabel(input.formatPreset)}`,
      `Idea: ${input.sourceText}`,
      `Style: ${input.style}`,
      `Ratio: ${input.ratio}`,
      `Quality: ${input.quality}`,
      input.audience ? `Audience: ${input.audience}` : '',
      input.inImageText ? `Text inside image, preserve exactly: ${input.inImageText}` : '',
      input.referenceMode === 'attached_by_user' ? 'Reference: user will attach a file/image directly in the target chat.' : '',
      purposeGuidance(input),
      workflowGuidance(input),
      input.scenePlan ? `Panel/scene plan:\n${input.scenePlan}` : '',
      input.consistencyNotes ? `Consistency notes: ${input.consistencyNotes}` : '',
      input.advancedNotes ? `Additional notes: ${input.advancedNotes}` : '',
      input.previousPrompt ? `Previous prompt: ${input.previousPrompt}` : '',
      input.feedback ? `Feedback: ${input.feedback}` : '',
    ]
      .filter(Boolean)
      .join('\n');
    return {
      model: model || DEFAULT_LM_STUDIO_MODEL,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      temperature: 0.4,
      stream: false,
    };
  }

  function parseJsonFromText(text) {
    const raw = String(text || '').trim();
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      const match = raw.match(/\{[\s\S]*\}/);
      if (!match) return null;
      try {
        return JSON.parse(match[0]);
      } catch {
        return null;
      }
    }
  }

  function fallbackResponse(input) {
    const prompt = fallbackPrompt(input);
    return {
      ok: true,
      action: input.action,
      targetSite: input.targetSite,
      prompt,
      summary: {
        purpose: purposeLabel(input.purpose),
        formatPreset: formatPresetLabel(input.formatPreset),
        outputCount: `${input.outputCount}`,
        style: input.style,
        ratio: input.ratio,
        quality: input.quality,
        targetSite: input.targetSite,
        purposeGuidanceKo: purposeGuidanceKo(input),
      },
      suggestions: ['이미지 안 문구는 짧고 명확하게 유지하면 글자 오류가 줄어듭니다.', '원하는 색감, 구도, 대상 연령을 추가 조건에 적으면 결과가 더 안정적입니다.'],
      version: { id: id('v'), parentId: input.parentVersionId ?? null, createdAt: new Date().toISOString() },
      metadata: { guideSet: ['browser-template'], containsProtectedKoreanText: koreanText(`${input.sourceText} ${input.inImageText}`).length > 0, source: 'browser_template' },
    };
  }

  function fallbackPrompt(input) {
    const protectedText = [...new Set([input.inImageText, ...koreanText(input.sourceText)].filter(Boolean))];
    const lines = [
      `Create an image prompt for ${input.targetSite === 'gemini' ? 'Gemini' : 'ChatGPT'}.`,
      `Main idea: ${input.sourceText || 'A clear, useful image based on the user idea.'}`,
      `Purpose: ${purposeLabel(input.purpose)}.`,
      `Output format preset: ${formatPresetLabel(input.formatPreset)} (${formatPresetEnglish(input.formatPreset)}).`,
      `Visual style: ${input.style}.`,
      `Aspect ratio: ${input.ratio}.`,
      `Quality direction: ${input.quality}.`,
      'Write in clear English with concrete visual details, composition, lighting, colors, and framing.',
    ];
    const workflow = workflowGuidance(input);
    const purposeRules = purposeGuidance(input);
    if (purposeRules) lines.push(purposeRules);
    if (workflow) {
      lines.push(workflow);
      if (input.scenePlan) lines.push(`Panel/scene plan from the user:\n${input.scenePlan}`);
      if (input.consistencyNotes) lines.push(`Consistency requirements across images: ${input.consistencyNotes}`);
    }
    if (input.purpose === 'education' || input.purpose === 'worksheet_illustration' || input.purpose === 'guide_notice') {
      lines.push('Make it age-appropriate, classroom-safe, non-violent, non-sexual, not scary, and not overly stimulating.');
    }
    if (protectedText.length) {
      lines.push(`Preserve this exact Korean text inside the image: "${protectedText.join(' / ')}". Do not translate, romanize, or paraphrase this text.`);
    }
    if (input.referenceMode === 'attached_by_user') lines.push('Refer to the attached image/file if the user has uploaded one in the current chat.');
    if (input.advancedNotes) lines.push(`Additional user notes: ${input.advancedNotes}`);
    return lines.join('\n');
  }

  function adapterFor(site) {
    if (site !== 'chatgpt' && site !== 'gemini') return null;
    const selectors =
      site === 'gemini'
        ? ['rich-textarea [contenteditable="true"]', 'div.ql-editor', 'form [contenteditable="true"]', '[role="textbox"]', 'textarea', '[contenteditable="true"]']
        : ['#prompt-textarea', 'form textarea', 'form [contenteditable="true"]', 'div.ProseMirror', '[role="textbox"]', 'textarea', '[contenteditable="true"]'];
    return {
      get() {
        return textOf(findComposer(selectors));
      },
      async set(prompt, mode) {
        const composer = findComposer(selectors);
        const existing = textOf(composer);
        const next = mode === 'append' && existing.trim() ? `${existing}\n\n${prompt}` : prompt;
        await setText(composer, next);
        return await waitForComposerText(selectors, prompt);
      },
    };
  }

  function findComposer(selectors) {
    return selectors
      .flatMap((selector) => [...document.querySelectorAll(selector)])
      .filter((element, index, all) => all.indexOf(element) === index)
      .filter((element) => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return rect.width > 30 && rect.height > 16 && style.display !== 'none' && style.visibility !== 'hidden';
      })
      .sort((a, b) => b.getBoundingClientRect().top - a.getBoundingClientRect().top)[0];
  }

  function textOf(element) {
    if (!element) return '';
    return 'value' in element ? element.value || '' : element.textContent || element.innerText || '';
  }

  async function setText(element, text) {
    if (!element) throw new Error('COMPOSER_NOT_FOUND');
    element.focus();
    if ('value' in element) {
      const setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(element), 'value')?.set;
      setter?.call(element, text);
      element.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: text }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
      return;
    }
    setEditableText(element, text);
  }

  function setEditableText(element, text) {
    element.focus();
    const selection = document.getSelection();
    const range = document.createRange();
    range.selectNodeContents(element);
    selection?.removeAllRanges();
    selection?.addRange(range);
    element.dispatchEvent(new InputEvent('beforeinput', { bubbles: true, cancelable: true, inputType: 'insertText', data: text }));
    document.execCommand('selectAll', false, null);
    document.execCommand('insertText', false, text);
    element.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: text }));
    if (!normalizeInsertedText(textOf(element)).includes(normalizeInsertedText(text).slice(0, 32))) {
      element.textContent = text;
      element.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: text }));
    }
  }

  async function waitForComposerText(selectors, prompt) {
    const needle = normalizeInsertedText(prompt).slice(0, Math.min(48, normalizeInsertedText(prompt).length));
    for (let attempt = 0; attempt < 10; attempt += 1) {
      const text = normalizeInsertedText(textOf(findComposer(selectors)));
      if (needle && text.includes(needle)) return true;
      await new Promise((resolve) => setTimeout(resolve, 80));
    }
    return false;
  }

  function normalizeInsertedText(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
  }

  async function saveCard(card) {
    const cards = await read('workCards', []);
    const next = [card, ...cards.filter((item) => item.id !== card.id)];
    await write('workCards', limitCards(next));
  }

  function createCard(input, result) {
    const createdAt = new Date().toISOString();
    const version = { id: result.version.id, parentId: null, prompt: result.prompt, promptKo: result.promptKo || '', summary: result.summary, suggestions: result.suggestions, metadata: result.metadata, pinned: false, createdAt };
    return {
      id: id('card'),
      title: (input.sourceText || purposeLabel(input.purpose) || '이미지 프롬프트').slice(0, 34),
      userTitle: '',
      sourceText: input.sourceText,
      options: input,
      targetSite: input.targetSite,
      currentVersionId: version.id,
      versions: [version],
      improvementHistory: [],
      favorite: false,
      archived: false,
      tags: [],
      createdAt,
      updatedAt: createdAt,
      lastUsedAt: createdAt,
    };
  }

  function appendVersion(card, result, feedback) {
    const createdAt = new Date().toISOString();
    const version = { id: result.version.id, parentId: card.currentVersionId, prompt: result.prompt, promptKo: result.promptKo || '', summary: result.summary, suggestions: result.suggestions, metadata: result.metadata, pinned: false, createdAt };
    return {
      ...card,
      currentVersionId: version.id,
      versions: [...card.versions, version],
      improvementHistory: [...card.improvementHistory, { id: id('improve'), fromVersionId: card.currentVersionId, toVersionId: version.id, feedback, action: result.action, createdAt }],
      updatedAt: createdAt,
      lastUsedAt: createdAt,
    };
  }

  function currentVersion(card) {
    if (!card?.versions?.length) return null;
    return card.versions.find((version) => version.id === card.currentVersionId) || card.versions.at(-1);
  }

  function limitCards(cards) {
    const pinned = cards.filter((card) => card.favorite || card.archived);
    const recent = cards.filter((card) => !card.favorite && !card.archived).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    return [...pinned, ...recent.slice(0, Math.max(0, 100 - pinned.length))];
  }

  function read(key, fallback) {
    return new Promise((resolve) => chrome.storage.local.get(key, (result) => resolve(result[key] ?? fallback)));
  }

  function write(key, value) {
    return new Promise((resolve) => chrome.storage.local.set({ [key]: value }, resolve));
  }

  function detectSite() {
    const host = location.hostname;
    if (host === 'chatgpt.com' || host === 'chat.openai.com') return 'chatgpt';
    if (host === 'gemini.google.com') return 'gemini';
    return 'unsupported';
  }

  function template() {
    return `
      <link rel="stylesheet" href="${chrome.runtime.getURL('styles/panel.css')}">
      <button class="floating" data-floating data-action="toggle"><span>프롬프트</span><span>만들기</span></button>
      <aside class="panel" data-panel>
        <header class="topbar">
          <div><strong>이미지 프롬프트 <span class="brand-signature">by HooniKim</span></strong><small data-site></small></div>
          <div class="top-actions"><button data-action="settings">설정</button><button data-action="toggle">접기</button></div>
        </header>
        <div class="body" data-body>
          <section class="onboarding" data-onboarding><b>처음 사용 안내</b><ol><li>용도를 고릅니다.</li><li>프롬프트를 만듭니다.</li><li>입력창에 넣고 직접 확인 후 전송합니다.</li></ol><button class="onboarding-confirm" data-action="onboarding">사용방법 확인</button></section>
          <section class="unsupported" data-unsupported><b>ChatGPT 또는 Gemini에서 열어주세요.</b><p>현재 입력창에 프롬프트를 넣어주는 도구입니다.</p><div class="row"><button data-action="open-url" data-url="https://chatgpt.com/">ChatGPT 열기</button><button data-action="open-url" data-url="https://gemini.google.com/">Gemini 열기</button></div></section>
          <main data-workflow>
            <section><label>작업 유형</label><div class="purpose-grid" data-purposes></div><button class="subtle" data-action="more">더보기</button></section>
            <section class="field"><label>원본 아이디어</label><textarea data-field="idea" rows="4" placeholder="예: 초등학생이 이해하기 쉬운 물의 순환 그림"></textarea><button class="subtle" data-action="current">현재 입력창에서 가져오기</button></section>
            <section class="grid-two">
              <label class="style-field">스타일<input data-field="style" data-style-source="preset" type="hidden"><button type="button" class="style-trigger" data-action="style-toggle"><span data-style-label></span><span class="style-trigger-arrow" aria-hidden="true"></span></button><div class="style-picker" data-style-picker hidden></div></label>
              <label>비율<select data-field="ratio">${RATIOS.map((ratio) => `<option value="${ratio}">${ratio}</option>`).join('')}</select></label>
              <label>품질<select data-field="quality"><option value="fast">빠르게</option><option value="balanced">균형</option><option value="high">고품질</option></select></label>
              <label>대상<select data-field="targetSite"><option value="chatgpt">ChatGPT용</option><option value="gemini">Gemini용</option></select></label>
            </section>
            <section class="workflow-options">
              <label>생성 장수<select data-field="outputCount">${OUTPUT_COUNTS.map((count) => `<option value="${count}">${count}장</option>`).join('')}</select></label>
              <label>장면/컷 구성<textarea data-field="scenePlan" rows="3" placeholder="예: 1장: 주인공 소개&#10;2장: 문제 상황&#10;3장: 해결 과정"></textarea></label>
              <label>일관성 유지 조건<textarea data-field="consistencyNotes" rows="2" placeholder="예: 같은 캐릭터, 같은 색감, 같은 배경 톤 유지"></textarea></label>
            </section>
            <details><summary>고급 옵션</summary><label>이미지에 표시할 정확한 문구<input data-field="inImageText" placeholder="예: 제목, 말풍선, 표지 문구처럼 이미지 안에 실제로 보일 텍스트"></label><label>교육 대상<select data-field="audience"><option value="">자동 추론</option><option>유아</option><option>초등</option><option>중등</option><option>고등</option><option>성인</option></select></label><label>참고 자료<select data-field="referenceMode"><option value="none">없음</option><option value="attached_by_user">사용자가 채팅창에 첨부파일로 업로드함</option></select></label><label>추가 조건<textarea data-field="advancedNotes" rows="2" placeholder="예: 배경은 밝은 교실, 텍스트는 최소화, 손가락은 정확하게, 로고/워터마크 제외"></textarea></label></details>
            <button class="primary" data-action="generate" data-generate-button>프롬프트 만들기</button><div class="busy" data-busy hidden>생성 중...</div>
            <section class="result" data-result hidden><div class="prompt" data-prompt></div><div class="summary" data-summary></div><ul data-suggestions></ul><div class="row"><button class="primary" data-action="insert">자동 입력</button><button class="copy-button" data-action="copy">복사</button></div><div class="quick-actions"><button data-action="select-feedback" data-feedback="더 선명하게">더 선명하게</button><button data-action="select-feedback" data-feedback="더 한국적으로">더 한국적으로</button><button data-action="select-feedback" data-feedback="텍스트 오류 줄이기">텍스트 오류 줄이기</button><button data-action="select-feedback" data-feedback="더 사실적으로">더 사실적으로</button><button data-action="select-feedback" data-feedback="더 단순하게">더 단순하게</button><button data-action="select-feedback" data-feedback="텍스트 줄이기">텍스트 줄이기</button><button data-action="select-feedback" data-feedback="색감 바꾸기">색감 바꾸기</button><button data-action="select-feedback" data-feedback="교육용으로 더 안전하게">교육용 안전</button></div><div class="feedback-form" data-feedback-form><textarea data-field="feedback" rows="2" placeholder="수정 방향을 선택하거나 직접 입력한 뒤 다시 생성하기를 누르세요"></textarea><button data-action="improve-custom">다시 생성하기</button></div></section>
            <section><label>최근 작업</label><ul class="history" data-history></ul></section>
          </main>
          <section class="settings-panel" data-settings-panel hidden><p>기본 기능은 외부 설정 없이 브라우저 안에서 바로 동작합니다. 고급 사용자는 직접 관리하는 Prompt API를 연결할 수 있습니다.</p><label><input data-field="useExternalApi" type="checkbox"> 사용자 지정 Prompt API 사용</label><label>API 주소<input data-field="apiUrl" autocomplete="off" spellcheck="false"></label><label>API 키<input data-field="apiKey" type="text" autocomplete="off" spellcheck="false" data-lpignore="true"></label><label>모델명<input data-field="model" autocomplete="off" spellcheck="false"></label><button data-action="save-settings">저장</button></section>
          <div class="toast" data-toast></div>
        </div>
        <div class="dialog" data-insert-dialog hidden><div><b>입력창에 내용이 있습니다.</b><button data-insert-mode="overwrite">덮어쓰기</button><button data-insert-mode="append">이어붙이기</button><button data-insert-mode="cancel">취소</button></div></div>
      </aside>
    `;
  }

  function q(root, selector) {
    return root.querySelector(selector);
  }

  function setDefault(root, field, value) {
    const element = q(root, `[data-field="${field}"]`);
    if (element && !element.value) element.value = value;
  }

  function setChecked(root, field, value) {
    const element = q(root, `[data-field="${field}"]`);
    if (element) element.checked = Boolean(value);
  }

  function id(prefix) {
    return `${prefix}_${crypto.randomUUID ? crypto.randomUUID() : `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`}`;
  }

  function purposeLabel(idValue) {
    return PURPOSES.find(([value]) => value === idValue)?.[1] || idValue || '단순 이미지';
  }

  function formatPresetLabel(idValue) {
    return {
      auto: '자동',
      youtube_thumbnail: '유튜브 썸네일',
      instagram_feed: '인스타그램 피드',
      instagram_story: '인스타그램 스토리',
      cardnews: '카드뉴스',
      a4: 'A4 문서',
      blog_cover: '블로그 대표 이미지',
      class_slide: '수업자료 슬라이드',
      storybook: '스토리북',
      comic_webtoon: '만화/웹툰',
      image_series: '여러 장 시리즈',
    }[idValue] || idValue || '자동';
  }

  function formatPresetEnglish(idValue) {
    return {
      auto: 'auto',
      youtube_thumbnail: 'YouTube thumbnail',
      instagram_feed: 'Instagram feed',
      instagram_story: 'Instagram story',
      cardnews: 'card news',
      a4: 'A4 document',
      blog_cover: 'blog cover',
      class_slide: 'class slide',
      storybook: 'storybook',
      comic_webtoon: 'comic or webtoon',
      image_series: 'image series',
    }[idValue] || 'custom';
  }

  function purposeGuidance(input = {}) {
    const rules = {
      cardnews_infographic: 'Purpose-specific rules: build a card news or infographic layout with a clear headline, one core message, 3-5 concise information blocks, simple icons or diagrams, short text, and clear visual hierarchy.',
      youtube_thumbnail: 'Purpose-specific rules: build a YouTube thumbnail with a strong focal subject, high contrast, a large readable title area, mobile-first legibility, emotional clarity, and no crowded small text.',
      class_slide: 'Purpose-specific rules: build a classroom slide with a clear learning objective, one large classroom-readable diagram, simple labels, arrows or examples, strong projection legibility, and minimal decorative clutter.',
      worksheet_illustration: 'Purpose-specific rules: build a worksheet or textbook illustration with clear linework, print-friendly shapes, age-appropriate simplicity, labeled parts when helpful, and enough empty space for instructions.',
      instagram_feed: 'Purpose-specific rules: build a square or feed-ready social post with a strong central message, balanced margins, brand-like consistency, readable short text, and a polished editorial composition.',
      instagram_story: 'Purpose-specific rules: build a vertical story layout with a strong top-to-bottom flow, safe text zones, large readable elements, a clear callout area, and mobile-screen legibility.',
      a4_document: 'Purpose-specific rules: build a print-friendly vertical layout with generous margins, clear title and section blocks, simple table or checklist areas when useful, restrained background, and high readability on paper.',
      blog_cover: 'Purpose-specific rules: build a blog cover image with a clear symbolic subject, title-safe negative space, clean thumbnail readability, restrained text, and a composition that still works when cropped.',
      guide_notice: 'Purpose-specific rules: build a student or parent notice image with a calm trustworthy tone, the most important notice first, clear information grouping, friendly school-safe visuals, and no exaggerated advertising feel.',
      sns_blog: 'Purpose-specific rules: build a social or blog image with a clear hook, readable headline zone, supporting visual metaphor, simple hierarchy, and platform-friendly cropping.',
      character_background_prop: 'Purpose-specific rules: build reusable design specs for the requested character, background, or prop, including silhouette, colors, materials, key details, front-facing clarity, and consistency notes.',
      education: 'Purpose-specific rules: build an educational explanation image with one core concept, visual analogy or diagram, learner-friendly labels, step-by-step structure when helpful, and classroom-safe tone.',
    };
    return rules[input.purpose] || '';
  }

  function purposeGuidanceKo(input = {}) {
    const rules = {
      cardnews_infographic: '카드뉴스는 제목, 핵심 메시지, 3-5개 정보 블록, 아이콘/도식, 짧은 텍스트, 명확한 정보 위계를 우선합니다.',
      youtube_thumbnail: '유튜브 썸네일은 강한 중심 피사체, 고대비, 크게 읽히는 제목 영역, 모바일 가독성, 과밀하지 않은 구성을 우선합니다.',
      class_slide: '수업자료 슬라이드는 학습 목표, 교실에서 크게 보이는 개념도, 간단한 라벨과 화살표, 투사 가독성, 장식 최소화를 우선합니다.',
      worksheet_illustration: '교재/활동지 삽화는 선명한 선, 출력 친화적 형태, 학습자 수준에 맞는 단순함, 필요한 라벨, 충분한 여백을 우선합니다.',
      instagram_feed: '인스타그램 피드는 중심 메시지, 균형 잡힌 여백, 일관된 브랜드 느낌, 짧고 읽기 쉬운 문구, 편집 이미지 같은 완성도를 우선합니다.',
      instagram_story: '인스타그램 스토리는 세로 화면 흐름, 안전한 텍스트 영역, 큰 요소, 명확한 강조 영역, 모바일 가독성을 우선합니다.',
      a4_document: 'A4 문서는 인쇄용 세로 레이아웃, 충분한 여백, 제목/섹션 박스, 표나 체크리스트 영역, 종이 출력 가독성을 우선합니다.',
      blog_cover: '블로그 대표 이미지는 주제를 상징하는 중심 이미지, 제목을 넣을 수 있는 여백, 썸네일 가독성, 절제된 텍스트, 크롭 대응 구성을 우선합니다.',
      guide_notice: '학생/학부모 안내는 차분하고 신뢰감 있는 톤, 핵심 안내 우선 배치, 명확한 정보 묶음, 학교 상황에 맞는 안전한 시각 요소를 우선합니다.',
      sns_blog: 'SNS/블로그 이미지는 명확한 훅, 읽기 쉬운 제목 영역, 보조 시각 비유, 단순한 위계, 플랫폼 크롭 대응을 우선합니다.',
      character_background_prop: '캐릭터/배경/소품은 실루엣, 색상, 재질, 핵심 디테일, 정면에서 알아보기 쉬운 형태, 재사용 일관성을 우선합니다.',
      education: '교육용 이미지는 하나의 핵심 개념, 시각적 비유나 도식, 학습자 친화적 라벨, 단계적 구조, 교실 안전 톤을 우선합니다.',
      storybook: '스토리북은 페이지별 장면, 같은 주인공, 일관된 분위기, 짧은 대사나 캡션을 우선합니다.',
      comic_webtoon: '만화/웹툰은 컷별 구도, 읽는 순서, 캐릭터 표정과 동작, 짧은 말풍선 대사를 우선합니다.',
      image_series: '여러 장 시리즈는 각 이미지가 독립적으로 쓰이면서도 공통 주제, 색감, 인물, 소품, 배경 일관성을 유지하는 것을 우선합니다.',
    };
    return rules[input.purpose] || '';
  }

  function purposeFormatPreset(purpose) {
    return {
      cardnews_infographic: 'cardnews',
      youtube_thumbnail: 'youtube_thumbnail',
      class_slide: 'class_slide',
      storybook: 'storybook',
      comic_webtoon: 'comic_webtoon',
      image_series: 'image_series',
      instagram_feed: 'instagram_feed',
      instagram_story: 'instagram_story',
      a4_document: 'a4',
      blog_cover: 'blog_cover',
    }[purpose] || 'auto';
  }

  function normalizeOutputCount(value) {
    const count = Number.parseInt(value, 10);
    if (!Number.isFinite(count) || count < 1) return 1;
    return Math.min(count, 12);
  }

  function enforcePromptContract(prompt, input = {}) {
    const additions = [];
    const outputCount = normalizeOutputCount(input.outputCount || 1);
    if (outputCount > 1 && !new RegExp(`exactly\\s+${outputCount}\\b`, 'i').test(prompt)) {
      additions.push(`Return a numbered prompt pack with exactly ${outputCount} image prompts.`);
    }
    if (input.ratio && input.ratio !== '1:1' && !prompt.includes(input.ratio)) {
      additions.push(`Aspect ratio: ${input.ratio}.`);
    }
    if (input.inImageText && !prompt.includes(input.inImageText)) {
      additions.push(`Preserve this exact text inside the image: "${input.inImageText}".`);
    }
    return additions.length > 0 ? `${prompt}\n${additions.join('\n')}` : prompt;
  }

  function workflowGuidance(input) {
    const count = input.outputCount || 1;
    const autoSplit = !input.scenePlan && count > 1
      ? ` No panel/scene plan was provided, so split the source idea into exactly ${count} natural pages, panels, or scenes yourself.`
      : '';
    const dialogue = dialogueGuidance(input);
    if (input.purpose === 'storybook') {
      return `Return a numbered prompt pack with exactly ${count} image prompts for a storybook sequence. Each numbered prompt should describe one page/spread, preserve the same main character design, and keep the visual style consistent.${dialogue}${autoSplit}`;
    }
    if (input.purpose === 'comic_webtoon') {
      return `Return a numbered prompt pack with exactly ${count} image prompts for comic/webtoon panels. Each numbered prompt should describe one panel, include panel composition guidance, and preserve character continuity.${dialogue}${autoSplit}`;
    }
    if (input.purpose === 'image_series' || count > 1) {
      return `Return a numbered prompt pack with exactly ${count} image prompts. Each prompt must be usable independently while preserving the shared subject, style, palette, and continuity.${autoSplit}`;
    }
    return '';
  }

  function dialogueGuidance(input = {}) {
    const text = `${input.advancedNotes || ''} ${input.inImageText || ''} ${input.feedback || ''}`.toLowerCase();
    if (/대사\s*없|말풍선\s*없|텍스트\s*최소|글자\s*최소|minimal text|no dialogue|no speech|no text|without dialogue/.test(text)) {
      return '';
    }
    if (input.purpose === 'storybook') {
      return ' Include 1-2 short, natural dialogue lines or captions per page when helpful; keep any visible text brief, age-appropriate, and easy to render.';
    }
    if (input.purpose === 'comic_webtoon') {
      return ' Include short speech-bubble dialogue by default, usually 1-2 concise bubbles per panel, unless the user explicitly asks for no dialogue or minimal text.';
    }
    return '';
  }

  function koreanText(text) {
    return [...new Set((String(text).match(/[가-힣][가-힣0-9\s.,!?'"“”‘’():-]{1,}/g) || []).map((item) => item.trim()).filter(Boolean))];
  }

  function siteLabel(site) {
    return { chatgpt: 'ChatGPT', gemini: 'Gemini', unsupported: '지원 사이트 아님' }[site] || site;
  }

  function esc(value) {
    return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
  }

  function firstNonEmptyText(...values) {
    for (const value of values) {
      if (value == null || typeof value === 'object') continue;
      const text = String(value).trim();
      if (text) return text;
    }
    return '';
  }

  function renderPromptTranslation(result = {}) {
    const summary = result.summary || {};
    const provided = firstNonEmptyText(
      result.promptKo,
      result.koreanPrompt,
      result.displayPromptKo,
      summary.promptKo,
      summary.koreanPrompt,
      summary.displayPromptKo,
        result.metadata?.promptKo,
      );
      if (provided) return appendPurposeGuidanceKo(provided, summary);

      const description = firstNonEmptyText(summary.description);
      if (description && /[\uAC00-\uD7A3]/.test(description)) return appendPurposeGuidanceKo(description, summary);

      return appendPurposeGuidanceKo(buildKoreanPromptPreview(description || result.prompt || '', summary), summary);
    }

    function buildKoreanPromptPreview(prompt, summary = {}) {
    const text = `${prompt || ''} ${summary.style || ''} ${summary.purpose || ''}`.toLowerCase();
    const lines = [koreanSubjectHint(text)];
    if (summary.feedback) {
      lines.push(`수정 요청을 반영했습니다: ${summary.feedback}`);
    }
    const style = koreanStyleHint(text);
    if (style) lines.push(`전체 분위기와 스타일은 ${style}로 구성합니다.`);
    if (summary.ratio || summary.quality) {
      lines.push(`${summary.ratio ? `${summary.ratio} 비율` : '지정한 비율'}과 ${summary.quality ? `${summary.quality} 품질` : '선택한 품질'} 조건을 반영합니다.`);
    }
    lines.push('실제 자동 입력에는 위 영어 프롬프트를 사용하고, 이 설명은 내용을 이해하기 위한 한글 안내입니다.');
      return lines.filter(Boolean).join('\n');
    }

    function appendPurposeGuidanceKo(text, summary = {}) {
      const rule = firstNonEmptyText(summary.purposeGuidanceKo);
      if (!rule || text.includes(rule)) return text;
      return `${text}\n적용된 작업 유형 규칙: ${rule}`;
    }

  function koreanSubjectHint(text) {
    if (text.includes('webtoon') || text.includes('comic')) {
      if (text.includes('prompt engineering')) return '프롬프트 엔지니어링을 강력한 기술처럼 보여 주는 역동적인 웹툰 장면입니다.';
      return '컷 구성, 인물 동작, 말풍선 흐름이 드러나는 만화 또는 웹툰 장면입니다.';
    }
    if (text.includes('storybook')) return '같은 주인공과 분위기를 유지하는 스토리북용 장면 프롬프트입니다.';
    if (text.includes('infographic') || text.includes('card news')) return '정보를 한눈에 이해할 수 있도록 구성한 카드뉴스 또는 인포그래픽 프롬프트입니다.';
    if (text.includes('education') || text.includes('student') || text.includes('classroom')) return '학습자가 이해하기 쉽도록 장면, 예시, 시각적 비유를 정리한 교육용 이미지 프롬프트입니다.';
    return '요청한 주제를 이미지 생성에 바로 쓸 수 있도록 장면, 분위기, 구도, 제약 조건까지 정리한 프롬프트입니다.';
  }

  function koreanStyleHint(text) {
    if (text.includes('vintage') && text.includes('comic')) return '빈티지 액션 코믹스 스타일';
    if (text.includes('manga')) return '일본 만화책 스타일';
    if (text.includes('webtoon')) return '웹툰 스타일';
    if (text.includes('retro')) return '레트로 그래픽 스타일';
    if (text.includes('realistic')) return '사실적인 편집 사진 스타일';
    if (text.includes('infographic')) return '깔끔한 정보 시각화 스타일';
    return '';
  }

  function localizedSuggestions(suggestions = []) {
    return (suggestions || []).map(localizeSuggestion).filter(Boolean);
  }

  function localizeSuggestion(value) {
    const text = String(value || '').trim();
    if (!text) return '';
    if (/[가-힣]/.test(text)) return text;
    const lower = text.toLowerCase();
    if (lower.includes('specific') || lower.includes('concrete') || lower.includes('application')) {
      return '주제와 연결되는 구체적인 실제 활용 장면을 넣으면 결과가 더 분명해집니다.';
    }
    if (lower.includes('dialogue') || lower.includes('bubble') || lower.includes('character')) {
      return '말풍선과 캐릭터의 상호작용을 넣어 핵심 개념을 자연스럽게 설명하세요.';
    }
    if (lower.includes('visual metaphor') || lower.includes('metaphor')) {
      return '복잡한 개념은 비교하기 쉬운 시각적 비유로 단순화해 보여 주세요.';
    }
    if (lower.includes('text') || lower.includes('typography')) {
      return '이미지 안 문구는 짧고 크게 배치해 글자 오류를 줄이세요.';
    }
    if (lower.includes('color') || lower.includes('palette')) {
      return '색상 역할을 분명히 나누어 중요한 정보가 한눈에 보이게 하세요.';
    }
    if (lower.includes('composition') || lower.includes('layout')) {
      return '구도와 정보 배치를 더 명확히 지정하면 결과가 안정적입니다.';
    }
    return '세부 장면, 구성, 색감, 문구 조건을 더 구체화하면 결과가 좋아집니다.';
  }

  function isSystemFeedbackText(text) {
    return text === '수정사항을 반영하여 다시 프롬프트를 생성중입니다' || text === '수정이 완료되었습니다.';
  }

  function styleSamplePath(index) {
    return `${STYLE_SAMPLE_DIR}/style-${String(index + 1).padStart(2, '0')}.webp`;
  }

  function styleCategoryLabel(index) {
    return STYLE_CATEGORIES.find(([, indexes]) => indexes.includes(index))?.[0] || '기타 스타일';
  }
})();
