/**
 * THIÊN MỆNH CHI THÀNH (2007 - 2026)
 * Senior Frontend Core Application Script (Vanilla JavaScript)
 */

(function () {
  'use strict';

  const SUPABASE_URL = 'https://ruevfxnbpjhqxzaojpbz.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_QNd2mBQcvG4Ay3TXFscC-g_2tucdI69';
  const ADMIN_EMAIL = 'phamnguyenhaithanh4@gmail.com';
  const SITE_NAME = 'Thiên Mệnh Chi Thành';
  const pageName = document.documentElement.dataset.page || document.body.dataset.page || 'home';
  const MUSIC_SESSION_KEY = 'thien-menh-chi-thanh:background-music';
  const GENESIS_PREFACE = '"Nơi lưu giữ toàn bộ quá trình độ kiếp từ một phàm nhân hay ngủ nướng thành Kiến Trúc Sư Gõ Phím tuổi 21. Đạo hữu ghé thăm xin nhẹ tay tặng chút Linh Thạch, chớ dại trêu chọc Thành Chủ kẻo bị tế lên Thiên Kiêu Bảng!"';
  const HERO_INTRO = '"Chào mừng đạo hữu hạ phàm ghé thăm thánh địa của Thành Chủ Hải Thành! Nơi đây phong ấn toàn bộ huyết lệ từ thuở luyện khí còn sợ bug đến khi độ kiếp thành chiến thần gõ phím Lv.21. Đã lỡ chân bước vào thì đừng vội quay xe — hãy dâng chút Linh Thạch lấy hên rồi cùng khám phá thiên cơ!"';
  const INVITE_URL = 'https://kyniem.ht05.id.vn/';
  const INVITE_MESSAGE = `Mời đạo hữu ghé thăm Thiên Mệnh Chi Thành – nơi Thành Chủ Hải Thành lưu giữ hành trình độ kiếp từ phàm nhân sợ bug đến chiến thần gõ phím: ${INVITE_URL}`;
  const GENESIS_IMAGE = 'images/%E1%BA%A3nh%20ch%C3%ADnh/avt.jpg';
  const CULTIVATION_PROFILE_COLUMNS = 'user_id,email,display_name,tu_vi,last_daily_claim,daily_like_xp,last_like_date,ticket_claimed,guestbook_claimed,streak_days,last_checkin_date,updated_at';
  const DEFAULT_FEATURE_TOGGLES = Object.freeze({
    decrees: true,
    oracle: true,
    ticket: true,
    game: true,
    audio: true,
    autoPlayMusic: true,
    attributes: true,
    leaderboard: true,
    hideAdminFromLeaderboard: false,
    comments: true,
    footerUtilities: true
  });
  const THEME_KEYS = ['xianxia', 'obsidian', 'sepia', 'midnight', 'daylight'];
  const DECREE_TYPES = Object.freeze({
    'phap-chi': '📜 Pháp Chỉ Tông Môn',
    'cao-thi': '🔥 Cáo Thị Khẩn',
    'tam-dac': '✨ Tâm Đắc Lão Tổ',
    'tin-mung': '🎉 Tin Mừng Tông Môn'
  });
  const CULTIVATION_MAXIMS = [
    'Code chạy ngay lần đầu không phải thiên tài — là bug đang giả vờ ngủ để mai phục.',
    'Thi cử đừng cầu đề dễ; hãy cầu trí nhớ đừng đăng xuất giữa phòng thi.',
    'Thức khuya tu luyện thì được, nhưng sáng mai đừng hỏi sao mặt mình giống NPC mất kết nối.',
    'Tình duyên như merge code: không đọc kỹ xung đột thì sớm muộn cũng phải ngồi gỡ.',
    'Nhân phẩm có thể quyết định gacha, nhưng không quyết định được bài kiểm tra đã ôn hay chưa.',
    'Độ kiếp qua môn nhờ ôn bài; độ kiếp qua deadline nhờ bắt đầu trước đêm cuối.',
    'Một dòng code thiếu dấu chấm phẩy có thể khiến cả tông môn thức trắng.',
    'Nếu bug biến mất khi mở màn hình chia sẻ, đó không phải phép màu — hãy kiểm tra lại log.',
    'Đừng thức đến canh năm để sửa một lỗi có thể sửa sau khi ngủ đủ giấc.',
    'Tỏ tình cũng như deploy: chọn đúng thời điểm, chuẩn bị rollback nếu bị từ chối.',
    'Lắc xăm không làm bài hộ được đâu; Lão Tổ chỉ ban lời khuyên, không ban đáp án.',
    'Tự tin là tốt, nhưng trước khi nộp bài nhớ nhìn lại xem đã ghi tên chưa.',
    'Commit lúc nửa đêm là một môn độ kiếp; nhớ backup trước khi gọi thiên lôi.',
    'Người có căn cơ mạnh không phải người không gặp bug, mà là người biết đọc thông báo lỗi.',
    'Deadline không biết thương người; hãy thương bản thân bằng cách đừng để sát giờ mới mở file.',
    'Điểm thấp chưa tận thế, nhưng quên lưu bài thì đúng là thiên đạo đang thử lòng.',
    'Đừng so vận đào hoa với người khác — có người đang yêu, có người đang yêu cầu đổi mật khẩu.',
    'Tâm ma lớn nhất của sĩ tử là câu “chắc phần này không ra” ngay trước lúc nó xuất hiện.',
    'Muốn code sạch thì dọn từng dòng; muốn phòng sạch thì đừng gọi đó là gió cuốn.',
    'Tóc rụng vì thức khuya không được tính là tóc hiến tế để tăng Tu Vi.',
    'Nhân phẩm tốt là bốc trúng quẻ hay; đạo tâm tốt là vẫn học dù quẻ bảo đi ngủ.',
    'Nếu bài làm có vẻ quá dễ, hãy kiểm tra xem mình có đang làm nhầm đề của năm ngoái.',
    'Tình yêu cần chân thành, còn tin nhắn lúc 2 giờ sáng cần xem lại vào buổi sáng.',
    'Đừng sửa production bằng trực giác; thiên cơ API nằm trong tài liệu, không nằm trong bói toán.',
    'Tu tiên đường dài, học hành cũng vậy: nghỉ giải lao một chút chứ đừng nghỉ luôn cả học kỳ.',
    'Một bài kiểm thử nhỏ hôm nay cứu đạo hữu khỏi màn hình đỏ và lời giải thích dài ngày mai.',
    'Độ kiếp thất bại thì luyện lại; gửi nhầm tin nhắn thì… cầu mong đối phương chưa đọc.',
    'Đừng để tab hướng dẫn mở nhiều hơn số trang đã ôn — đó là trận pháp gây ảo giác chăm chỉ.'
  ];
  const ORACLE_REPEAT_NOTES = [
    '⚠️ Thiên cơ hôm nay đã tiết lộ hết rồi! Đạo hữu tham lam lắc tiếp coi chừng tẩu hỏa nhập ma, rụng sạch tóc đấy — mai quay lại nhé!',
    '🛑 Ống xăm của Lão Tổ đã bốc khói! Mỗi ngày chỉ được 1 quẻ duy nhất, cố bấm nữa là Lão Tổ trừ ngược 100 Tu Vi bây giờ!',
    '🎋 Xăm đã nghỉ phép! Đạo hữu bấm thêm cũng chỉ nghe tiếng lá tre xào xạc thôi, mai hãy quay lại.',
    '👀 Lão Tổ thấy hết nhé: quẻ hôm nay vẫn nguyên xi, chỉ có ngón tay đạo hữu là đang tập thể lực.',
    '☯ Thiên cơ không phải máy bán nước tự động — một ngày một quẻ, lắc nữa chỉ hao công đức!',
    '💨 Ống xăm đang hồi khí! Bấm thêm lần nữa là phải tự viết bản kiểm điểm gửi Thiên Đạo đó.',
    '📜 Quẻ hôm nay đã đóng dấu niêm phong. Đạo hữu hãy đọc kỹ rồi hẵng đòi spoiler ngày mai.',
    '🧘 Tham thì thâm, lắc nhiều chỉ khiến Lão Tổ chóng mặt chứ không khiến vận may tăng đâu!',
    '🌙 Hết lượt gieo quẻ hôm nay. Đi ngủ sớm đi, biết đâu ngày mai tóc vẫn còn nguyên.',
    '🔒 Thiên cơ đã khóa! Nút này không phải nút tua nhanh sang ngày mai đâu đạo hữu.'
  ];
  const supabaseClient = window.supabase && typeof window.supabase.createClient === 'function'
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;
  let authenticatedUser = null;
  let pendingAuthAction = null;
  let activeAuthMode = 'login';
  let pauseCanvasAnimation = null;
  let pauseXianxiaAnimation = null;
  let html2CanvasPromise = null;
  let adminToastTimer = null;
  let cultivationCardControlsBound = false;
  let adminDashboardRequest = null;
  let adminWorkspaceInitialized = false;
  let adminPreviewObjectUrl = '';
  let discipleSyncUserId = '';
  let presenceChannel = null;
  let discipleRealtimeChannel = null;
  let presenceJoinTime = new Date().toISOString();
  let onlinePresenceState = {};
  let disciplesLoadPromise = null;

  // State Management
  const state = {
    data: null,
    currentFilter: 'all', // 'all' | 'photos' | 'quotes'
    siteSettings: {},
    siteConfig: {},
    liveConfigChannel: null,
    featureToggles: { ...DEFAULT_FEATURE_TOGGLES },
    themeSettings: { theme: 'xianxia', sky: 'cosmic' },
    decrees: [],
    milestoneCommentCounts: new Map(),
    milestoneCountsPromise: null,
    currentMilestoneStage: null,
    cultivationOverrides: {},
    customAttributes: {},
    cultivationCardExpansion: new Map(),
    originalMemoriesByStage: new Map(),
    hiddenMemories: new Set(),
    deletedMemories: [],
    adminMemoryFilter: 'all',
    adminGuestbookRows: [],
    adminCommentRows: [],
    adminGameRows: [],
    adminDisciples: [],
    disciple: null,
    discipleStatusReady: false,
    archive: {
      memories: [],
      renderedCount: 0,
      closeTimer: null
    },
    adminEditingMemory: null,
    adminEditingDecreeId: null,
    cultivation: {
      userId: null,
      profile: null,
      tuVi: 0,
      syncPromise: null,
      awardQueue: Promise.resolve(),
      pendingClaims: new Set()
    },
    visitor: {
      visible: false,
      count: 0
    },
    currentAudio: null,
    currentAudioBtn: null,
    currentVinyl: null,
    currentStageForModal: null,
    currentModalMonth: 'all',
    bgMusic: {
      playlist: [],
      currentIndex: 0,
      audio: new Audio(),
      startTimeApplied: false,
      isPlaying: false,
      isUserMuted: true,
      savedPlaybackState: null,
      resumeTime: 0,
      autoplayAwaitingGesture: false,
      autoplayGestureHandler: null
    },
    lightbox: {
      images: [],
      items: [],
      currentIndex: 0,
      memory: null,
      isZoomed: false,
      panX: 0,
      panY: 0,
      scale: 1,
      transformFrameId: 0,
      dragOrigin: null
    },
    game: {
      pool: [],
      questions: [],
      currentIndex: 0,
      score: 0,
      streak: 0,
      bestStreak: 0,
      resultSaved: false,
      hasAnswered: false,
      lastCorrectLine: '',
      lastWrongLine: '',
      mode: 'normal',
      combo: 0,
      bestCombo: 0,
      correctAnswers: 0,
      lives: 3,
      timeLeft: 15,
      questionStartedAt: 0,
      timerId: null,
      powerups: { fifty: false, hint: false, freeze: false },
      usedPowerups: new Set(),
      choices: []
    },
    cinema: {
      slides: [],
      currentIndex: 0,
      isPlaying: false,
      isMuted: false,
      timer: null,
      elapsedMs: 0,
      slideDurationMs: 5000,
      currentTrackSrc: null
    }
  };
  state.bgMusic.audio.preload = 'none';

  // Helper: Format Seconds to MM:SS
  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, character => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[character]);
  }

  function getCultivationLevelName(stage) {
    const override = state.cultivationOverrides[stage.id] || {};
    const level = String(override.level || stage.level || '');
    const lv = level.match(/Lv\.\s*\d+/i)?.[0] || level.trim();
    const map = {
      'luc-nho': 'Luyện Khí Tầng 2 – Tân Binh Hít Khí Trời',
      '2021': 'Trúc Cơ Kỳ – Chiến Thần Cấp 3',
      '2022': 'Kim Đan Kỳ – Chiến Thần Tái Hòa Nhập',
      '2023': 'Nguyên Anh Kỳ – Tân Thủ Đồ Tu',
      '2024': 'Hóa Thần Kỳ – Đạo Hữu Đi Làm',
      '2025': 'Luyện Hư Kỳ – Trưởng Thành Tu 20',
      '2026': 'Hợp Thể Kỳ – Kiến Trúc Sư Kiếm Tiền'
    };
    return `${lv} • ${override.levelName || map[stage.id] || 'Cảnh Giới Bí Ẩn'}`;
  }

  function getCultivationFate(stageId) {
    const override = state.cultivationOverrides[stageId] || {};
    if (override.fate) return override.fate;
    const fates = {
      'luc-nho': 'Mệnh cách Hồn Trẻ Xuyên Nhận – linh khí còn thơm sữa.',
      '2021': 'Mệnh cách Cày Đêm Cấp Tốc – deadline tự động chạy theo.',
      '2022': 'Mệnh cách Gió Trời Nhạy Bén – bắt trend chưa kịp cắt phông.',
      '2023': 'Mệnh cách Trưởng Thành Chậm – mỗi bug là một kinh nghiệm.',
      '2024': 'Mệnh cách Lạc Đường Không Sai – đi làm vẫn giữ linh tính.',
      '2025': 'Mệnh cách Tu 20 Nghiêm Túc – ví tiền rung ít nhưng rung thật.',
      '2026': 'Mệnh cách Kiếm Tốc Lập Code – deploy thẳng, nhân phẩm thẳng hơn.'
    };
    return fates[stageId] || 'Mệnh cách Ấn Linh – chờ trời mở cánh cửa.';
  }

  function getCultivationLevel(stage) {
    const override = state.cultivationOverrides[stage.id] || {};
    const level = String(override.level || stage.level || '');
    return level.match(/Lv\.\s*\d+/i)?.[0] || level.trim();
  }

  function getCultivationMainStats(stage) {
    const customStats = state.customAttributes[stage.id]?.mainStats || [];
    return stage.mainStats.map((stat, index) => ({
      ...stat,
      ...(customStats[index] || {})
    }));
  }

  function getCultivationSubStats(stage) {
    const override = state.cultivationOverrides[stage.id];
    const baseStats = override && Array.isArray(override.subStats) && override.subStats.length
      ? override.subStats
      : stage.subStats;
    const customStats = state.customAttributes[stage.id]?.subStats || [];
    return baseStats.map((stat, index) => ({
      ...stat,
      ...(customStats[index] || {})
    }));
  }

  const STAT_QUALITIES = [
    { value: 'cuc-pham', label: 'Cực Phẩm', className: 'cuc-pham' },
    { value: 'thuong-pham', label: 'Thượng Phẩm', className: 'thuong-pham' },
    { value: 'trung-pham', label: 'Trung Phẩm', className: 'trung-pham' },
    { value: 'ha-pham', label: 'Hạ Phẩm', className: 'ha-pham' },
    { value: 'tiem-nang', label: 'Tiềm Năng', className: 'tiem-nang' }
  ];

  function getStatQuality(qualityValue, value) {
    const quality = String(qualityValue || '').trim().toLowerCase();
    const selected = STAT_QUALITIES.find(item =>
      item.value === quality || item.label.toLowerCase() === quality
    );
    if (selected) return selected;
    if (value >= 90) return STAT_QUALITIES[0];
    if (value >= 80) return STAT_QUALITIES[1];
    return STAT_QUALITIES[4];
  }

  function renderMainStatsMarkup(stage) {
    return getCultivationMainStats(stage).map(stat => {
      const value = Math.max(0, Math.min(100, Number(stat.value) || 0));
      const quality = getStatQuality(stat.quality, value);
      const label = escapeHtml(stat.label);
      return `
        <div class="stat-bar-item">
          <div class="stat-bar-labels">
            <span class="stat-bar-name">${label}</span>
            <span class="stat-bar-value-group">
              <span class="stat-bar-val">${value}%</span>
              <span class="rpg-mainstat-badge ${quality.className}">${quality.label}</span>
            </span>
          </div>
          <div class="rpg-mainstat-bar" role="img" aria-label="${label}: ${value}%">
            <div class="rpg-mainstat-bar-inner" style="width: ${value}%">
              <span class="rpg-mainstat-bar-dot" aria-hidden="true"></span>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  function renderSubStatsMarkup(stage) {
    return getCultivationSubStats(stage).map(stat => {
      const hasAttributeMeta = Number.isFinite(Number(stat.percent)) || Boolean(stat.quality);
      const percent = Math.max(0, Math.min(100, Number(stat.percent) || 0));
      const quality = getStatQuality(stat.quality, percent);
      return `
        <div class="rpg-substat-card">
          <span class="rpg-substat-name">${escapeHtml(stat.label)}</span>
          ${renderStars(stat.value)}
          ${hasAttributeMeta ? `
            <div class="rpg-substat-attribute">
              <span>${percent}%</span>
              <span class="rpg-mainstat-badge ${quality.className}">${quality.label}</span>
            </div>
          ` : ''}
        </div>
      `;
    }).join('');
  }

  function renderHomeCultivationAttributes() {
    const container = document.getElementById('home-cultivation-details-content');
    const stage = state.data && state.data.stages.find(item => item.id === '2026');
    if (!container || !stage) return;
    container.innerHTML = `
      <div class="home-cultivation-fate">🔮 Mệnh Cách: ${escapeHtml(getCultivationFate(stage.id))}</div>
      <div class="rpg-stats-container home-cultivation-stats">
        <div class="rpg-stat-col">
          <div class="rpg-stat-col-title"><span>❖ LINH CĂN &amp; CĂN CỐT CHÍNH</span></div>
          <div class="stat-bar-group">${renderMainStatsMarkup(stage)}</div>
        </div>
        <div class="rpg-stat-col">
          <div class="rpg-stat-col-title"><span>◈ THIÊN PHÚ &amp; HUYẾT MẠCH PHỤ</span></div>
          <div class="rpg-substats-grid">${renderSubStatsMarkup(stage)}</div>
        </div>
      </div>
    `;
  }

  function initHomeCultivationCard() {
    const section = document.getElementById('home-cultivation-section');
    const button = document.getElementById('home-cultivation-toggle');
    const details = document.getElementById('home-cultivation-details');
    if (!section || !button || !details || button.dataset.bound === 'true') return;
    button.dataset.bound = 'true';
    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') !== 'true';
      section.classList.toggle('is-expanded', expanded);
      button.setAttribute('aria-expanded', String(expanded));
      details.setAttribute('aria-hidden', String(!expanded));
      button.textContent = expanded
        ? '✧ Thu Gọn ▴'
        : '✧ Khai Mở ▾';
    });
  }

  function initStageCultivationCardControls() {
    if (cultivationCardControlsBound) return;
    cultivationCardControlsBound = true;
    document.addEventListener('click', event => {
      const toggle = event.target instanceof Element
        ? event.target.closest('.rpg-collapsed-summary, .rpg-expanded-summary, .rpg-collapse-trigger')
        : null;
      if (!toggle) return;
      const card = toggle.closest('.rpg-card-collapsible');
      if (!card) return;
      const stageId = card.dataset.cultivationStageId;
      if (!stageId) return;

      const expanded = !card.classList.contains('is-expanded');
      state.cultivationCardExpansion.set(stageId, expanded);
      card.classList.toggle('is-expanded', expanded);
      card.querySelectorAll('.rpg-collapsed-summary, .rpg-expanded-summary, .rpg-collapse-trigger')
        .forEach(button => button.setAttribute('aria-expanded', String(expanded)));
      const panel = card.querySelector('.rpg-expanded-panel');
      const collapsedSummary = card.querySelector('.rpg-collapsed-summary');
      const expandedSummary = card.querySelector('.rpg-expanded-summary');
      if (panel) {
        panel.setAttribute('aria-hidden', String(!expanded));
        panel.toggleAttribute('inert', !expanded);
      }
      if (collapsedSummary) {
        collapsedSummary.setAttribute('aria-hidden', String(expanded));
        collapsedSummary.toggleAttribute('inert', expanded);
      }
      if (expandedSummary) expandedSummary.setAttribute('aria-hidden', String(!expanded));
      const activeToggle = card.querySelector(expanded
        ? '.rpg-expanded-summary'
        : '.rpg-collapsed-summary');
      if (activeToggle) activeToggle.focus({ preventScroll: true });
    });
  }

  const CULTIVATION_RANKS = [
    { min: 0, next: 50, name: 'Phàm Nhân Nhập Môn' },
    { min: 50, next: 150, name: 'Luyện Khí Kỳ' },
    { min: 150, next: 300, name: 'Trúc Cơ Kỳ' },
    { min: 300, next: 600, name: 'Kim Đan Kỳ' },
    { min: 600, next: 1000, name: 'Nguyên Anh Kỳ' },
    { min: 1000, next: null, name: 'Hóa Thần Đại Năng' }
  ];
  let cultivationToastTimer = null;

  function getCultivationRank(tuVi) {
    const points = Math.max(0, Number(tuVi) || 0);
    return [...CULTIVATION_RANKS].reverse().find(rank => points >= rank.min) || CULTIVATION_RANKS[0];
  }

  function renderCultivationCard() {
    const card = document.getElementById('auth-cultivation-card');
    const rankEl = document.getElementById('auth-cultivation-rank');
    const totalEl = document.getElementById('auth-cultivation-total');
    const navTotal = document.getElementById('nav-cultivation-total');
    const navLabel = document.getElementById('nav-cultivation-label');
    const navBadge = document.getElementById('nav-cultivation-badge');
    const progress = document.getElementById('auth-cultivation-progress');
    const progressLabel = document.getElementById('auth-cultivation-progress-label');
    const status = document.getElementById('auth-cultivation-status');
    const streakBadge = document.getElementById('auth-cultivation-streak');
    if (!card) return;

    card.hidden = !authenticatedUser;
    const displayedPoints = !authenticatedUser
      ? 0
      : isAdminUser()
        ? 9999
        : Math.max(0, Number(state.cultivation.tuVi) || 0);
    if (navTotal) navTotal.textContent = String(displayedPoints);
    if (navBadge && navLabel) {
      const isAdmin = isAdminUser();
      const hideAdminPoints = isAdmin && state.featureToggles.hideAdminFromLeaderboard;
      const pointsRank = getCultivationRank(displayedPoints);
      const rankLabel = pointsRank.name
        .replace(' Nhập Môn', '')
        .replace(' Kỳ', '')
        .replace(' Đại Năng', '');
      navLabel.textContent = rankLabel;
      if (navTotal) {
        navTotal.hidden = hideAdminPoints;
        if (isAdmin) {
          navBadge.replaceChildren(document.createTextNode('👑 Chí Tôn • '), navTotal);
        } else {
          navBadge.replaceChildren(
            document.createTextNode('✦ '),
            navLabel,
            document.createTextNode(' • '),
            navTotal
          );
        }
      }
      navBadge.setAttribute('aria-label', isAdmin
        ? (hideAdminPoints ? 'Chí Tôn' : 'Chí Tôn • 9999')
        : `${rankLabel} • ${displayedPoints}`);
    }
    if (!authenticatedUser) return;
    const points = Math.max(0, Number(state.cultivation.tuVi) || 0);
    if (streakBadge) {
      const streakDays = Math.max(0, Number(state.cultivation.profile && state.cultivation.profile.streak_days) || 0);
      streakBadge.textContent = `🔥 Chuỗi ${streakDays} ngày`;
    }
    const rank = getCultivationRank(points);
    if (rankEl) rankEl.textContent = isAdminUser()
      ? 'Độ Kiếp Chí Tôn • Thành Chủ Sáng Thế'
      : rank.name;
    if (totalEl) totalEl.textContent = String(points);
    if (status) status.textContent = state.cultivation.profileError || '';
    if (progress) {
      if (isAdminUser() || rank.next == null) {
        progress.value = 100;
        if (progressLabel) progressLabel.textContent = isAdminUser()
          ? '9999 Tu Vi · Độ Kiếp Chí Tôn'
          : `${points} Tu Vi · Đã đạt cảnh giới tối cao`;
      } else {
        progress.value = Math.max(0, Math.min(100, ((points - rank.min) / (rank.next - rank.min)) * 100));
        if (progressLabel) progressLabel.textContent = `${points} / ${rank.next} Tu Vi`;
      }
    }
  }

  function showCultivationToast(message, icon = '✨') {
    let toast = document.getElementById('cultivation-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'cultivation-toast';
      toast.className = 'rpg-toast cultivation-toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
    }

    const iconElement = document.createElement('span');
    iconElement.className = 'cultivation-toast-icon';
    iconElement.textContent = icon;
    const messageElement = document.createElement('span');
    messageElement.textContent = message;
    toast.replaceChildren(iconElement, messageElement);
    toast.classList.add('show');
    if (cultivationToastTimer) clearTimeout(cultivationToastTimer);
    cultivationToastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
  }

  function spawnTuViBurst(sourceElement) {
    const target = document.getElementById('nav-cultivation-badge');
    const targetRect = target && target.getBoundingClientRect();
    const targetX = targetRect && targetRect.width
      ? targetRect.left + targetRect.width / 2
      : window.innerWidth - 86;
    const targetY = targetRect && targetRect.height
      ? targetRect.top + targetRect.height / 2
      : 32;
    const sourceRect = sourceElement instanceof Element
      ? sourceElement.getBoundingClientRect()
      : null;
    const sourceX = sourceRect && sourceRect.width
      ? sourceRect.left + sourceRect.width / 2
      : window.innerWidth / 2;
    const sourceY = sourceRect && sourceRect.height
      ? sourceRect.top + sourceRect.height / 2
      : window.innerHeight * 0.62;

    for (let index = 0; index < 10; index += 1) {
      const particle = document.createElement('span');
      const startX = sourceX + (Math.random() - 0.5) * 34;
      const startY = sourceY + (Math.random() - 0.5) * 22;
      const curveX = (Math.random() - 0.5) * 80;
      const curveY = -28 - Math.random() * 62;
      particle.className = 'tuvi-burst-gem';
      particle.setAttribute('aria-hidden', 'true');
      particle.style.left = `${startX}px`;
      particle.style.top = `${startY}px`;
      particle.style.setProperty('--tuvi-dx', `${targetX - startX}px`);
      particle.style.setProperty('--tuvi-dy', `${targetY - startY}px`);
      particle.style.setProperty('--tuvi-mid-x', `${(targetX - startX) * 0.46 + curveX}px`);
      particle.style.setProperty('--tuvi-mid-y', `${(targetY - startY) * 0.46 + curveY}px`);
      particle.style.animationDelay = `${index * 18}ms`;
      document.body.appendChild(particle);
      particle.addEventListener('animationend', () => particle.remove(), { once: true });
      window.setTimeout(() => particle.remove(), 1100);
    }

    if (target && targetRect && targetRect.width) {
      target.classList.remove('tuvi-burst-arrival');
      window.requestAnimationFrame(() => target.classList.add('tuvi-burst-arrival'));
      window.setTimeout(() => target.classList.remove('tuvi-burst-arrival'), 620);
    }
  }

  window.spawnTuViBurst = spawnTuViBurst;

  function localDateKey(date = new Date()) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  function vietnamDateKey(date = new Date()) {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Ho_Chi_Minh',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).formatToParts(date);
    const values = Object.fromEntries(parts.map(part => [part.type, part.value]));
    return `${values.year}-${values.month}-${values.day}`;
  }

  function shiftDateKey(dateKey, days) {
    const date = new Date(`${dateKey}T00:00:00.000Z`);
    date.setUTCDate(date.getUTCDate() + days);
    return date.toISOString().slice(0, 10);
  }

  function normalizeDateKey(value) {
    const dateKey = String(value || '').slice(0, 10);
    return /^\d{4}-\d{2}-\d{2}$/.test(dateKey) ? dateKey : null;
  }

  function parseSettingValue(value) {
    if (typeof value !== 'string') return value && typeof value === 'object' ? value : {};
    try {
      const parsed = JSON.parse(value);
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (error) {
      return {};
    }
  }

  function normalizeCultivationOverrides(value) {
    const source = parseSettingValue(value);
    const normalized = {};
    const stageIds = new Set((state.data && state.data.stages || []).map(stage => stage.id));
    Object.entries(source).forEach(([stageId, override]) => {
      if (!stageIds.has(stageId) || !override || typeof override !== 'object') return;
      normalized[stageId] = {
        level: String(override.level || '').trim(),
        levelName: String(override.levelName || '').trim(),
        fate: String(override.fate || '').trim(),
        subStats: Array.isArray(override.subStats)
          ? override.subStats.slice(0, 4).map(stat => ({
            label: String(stat && stat.label || '').trim(),
            value: Math.max(0, Math.min(5, Number(stat && stat.value) || 0))
          }))
          : []
      };
    });
    return normalized;
  }

  function normalizeCustomAttributes(value) {
    const source = parseSettingValue(value);
    const normalized = {};
    const stages = new Map((state.data && state.data.stages || []).map(stage => [stage.id, stage]));
    Object.entries(source).forEach(([stageId, override]) => {
      const stage = stages.get(stageId);
      if (!stage || !override || typeof override !== 'object') return;
      const stageAttributes = {};
      if (Array.isArray(override.mainStats)) {
        stageAttributes.mainStats = override.mainStats.slice(0, stage.mainStats.length).map((stat, index) => {
          const fallback = stage.mainStats[index] || {};
          const value = Math.max(0, Math.min(100, Number(stat && stat.value) || 0));
          return {
            label: String(stat && stat.label || fallback.label || '').trim(),
            value,
            quality: getStatQuality(stat && stat.quality, value).value
          };
        });
      }
      if (Array.isArray(override.subStats)) {
        stageAttributes.subStats = override.subStats.slice(0, stage.subStats.length).map((stat, index) => {
          const fallback = stage.subStats[index] || {};
          const starValue = Math.max(0, Math.min(5, Number(stat && stat.value) || 0));
          const percent = Math.max(0, Math.min(100,
            Number(stat && stat.percent != null ? stat.percent : (Number(fallback.value) || 0) * 20) || 0
          ));
          return {
            label: String(stat && stat.label || fallback.label || '').trim(),
            value: starValue,
            percent,
            quality: getStatQuality(stat && stat.quality, percent).value
          };
        });
      }
      normalized[stageId] = stageAttributes;
    });
    return normalized;
  }

  function refreshCultivationStageCards() {
    if (!state.data) return;
    renderHomeCultivationAttributes();
    state.data.stages.forEach(stage => {
      const section = document.getElementById(`stage-${stage.id}`);
      if (!section) return;
      const levelBadges = section.querySelectorAll('.rpg-avatar-lv');
      const levelNames = section.querySelectorAll('.rpg-level-name');
      const fate = section.querySelector('.rpg-fate-badge');
      const mainStats = section.querySelector('.stat-bar-group');
      const subStats = section.querySelector('.rpg-substats-grid');
      levelBadges.forEach(levelBadge => {
        levelBadge.textContent = getCultivationLevel(stage);
      });
      levelNames.forEach(levelName => {
        levelName.textContent = getCultivationLevelName(stage);
      });
      if (fate) fate.textContent = `🔮 Mệnh Cách: ${getCultivationFate(stage.id)}`;
      if (mainStats) mainStats.innerHTML = renderMainStatsMarkup(stage);
      if (subStats) subStats.innerHTML = renderSubStatsMarkup(stage);
    });
  }

  async function loadSiteSettings() {
    if (!supabaseClient) return;
    try {
      const { data, error } = await supabaseClient.from('site_settings')
        .select('key,value')
        .in('key', ['cultivation_overrides', 'custom_attributes', 'visitor_config', 'hidden_memories', 'announcement_config', 'quiz_special_questions']);
      if (error) throw error;

      (data || []).forEach(row => {
        state.siteSettings[row.key] = parseSettingValue(row.value);
      });
      state.cultivationOverrides = normalizeCultivationOverrides(state.siteSettings.cultivation_overrides);
      state.customAttributes = normalizeCustomAttributes(state.siteSettings.custom_attributes);
      state.hiddenMemories = new Set(Array.isArray(state.siteSettings.hidden_memories)
        ? state.siteSettings.hidden_memories.map(String)
        : []);
      applyHiddenMemories();
      renderSiteAnnouncement();
      const announcement = state.siteSettings.announcement_config || {};
      const announcementEnabled = document.getElementById('admin-announcement-enabled');
      const announcementText = document.getElementById('admin-announcement-text');
      if (announcementEnabled) announcementEnabled.checked = announcement.enabled === true;
      if (announcementText) announcementText.value = String(announcement.text || '');
      const visitorConfig = state.siteSettings.visitor_config || {};
      state.visitor.visible = visitorConfig.visible === true;
      refreshCultivationStageCards();
      renderStages();
      renderAdminMemoryList();
      renderAdminSpecialQuestions();
      updateVisitorBadge();
      syncAdminSettingsForm();
    } catch (error) {
      console.warn('Không thể tải cài đặt Tiên Giới:', error);
    }
  }

  function updateVisitorBadge() {
    const badge = document.getElementById('visitor-count-badge');
    const row = document.getElementById('visitor-count-row');
    const count = document.getElementById('visitor-count-number');
    if (!badge) return;
    badge.hidden = !state.visitor.visible;
    if (row) row.hidden = !state.visitor.visible;
    if (count) count.textContent = String(Math.max(0, Number(state.visitor.count) || 0));
  }

  function getVisitorCount(value) {
    const candidate = Array.isArray(value) ? value[0] : value;
    if (candidate == null || candidate === '') return null;
    if (Number.isFinite(Number(candidate))) return Number(candidate);
    if (candidate && typeof candidate === 'object') {
      const count = candidate.count ?? candidate.visitor_count ?? candidate.increment_visitor_count;
      if (Number.isFinite(Number(count))) return Number(count);
    }
    return null;
  }

  async function initVisitorCounter() {
    if (!supabaseClient) return;
    const sessionKey = 'tmtc-visitor-counted';
    try {
      if (sessionStorage.getItem(sessionKey)) return;
      const { data, error } = await supabaseClient.rpc('increment_visitor_count');
      if (error) throw error;
      sessionStorage.setItem(sessionKey, '1');
      const count = getVisitorCount(data);
      const configuredCount = getVisitorCount(state.siteConfig.visitor_count);
      if (configuredCount != null) state.visitor.count = configuredCount;
      else if (count != null) state.visitor.count = count;

      const { data: configRow, error: settingsError } = await supabaseClient.from('site_settings')
        .select('value')
        .eq('key', 'visitor_config')
        .maybeSingle();
      if (settingsError) throw settingsError;
      const config = parseSettingValue(configRow && configRow.value);
      state.siteSettings.visitor_config = config;
      state.visitor.visible = config.visible === true;
      if (count == null) {
        const savedCount = getVisitorCount(state.siteConfig.visitor_count);
        state.visitor.count = savedCount ?? getVisitorCount(config.count ?? config.visitor_count) ?? 0;
      }
      updateVisitorBadge();
      syncAdminVisitorCounterForm();
    } catch (error) {
      console.warn('Không thể cập nhật bộ đếm viếng thăm:', error);
    }
  }

  async function saveSiteSetting(key, value) {
    if (!supabaseClient) throw new Error('Dịch vụ cài đặt chưa kết nối.');
    const { error } = await supabaseClient.from('site_settings')
      .upsert({ key, value }, { onConflict: 'key' });
    if (error) throw error;
    state.siteSettings[key] = value;
  }

  function normalizeFeatureToggles(value) {
    const saved = parseSettingValue(value);
    return Object.fromEntries(Object.keys(DEFAULT_FEATURE_TOGGLES).map(key => [
      key,
      saved[key] !== false
    ]));
  }

  function normalizeThemeSettings(value) {
    const saved = parseSettingValue(value);
    return {
      theme: THEME_KEYS.includes(saved.theme) ? saved.theme : 'xianxia',
      sky: saved.sky === 'mountain' ? 'mountain' : 'cosmic'
    };
  }

  function applyGlobalThemeSettings(value) {
    state.themeSettings = normalizeThemeSettings(value);
    document.documentElement.dataset.theme = state.themeSettings.theme;
    document.documentElement.dataset.skyMood = state.themeSettings.sky;
    const themeSelect = document.getElementById('admin-global-theme');
    const skySelect = document.getElementById('admin-global-sky');
    if (themeSelect) themeSelect.value = state.themeSettings.theme;
    if (skySelect) skySelect.value = state.themeSettings.sky;
  }

  function applyFeatureToggles() {
    const toggles = state.featureToggles;
    const setVisibility = (selector, visible) => {
      document.querySelectorAll(selector).forEach(element => {
        element.hidden = !visible;
      });
    };
    setVisibility('#nav-thien-co-btn', toggles.oracle);
    setVisibility('#nav-tongmon-link', toggles.ticket || toggles.game);
    setVisibility('#ticket-station', toggles.ticket);
    setVisibility('#btn-nav-game', toggles.game);
    setVisibility('#global-audio-toggle, #floating-bg-player', toggles.audio);
    setVisibility('.rpg-card', toggles.attributes);
    setVisibility('#home-cultivation-section', toggles.attributes);
    setVisibility('#public-leaderboard', toggles.leaderboard);
    setVisibility('.milestone-comments-open', toggles.comments);
    setVisibility('#utility-launcher', toggles.footerUtilities);

    document.querySelectorAll('[data-feature-toggle]').forEach(input => {
      input.checked = toggles[input.dataset.featureToggle] !== false;
    });
    renderFeaturedDecree();
  }

  async function saveSiteConfig(configKey, value) {
    if (!supabaseClient) throw new Error('Dịch vụ cấu hình toàn trang chưa kết nối.');
    const updatedAt = new Date().toISOString();
    const payload = { config_key: configKey, config_value: value, updated_at: updatedAt };
    const { error: upsertError } = await supabaseClient.from('site_config')
      .upsert(payload, { onConflict: 'config_key' });
    if (upsertError) {
      const { data: existing, error: lookupError } = await supabaseClient.from('site_config')
        .select('config_key')
        .eq('config_key', configKey)
        .maybeSingle();
      if (lookupError) {
        throw new Error(`${upsertError.message || 'Không thể lưu cấu hình.'} (dự phòng cũng lỗi: ${lookupError.message || 'không thể kiểm tra cấu hình hiện có'})`);
      }

      const values = { config_value: value, updated_at: updatedAt };
      const fallbackWrite = async useTimestamp => {
        const rowValues = useTimestamp ? values : { config_value: value };
        return existing
          ? await supabaseClient.from('site_config').update(rowValues)
            .eq('config_key', configKey).select('config_key').maybeSingle()
          : await supabaseClient.from('site_config').insert({
            config_key: configKey,
            ...rowValues
          }).select('config_key').maybeSingle();
      };
      let result = await fallbackWrite(true);
      if (result.error && isMissingDatabaseColumn(result.error, 'updated_at')) {
        result = await fallbackWrite(false);
      }
      if (result.error) throw result.error;
      if (!result.data) {
        if (existing) throw new Error('Không thể cập nhật cấu hình hiện có; hãy kiểm tra quyền truy cập Supabase.');
        throw new Error('Không thể thêm cấu hình mới; hãy kiểm tra quyền truy cập Supabase.');
      }
    }
    state.siteConfig[configKey] = value;
  }

  async function loadGlobalSiteConfig() {
    if (!supabaseClient) {
      applyFeatureToggles();
      applyGlobalThemeSettings(state.themeSettings);
      return;
    }

    try {
      const { data, error } = await supabaseClient.from('site_config')
        .select('config_key,config_value')
        .in('config_key', ['theme_settings', 'feature_toggles', 'visitor_count']);
      if (error) throw error;
      (data || []).forEach(row => {
        state.siteConfig[row.config_key] = parseSettingValue(row.config_value);
      });
      state.featureToggles = normalizeFeatureToggles(state.siteConfig.feature_toggles);
      const savedVisitorCount = getVisitorCount(state.siteConfig.visitor_count);
      if (savedVisitorCount != null) state.visitor.count = savedVisitorCount;
      applyGlobalThemeSettings(state.siteConfig.theme_settings);
      updateVisitorBadge();
    } catch (error) {
      console.warn('Không thể tải cấu hình toàn trang:', error);
    }
    applyFeatureToggles();
    syncAdminGlobalSettingsForms();
  }

  function syncAdminGlobalSettingsForms() {
    const themeSelect = document.getElementById('admin-global-theme');
    const skySelect = document.getElementById('admin-global-sky');
    if (themeSelect) themeSelect.value = state.themeSettings.theme;
    if (skySelect) skySelect.value = state.themeSettings.sky;
    document.querySelectorAll('[data-feature-toggle]').forEach(input => {
      input.checked = state.featureToggles[input.dataset.featureToggle] !== false;
    });
    syncAdminVisitorCounterForm();
  }

  function formatDecreeDate(value) {
    const date = new Date(value);
    if (!Number.isFinite(date.getTime())) return 'Thời gian đang được hiệu chỉnh';
    const formatter = new Intl.DateTimeFormat('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hourCycle: 'h23'
    });
    const parts = Object.fromEntries(formatter.formatToParts(date).map(part => [part.type, part.value]));
    return `⏳ Ban hành lúc ${parts.hour}:${parts.minute} • Ngày ${parts.day}/${parts.month}/${parts.year}`;
  }

  function renderDecreeCard(decree) {
    const article = document.createElement('article');
    article.className = 'decree-history-card';
    const type = document.createElement('span');
    type.className = 'decree-type-badge';
    type.textContent = DECREE_TYPES[decree.decree_type] || DECREE_TYPES['phap-chi'];
    const time = document.createElement('p');
    time.className = 'decree-time';
    time.textContent = formatDecreeDate(decree.created_at);
    const title = document.createElement('h3');
    title.textContent = String(decree.title || '');
    const content = document.createElement('p');
    content.className = 'decree-content';
    content.textContent = String(decree.content || '');
    article.append(type, time, title, content);
    if (decree.is_pinned) {
      const pin = document.createElement('span');
      pin.className = 'decree-pinned-label';
      pin.textContent = '📌 Đang ghim';
      article.appendChild(pin);
    }
    return article;
  }

  function renderFeaturedDecree() {
    const section = document.getElementById('tong-chu-decree-section');
    const type = document.getElementById('featured-decree-type');
    const time = document.getElementById('featured-decree-time');
    const title = document.getElementById('tong-chu-decree-title');
    const content = document.getElementById('featured-decree-content');
    const historyButton = document.getElementById('open-decree-history');
    const featured = state.decrees.find(decree => decree.is_pinned) || state.decrees[0];
    if (!section || !type || !time || !title || !content) return;
    section.hidden = !featured || state.featureToggles.decrees === false;
    if (!featured) return;
    type.textContent = DECREE_TYPES[featured.decree_type] || DECREE_TYPES['phap-chi'];
    time.textContent = formatDecreeDate(featured.created_at);
    title.textContent = String(featured.title || '');
    content.textContent = String(featured.content || '');
    if (historyButton) {
      historyButton.hidden = state.decrees.length < 2;
      historyButton.textContent = `📜 Xem Tất Cả Chiếu Thư (${state.decrees.length})`;
    }
  }

  function renderAdminDecreeList() {
    document.querySelectorAll('#admin-decree-list, #admin-decree-list-memory').forEach(list => {
      list.replaceChildren();
      if (!state.decrees.length) {
        const empty = document.createElement('p');
        empty.className = 'admin-memory-empty';
        empty.textContent = 'Chưa có chiếu thư nào được ban bố.';
        list.appendChild(empty);
        return;
      }

      state.decrees.forEach(decree => {
        const item = document.createElement('article');
        item.className = 'admin-decree-item';
        const details = renderDecreeCard(decree);
        const actions = document.createElement('div');
        actions.className = 'admin-decree-actions';
        const editButton = document.createElement('button');
        editButton.type = 'button';
        editButton.className = 'admin-secondary-button';
        editButton.dataset.decreeAction = 'edit';
        editButton.dataset.decreeId = String(decree.id);
        editButton.textContent = '✏️ Sửa';
        const pinButton = document.createElement('button');
        pinButton.type = 'button';
        pinButton.className = 'admin-secondary-button';
        pinButton.dataset.decreeAction = 'pin';
        pinButton.dataset.decreeId = String(decree.id);
        pinButton.textContent = decree.is_pinned ? 'Bỏ ghim' : '📌 Ghim';
        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.className = 'admin-delete-button';
        deleteButton.dataset.decreeAction = 'delete';
        deleteButton.dataset.decreeId = String(decree.id);
          deleteButton.textContent = '🗑️ Xóa';
        actions.append(editButton, pinButton, deleteButton);
        item.append(details, actions);
        list.appendChild(item);
      });
    });
  }

  async function loadTongChuDecrees({ throwOnError = false } = {}) {
    if (!supabaseClient) {
      state.decrees = [];
      renderFeaturedDecree();
      renderAdminDecreeList();
      return;
    }
    try {
      const { data, error } = await supabaseClient.from('tong_chu_decrees')
        .select('*')
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(100);
      if (error) throw error;
      state.decrees = data || [];
      renderFeaturedDecree();
      renderAdminDecreeList();
    } catch (error) {
      console.warn('Không thể tải Chiếu Thư Tông Chủ:', error);
      renderFeaturedDecree();
      renderAdminDecreeList();
      if (throwOnError) throw error;
    }
  }

  function renderDecreeHistory() {
    const list = document.getElementById('decree-history-list');
    if (!list) return;
    list.replaceChildren();
    state.decrees.forEach(decree => list.appendChild(renderDecreeCard(decree)));
  }

  function initGlobalSiteRealtime() {
    if (!supabaseClient || typeof supabaseClient.channel !== 'function' || state.liveConfigChannel) return;
    try {
      state.liveConfigChannel = supabaseClient.channel('tmtc-site-live')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'site_config'
        }, payload => {
          const row = payload.new && payload.new.config_key
            ? payload.new
            : payload.old;
          if (!row || !row.config_key) return;
          const value = payload.eventType === 'DELETE' ? null : parseSettingValue(row.config_value);
          if (row.config_key === 'theme_settings') {
            state.siteConfig.theme_settings = value;
            applyGlobalThemeSettings(value);
          } else if (row.config_key === 'feature_toggles') {
            state.siteConfig.feature_toggles = value;
            state.featureToggles = normalizeFeatureToggles(value);
            applyFeatureToggles();
            renderCultivationCard();
            void loadCultivationLeaderboard();
          } else if (row.config_key === 'visitor_count') {
            state.siteConfig.visitor_count = value;
            state.visitor.count = getVisitorCount(value) ?? 0;
            syncAdminVisitorCounterForm();
            updateVisitorBadge();
          }
        })
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'tong_chu_decrees'
        }, () => {
          void loadTongChuDecrees();
        })
        .subscribe(status => {
          if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
            console.warn(`Không thể đồng bộ cấu hình/chiếu thư trực tiếp: ${status}`);
          }
        });
    } catch (error) {
      state.liveConfigChannel = null;
      console.warn('Không thể khởi tạo đồng bộ cấu hình trực tiếp:', error);
    }
  }

  function applyHiddenMemories() {
    if (!state.data) return;
    state.data.stages.forEach(stage => {
      const sourceMemories = state.originalMemoriesByStage.get(stage.id) || [];
      const dynamicMemories = stage.memories.filter(memory => memory.isDynamic);
      stage.memories = [
        ...sourceMemories.filter(memory => !state.hiddenMemories.has(String(memory.id))),
        ...dynamicMemories
      ];
    });
    updateStageMemoryCounts();
  }

  function applyCultivationProfile(profile) {
    const effectiveProfile = profile && isAdminUser()
      ? { ...profile, tu_vi: 9999 }
      : profile;
    state.cultivation.profile = effectiveProfile || null;
    state.cultivation.tuVi = Math.max(0, Number(
      effectiveProfile && (effectiveProfile.cultivation_points ?? effectiveProfile.tu_vi)
    ) || 0);
    state.cultivation.profileError = '';
    renderCultivationCard();
  }

  function getUserDisplayName(user) {
    const email = String(user && user.email || '');
    const metadata = user && user.user_metadata || {};
    return String(metadata.display_name || metadata.full_name || email.split('@')[0] || 'Đạo Hữu').trim();
  }

  function buildCultivationPayload(user, profile, changes = {}) {
    const values = { ...(profile || {}), ...changes };
    const changedTuVi = Object.prototype.hasOwnProperty.call(changes, 'cultivation_points')
      ? changes.cultivation_points
      : Object.prototype.hasOwnProperty.call(changes, 'tu_vi')
        ? changes.tu_vi
        : values.cultivation_points ?? values.tu_vi;
    const tuVi = Math.max(0, Number(changedTuVi) || 0);
    return {
      user_id: user.id,
      email: String(user.email || values.email || ''),
      display_name: String(values.display_name || getUserDisplayName(user)),
      tu_vi: tuVi,
      cultivation_points: tuVi,
      last_daily_claim: normalizeDateKey(values.last_daily_claim),
      daily_like_xp: Math.max(0, Number(values.daily_like_xp) || 0),
      last_like_date: normalizeDateKey(values.last_like_date),
      ticket_claimed: Boolean(values.ticket_claimed),
      guestbook_claimed: Boolean(values.guestbook_claimed),
      streak_days: Math.max(0, Number(values.streak_days) || 0),
      last_checkin_date: normalizeDateKey(values.last_checkin_date),
      updated_at: new Date().toISOString()
    };
  }

  function getCultivationPoints(profile) {
    return Math.max(0, Number(profile && (profile.cultivation_points ?? profile.tu_vi)) || 0);
  }

  async function fetchCultivationProfile(userId) {
    let result = await supabaseClient.from('user_cultivation')
      .select(CULTIVATION_PROFILE_COLUMNS)
      .eq('user_id', userId)
      .maybeSingle();
    if (result.error && isMissingDatabaseColumn(result.error, 'email')) {
      console.warn('user_cultivation chưa có cột email; cần bổ sung cột để bật chỉnh Tu Vi theo Gmail.');
      result = await supabaseClient.from('user_cultivation')
        .select(CULTIVATION_PROFILE_COLUMNS.split(',').filter(column => column !== 'email').join(','))
        .eq('user_id', userId)
        .maybeSingle();
    }
    if (result.error) throw result.error;
    return result.data;
  }

  async function upsertCultivationProfile(profile) {
    const payload = { ...profile };
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const { error } = await supabaseClient.from('user_cultivation')
        .upsert(payload, { onConflict: 'user_id' });
      if (!error) return;
      const unsupportedColumn = ['email', 'cultivation_points'].find(column =>
        Object.prototype.hasOwnProperty.call(payload, column) && isMissingDatabaseColumn(error, column)
      );
      if (!unsupportedColumn) throw error;
      console.warn(`user_cultivation chưa có cột ${unsupportedColumn}; bỏ cột này khỏi lần lưu hiện tại.`);
      delete payload[unsupportedColumn];
    }
    throw new Error('Không thể đồng bộ hồ sơ Tu Vi với cấu trúc bảng hiện tại.');
  }

  async function claimDailyCultivation(user, profile) {
    const today = vietnamDateKey();
    const previousCheckin = normalizeDateKey(profile && profile.last_checkin_date);
    const previousDailyClaim = normalizeDateKey(profile && profile.last_daily_claim);
    const currentStreak = Math.max(0, Number(profile && profile.streak_days) || 0);

    if (previousCheckin === today) return false;
    if (previousDailyClaim === today) {
      const migratedStreak = previousCheckin === shiftDateKey(today, -1)
        ? currentStreak + 1
        : Math.max(currentStreak, 1);
      const migratedProfile = buildCultivationPayload(user, profile, {
        streak_days: migratedStreak,
        last_checkin_date: today
      });
      await upsertCultivationProfile(migratedProfile);
      applyCultivationProfile(migratedProfile);
      return false;
    }

    const streakDays = previousCheckin === shiftDateKey(today, -1) ? currentStreak + 1 : 1;
    const reward = isAdminUser(user) ? 0 : streakDays >= 7 ? 35 : streakDays >= 3 ? 20 : 10;
    const updatedProfile = buildCultivationPayload(user, profile, {
      tu_vi: isAdminUser(user) ? 9999 : getCultivationPoints(profile) + reward,
      last_daily_claim: today,
      last_checkin_date: today,
      streak_days: streakDays
    });
    await upsertCultivationProfile(updatedProfile);

    applyCultivationProfile(updatedProfile);
    showCultivationToast(isAdminUser(user)
      ? `🔥 Tông Chủ duy trì chuỗi điểm danh ${streakDays} ngày.`
      : `🔥 Chuỗi ${streakDays} ngày · +${reward} Tu Vi điểm danh`, '☀️');
    if (reward > 0) spawnTuViBurst(document.getElementById('nav-cultivation-badge'));
    return true;
  }

  async function syncCultivationForUser(user) {
    if (!user || !supabaseClient) return;
    if (state.cultivation.userId === user.id) {
      if (state.cultivation.syncPromise) return state.cultivation.syncPromise;
      if (state.cultivation.profile) return;
    } else {
      state.cultivation.userId = user.id;
      state.cultivation.profile = null;
      state.cultivation.tuVi = 0;
      state.cultivation.profileError = '';
      renderCultivationCard();
    }

    state.cultivation.syncPromise = (async () => {
      const profile = await fetchCultivationProfile(user.id);
      if (state.cultivation.userId !== user.id) return;
      const syncedProfile = buildCultivationPayload(user, profile, isAdminUser(user) ? { tu_vi: 9999 } : {});
      await upsertCultivationProfile(syncedProfile);
      applyCultivationProfile(syncedProfile);
      const dailyClaim = state.cultivation.awardQueue.then(async () => {
        const latestProfile = await fetchCultivationProfile(user.id);
        if (state.cultivation.userId !== user.id) return;
        await claimDailyCultivation(user, latestProfile);
      });
      state.cultivation.awardQueue = dailyClaim.then(() => undefined, () => undefined);
      await dailyClaim;
    })();

    try {
      await state.cultivation.syncPromise;
      void loadLeaderboard();
    } catch (error) {
      console.error('Không thể tải Tu Vi Đạo Hữu:', error);
      state.cultivation.profileError = 'Chưa thể đồng bộ Tu Vi. Vui lòng thử lại sau.';
      renderCultivationCard();
    } finally {
      if (state.cultivation.userId === user.id) state.cultivation.syncPromise = null;
    }
  }

  async function awardCultivation(points, reason, options = {}) {
    if (!supabaseClient || !authenticatedUser) return false;
    if (options.claimField) {
      if (state.cultivation.pendingClaims.has(options.claimField)) return false;
      state.cultivation.pendingClaims.add(options.claimField);
    }
    const userId = authenticatedUser.id;
    const award = state.cultivation.awardQueue.then(() =>
      applyCultivationAward(points, reason, options, userId)
    );
    state.cultivation.awardQueue = award.then(() => undefined, () => undefined);
    try {
      return await award;
    } finally {
      if (options.claimField) state.cultivation.pendingClaims.delete(options.claimField);
    }
  }

  async function applyCultivationAward(points, reason, options, userId) {
    if (!authenticatedUser || authenticatedUser.id !== userId) return false;
    const user = authenticatedUser;
    try {
      if (isAdminUser(user)) {
        showCultivationToast('Tông Chủ đã đạt Chí Tôn • 9999 Tu Vi.', '👑');
        return false;
      }
      const profile = await fetchCultivationProfile(user.id);
      if (authenticatedUser?.id !== user.id) return false;

      if (options.claimField && profile && profile[options.claimField]) {
        return false;
      }

      let awardedPoints = points;
      const changes = {};
      if (options.dailyLike) {
        const today = localDateKey();
        const claimedToday = normalizeDateKey(profile && profile.last_like_date) === today;
        const pointsClaimedToday = claimedToday ? Number(profile && profile.daily_like_xp) || 0 : 0;
        awardedPoints = Math.min(points, Math.max(0, 50 - pointsClaimedToday));
        if (awardedPoints <= 0) {
          showCultivationToast('Đạo hữu đã nhận đủ 50 Tu Vi Linh Thạch hôm nay.', '💠');
          return false;
        }
        changes.last_like_date = today;
        changes.daily_like_xp = pointsClaimedToday + awardedPoints;
      }

      if (options.claimField) changes[options.claimField] = true;
      const updatedProfile = buildCultivationPayload(user, profile, {
        ...changes,
        tu_vi: getCultivationPoints(profile) + awardedPoints
      });

      await upsertCultivationProfile(updatedProfile);
      if (authenticatedUser?.id !== user.id) return false;

      applyCultivationProfile({ ...(profile || {}), ...updatedProfile });
      showCultivationToast(`+${awardedPoints} Tu Vi · ${reason}`, '✨');
      spawnTuViBurst(options.sourceElement);
      void loadCultivationLeaderboard();
      return true;
    } catch (error) {
      console.error(`Không thể cộng Tu Vi (${reason}):`, error);
      const message = `Không thể cộng Tu Vi: ${error.message || 'Lỗi kết nối cơ sở dữ liệu.'}`;
      state.cultivation.profileError = message;
      renderCultivationCard();
      showCultivationToast(message, '⚠️');
      return false;
    }
  }

  function getStagePresentation(stage, index, total) {
    const presentations = {
      'luc-nho': 'Thuở Khai Linh • Luyện Khí Sơ Nhập',
      '2021': 'Niên Hiệu 2021 • Trúc Cơ Độ Kiếp',
      '2022': 'Niên Hiệu 2022 • Kết Đan Nhập Môn',
      '2023': 'Niên Hiệu 2023 • Nguyên Anh Tu Hành',
      '2024': 'Niên Hiệu 2024 • Hóa Thần Vượt Bão',
      '2025': 'Niên Hiệu 2025 • Luyện Hư Ngộ Đạo',
      '2026': 'Niên Hiệu 2026 • Hợp Thể Kiếm Tiền'
    };
    const stageNumber = String(index + 1).padStart(2, '0');
    const totalStages = String(total).padStart(2, '0');
    const isOrigin = stage.id === 'luc-nho' || stage.period === 'Tuổi thơ';
    const eyebrow = isOrigin
      ? `KIẾP NẠN THỨ ${stageNumber} / ${totalStages} • KHỞI NGUYÊN • THUỞ KHAI LINH`
      : `KIẾP NẠN THỨ ${stageNumber} / ${totalStages} • NIÊN HIỆU ${stage.period}`;
    return {
      eyebrow,
      title: presentations[stage.id] || stage.title
    };
  }

  function getMemoryLikeId(memory) {
    return String(memory.dbId != null ? memory.dbId : memory.id);
  }

  function memoryLikeButtonMarkup(stage, memory, extraClass = '') {
    return `
      <div class="memory-like-control">
        <button type="button" class="memory-like-button ${extraClass}" data-memory-like-button
          data-stage-id="${escapeHtml(stage.id)}" data-memory-id="${escapeHtml(memory.id)}" aria-pressed="false">
          <span class="memory-like-icon" aria-hidden="true">💠</span>
          <span class="memory-like-label">Tặng Linh Thạch (<span class="memory-like-count">0</span>)</span>
        </button>
        <span class="memory-like-status" role="status" aria-live="polite"></span>
      </div>
    `;
  }

  function getMemoryLikeStatusElement(button) {
    if (button && button.id === 'lightbox-memory-like') {
      return document.getElementById('lightbox-memory-like-status');
    }
    return button && button.closest('.memory-like-control')
      ? button.closest('.memory-like-control').querySelector('.memory-like-status')
      : null;
  }

  function setMemoryLikeStatus(button, message, isError = false) {
    const status = getMemoryLikeStatusElement(button);
    if (!status) return;
    status.textContent = message;
    status.classList.toggle('is-error', isError);
  }

  function updateMemoryLikeControls(stage, memory, isLiked, count) {
    const memoryId = String(memory.id);
    const normalizedCount = Math.max(0, Number(count) || 0);
    document.querySelectorAll('[data-memory-like-button], #lightbox-memory-like').forEach(button => {
      if (button.dataset.memoryId !== memoryId || button.dataset.stageId !== stage.id) return;
      const countLabel = button.querySelector('.memory-like-count');
      if (countLabel) countLabel.textContent = String(normalizedCount);
      button.classList.toggle('is-liked', isLiked);
      button.setAttribute('aria-pressed', String(isLiked));
    });
  }

  function setMemoryLikeControlsDisabled(stage, memory, disabled) {
    const memoryId = String(memory.id);
    document.querySelectorAll('[data-memory-like-button], #lightbox-memory-like').forEach(button => {
      if (button.dataset.memoryId === memoryId && button.dataset.stageId === stage.id) {
        button.disabled = disabled;
      }
    });
  }

  function findMemoryForLikeButton(button) {
    if (!state.data || !button) return null;
    const stage = state.data.stages.find(item => item.id === button.dataset.stageId);
    if (!stage) return null;
    const memory = stage.memories.find(item => String(item.id) === button.dataset.memoryId);
    return memory ? { stage, memory } : null;
  }

  async function refreshMemoryLikeButton(button, stage, memory) {
    if (!button || !stage || !memory) return;
    if (!supabaseClient) {
      setMemoryLikeStatus(button, 'Linh mạch dữ liệu chưa sẵn sàng.');
      return;
    }

    const memoryId = getMemoryLikeId(memory);
    const userId = authenticatedUser && authenticatedUser.id;
    const requestId = Number(button.dataset.likeRequestId || 0) + 1;
    button.dataset.likeRequestId = String(requestId);
    try {
      const countRequest = supabaseClient.from('memory_likes')
        .select('*', { count: 'exact', head: true })
        .eq('memory_id', memoryId);
      const ownLikeRequest = authenticatedUser
        ? supabaseClient.from('memory_likes')
          .select('memory_id')
          .eq('memory_id', memoryId)
          .eq('user_id', authenticatedUser.id)
          .maybeSingle()
        : Promise.resolve({ data: null, error: null });
      const [countResult, ownResult] = await Promise.all([countRequest, ownLikeRequest]);
      if (countResult.error) throw countResult.error;
      if (ownResult.error) throw ownResult.error;
      if (!button.isConnected || button.dataset.likeRequestId !== String(requestId) ||
          button.dataset.memoryId !== String(memory.id) ||
          String(authenticatedUser && authenticatedUser.id || '') !== String(userId || '')) return;

      const count = Number(countResult.count) || 0;
      const isLiked = Boolean(ownResult.data);
      updateMemoryLikeControls(stage, memory, isLiked, count);
      setMemoryLikeStatus(button, '');
    } catch (error) {
      console.error('Không thể tải số Linh Thạch:', error);
      if (button.isConnected && button.dataset.likeRequestId === String(requestId) &&
          button.dataset.memoryId === String(memory.id)) {
        setMemoryLikeStatus(button, 'Linh mạch đang chậm; số lượt tặng sẽ cập nhật khi kết nối ổn định.');
      }
    }
  }

  function refreshVisibleMemoryLikes(root = document) {
    if (!root || typeof root.querySelectorAll !== 'function') return;
    root.querySelectorAll('[data-memory-like-button]').forEach(button => {
      if (button.closest('[hidden]')) return;
      const found = findMemoryForLikeButton(button);
      if (found) refreshMemoryLikeButton(button, found.stage, found.memory);
    });
  }

  async function toggleMemoryLike(memory, stage, button) {
    if (!supabaseClient || !authenticatedUser) {
      setMemoryLikeStatus(button, 'Vui lòng đăng nhập để tặng Linh Thạch.', true);
      return;
    }
    const memoryId = getMemoryLikeId(memory);
    setMemoryLikeControlsDisabled(stage, memory, true);
    setMemoryLikeStatus(button, 'Đang truyền Linh Thạch…');
    const previousCount = Number(button.querySelector('.memory-like-count')?.textContent) || 0;
    const previousLiked = button.classList.contains('is-liked');
    const optimisticLiked = !previousLiked;
    updateMemoryLikeControls(stage, memory, optimisticLiked, previousCount + (optimisticLiked ? 1 : -1));
    try {
      const { data: existingLike, error: lookupError } = await supabaseClient.from('memory_likes')
        .select('memory_id')
        .eq('memory_id', memoryId)
        .eq('user_id', authenticatedUser.id)
        .maybeSingle();
      if (lookupError) throw lookupError;

      if (existingLike) {
        if (optimisticLiked) {
          updateMemoryLikeControls(stage, memory, false, previousCount - 1);
        }
        const { error } = await supabaseClient.from('memory_likes')
          .delete()
          .eq('memory_id', memoryId)
          .eq('user_id', authenticatedUser.id);
        if (error) throw error;
      } else {
        if (!optimisticLiked) {
          updateMemoryLikeControls(stage, memory, true, previousCount + 1);
        }
        const { error } = await supabaseClient.from('memory_likes')
          .upsert(
            { memory_id: memoryId, user_id: authenticatedUser.id },
            { onConflict: 'memory_id,user_id' }
          );
        if (error) throw error;
      }

      await refreshMemoryLikeButton(button, stage, memory);
      setMemoryLikeStatus(button, existingLike ? 'Đã thu hồi Linh Thạch.' : 'Linh Thạch đã được dâng lên!');
      if (!existingLike) {
        await awardCultivation(10, 'Dâng Linh Thạch', { dailyLike: true, sourceElement: button });
      }
    } catch (error) {
      console.error('Không thể cập nhật Linh Thạch:', error);
      updateMemoryLikeControls(stage, memory, previousLiked, previousCount);
      setMemoryLikeStatus(button, 'Không thể cập nhật Linh Thạch. Vui lòng thử lại.', true);
    } finally {
      setMemoryLikeControlsDisabled(stage, memory, false);
    }
  }

  function handleMemoryLikeClick(memory, stage, button) {
    if (!authenticatedUser) {
      const lightboxOpen = button.id === 'lightbox-memory-like' &&
        document.getElementById('lightbox-modal')?.classList.contains('active');
      const filmstripModal = document.getElementById('filmstrip-modal');
      const filmstripOpen = lightboxOpen && filmstripModal && filmstripModal.classList.contains('active');
      if (lightboxOpen) closeLightbox();
      if (filmstripOpen) closeFilmstripModal();
      const resumeAction = () => {
        let targetButton = button;
        if (lightboxOpen) {
          if (filmstripOpen) openFilmstripModal(stage.id);
          openLightbox(memory, 0, stage);
          targetButton = document.getElementById('lightbox-memory-like');
        }
        toggleMemoryLike(memory, stage, targetButton);
      };
      requireAuth(resumeAction);
      return;
    }
    toggleMemoryLike(memory, stage, button);
  }

  function applyStartTimeOnce(audio, startTime) {
    if (!audio || !Number.isFinite(startTime) || startTime < 0) return;
    if (audio.dataset.startTimeApplied === 'true') return;

    const apply = () => {
      if (audio.dataset.startTimeApplied === 'true') return;
      if (audio.readyState >= 1) {
        audio.currentTime = startTime;
        audio.dataset.startTimeApplied = 'true';
      }
    };

    if (audio.readyState >= 1) {
      apply();
    } else {
      audio.addEventListener('loadedmetadata', apply, { once: true });
    }
  }

  let linhThachIconId = 0;

  // Helper: Render five cultivation crystals, including half tiers.
  function renderStars(rating) {
    const maxStars = 5;
    const rawValue = typeof rating === 'number' ? rating : parseFloat(rating) || 0;
    const num = Math.max(0, Math.min(maxStars, rawValue));
    let html = `<div class="rpg-substat-flames" role="img" aria-label="Tầng ${num} trên ${maxStars}" title="${num} / ${maxStars} tầng">`;

    for (let i = 1; i <= maxStars; i++) {
      const state = num >= i ? 'active' : num >= i - 0.5 ? 'half' : 'inactive';
      const gradientId = `linh-thach-${++linhThachIconId}`;
      const fill = state === 'active'
        ? `url(#${gradientId}-full)`
        : state === 'half'
          ? `url(#${gradientId}-half)`
          : 'rgba(20, 32, 48, 0.9)';
      html += `
        <span class="rpg-crystal ${state}" aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false">
            <defs>
              <linearGradient id="${gradientId}-full" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#34d399"></stop>
                <stop offset="100%" stop-color="#fbbf24"></stop>
              </linearGradient>
              <linearGradient id="${gradientId}-half" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="50%" stop-color="#34d399"></stop>
                <stop offset="50%" stop-color="#16283a"></stop>
              </linearGradient>
            </defs>
            <path d="M12 2.2 20.4 7v10L12 21.8 3.6 17V7z" fill="${fill}" stroke="${state === 'inactive' ? '#66808b' : '#fcd34d'}" stroke-width="1.25"></path>
            <path d="m12 2.2-3.8 5.3L12 21.8l3.8-14.3zM3.6 7h16.8M3.6 17h16.8" fill="none" stroke="rgba(226, 252, 245, 0.62)" stroke-width="0.75"></path>
          </svg>
        </span>`;
    }
    html += `</div><span class="rpg-substat-tier">Tầng ${num}/${maxStars}</span>`;
    return html;
  }

  // ========================================================
  // 1. INITIALIZATION & DATA BINDING
  // ========================================================
  function init() {
    if (!window.MEMORIES_DATA) {
      console.error('Không tìm thấy dữ liệu MEMORIES_DATA trong window!');
      return;
    }

    try {
      state.data = window.MEMORIES_DATA;
      if (!Array.isArray(state.data.stages)) state.data.stages = [];
      state.data.stages = state.data.stages.map(stage => ({
        ...stage,
        mainStats: Array.isArray(stage.mainStats) ? stage.mainStats : [],
        subStats: Array.isArray(stage.subStats) ? stage.subStats : [],
        memories: Array.isArray(stage.memories)
          ? stage.memories.filter(memory => memory.is_deleted !== true)
          : [],
        themeSong: stage.themeSong || { title: 'Giai điệu hoài niệm', src: '', startTime: 0 }
      }));
      state.originalMemoriesByStage = new Map(state.data.stages.map(stage => [
        stage.id,
        stage.memories.filter(memory => !memory.isDynamic)
      ]));

      const homePage = pageName === 'home';
      const galleryPage = pageName === 'gallery';
      const adminPage = pageName === 'admin';
      const tongmonPage = pageName === 'tongmon';

      initHeroSection();
      if (homePage || galleryPage) initStickyNav();
      applyGlobalThemeSettings(state.themeSettings);
      applyFeatureToggles();
      if (homePage || galleryPage) renderStages();
      initOffscreenPerformance();
      if (homePage) initHomeCultivationCard();
      initHeaderOffset();
      initCultivationBackground();
      initXianxiaCanvas();
      initSpiritParticlesCanvas();
      if (homePage) {
        initAchievements();
        initTimeCapsule();
      }

      if (tongmonPage) initTicketStation();
      initBackgroundMusic();
      bindGlobalEvents();
      initModalNavbarSync();
      if (homePage || tongmonPage) initUtilityPanels();
      initAuthPortal();
      initPageAccessControls();
      if (galleryPage) initArchiveLockModal();
      if (homePage) initCultivationOracle();
      initFeatureModals();
      if (homePage || tongmonPage) initLeaderboardTabs();
      if (galleryPage || tongmonPage || adminPage) {
        void loadDynamicMemories().then(() => {
          if (adminPage && isAdminUser()) renderAdminMetrics();
        });
      }
      void Promise.all([loadSiteSettings(), loadGlobalSiteConfig()])
        .then(() => {
          startConfiguredBackgroundMusic();
          if (homePage) initVisitorCounter();
          if (adminPage && isAdminUser()) void renderAdminMetrics();
        });
      if (homePage || adminPage) void loadTongChuDecrees();
      initGlobalSiteRealtime();
      window.setTimeout(initPresence, 300);
      if (homePage || tongmonPage) void loadLeaderboard();
    } catch (e) {
      console.error('Không thể khởi tạo trang:', e);
    }
  }

  function initOffscreenPerformance() {
    if (!('IntersectionObserver' in window)) return;
    const targets = document.querySelectorAll(
      '.stage-section, .achievement-card, .time-capsule-section, ' +
      '.home-cultivation-section, .page-route-card, #public-leaderboard, .public-leaderboard-card'
    );
    if (!targets.length) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        entry.target.classList.toggle('is-offscreen-perf', !entry.isIntersecting);
      });
    }, { rootMargin: '160px 0px' });
    targets.forEach(target => observer.observe(target));
  }

  function findStageForMemoryRow(row) {
    const stageKey = String(row.stage_id || row.stage || row.year || '');
    return state.data.stages.find(stage =>
      stage.id === stageKey || stage.period === stageKey || stage.title === stageKey
    );
  }

  function isVideoUrl(url) {
    if (typeof url !== 'string') return false;
    try {
      return /\.(mp4|m4v|mov|webm|ogv)$/i.test(new URL(url, window.location.href).pathname);
    } catch (error) {
      return /\.(mp4|m4v|mov|webm|ogv)(?:[?#]|$)/i.test(url);
    }
  }

  function getVideoExtension(file) {
    const nameExtension = String(file.name || '').match(/\.(mp4|m4v|mov|webm|ogv)$/i);
    if (nameExtension) return nameExtension[1].toLowerCase();
    const typeExtensions = {
      'video/mp4': 'mp4',
      'video/webm': 'webm',
      'video/quicktime': 'mov',
      'video/ogg': 'ogv'
    };
    return typeExtensions[file.type] || '';
  }

  function getVideoContentType(file, extension) {
    if (file.type.startsWith('video/')) return file.type;
    const extensionTypes = {
      mp4: 'video/mp4',
      m4v: 'video/mp4',
      mov: 'video/quicktime',
      webm: 'video/webm',
      ogv: 'video/ogg'
    };
    return extensionTypes[extension] || '';
  }

  function mapDynamicMemory(row) {
    if (!row || row.id == null) return null;
    const source = row.image_url || row.image || row.imageUrl || row.photo_url;
    const imageList = Array.isArray(source) ? source : source ? [source] : [];
    const images = imageList
      .filter(image => typeof image === 'string' && /^https?:\/\//i.test(image))
      .map(image => image.trim());

    return {
      id: `supabase-${String(row.id)}`,
      dbId: row.id,
      type: row.type === 'story' ? 'story' : 'photo',
      isDynamic: true,
      sortOrder: row.sort_order == null ? Number.MAX_SAFE_INTEGER : Number(row.sort_order) || 0,
      title: String(row.title || 'Kỷ niệm mới'),
      time: String(row.date_label || row.time || row.created_at || ''),
      month: row.month == null || row.month === '' ? null : Number(row.month),
      description: String(row.story || row.caption || row.description || ''),
      image: images,
      mediaType: isVideoUrl(images[0]) ? 'video' : 'image',
      tag: row.type === 'story' ? 'Tâm sự' : 'Kỷ niệm',
      isHighlight: false
    };
  }

  function getStageQuoteMemories(stage) {
    return stage.memories.filter(memory =>
      (!memory.image || memory.image.length === 0) || memory.tag === 'Tâm sự'
    );
  }

  function bindStageQuoteToggle(toggle) {
    const button = toggle.querySelector('.btn-toggle-stage-quotes');
    if (!button) return;
    button.addEventListener('click', () => {
      const content = toggle.querySelector('.stage-quotes-content');
      if (!content) return;
      const willOpen = content.hidden;
      content.hidden = !willOpen;
      button.setAttribute('aria-expanded', String(willOpen));
      const label = button.querySelector('.quote-toggle-text');
      if (label) label.textContent = willOpen ? 'Thu Gọn Tâm Ma Bí Lục' : 'Khai Mở Tâm Ma Bí Lục';
      button.setAttribute('aria-label', `${label ? label.textContent : 'Tâm Ma Bí Lục'} (${button.querySelector('.quotes-count')?.textContent || ''})`);
      if (willOpen) refreshVisibleMemoryLikes(content);
    });
  }

  function syncStageQuoteList(stage, section) {
    const quotes = getStageQuoteMemories(stage);
    let toggle = section.querySelector('.stage-quotes-toggle');
    if (!quotes.length) {
      if (toggle) toggle.remove();
      return;
    }

    const wasExpanded = Boolean(toggle && toggle.querySelector('.stage-quotes-content') &&
      !toggle.querySelector('.stage-quotes-content').hidden);
    if (!toggle) {
      toggle = document.createElement('div');
      toggle.className = 'stage-quotes-toggle';
      const archiveRow = section.querySelector('.stage-archive-row');
      if (archiveRow) archiveRow.before(toggle);
      else section.querySelector('.container')?.appendChild(toggle);
    }

    toggle.dataset.stageId = stage.id;
    toggle.innerHTML = `
      <button class="btn-toggle-stage-quotes" type="button" aria-expanded="${wasExpanded}" aria-controls="stage-quotes-${escapeHtml(stage.id)}">
        <span class="quote-toggle-label">
          <svg class="quote-scroll-icon" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
            <path d="M8 5.5h15a3 3 0 0 1 3 3v15a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3v-15a3 3 0 0 1 3-3Z" fill="none" stroke="currentColor" stroke-width="1.6"/>
            <path d="M9 10h12M9 14h12M9 18h9M9 22h7M5 8H3.5v16H5m21-16h2v16h-2" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.35"/>
            <path d="m22 4 2 2-2 2M10 27l-2 2-2-2" fill="none" stroke="#f8dfa0" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.4"/>
          </svg>
          <span class="quote-toggle-text">${wasExpanded ? 'Thu Gọn Tâm Ma Bí Lục' : 'Khai Mở Tâm Ma Bí Lục'}</span>
        </span>
        <span class="quotes-count">${quotes.length} chương</span>
      </button>
      <div class="stage-quotes-content" id="stage-quotes-${escapeHtml(stage.id)}" ${wasExpanded ? '' : 'hidden'}>
        ${quotes.map(memory => `
          <article class="stage-quote-item">
            <span class="stage-quote-time">${escapeHtml(memory.time || '')}</span>
            <h4>${escapeHtml(memory.title || 'Tâm sự')}</h4>
            <p>“${escapeHtml(memory.description || '')}”</p>
            ${memoryLikeButtonMarkup(stage, memory, 'quote-memory-like')}
          </article>
        `).join('')}
      </div>
    `;
    bindStageQuoteToggle(toggle);
  }

  function updateStageMemoryCounts() {
    state.data.stages.forEach((stage, index) => {
      const section = document.getElementById(`stage-${stage.id}`);
      if (!section) return;
      syncStageQuoteList(stage, section);
      const presentation = getStagePresentation(stage, index, state.data.stages.length);
      const indexTag = section.querySelector('.stage-index-tag');
      const archiveLabel = section.querySelector('.btn-open-archive > span:last-child');
      const count = stage.memories.length;
      if (indexTag) indexTag.textContent = presentation.eyebrow;
      if (archiveLabel) {
        archiveLabel.textContent = `Khai Ấn Ngọc Giản: Ký Ức ${stage.period} (${count} mảnh tàn hồn)`;
      }
    });
  }

  function refreshOpenArchive(stage) {
    const modal = document.getElementById('filmstrip-modal');
    if (!modal || !modal.classList.contains('active') || state.currentStageForModal !== stage) return;
    const subtitle = document.getElementById('modal-stage-subtitle');
    if (subtitle) subtitle.textContent = `Kho lưu trữ gồm ${stage.memories.length} khoảnh khắc & tư liệu`;
    buildModalMonthChips(stage);
    renderFilmstripGrid(stage, state.currentModalMonth);
  }

  async function loadDynamicMemories({ throwOnError = false } = {}) {
    if (!supabaseClient || !state.data) return;

    try {
      const { data, error } = await supabaseClient
        .from('memories')
        .select('*')
        .order('created_at', { ascending: true });
      if (error) throw error;
      if (!Array.isArray(data)) return;

      let changed = false;
      state.data.stages.forEach(stage => {
        const staticMemories = (state.originalMemoriesByStage.get(stage.id) || [])
          .filter(memory => !state.hiddenMemories.has(String(memory.id)));
        const dynamicMemories = data
          .filter(row => row.is_deleted !== true)
          .filter(row => findStageForMemoryRow(row) === stage)
          .map(mapDynamicMemory)
          .filter(Boolean)
          .sort((left, right) => left.sortOrder - right.sortOrder);
        const oldSignature = JSON.stringify(stage.memories
          .filter(memory => memory.isDynamic)
          .map(memory => [memory.dbId, memory.sortOrder, memory.title, memory.time, memory.description, memory.image]));
        const newSignature = JSON.stringify(dynamicMemories
          .map(memory => [memory.dbId, memory.sortOrder, memory.title, memory.time, memory.description, memory.image]));
        if (oldSignature !== newSignature) changed = true;
        stage.memories = [...staticMemories, ...dynamicMemories];
      });

      if (changed) {
        updateStageMemoryCounts();
        if (state.currentStageForModal) refreshOpenArchive(state.currentStageForModal);
        renderAdminMemoryList();
      }
    } catch (error) {
      console.warn('Không thể tải kỷ niệm động; tiếp tục dùng dữ liệu gốc:', error);
      if (throwOnError) throw error;
    }
  }

  function isAdminUser(user = authenticatedUser) {
    return String(user && user.email || '').toLowerCase() === ADMIN_EMAIL;
  }

  function requireAuth(actionCallback) {
    if (authenticatedUser) return true;
    pendingAuthAction = typeof actionCallback === 'function' ? actionCallback : null;
    activeAuthMode = 'login';
    openAuthModal('Đạo hữu vui lòng Đăng nhập hoặc Đăng ký để khai mở pháp bảo này!');
    return false;
  }

  function isDiscipleBanned() {
    return Boolean(state.disciple && state.disciple.is_banned === true);
  }

  function discipleBanMessage(status) {
    if (status) {
      status.textContent = '⚠️ Tài khoản của đạo hữu đã bị Tông Môn Phong Ấn!';
      status.classList.add('is-error');
    } else {
      showToast('⚠️ Tài khoản của đạo hữu đã bị Tông Môn Phong Ấn!', '🔒');
    }
    return false;
  }

  function hasDiscipleFeatureAccess(status) {
    if (!authenticatedUser) return false;
    if (!state.discipleStatusReady) {
      if (status) status.textContent = 'Đang xác minh tư cách môn đồ, xin chờ một lát.';
      else showToast('Đang xác minh tư cách môn đồ, xin chờ một lát.', '⏳');
      return false;
    }
    return !isDiscipleBanned() || discipleBanMessage(status);
  }

  function safeSessionValue(key, createValue) {
    try {
      let value = sessionStorage.getItem(key);
      if (!value) {
        value = createValue();
        sessionStorage.setItem(key, value);
      }
      return value;
    } catch (error) {
      console.warn('Không thể lưu trạng thái phiên Tông Môn:', error);
      return createValue();
    }
  }

  function getMemberFullName(user) {
    const metadata = user && user.user_metadata || {};
    return String(metadata.full_name || metadata.name || metadata.display_name ||
      user && user.email && user.email.split('@')[0] || 'Đạo Hữu').trim();
  }

  function getMemberAvatar(user) {
    const metadata = user && user.user_metadata || {};
    const value = String(metadata.avatar_url || metadata.picture || '').trim();
    return /^https:\/\//i.test(value) ? value : '';
  }

  async function syncDiscipleForUser(user) {
    if (!user || !user.id || !supabaseClient || discipleSyncUserId === String(user.id)) return;
    discipleSyncUserId = String(user.id);
    state.discipleStatusReady = false;
    syncPageAccess();
    const visitKey = `thien-menh:disciple-visit:${user.id}`;
    let isNewVisit = false;
    try {
      isNewVisit = !sessionStorage.getItem(visitKey);
      if (isNewVisit) sessionStorage.setItem(visitKey, '1');
      const { data: existing, error: readError } = await supabaseClient.from('disciples')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      if (readError) throw readError;

      const payload = {
        user_id: user.id,
        email: String(user.email || ''),
        full_name: getMemberFullName(user),
        avatar_url: getMemberAvatar(user) || String(existing && existing.avatar_url || ''),
        sect_title: String(existing && existing.sect_title || 'Ngoại Môn Đệ Tử'),
        is_banned: Boolean(existing && existing.is_banned),
        visit_count: Math.max(0, Number(existing && existing.visit_count) || 0) + (isNewVisit ? 1 : 0),
        last_seen: new Date().toISOString()
      };
      const { data, error } = await supabaseClient.from('disciples')
        .upsert(payload, { onConflict: 'user_id' })
        .select('*')
        .single();
      if (error) throw error;
      state.disciple = data || payload;
      state.discipleStatusReady = true;
      initDiscipleRealtime(user);
      refreshDiscipleshipUI();
      updatePresence();
      void loadGameLeaderboard();
      if (isAdminUser()) void loadAdminDisciples();
    } catch (error) {
      discipleSyncUserId = '';
      state.disciple = {
        user_id: user.id,
        email: String(user.email || ''),
        full_name: getMemberFullName(user),
        avatar_url: getMemberAvatar(user),
        sect_title: 'Ngoại Môn Đệ Tử',
        is_banned: false,
        visit_count: 0
      };
      state.discipleStatusReady = false;
      console.warn('Không thể đồng bộ Sổ Môn Đồ:', error);
      refreshDiscipleshipUI();
      updatePresence();
    }
  }

  function initDiscipleRealtime(user) {
    if (!supabaseClient || !user || !user.id || !supabaseClient.channel) return;
    if (discipleRealtimeChannel) void supabaseClient.removeChannel(discipleRealtimeChannel);
    discipleRealtimeChannel = supabaseClient.channel(`disciples-access:${user.id}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'disciples',
        filter: `user_id=eq.${user.id}`
      }, payload => {
        if (!payload.new || String(payload.new.user_id) !== String(authenticatedUser && authenticatedUser.id)) return;
        state.disciple = { ...(state.disciple || {}), ...payload.new };
        state.discipleStatusReady = true;
        refreshDiscipleshipUI();
        updatePresence();
      })
      .subscribe(status => {
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          console.warn('Không thể đồng bộ cập nhật Sổ Môn Đồ theo thời gian thực.');
        }
      });
  }

  function refreshDiscipleshipUI() {
    syncPageAccess();
    const title = document.getElementById('ticket-disp-sect-title');
    if (title) {
      title.textContent = String(state.disciple && state.disciple.sect_title || 'Ngoại Môn Đệ Tử');
      title.hidden = false;
    }
    if (isDiscipleBanned()) {
      document.querySelectorAll('.milestone-comment-form textarea, .milestone-comment-form button[type="submit"]')
        .forEach(element => { element.disabled = true; });
      const gameModal = document.getElementById('game-modal');
      if (gameModal && gameModal.classList.contains('active')) closeGameModal();
      const ticketStation = document.getElementById('ticket-station');
      if (ticketStation) {
        ticketStation.hidden = true;
        ticketStation.classList.remove('open');
      }
    } else {
      document.querySelectorAll('.milestone-comment-form textarea, .milestone-comment-form button[type="submit"]')
        .forEach(element => { element.disabled = false; });
    }
  }

  function getPresencePageName() {
    return {
      home: 'Đại Điện',
      gallery: 'Tàng Kinh Các',
      tongmon: 'Tông Môn Các',
      admin: 'Nội Các'
    }[pageName] || 'Đại Điện';
  }

  function getMaskedEmail(email) {
    const [name, domain] = String(email || '').split('@');
    if (!name || !domain) return '';
    return `${name.slice(0, 1)}***@${domain}`;
  }

  function currentPresencePayload() {
    const user = authenticatedUser;
    const anonymousId = safeSessionValue('thien-menh:anonymous-id', () =>
      `anon-${Math.random().toString(36).slice(2, 8)}`);
    const anonymousName = safeSessionValue('thien-menh:anonymous-name', () =>
      `Tán Tu Ẩn Danh #${Math.floor(1000 + Math.random() * 9000)}`);
    return {
      user_id: user ? String(user.id) : '',
      anonymous_id: user ? '' : anonymousId,
      full_name: user
        ? String(state.disciple && state.disciple.full_name || getMemberFullName(user))
        : anonymousName,
      email: user ? getMaskedEmail(user.email) : '',
      avatar_url: user
        ? String(state.disciple && state.disciple.avatar_url || getMemberAvatar(user))
        : '',
      sect_title: user
        ? String(state.disciple && state.disciple.sect_title || 'Ngoại Môn Đệ Tử')
        : 'Tán Tu',
      page: getPresencePageName(),
      device: window.matchMedia('(max-width: 767px)').matches ? 'Điện thoại' : 'Máy tính',
      joined_at: presenceJoinTime
    };
  }

  function updatePresence() {
    if (!presenceChannel) return;
    void presenceChannel.track(currentPresencePayload()).catch(error => {
      console.warn('Không thể cập nhật hiện diện Tông Môn:', error);
    });
  }

  function initPresence() {
    if (!supabaseClient || presenceChannel) return;
    const key = safeSessionValue('thien-menh:presence-key', () =>
      `visit-${Math.random().toString(36).slice(2, 12)}`);
    try {
      presenceChannel = supabaseClient.channel('tongmon-online-presence', {
        config: { presence: { key } }
      });
      presenceChannel
        .on('presence', { event: 'sync' }, () => {
          onlinePresenceState = presenceChannel.presenceState();
          renderAdminOnlinePresence();
        })
        .subscribe(status => {
          if (status === 'SUBSCRIBED') updatePresence();
          if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
            const list = document.getElementById('admin-online-visitors');
            if (list && isAdminUser()) list.textContent = 'Thiên Nhãn chưa kết nối được Realtime Presence.';
          }
        });
    } catch (error) {
      console.warn('Không thể mở kênh Realtime Presence:', error);
    }
  }

  function renderAdminOnlinePresence() {
    const list = document.getElementById('admin-online-visitors');
    const count = document.getElementById('admin-online-count');
    if (!list || !count || !isAdminUser()) return;
    const membersById = new Map((state.adminDisciples || []).map(member => [String(member.user_id), member]));
    const unique = new Map();
    Object.values(onlinePresenceState || {}).flat().forEach(presence => {
      const identity = presence.user_id
        ? `user:${presence.user_id}`
        : `anon:${presence.anonymous_id || presence.full_name || Math.random()}`;
      if (!unique.has(identity)) unique.set(identity, presence);
    });
    const visitors = Array.from(unique.values());
    count.textContent = `${visitors.length} đang online`;
    list.replaceChildren();
    if (!visitors.length) {
      const empty = document.createElement('p');
      empty.className = 'admin-memory-empty';
      empty.textContent = 'Hiện chưa có đạo hữu nào trực tuyến.';
      list.appendChild(empty);
      return;
    }
    visitors.forEach(visitor => {
      const member = membersById.get(String(visitor.user_id || ''));
      const row = document.createElement('article');
      row.className = 'admin-online-row';
      const avatar = document.createElement('img');
      avatar.className = 'admin-online-avatar';
      avatar.alt = '';
      avatar.loading = 'lazy';
      avatar.decoding = 'async';
      if (visitor.avatar_url && /^https:\/\//i.test(visitor.avatar_url)) avatar.src = visitor.avatar_url;
      else avatar.hidden = true;
      const identity = document.createElement('div');
      identity.className = 'admin-online-identity';
      const name = document.createElement('strong');
      name.textContent = String(visitor.full_name || 'Tán Tu Ẩn Danh');
      const email = document.createElement('span');
      email.textContent = String(member && member.email || visitor.email || 'Ẩn danh');
      const title = document.createElement('span');
      title.textContent = String(member && member.sect_title || visitor.sect_title || 'Tán Tu');
      identity.append(name, email, title);
      const badges = document.createElement('div');
      badges.className = 'admin-online-badges';
      [visitor.page || 'Đại Điện', visitor.device || 'Máy tính'].forEach(text => {
        const badge = document.createElement('span');
        badge.textContent = text;
        badges.appendChild(badge);
      });
      row.append(avatar, identity, badges);
      list.appendChild(row);
    });
  }

  function openAuthModal(message = '') {
    const modal = document.getElementById('auth-modal');
    if (!modal) return;
    modal.hidden = false;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    renderAuthState(authenticatedUser);
    if (!authenticatedUser) setAuthMode(activeAuthMode);
    setAdminStatus(message);
  }

  function closeAuthModal(clearPending = false) {
    const modal = document.getElementById('auth-modal');
    if (!modal) return;
    if (clearPending) pendingAuthAction = null;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    modal.hidden = true;
    syncFeatureModalScrollLock();
  }

  function setAuthMode(mode) {
    if (authenticatedUser) return;
    activeAuthMode = mode === 'signup' ? 'signup' : 'login';
    setAdminStatus('');
    const loginForm = document.getElementById('auth-login-form');
    const signupForm = document.getElementById('auth-signup-form');
    const loginTab = document.getElementById('auth-tab-login');
    const signupTab = document.getElementById('auth-tab-signup');
    if (!loginForm || !signupForm) return;

    loginForm.hidden = activeAuthMode !== 'login';
    signupForm.hidden = activeAuthMode !== 'signup';
    if (loginTab) {
      loginTab.classList.toggle('active', activeAuthMode === 'login');
      loginTab.setAttribute('aria-selected', String(activeAuthMode === 'login'));
    }
    if (signupTab) {
      signupTab.classList.toggle('active', activeAuthMode === 'signup');
      signupTab.setAttribute('aria-selected', String(activeAuthMode === 'signup'));
    }
    const visibleForm = activeAuthMode === 'login' ? loginForm : signupForm;
    visibleForm.classList.remove('auth-form-enter');
    window.requestAnimationFrame(() => visibleForm.classList.add('auth-form-enter'));
  }

  function renderAuthState(user) {
    const headerButton = document.getElementById('btn-header-auth');
    const cultivationBadge = document.getElementById('nav-cultivation-badge');
    const tabs = document.getElementById('auth-tabs');
    const loginForm = document.getElementById('auth-login-form');
    const signupForm = document.getElementById('auth-signup-form');
    const accountPanel = document.getElementById('auth-account-panel');
    const memberPanel = document.getElementById('auth-member-panel');
    const adminPanel = document.getElementById('admin-dashboard');
    const userLabel = document.getElementById('auth-user-label');
    const memberEmail = document.getElementById('auth-member-email');
    const email = String(user && user.email || '');
    const admin = isAdminUser(user);
    const displayName = user ? getUserDisplayName(user) : '';
    const headerLabel = !user
      ? '◈ Đăng nhập'
      : admin
        ? '◈ Admin'
        : `◈ ${displayName || email.split('@')[0] || 'Đạo Hữu'}`;

    if (headerButton) {
      headerButton.textContent = headerLabel;
      headerButton.title = user ? email : 'Đăng nhập hoặc đăng ký';
      headerButton.classList.toggle('is-admin', admin);
      headerButton.classList.toggle('is-member', Boolean(user) && !admin);
    }
    if (cultivationBadge) cultivationBadge.classList.toggle('is-visible', Boolean(user));

    if (!tabs || !loginForm || !signupForm || !accountPanel) return;
    accountPanel.hidden = !user;
    tabs.hidden = Boolean(user);
    loginForm.hidden = Boolean(user) || activeAuthMode !== 'login';
    signupForm.hidden = Boolean(user) || activeAuthMode !== 'signup';
    if (memberPanel) memberPanel.hidden = !user || admin;
    if (adminPanel) adminPanel.hidden = !user || !admin;
    if (userLabel) userLabel.textContent = user ? `Đang đăng nhập: ${email}` : '';
    if (memberEmail) memberEmail.textContent = email;
    renderCultivationCard();

    if (user) {
      fillAuthenticatedForms(user);
      if (admin) {
        renderAdminMemoryList();
        void loadAdminDashboardData();
      }
      syncAdminSettingsForm();
    }
  }

  function fillAuthenticatedForms(user) {
    const userName = getUserDisplayName(user);
    const fields = [
      document.getElementById('ticket-visitor-name'),
      document.getElementById('capsule-sender')
    ];
    fields.forEach(field => {
      if (!field) return;
      const currentValue = field.value.trim();
      const lastPrefill = field.dataset.authPrefillValue || '';
      if (!currentValue || currentValue === lastPrefill) {
        field.value = userName;
        field.dataset.authPrefillValue = userName;
        field.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });

    const ticketName = document.getElementById('ticket-visitor-name');
    const ticketDisplay = document.getElementById('ticket-disp-visitor');
    const ticketStub = document.getElementById('ticket-disp-stub-visitor');
    if (ticketName && ticketDisplay && ticketName.value.trim() === userName) {
      ticketDisplay.textContent = userName;
      if (ticketStub) ticketStub.textContent = userName.length > 14
        ? `${userName.substring(0, 14)}...`
        : userName;
    }
  }

  function setAuthenticatedUser(user) {
    const wasAuthenticated = Boolean(authenticatedUser);
    const previousUserId = String(authenticatedUser && authenticatedUser.id || '');
    authenticatedUser = user || null;
    if (previousUserId && previousUserId !== String(authenticatedUser && authenticatedUser.id || '') &&
        discipleRealtimeChannel && supabaseClient) {
      void supabaseClient.removeChannel(discipleRealtimeChannel);
      discipleRealtimeChannel = null;
    }
    if (!authenticatedUser || previousUserId !== String(authenticatedUser.id)) {
      state.disciple = null;
      state.discipleStatusReady = false;
      discipleSyncUserId = '';
    }
    renderAuthState(authenticatedUser);
    syncPageAccess();
    const discipleSync = authenticatedUser ? syncDiscipleForUser(authenticatedUser) : null;
    updatePresence();
    refreshVisibleMemoryLikes();
    initMilestoneComments();
    if (authenticatedUser) {
      void syncCultivationForUser(authenticatedUser);
      void loadLeaderboard();
    } else {
      state.cultivation.userId = null;
      state.cultivation.profile = null;
      state.cultivation.tuVi = 0;
      state.cultivation.profileError = '';
      state.cultivation.syncPromise = null;
      renderCultivationCard();
    }

    if (authenticatedUser && pendingAuthAction) {
      const action = pendingAuthAction;
      pendingAuthAction = null;
      closeAuthModal();
      const cultivationSync = state.cultivation.syncPromise;
      const requiredSyncs = [cultivationSync, discipleSync].filter(Boolean);
      if (requiredSyncs.length) void Promise.allSettled(requiredSyncs).then(action);
      else action();
    } else if (!authenticatedUser && wasAuthenticated) {
      pendingAuthAction = null;
      closeProtectedFeatures();
    }
  }

  function syncPageAccess() {
    const isAdmin = isAdminUser();
    const homeLink = document.getElementById('nav-home-link');
    const adminLink = document.getElementById('nav-admin-link');
    const homeAdminLink = document.getElementById('home-admin-route');
    if (homeLink) homeLink.hidden = pageName === 'home';
    if (adminLink) adminLink.hidden = !isAdmin;
    if (homeAdminLink) homeAdminLink.hidden = !isAdmin;

    if (pageName === 'tongmon') {
      const lock = document.getElementById('tongmon-access-lock');
      const content = document.getElementById('tongmon-content');
      const ticketStation = document.getElementById('ticket-station');
      const isAuthenticated = Boolean(authenticatedUser);
      const banLock = document.getElementById('tongmon-ban-lock');
      const checkingLock = document.getElementById('tongmon-checking-lock');
      const isBanned = isDiscipleBanned();
      if (lock) lock.hidden = isAuthenticated || isBanned;
      if (lock && lock.parentElement) lock.parentElement.hidden = isAuthenticated || isBanned;
      if (banLock) banLock.hidden = !isAuthenticated || !isBanned;
      const isChecking = isAuthenticated && !state.discipleStatusReady;
      if (checkingLock) checkingLock.hidden = !isChecking;
      if (content) content.hidden = !isAuthenticated || isBanned || isChecking;
      if (ticketStation) ticketStation.hidden = !isAuthenticated || isBanned || isChecking || !state.featureToggles.ticket;
    }

    if (pageName === 'admin') {
      const lock = document.getElementById('admin-access-denied');
      const dashboard = document.getElementById('admin-dashboard');
      const message = document.getElementById('admin-lock-message');
      if (lock) lock.hidden = isAdmin;
      if (lock && lock.parentElement) lock.parentElement.hidden = isAdmin;
      if (dashboard) dashboard.hidden = !isAdmin;
      if (message && authenticatedUser && !isAdmin) {
        message.textContent = 'Tài khoản hiện tại không có quyền Tông Chủ. Hãy đăng nhập bằng tài khoản quản trị để mở Nội Các.';
      }
    }
  }

  function renderSiteAnnouncement() {
    const banner = document.getElementById('site-announcement');
    if (!banner) return;
    const config = state.siteSettings.announcement_config || {};
    const title = document.getElementById('site-announcement-title');
    const text = document.getElementById('site-announcement-text');
    const content = String(config.text || '').trim();
    banner.hidden = config.enabled !== true || !content;
    if (title) title.textContent = String(config.title || 'Thông báo Tông Môn');
    if (text) text.textContent = content;
  }

  function initHeaderOffset() {
    const header = document.getElementById('sticky-header');
    if (!header) return;
    const updateHeight = () => {
      document.documentElement.style.setProperty('--header-height', `${Math.ceil(header.getBoundingClientRect().height)}px`);
    };
    updateHeight();
    if ('ResizeObserver' in window) {
      new ResizeObserver(updateHeight).observe(header);
    } else {
      window.addEventListener('resize', updateHeight, { passive: true });
    }
  }

  function initPageAccessControls() {
    const loginButtons = [
      document.getElementById('tongmon-login-btn'),
      document.getElementById('admin-login-btn')
    ].filter(Boolean);
    loginButtons.forEach(button => button.addEventListener('click', () => openAuthModal()));
    syncPageAccess();
  }

  function closeProtectedFeatures() {
    ['time-capsule', 'ticket-station'].forEach(id => {
      const section = document.getElementById(id);
      if (section) {
        section.hidden = true;
        section.classList.remove('open');
      }
      document.querySelectorAll(`[data-utility-target="${id}"]`).forEach(button => {
        button.setAttribute('aria-expanded', 'false');
      });
    });
    const gameModal = document.getElementById('game-modal');
    if (gameModal && gameModal.classList.contains('active')) closeGameModal();
  }

  function setAdminStatus(message, isError = false) {
    const status = document.getElementById('auth-status');
    if (status) {
      status.textContent = message;
      status.classList.toggle('is-error', isError);
    }
    if (isAdminUser()) showAdminToast(message, isError);
  }

  function authErrorMessage(error, mode) {
    const message = String(error && error.message || '');
    const normalized = message.toLowerCase();
    if (/invalid login credentials|invalid credentials|email or password/.test(normalized)) {
      return 'Email hoặc mật khẩu không chính xác.';
    }
    if (/already registered|already exists|user already|email.*taken/.test(normalized)) {
      return 'Email này đã được đăng ký. Đạo hữu hãy đăng nhập nhé.';
    }
    if (/email not confirmed|email.*confirm/.test(normalized)) {
      return 'Email chưa được xác nhận. Vui lòng kiểm tra hộp thư trước khi đăng nhập.';
    }
    if (/password/.test(normalized) && /at least|minimum|short|weak|6 characters/.test(normalized)) {
      return 'Mật khẩu cần có ít nhất 6 ký tự.';
    }
    return `Không thể ${mode === 'signup' ? 'đăng ký' : 'đăng nhập'}: ${message || 'Đã xảy ra lỗi.'}`;
  }

  function normalizeAuthName(value) {
    return String(value || '')
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .replace(/đ/gi, 'd')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
  }

  function validateSignupName(value) {
    const name = String(value || '').trim().replace(/\s+/g, ' ');
    if (name.length < 2 || name.length > 25) return 'Đạo Hiệu phải dài từ 2 đến 25 ký tự.';
    if (!/^[\p{L}\p{N} ]+$/u.test(name)) return 'Đạo Hiệu chỉ được gồm chữ cái, chữ số và khoảng trắng.';
    const normalized = normalizeAuthName(name);
    if (/^\d+$/.test(normalized) || /^(.)\1+$/u.test(normalized.replace(/\s/g, ''))) {
      return 'Đạo Hiệu không được là chuỗi số hoặc lặp một ký tự.';
    }

    const forbiddenIdentities = ['admin', 'quantri', 'system', 'thanhchu'];
    const compactName = normalized.replace(/\s/g, '');
    if (forbiddenIdentities.some(term => compactName.includes(term))) {
      return 'Đạo Hiệu này dành riêng cho hệ thống hoặc Thành Chủ.';
    }

    const vulgarName = normalizeAuthName(name);
    const vulgarTerms = new Set([
      'fuck', 'fucking', 'shit', 'bitch', 'asshole', 'damn',
      'dit', 'du', 'lon', 'cac', 'deo', 'dm', 'dcm', 'vcl', 'vl'
    ]);
    if (vulgarName.split(/\s+/).some(word => vulgarTerms.has(word))) {
      return 'Đạo Hiệu có từ ngữ không phù hợp. Vui lòng chọn tên khác.';
    }
    return '';
  }

  function validateSignupEmail(value) {
    const email = String(value || '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return 'Email chưa đúng định dạng. Vui lòng kiểm tra lại.';
    }
    const [localPart, domain] = email.toLowerCase().split('@');
    if (/^(test|abc|123)(?:$|[.+_-])/.test(localPart) || /^\d+$/.test(localPart)) {
      return 'Email này trông giống địa chỉ thử nghiệm hoặc giả mạo.';
    }
    if (
      domain === 'example.com' ||
      domain === 'mailinator.com' ||
      domain.endsWith('.mailinator.com') ||
      domain.includes('tempmail')
    ) {
      return 'Vui lòng dùng email thật, không dùng dịch vụ email tạm.';
    }
    return '';
  }

  function setAdminToolStatus(id, message, isError = false) {
    const status = document.getElementById(id);
    if (status) {
      status.textContent = message;
      status.classList.toggle('is-error', isError);
    }
    if (isAdminUser()) showAdminToast(message, isError);
  }

  function showAdminToast(message, isError = false) {
    const text = String(message || '').trim();
    if (!text || /^đang /i.test(text)) return;
    let toast = document.getElementById('admin-action-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'admin-action-toast';
      toast.className = 'admin-action-toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
    }
    toast.textContent = isError
      ? `❌ Lỗi: ${text.replace(/^không thể[^:]*:\s*/i, '')}`
      : `✅ ${text}`;
    toast.classList.toggle('is-error', isError);
    toast.classList.add('is-visible');
    if (adminToastTimer) window.clearTimeout(adminToastTimer);
    adminToastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 4200);
  }

  function populateAdminCultivationForm(stageId) {
    const stage = state.data && state.data.stages.find(item => item.id === stageId);
    if (!stage) return;
    const override = state.cultivationOverrides[stageId] || {};
    const level = document.getElementById('admin-cultivation-level');
    const name = document.getElementById('admin-cultivation-name');
    const fate = document.getElementById('admin-cultivation-fate');
    const mainStatsContainer = document.getElementById('admin-cultivation-mainstats');
    const skills = document.getElementById('admin-cultivation-skills');
    if (level) level.value = override.level || (String(stage.level || '').match(/Lv\.\s*\d+/i) || [''])[0];
    if (name) name.value = override.levelName || getCultivationLevelName(stage).replace(/^.*?•\s*/, '');
    if (fate) fate.value = override.fate || getCultivationFate(stage.id);
    if (mainStatsContainer) {
      mainStatsContainer.innerHTML = getCultivationMainStats(stage).map((stat, index) => {
        const quality = getStatQuality(stat.quality, Number(stat.value) || 0).value;
        return `
          <div class="admin-attribute-row">
            <h6>${escapeHtml(stat.label || `Linh Căn ${index + 1}`)}</h6>
            <label for="admin-mainstat-name-${index}">Tên</label>
            <input id="admin-mainstat-name-${index}" type="text" maxlength="60" value="${escapeHtml(stat.label)}" required>
            <label for="admin-mainstat-value-${index}">Chỉ số (%)</label>
            <input id="admin-mainstat-value-${index}" type="number" min="0" max="100" step="1" value="${Math.max(0, Math.min(100, Number(stat.value) || 0))}" required>
            <label for="admin-mainstat-quality-${index}">Phẩm chất</label>
            <select id="admin-mainstat-quality-${index}" required>
              ${STAT_QUALITIES.map(item => `<option value="${item.value}" ${item.value === quality ? 'selected' : ''}>${item.label}</option>`).join('')}
            </select>
          </div>
        `;
      }).join('');
    }
    if (!skills) return;

    const stats = getCultivationSubStats(stage);
    skills.innerHTML = Array.from({ length: 4 }, (_, index) => {
      const stat = stats[index] || { label: `Linh Thạch ${index + 1}`, value: 0 };
      const percent = stat.percent == null
        ? Math.round((Number(stat.value) || 0) * 20)
        : Math.max(0, Math.min(100, Number(stat.percent) || 0));
      const quality = getStatQuality(stat.quality, percent).value;
      return `
        <div class="admin-skill-row">
          <h6>Thiên Phú Phụ ${index + 1}</h6>
          <label for="admin-skill-name-${index}">Tên</label>
          <input id="admin-skill-name-${index}" type="text" maxlength="60" value="${escapeHtml(stat.label)}" required>
          <label for="admin-skill-value-${index}">Số sao (0–5)</label>
          <input id="admin-skill-value-${index}" type="number" min="0" max="5" step="0.5" value="${escapeHtml(stat.value)}" required>
          <label for="admin-substat-percent-${index}">Chỉ số (%)</label>
          <input id="admin-substat-percent-${index}" type="number" min="0" max="100" step="1" value="${percent}" required>
          <label for="admin-substat-quality-${index}">Phẩm chất</label>
          <select id="admin-substat-quality-${index}" required>
            ${STAT_QUALITIES.map(item => `<option value="${item.value}" ${item.value === quality ? 'selected' : ''}>${item.label}</option>`).join('')}
          </select>
        </div>
      `;
    }).join('');
  }

  function activateAdminPanel(panelId, memoryPanelId = 'admin-panel-add-memory') {
    const tabs = Array.from(document.querySelectorAll('[data-admin-panel-target]'));
    const panels = Array.from(document.querySelectorAll('.admin-dashboard-panel'));
    if (!tabs.some(tab => tab.dataset.adminPanelTarget === panelId)) return;
    tabs.forEach(tab => {
      const selected = tab.dataset.adminPanelTarget === panelId;
      tab.classList.toggle('active', selected);
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    panels.forEach(panel => {
      panel.hidden = panel.id !== panelId;
    });
    const showMemory = panelId === 'admin-panel-memory';
    const addMemoryPanel = document.getElementById('admin-panel-add-memory');
    const manageMemoryPanel = document.getElementById('admin-panel-manage-memories');
    if (addMemoryPanel) addMemoryPanel.hidden = !showMemory || memoryPanelId !== 'admin-panel-add-memory';
    if (manageMemoryPanel) manageMemoryPanel.hidden = !showMemory || memoryPanelId !== 'admin-panel-manage-memories';
    document.querySelectorAll('.admin-memory-subtab').forEach(button => {
      const selected = button.dataset.memoryPanelTarget === memoryPanelId;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-selected', String(selected));
    });
    if (showMemory && memoryPanelId === 'admin-panel-manage-memories') {
      syncAdminVisitorCounterForm();
      void loadDeletedMemories();
    }
    if (panelId === 'admin-panel-attributes' && isAdminUser()) {
      void loadAdminCultivationProfiles();
    }
  }

  function activateAdminConfigPanel(panelId) {
    document.querySelectorAll('.admin-config-panel').forEach(panel => {
      panel.hidden = panel.id !== panelId;
    });
    document.querySelectorAll('[data-admin-config-target]').forEach(button => {
      const selected = button.dataset.adminConfigTarget === panelId;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-selected', String(selected));
    });
    if (panelId === 'admin-panel-attributes' && isAdminUser()) {
      void loadAdminCultivationProfiles();
    }
  }

  function initAdminWorkspace() {
    const configContainer = document.getElementById('admin-config-panels');
    if (configContainer) {
      ['admin-panel-features', 'admin-panel-theme', 'admin-panel-attributes'].forEach(id => {
        const panel = document.getElementById(id);
        if (panel) {
          panel.hidden = true;
          configContainer.appendChild(panel);
        }
      });
    }
    activateAdminConfigPanel('admin-panel-features');

    const announcement = state.siteSettings.announcement_config || {};
    const enabled = document.getElementById('admin-announcement-enabled');
    const text = document.getElementById('admin-announcement-text');
    if (enabled) enabled.checked = announcement.enabled === true;
    if (text) text.value = String(announcement.text || '');

    const announcementForm = document.getElementById('admin-announcement-form');
    if (announcementForm) {
      announcementForm.addEventListener('submit', async event => {
        event.preventDefault();
        const status = document.getElementById('admin-announcement-status');
        const saveButton = announcementForm.querySelector('button[type="submit"]');
        const next = {
          enabled: Boolean(enabled && enabled.checked),
          text: String(text && text.value || '').trim()
        };
        if (next.enabled && !next.text) {
          if (status) status.textContent = 'Hãy nhập nội dung trước khi bật dải thông báo.';
          return;
        }
        if (saveButton) saveButton.disabled = true;
        if (status) status.textContent = 'Đang lưu thông báo…';
        try {
          await saveSiteSetting('announcement_config', next);
          renderSiteAnnouncement();
          if (status) status.textContent = 'Đã lưu và áp dụng thông báo trên trang chủ.';
        } catch (error) {
          if (status) status.textContent = `Không thể lưu thông báo: ${error.message || 'Lỗi kết nối.'}`;
        } finally {
          if (saveButton) saveButton.disabled = false;
        }
      });
    }

    const memorySearch = document.getElementById('admin-memory-search');
    if (memorySearch) memorySearch.addEventListener('input', renderAdminMemoryList);
    const metricsRefresh = document.getElementById('admin-metrics-refresh');
    if (metricsRefresh) metricsRefresh.addEventListener('click', () => {
      adminDashboardRequest = null;
      void loadAdminDashboardData();
    });
    const backupButton = document.getElementById('admin-export-backup');
    if (backupButton) backupButton.addEventListener('click', () => void exportAdminBackup(backupButton));

    ['admin-guestbook-search', 'admin-comment-search', 'admin-game-search'].forEach(id => {
      const input = document.getElementById(id);
      if (input) input.addEventListener('input', () => {
        if (id === 'admin-guestbook-search') renderAdminGuestbookList();
        else if (id === 'admin-comment-search') renderAdminCommentsList();
        else renderAdminGameScores();
      });
    });
    const disciplesSearch = document.getElementById('admin-disciples-search');
    if (disciplesSearch) disciplesSearch.addEventListener('input', renderAdminDisciples);
    const sectTitles = document.createElement('datalist');
    sectTitles.id = 'admin-sect-title-options';
    ['Đại Trưởng Lão', 'Hộ Pháp', 'Chân Truyền Đệ Tử', 'Nội Môn Đệ Tử', 'Ngoại Môn Đệ Tử']
      .forEach(value => {
        const option = document.createElement('option');
        option.value = value;
        sectTitles.appendChild(option);
      });
    document.body.appendChild(sectTitles);
    const specialQuestionForm = document.getElementById('admin-special-question-form');
    if (specialQuestionForm) {
      specialQuestionForm.addEventListener('submit', event => {
        event.preventDefault();
        void addAdminSpecialQuestion(specialQuestionForm);
      });
    }
    const resetGameButton = document.getElementById('admin-reset-game-leaderboard');
    if (resetGameButton) resetGameButton.addEventListener('click', () => void resetDisciplesGameLeaderboard(resetGameButton));
    const dashboard = document.getElementById('admin-dashboard');
    if (dashboard) {
      dashboard.addEventListener('click', event => {
        const target = event.target instanceof Element ? event.target : null;
        const configTab = target && target.closest('[data-admin-config-target]');
        if (configTab) {
          activateAdminConfigPanel(configTab.dataset.adminConfigTarget);
          return;
        }
        const deleteButton = target && target.closest('[data-admin-delete-table]');
        if (deleteButton) void deleteAdminRecord(deleteButton);
        const discipleAction = target && target.closest('[data-disciple-action]');
        if (discipleAction) void handleAdminDiscipleAction(discipleAction);
        const specialDelete = target && target.closest('[data-special-question-delete]');
        if (specialDelete) void removeAdminSpecialQuestion(specialDelete.dataset.specialQuestionDelete);
      });
      dashboard.addEventListener('change', event => {
        const target = event.target instanceof HTMLInputElement ? event.target : null;
        if (target && target.matches('.admin-disciple-title-input')) void saveDiscipleTitle(target);
      });
    }
    initAdminMemoryPreview();
  }

  function initAdminMemoryPreview() {
    const fileInput = document.getElementById('admin-memory-image');
    const urlInput = document.getElementById('admin-memory-image-url');
    const preview = document.getElementById('admin-memory-image-preview');
    if (!preview) return;
    const revokePreviewUrl = () => {
      if (adminPreviewObjectUrl) URL.revokeObjectURL(adminPreviewObjectUrl);
      adminPreviewObjectUrl = '';
    };
    const displayUrl = value => {
      revokePreviewUrl();
      const url = String(value || '').trim();
      if (!url) {
        preview.removeAttribute('src');
        preview.hidden = true;
        return;
      }
      try {
        const parsed = new URL(url, window.location.href);
        if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('URL ảnh không hợp lệ.');
        preview.src = parsed.href;
        preview.hidden = false;
      } catch (error) {
        preview.removeAttribute('src');
        preview.hidden = true;
      }
    };
    if (fileInput) {
      fileInput.addEventListener('change', () => {
        revokePreviewUrl();
        const file = fileInput.files && fileInput.files[0];
        if (!file || !file.type.startsWith('image/')) {
          displayUrl(urlInput && urlInput.value);
          return;
        }
        adminPreviewObjectUrl = URL.createObjectURL(file);
        preview.src = adminPreviewObjectUrl;
        preview.hidden = false;
      });
    }
    if (urlInput) urlInput.addEventListener('input', () => {
      if (!(fileInput && fileInput.files && fileInput.files.length)) displayUrl(urlInput.value);
    });
    preview.addEventListener('error', () => {
      preview.hidden = true;
    });
  }

  async function loadAdminDashboardData() {
    if (!isAdminUser() || !supabaseClient || adminDashboardRequest) return adminDashboardRequest;
    adminDashboardRequest = (async () => {
      await Promise.all([renderAdminMetrics(), loadAdminReviewData(), loadAdminGameScoresData()]);
      await loadAdminDisciples();
      renderAdminSpecialQuestions();
    })();
    try {
      await adminDashboardRequest;
    } catch (error) {
      const status = document.getElementById('admin-review-status');
      if (status) status.textContent = `Không thể tải dữ liệu Nội Các: ${error.message || 'Lỗi kết nối Supabase.'}`;
    } finally {
      adminDashboardRequest = null;
    }
  }

  async function renderAdminMetrics() {
    const visitorMetric = document.getElementById('admin-metric-visitors');
    const memoryMetric = document.getElementById('admin-metric-memories');
    const guestbookMetric = document.getElementById('admin-metric-guestbook');
    const commentsMetric = document.getElementById('admin-metric-comments');
    if (!visitorMetric || !supabaseClient) return;
    const countMemories = () => (state.data && state.data.stages || [])
      .reduce((total, stage) => total + stage.memories.length, 0);
    visitorMetric.textContent = String(getVisitorCount(state.siteConfig.visitor_count) ?? state.visitor.count ?? 0);
    memoryMetric.textContent = String(countMemories());
    const [guestbookResult, commentsResult] = await Promise.all([
      supabaseClient.from('guestbook').select('message', { count: 'exact', head: true }),
      supabaseClient.from('milestone_comments').select('stage_id', { count: 'exact', head: true })
    ]);
    guestbookMetric.textContent = guestbookResult.error ? '—' : String(guestbookResult.count || 0);
    commentsMetric.textContent = commentsResult.error ? '—' : String(commentsResult.count || 0);
    const errors = [guestbookResult.error, commentsResult.error].filter(Boolean);
    const status = document.getElementById('admin-review-status');
    if (status && errors.length) {
      status.textContent = `Không tải đủ số liệu: ${errors.map(error => error.message || 'Lỗi truy vấn').join(' · ')}`;
    }
  }

  async function loadAdminReviewData() {
    const status = document.getElementById('admin-review-status');
    if (!supabaseClient || !isAdminUser()) return;
    if (status) status.textContent = 'Đang tải lưu bút và bình luận…';
    const [guestbookResult, commentsResult] = await Promise.all([
      supabaseClient.from('guestbook').select('*').order('unlock_date', { ascending: false }).limit(500),
      supabaseClient.from('milestone_comments').select('*').order('created_at', { ascending: false }).limit(500)
    ]);
    state.adminGuestbookRows = guestbookResult.error ? [] : guestbookResult.data || [];
    state.adminCommentRows = commentsResult.error ? [] : commentsResult.data || [];
    renderAdminGuestbookList();
    renderAdminCommentsList();
    const errors = [
      guestbookResult.error && `Lưu bút: ${guestbookResult.error.message || 'lỗi truy vấn'}`,
      commentsResult.error && `Bình luận: ${commentsResult.error.message || 'lỗi truy vấn'}`
    ].filter(Boolean);
    if (status) status.textContent = errors.length
      ? `Không tải được dữ liệu: ${errors.join(' · ')}`
      : `Đã tải ${state.adminGuestbookRows.length} lưu bút và ${state.adminCommentRows.length} bình luận.`;
  }

  function renderAdminGuestbookList() {
    const list = document.getElementById('admin-guestbook-list');
    if (!list) return;
    const query = String(document.getElementById('admin-guestbook-search')?.value || '').trim().toLocaleLowerCase('vi');
    const rows = (state.adminGuestbookRows || []).filter(row =>
      `${row.sender_name || ''} ${row.message || ''} ${row.unlock_date || ''} ${row.created_at || ''}`
        .toLocaleLowerCase('vi').includes(query));
    list.replaceChildren();
    appendAdminReviewRows(list, rows, row =>
      `${row.sender_name || 'Người bạn ẩn danh'} · ${row.unlock_date || row.created_at || ''}`,
      row => String(row.message || ''),
      'guestbook');
  }

  function renderAdminCommentsList() {
    const list = document.getElementById('admin-comment-list');
    if (!list) return;
    const query = String(document.getElementById('admin-comment-search')?.value || '').trim().toLocaleLowerCase('vi');
    const rows = (state.adminCommentRows || []).filter(row =>
      `${row.stage_id || ''} ${row.content || ''} ${row.created_at || ''} ${row.user_id || ''}`
        .toLocaleLowerCase('vi').includes(query));
    list.replaceChildren();
    appendAdminReviewRows(list, rows, row =>
      `Mốc ${row.stage_id || '—'} · ${row.created_at || ''}`,
      row => String(row.content || ''),
      'milestone_comments');
  }

  function appendAdminReviewRows(list, rows, titleFor, messageFor, table) {
    if (!rows.length) {
      const empty = document.createElement('p');
      empty.className = 'admin-memory-empty';
      empty.textContent = 'Không có nội dung phù hợp.';
      list.appendChild(empty);
      return;
    }
    rows.forEach(row => {
      const item = document.createElement('article');
      item.className = 'admin-review-item';
      const heading = document.createElement('strong');
      heading.textContent = titleFor(row);
      const content = document.createElement('p');
      content.textContent = messageFor(row);
      item.append(heading, content);
      if (row.id != null) {
        const remove = document.createElement('button');
        remove.type = 'button';
        remove.className = 'admin-delete-button';
        remove.dataset.adminDeleteTable = table;
        remove.dataset.adminDeleteId = String(row.id);
        remove.textContent = 'Xóa';
        item.appendChild(remove);
      }
      list.appendChild(item);
    });
  }

  async function loadAdminGameScoresData() {
    const status = document.getElementById('admin-game-status');
    if (!status || !supabaseClient || !isAdminUser()) return;
    status.textContent = 'Đang tải bảng Độ Kiếp…';
    const { data, error } = await supabaseClient.from('disciples')
      .select('user_id,email,full_name,quiz_best_score,quiz_max_combo,last_seen')
      .order('quiz_best_score', { ascending: false })
      .order('quiz_max_combo', { ascending: false })
      .limit(500);
    state.adminGameRows = error ? [] : data || [];
    renderAdminGameScores();
    status.textContent = error
      ? `Không tải được bảng Độ Kiếp: ${error.message || 'Lỗi truy vấn.'}`
      : `Đã tải ${state.adminGameRows.length} đạo hữu.`;
  }

  function renderAdminGameScores() {
    const list = document.getElementById('admin-game-score-list');
    if (!list) return;
    const query = String(document.getElementById('admin-game-search')?.value || '').trim().toLocaleLowerCase('vi');
    const rows = (state.adminGameRows || []).filter(row =>
      `${row.full_name || ''} ${row.email || ''} ${row.quiz_best_score || ''}`
        .toLocaleLowerCase('vi').includes(query));
    list.replaceChildren();
    rows.forEach((row, index) => {
      const item = document.createElement('article');
      item.className = 'admin-review-item';
      const heading = document.createElement('strong');
      heading.textContent = `${index + 1}. ${row.full_name || row.email || 'Đạo hữu'} · ${row.quiz_best_score || 0} điểm`;
      const content = document.createElement('p');
      content.textContent = `Combo dài nhất: ${row.quiz_max_combo || 0} · Lần cuối: ${row.last_seen || '—'} · ID: ${row.user_id || '—'}`;
      item.append(heading, content);
      list.appendChild(item);
    });
  }

  async function loadAdminDisciples() {
    const list = document.getElementById('admin-disciples-list');
    const status = document.getElementById('admin-disciples-status');
    if (!list || !status || !isAdminUser() || !supabaseClient) return;
    status.textContent = 'Đang tải sổ môn đồ…';
    const disciples = [];
    let offset = 0;
    try {
      while (true) {
        const { data, error } = await supabaseClient.from('disciples')
          .select('user_id,email,full_name,avatar_url,sect_title,is_banned,visit_count,last_seen,quiz_best_score,quiz_max_combo')
          .order('last_seen', { ascending: false })
          .range(offset, offset + 999);
        if (error) throw error;
        const batch = data || [];
        disciples.push(...batch);
        if (batch.length < 1000) break;
        offset += batch.length;
      }
    } catch (error) {
      state.adminDisciples = [];
      renderAdminDisciples();
      status.textContent = `Không tải được Sổ Môn Đồ: ${error.message || 'Lỗi truy vấn Supabase.'}`;
      renderAdminOnlinePresence();
      return;
    }
    state.adminDisciples = disciples;
    renderAdminDisciples();
    renderAdminOnlinePresence();
    status.textContent = `Đã tải ${state.adminDisciples.length} môn đồ.`;
  }

  function getMemberGuestbookCounts() {
    const counts = new Map();
    (state.adminGuestbookRows || []).forEach(entry => {
      const key = String(entry.user_id || '').trim();
      const fallback = String(entry.sender_name || '').trim().toLocaleLowerCase('vi');
      const member = state.adminDisciples.find(item =>
        key && String(item.user_id) === key ||
        fallback && [item.full_name, item.email].some(value =>
          String(value || '').trim().toLocaleLowerCase('vi') === fallback)
      );
      if (member) {
        const memberId = String(member.user_id);
        counts.set(memberId, (counts.get(memberId) || 0) + 1);
      }
    });
    return counts;
  }

  function renderAdminDisciples() {
    const list = document.getElementById('admin-disciples-list');
    if (!list) return;
    const query = String(document.getElementById('admin-disciples-search')?.value || '')
      .trim().toLocaleLowerCase('vi');
    const counts = getMemberGuestbookCounts();
    const rows = (state.adminDisciples || []).filter(member =>
      `${member.full_name || ''} ${member.email || ''} ${member.sect_title || ''}`
        .toLocaleLowerCase('vi').includes(query));
    list.replaceChildren();
    if (!rows.length) {
      const empty = document.createElement('p');
      empty.className = 'admin-memory-empty';
      empty.textContent = query ? 'Không tìm thấy môn đồ phù hợp.' : 'Chưa có đạo hữu trong Sổ Môn Đồ.';
      list.appendChild(empty);
      return;
    }
    rows.forEach(member => {
      const row = document.createElement('article');
      row.className = `admin-disciple-row${member.is_banned ? ' is-banned' : ''}`;
      const avatar = document.createElement('img');
      avatar.className = 'admin-disciple-avatar';
      avatar.alt = '';
      avatar.loading = 'lazy';
      avatar.decoding = 'async';
      avatar.src = /^https:\/\//i.test(String(member.avatar_url || ''))
        ? member.avatar_url
        : 'images/default-avatar.svg';
      avatar.addEventListener('error', () => { avatar.hidden = true; }, { once: true });

      const identity = document.createElement('div');
      identity.className = 'admin-disciple-identity';
      const name = document.createElement('strong');
      name.textContent = String(member.full_name || 'Đạo Hữu');
      const email = document.createElement('span');
      email.textContent = String(member.email || '');
      identity.append(name, email);

      const details = document.createElement('div');
      details.className = 'admin-disciple-details';
      const visits = document.createElement('span');
      visits.textContent = `Lượt ghé: ${Math.max(0, Number(member.visit_count) || 0)}`;
      const lastSeen = document.createElement('span');
      lastSeen.textContent = `Lần cuối: ${member.last_seen ? new Date(member.last_seen).toLocaleString('vi-VN') : '—'}`;
      const messages = document.createElement('span');
      messages.textContent = `Lời nhắn: ${counts.get(String(member.user_id)) || 0}`;
      details.append(visits, lastSeen, messages);

      const controls = document.createElement('div');
      controls.className = 'admin-disciple-controls';
      const title = document.createElement('input');
      title.type = 'text';
      title.className = 'admin-disciple-title-input';
      title.setAttribute('list', 'admin-sect-title-options');
      title.setAttribute('aria-label', `Cấp chức vụ của ${member.full_name || member.email || 'môn đồ'}`);
      title.dataset.userId = String(member.user_id);
      title.value = String(member.sect_title || 'Ngoại Môn Đệ Tử');
      title.maxLength = 60;
      const ban = document.createElement('button');
      ban.type = 'button';
      ban.className = member.is_banned ? 'admin-delete-button' : 'admin-secondary-button';
      ban.dataset.discipleAction = 'ban';
      ban.dataset.userId = String(member.user_id);
      ban.dataset.banned = String(Boolean(member.is_banned));
      ban.textContent = member.is_banned ? '🔓 Giải Ấn' : '🔒 Phong Ấn';
      controls.append(title, ban);
      row.append(avatar, identity, details, controls);
      list.appendChild(row);
    });
  }

  async function saveDiscipleTitle(input) {
    if (!isAdminUser() || !supabaseClient) return;
    const userId = input.dataset.userId;
    const title = input.value.trim().slice(0, 60);
    if (!userId || !title) {
      input.value = 'Ngoại Môn Đệ Tử';
      return;
    }
    input.disabled = true;
    try {
      const { data, error } = await supabaseClient.from('disciples')
        .update({ sect_title: title })
        .eq('user_id', userId)
        .select('user_id')
        .maybeSingle();
      if (error) throw error;
      if (!data) throw new Error('Không tìm thấy môn đồ hoặc tài khoản quản trị không có quyền cập nhật.');
      const member = state.adminDisciples.find(item => String(item.user_id) === userId);
      if (member) member.sect_title = title;
      updatePresence();
      renderAdminOnlinePresence();
      const status = document.getElementById('admin-disciples-status');
      if (status) status.textContent = `Đã cập nhật chức vụ: ${title}.`;
    } catch (error) {
      const status = document.getElementById('admin-disciples-status');
      if (status) status.textContent = `Không thể cập nhật chức vụ: ${error.message || 'Lỗi Supabase.'}`;
    } finally {
      input.disabled = false;
    }
  }

  async function handleAdminDiscipleAction(button) {
    if (!isAdminUser() || !supabaseClient) return;
    const userId = button.dataset.userId;
    const banned = button.dataset.banned !== 'true';
    if (!userId) return;
    button.disabled = true;
    try {
      const { data, error } = await supabaseClient.from('disciples')
        .update({ is_banned: banned })
        .eq('user_id', userId)
        .select('user_id')
        .maybeSingle();
      if (error) throw error;
      if (!data) throw new Error('Không tìm thấy môn đồ hoặc tài khoản quản trị không có quyền cập nhật.');
      const member = state.adminDisciples.find(item => String(item.user_id) === userId);
      if (member) member.is_banned = banned;
      renderAdminDisciples();
      renderAdminOnlinePresence();
      const status = document.getElementById('admin-disciples-status');
      if (status) status.textContent = banned ? 'Đã phong ấn tài khoản.' : 'Đã giải ấn tài khoản.';
    } catch (error) {
      const status = document.getElementById('admin-disciples-status');
      if (status) status.textContent = `Không thể cập nhật lệnh phong ấn: ${error.message || 'Lỗi Supabase.'}`;
      button.disabled = false;
    }
  }

  async function addAdminSpecialQuestion(form) {
    if (!isAdminUser()) return;
    const imageInput = document.getElementById('admin-special-question-image');
    const periodInput = document.getElementById('admin-special-question-period');
    const descriptionInput = document.getElementById('admin-special-question-description');
    const status = document.getElementById('admin-special-question-status');
    const imageUrl = String(imageInput && imageInput.value || '').trim();
    const period = String(periodInput && periodInput.value || '').trim();
    const description = String(descriptionInput && descriptionInput.value || '').trim();
    try {
      const parsed = new URL(imageUrl);
      if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('URL ảnh chỉ được dùng HTTP hoặc HTTPS.');
      if (!period || !description) throw new Error('Hãy nhập niên hiệu và gợi ý.');
      const questions = Array.isArray(state.siteSettings.quiz_special_questions)
        ? [...state.siteSettings.quiz_special_questions]
        : [];
      questions.push({
        id: `special-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        image_url: parsed.href,
        period,
        description
      });
      await saveSiteSetting('quiz_special_questions', questions);
      form.reset();
      renderAdminSpecialQuestions();
      status.textContent = 'Đã thêm câu hỏi đặc biệt vào bộ đề.';
    } catch (error) {
      if (status) status.textContent = `Không thể thêm câu hỏi: ${error.message || 'Lỗi lưu Supabase.'}`;
    }
  }

  function renderAdminSpecialQuestions() {
    const list = document.getElementById('admin-special-question-list');
    if (!list) return;
    list.replaceChildren();
    (Array.isArray(state.siteSettings.quiz_special_questions) ? state.siteSettings.quiz_special_questions : [])
      .forEach(question => {
      const row = document.createElement('article');
      row.className = 'admin-review-item';
      const title = document.createElement('strong');
      title.textContent = `${question.period || 'Giai đoạn'} · ${question.description || 'Câu hỏi đặc biệt'}`;
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'admin-delete-button';
      remove.dataset.specialQuestionDelete = String(question.id || '');
      remove.textContent = 'Xóa';
      row.append(title, remove);
      list.appendChild(row);
    });
  }

  async function removeAdminSpecialQuestion(questionId) {
    if (!questionId || !isAdminUser() || !window.confirm('Xóa câu hỏi đặc biệt này khỏi bộ đề?')) return;
    const questions = (state.siteSettings.quiz_special_questions || [])
      .filter(question => String(question.id) !== String(questionId));
    try {
      await saveSiteSetting('quiz_special_questions', questions);
      renderAdminSpecialQuestions();
      setAdminToolStatus('admin-special-question-status', 'Đã xóa câu hỏi đặc biệt.');
    } catch (error) {
      setAdminToolStatus('admin-special-question-status', `Không thể xóa câu hỏi: ${error.message || 'Lỗi cập nhật.'}`, true);
    }
  }

  async function resetDisciplesGameLeaderboard(button) {
    if (!isAdminUser() || !supabaseClient ||
        !window.confirm('Đặt lại toàn bộ điểm và combo trên Bảng Phong Thần?')) return;
    button.disabled = true;
    try {
      const { error } = await supabaseClient.from('disciples')
        .update({ quiz_best_score: 0, quiz_max_combo: 0 })
        .not('user_id', 'is', null);
      if (error) throw error;
      await Promise.all([loadGameLeaderboard(), loadAdminGameScoresData()]);
      setAdminToolStatus('admin-game-status', 'Đã đặt lại Bảng Phong Thần.');
    } catch (error) {
      setAdminToolStatus('admin-game-status', `Không thể đặt lại bảng xếp hạng: ${error.message || 'Lỗi cập nhật.'}`, true);
    } finally {
      button.disabled = false;
    }
  }

  async function deleteAdminRecord(button) {
    const table = button.dataset.adminDeleteTable;
    const id = button.dataset.adminDeleteId;
    if (!isAdminUser() || !supabaseClient || !['guestbook', 'milestone_comments'].includes(table) || !id) return;
    const label = table === 'guestbook' ? 'lưu bút' : 'bình luận';
    if (!window.confirm(`Xóa ${label} này khỏi Supabase? Thao tác không thể hoàn tác.`)) return;
    button.disabled = true;
    try {
      const { error } = await supabaseClient.from(table).delete().eq('id', id);
      if (error) throw error;
      adminDashboardRequest = null;
      await loadAdminDashboardData();
    } catch (error) {
      const status = document.getElementById('admin-review-status');
      if (status) status.textContent = `Không thể xóa ${label}: ${error.message || 'Lỗi cập nhật dữ liệu.'}`;
      button.disabled = false;
    }
  }

  async function exportAdminBackup(button) {
    const status = document.getElementById('admin-backup-status');
    if (!isAdminUser() || !supabaseClient) {
      if (status) status.textContent = 'Chỉ Tông Chủ đã xác thực mới được xuất dữ liệu.';
      return;
    }
    button.disabled = true;
    if (status) status.textContent = 'Đang lấy dữ liệu sao lưu…';
    const tables = ['site_config', 'site_settings', 'memories', 'guestbook', 'milestone_comments', 'leaderboard', 'disciples'];
    try {
      const results = await Promise.all(tables.map(async table => {
        const { data, error } = await supabaseClient.from(table).select('*');
        if (error) throw new Error(`${table}: ${error.message || 'Lỗi truy vấn.'}`);
        return [table, data || []];
      }));
      const backup = {
        exportedAt: new Date().toISOString(),
        site: SITE_NAME,
        data: Object.fromEntries(results)
      };
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `thien-menh-chi-thanh-backup-${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      if (status) status.textContent = 'Đã xuất tệp sao lưu JSON.';
    } catch (error) {
      if (status) status.textContent = `Không thể xuất sao lưu đầy đủ: ${error.message || 'Lỗi truy vấn.'}`;
    } finally {
      button.disabled = false;
    }
  }

  function syncAdminSettingsForm() {
    const visitorToggle = document.getElementById('admin-visitor-visible');
    if (visitorToggle) visitorToggle.checked = state.visitor.visible;
    const stageSelect = document.getElementById('admin-cultivation-stage');
    if (stageSelect) populateAdminCultivationForm(stageSelect.value);
    syncAdminGlobalSettingsForms();
    syncAdminVisitorCounterForm();
  }

  function syncAdminVisitorCounterForm() {
    const input = document.getElementById('admin-visitor-count');
    if (!input) return;
    const savedCount = getVisitorCount(state.siteConfig.visitor_count);
    input.value = String(savedCount ?? state.visitor.count ?? 0);
  }

  function initAdminSettingsControls() {
    if (!adminWorkspaceInitialized) {
      initAdminWorkspace();
      adminWorkspaceInitialized = true;
    }
    const dashboardTabs = Array.from(document.querySelectorAll('[data-admin-panel-target]'));
    const initialDashboardTab = dashboardTabs.find(tab => tab.getAttribute('aria-selected') === 'true') || dashboardTabs[0];
    if (initialDashboardTab) activateAdminPanel(initialDashboardTab.dataset.adminPanelTarget);
    document.addEventListener('click', event => {
      const clicked = event.target instanceof Element ? event.target.closest('button') : null;
      if (!clicked || !clicked.closest('#admin-dashboard')) return;
      const dashboardTab = clicked.closest('.admin-dashboard-tab[data-admin-panel-target]');
      if (dashboardTab) {
        const panelId = dashboardTab.dataset.adminPanelTarget;
        activateAdminPanel(panelId);
        if (panelId === 'admin-panel-reviews') void loadAdminReviewData();
        if (panelId === 'admin-panel-game') void loadAdminGameScoresData();
        if (panelId === 'admin-panel-disciples') void loadAdminDisciples();
        return;
      }
      const memoryTab = clicked.closest('.admin-memory-subtab[data-memory-panel-target]');
      if (memoryTab) {
        activateAdminPanel('admin-panel-memory', memoryTab.dataset.memoryPanelTarget);
        return;
      }
      const filterButton = clicked.closest('[data-admin-memory-filter]');
      if (filterButton) {
        const filter = filterButton.dataset.adminMemoryFilter;
        const hasStage = filter === 'all' || state.data.stages.some(stage => stage.id === filter);
        if (!hasStage) return;
        state.adminMemoryFilter = filter;
        renderAdminMemoryList();
        return;
      }
      const memoryButton = clicked.closest('#admin-memory-list [data-memory-action]');
      const restoreButton = clicked.closest('#admin-deleted-memory-list [data-memory-action="restore"]');
      if (restoreButton) {
        const deletedMemory = state.deletedMemories.find(item =>
          String(item.id) === restoreButton.dataset.memoryId
        );
        if (deletedMemory) void restoreDeletedMemory(deletedMemory, restoreButton);
        return;
      }
      if (memoryButton) {
        const stage = state.data.stages.find(item => item.id === memoryButton.dataset.stageId);
        const memory = stage && stage.memories.find(item =>
          String(item.id) === memoryButton.dataset.memoryId
        );
        if (!stage || !memory) return;
        switch (memoryButton.dataset.memoryAction) {
          case 'edit':
            editDynamicMemory(stage, memory);
            break;
          case 'up':
            void moveDynamicMemory(stage, memory, -1);
            break;
          case 'down':
            void moveDynamicMemory(stage, memory, 1);
            break;
          case 'hide-original':
            void hideOriginalMemory(stage, memory, memoryButton);
            break;
          case 'delete':
            void deleteDynamicMemory(stage, memory, memoryButton);
            break;
          default:
            break;
        }
      }
    });

    const visitorToggle = document.getElementById('admin-visitor-visible');
    if (visitorToggle) {
      document.addEventListener('change', async event => {
        if (event.target.id !== 'admin-visitor-visible') return;
        const currentToggle = event.target;
        if (!isAdminUser()) {
          currentToggle.checked = state.visitor.visible;
          setAdminToolStatus('admin-visitor-status', 'Chỉ Admin mới được đổi cài đặt này.', true);
          return;
        }
        const previousConfig = state.siteSettings.visitor_config || {};
        const nextConfig = { ...previousConfig, visible: currentToggle.checked };
        currentToggle.disabled = true;
        try {
          await saveSiteSetting('visitor_config', nextConfig);
          state.visitor.visible = nextConfig.visible;
          updateVisitorBadge();
          setAdminToolStatus('admin-visitor-status', nextConfig.visible
            ? 'Đã bật huy hiệu Đạo Hữu Lỡ Bước Nhập Môn.'
            : 'Đã ẩn huy hiệu Đạo Hữu Lỡ Bước Nhập Môn.');
        } catch (error) {
          currentToggle.checked = state.visitor.visible;
          setAdminToolStatus('admin-visitor-status', `Không thể lưu cài đặt: ${error.message || 'Lỗi kết nối.'}`, true);
        } finally {
          currentToggle.disabled = false;
        }
      });
    }

    const stageSelect = document.getElementById('admin-cultivation-stage');
    if (stageSelect) {
      document.addEventListener('change', event => {
        if (event.target.id === 'admin-cultivation-stage') {
          populateAdminCultivationForm(event.target.value);
        }
      });
    }

    if (document.getElementById('admin-cultivation-form')) {
      document.addEventListener('submit', async event => {
        if (event.target.id !== 'admin-cultivation-form') return;
        event.preventDefault();
        const cultivationForm = event.target;
        if (!isAdminUser()) {
          setAdminToolStatus('admin-cultivation-status', 'Chỉ Admin mới được sửa thuộc tính tu tiên.', true);
          return;
        }
        const stageId = stageSelect.value;
        const stage = state.data.stages.find(item => item.id === stageId);
        if (!stage) return;
        const subStats = Array.from({ length: 4 }, (_, index) => ({
          label: document.getElementById(`admin-skill-name-${index}`).value.trim(),
          value: Number(document.getElementById(`admin-skill-value-${index}`).value)
        }));
        const mainStats = getCultivationMainStats(stage).map((stat, index) => ({
          label: document.getElementById(`admin-mainstat-name-${index}`).value.trim(),
          value: Number(document.getElementById(`admin-mainstat-value-${index}`).value),
          quality: document.getElementById(`admin-mainstat-quality-${index}`).value
        }));
        const customSubStats = subStats.map((stat, index) => ({
          ...stat,
          percent: Number(document.getElementById(`admin-substat-percent-${index}`).value),
          quality: document.getElementById(`admin-substat-quality-${index}`).value
        }));
        const invalidMainStats = mainStats.some(stat =>
          !stat.label || !Number.isFinite(stat.value) || stat.value < 0 || stat.value > 100 ||
          !STAT_QUALITIES.some(quality => quality.value === stat.quality)
        );
        const invalidSubStats = customSubStats.some(stat =>
          !stat.label || !Number.isFinite(stat.value) || stat.value < 0 || stat.value > 5 ||
          !Number.isFinite(stat.percent) || stat.percent < 0 || stat.percent > 100 ||
          !STAT_QUALITIES.some(quality => quality.value === stat.quality)
        );
        if (invalidMainStats || invalidSubStats) {
          setAdminToolStatus('admin-cultivation-status', 'Hãy kiểm tra tên, chỉ số 0–100%, phẩm chất và số sao của các thuộc tính.', true);
          return;
        }

        const nextOverrides = {
          ...state.cultivationOverrides,
          [stageId]: {
            level: document.getElementById('admin-cultivation-level').value.trim(),
            levelName: document.getElementById('admin-cultivation-name').value.trim(),
            fate: document.getElementById('admin-cultivation-fate').value.trim(),
            subStats
          }
        };
        const nextCustomAttributes = {
          ...state.customAttributes,
          [stageId]: {
            ...(state.customAttributes[stageId] || {}),
            mainStats,
            subStats: customSubStats
          }
        };
        const submitButton = cultivationForm.querySelector('button[type="submit"]');
        if (submitButton) submitButton.disabled = true;
        setAdminToolStatus('admin-cultivation-status', 'Đang khắc ghi thuộc tính tu tiên…');
        try {
          const { error } = await supabaseClient.from('site_settings').upsert([
            { key: 'cultivation_overrides', value: nextOverrides },
            { key: 'custom_attributes', value: nextCustomAttributes }
          ], { onConflict: 'key' });
          if (error) throw error;
          state.siteSettings.cultivation_overrides = nextOverrides;
          state.siteSettings.custom_attributes = nextCustomAttributes;
          state.cultivationOverrides = normalizeCultivationOverrides(nextOverrides);
          state.customAttributes = normalizeCustomAttributes(nextCustomAttributes);
          refreshCultivationStageCards();
          setAdminToolStatus('admin-cultivation-status', 'Đã lưu và áp dụng thuộc tính cho giai đoạn này.');
        } catch (error) {
          setAdminToolStatus('admin-cultivation-status', `Không thể lưu thuộc tính: ${error.message || 'Lỗi kết nối.'}`, true);
        } finally {
          if (submitButton) submitButton.disabled = false;
        }
      });
    }

    initAdminGlobalControls();
    initAdminDecreeControls();
    initAdminUserCultivationControl();
    initAdminVisitorCounterControl();
  }

  function initAdminVisitorCounterControl() {
    const form = document.getElementById('admin-visitor-count-form');
    if (!form) return;
    document.addEventListener('submit', async event => {
      if (event.target.id !== 'admin-visitor-count-form') return;
      event.preventDefault();
      if (!isAdminUser()) {
        setAdminToolStatus('admin-visitor-status', 'Chỉ Tông Chủ mới được cập nhật bộ đếm đạo hữu.', true);
        return;
      }
      const input = document.getElementById('admin-visitor-count');
      const count = Number(input.value);
      if (!Number.isSafeInteger(count) || count < 0) {
        setAdminToolStatus('admin-visitor-status', 'Số đếm phải là số nguyên không âm.', true);
        input.focus();
        return;
      }
      const button = form.querySelector('button[type="submit"]');
      if (button) button.disabled = true;
      setAdminToolStatus('admin-visitor-status', 'Đang cập nhật bộ đếm đạo hữu…');
      try {
        await saveSiteConfig('visitor_count', count);
        state.visitor.count = count;
        updateVisitorBadge();
        setAdminToolStatus('admin-visitor-status', 'Đã cập nhật bộ đếm đạo hữu!');
      } catch (error) {
        setAdminToolStatus('admin-visitor-status', `Không thể cập nhật bộ đếm: ${error.message || 'Lỗi kết nối.'}`, true);
      } finally {
        if (button) button.disabled = false;
      }
    });
  }

  function initAdminGlobalControls() {
    document.addEventListener('change', async event => {
      const input = event.target instanceof Element
        ? event.target.closest('[data-feature-toggle]')
        : null;
      if (!input || !input.closest('#admin-dashboard')) return;
        const key = input.dataset.featureToggle;
        if (!Object.prototype.hasOwnProperty.call(DEFAULT_FEATURE_TOGGLES, key) || !isAdminUser()) {
          input.checked = state.featureToggles[key] !== false;
          setAdminToolStatus('admin-feature-status', 'Chỉ Tông Chủ mới được đổi công tắc toàn trang.', true);
          return;
        }

        const previous = state.featureToggles;
        const next = { ...previous, [key]: input.checked };
        const inputs = Array.from(document.querySelectorAll('[data-feature-toggle]'));
        inputs.forEach(item => {
          item.disabled = true;
        });
        state.featureToggles = next;
        applyFeatureToggles();
        if (key === 'autoPlayMusic' && input.checked) {
          void startConfiguredBackgroundMusic(true);
        } else if (key === 'autoPlayMusic') {
          state.bgMusic.autoplayAwaitingGesture = false;
          removeAutoplayGestureListeners();
        }
        renderCultivationCard();
        void loadCultivationLeaderboard();
        try {
          await saveSiteConfig('feature_toggles', next);
          renderFeaturedDecree();
          setAdminToolStatus('admin-feature-status', 'Đã lưu trạng thái hiển thị!');
        } catch (error) {
          state.featureToggles = previous;
          applyFeatureToggles();
          if (key === 'autoPlayMusic' && previous.autoPlayMusic === false) {
            state.bgMusic.autoplayAwaitingGesture = false;
            removeAutoplayGestureListeners();
          }
          renderCultivationCard();
          void loadCultivationLeaderboard();
          setAdminToolStatus('admin-feature-status', `Không thể lưu công tắc: ${error.message || 'Lỗi kết nối.'}`, true);
        } finally {
          inputs.forEach(item => {
            item.disabled = false;
          });
        }
    });

    if (document.getElementById('admin-theme-form')) {
      document.addEventListener('submit', async event => {
        if (event.target.id !== 'admin-theme-form') return;
        event.preventDefault();
        const themeForm = event.target;
        if (!isAdminUser()) {
          setAdminToolStatus('admin-theme-status', 'Chỉ Tông Chủ mới được đổi Cảnh Giới & Nền Trời.', true);
          return;
        }
        const next = normalizeThemeSettings({
          theme: document.getElementById('admin-global-theme').value,
          sky: document.getElementById('admin-global-sky').value
        });
        const button = themeForm.querySelector('button[type="submit"]');
        if (button) button.disabled = true;
        setAdminToolStatus('admin-theme-status', 'Đang truyền Cảnh Giới lên toàn tông môn…');
        try {
          await saveSiteConfig('theme_settings', next);
          applyGlobalThemeSettings(next);
          setAdminToolStatus('admin-theme-status', 'Đã lưu; nền mới sẽ hiển thị với mọi người khi mở trang.');
        } catch (error) {
          syncAdminGlobalSettingsForms();
          setAdminToolStatus('admin-theme-status', `Không thể lưu Cảnh Giới: ${error.message || 'Lỗi kết nối.'}`, true);
        } finally {
          if (button) button.disabled = false;
        }
      });
    }
  }

  function initAdminDecreeControls() {
    const form = document.getElementById('admin-decree-form');
    const cancelEditButton = document.getElementById('admin-decree-cancel-edit');
    if (cancelEditButton && form) {
      document.addEventListener('click', event => {
        const cancel = event.target instanceof Element
          ? event.target.closest('#admin-decree-cancel-edit')
          : null;
        if (!cancel) return;
        state.adminEditingDecreeId = null;
        form.reset();
        cancelEditButton.hidden = true;
        const submitButton = document.getElementById('admin-decree-submit');
        if (submitButton) submitButton.textContent = '⚡ Ban Bố Chiếu Thư';
        setAdminToolStatus('admin-decree-status', '');
      });
    }
    if (form) {
      document.addEventListener('submit', async event => {
        if (event.target.id !== 'admin-decree-form') return;
        event.preventDefault();
        if (!isAdminUser()) {
          setAdminToolStatus('admin-decree-status', 'Chỉ Tông Chủ mới được ban bố chiếu thư.', true);
          return;
        }
        const submitButton = document.getElementById('admin-decree-submit');
        const decree = {
          decree_type: document.getElementById('admin-decree-type').value,
          title: document.getElementById('admin-decree-title').value.trim(),
          content: document.getElementById('admin-decree-content').value.trim(),
          author_title: String(authenticatedUser.user_metadata && authenticatedUser.user_metadata.author_title || 'Hải Thành Lão Tổ'),
          is_pinned: document.getElementById('admin-decree-pinned').checked
        };
        if (!decree.title || !decree.content || !DECREE_TYPES[decree.decree_type]) return;
        if (submitButton) submitButton.disabled = true;
        setAdminToolStatus('admin-decree-status', state.adminEditingDecreeId
          ? 'Đang tu chỉnh chiếu thư…'
          : 'Đang truyền chiếu thư lên Tông Môn…');
        try {
          await saveTongChuDecree(decree, state.adminEditingDecreeId);
          const wasEditing = Boolean(state.adminEditingDecreeId);
          state.adminEditingDecreeId = null;
          form.reset();
          if (cancelEditButton) cancelEditButton.hidden = true;
          if (submitButton) submitButton.textContent = '⚡ Ban Bố Chiếu Thư';
          await loadTongChuDecrees({ throwOnError: true });
          setAdminToolStatus('admin-decree-status', wasEditing
            ? 'Chiếu thư đã được lưu thành công.'
            : 'Đã ban bố chiếu thư thành công!');
        } catch (error) {
          setAdminToolStatus('admin-decree-status', `Không thể ban bố chiếu thư: ${error.message || 'Lỗi kết nối.'}`, true);
        } finally {
          if (submitButton) submitButton.disabled = false;
        }
      });
    }

    document.addEventListener('click', async event => {
        const target = event.target instanceof Element
          ? event.target.closest('#admin-dashboard [data-decree-action]')
          : null;
        if (!target || !isAdminUser()) return;
        const decree = state.decrees.find(item => String(item.id) === target.dataset.decreeId);
        if (!decree) return;
        const action = target.dataset.decreeAction;
        if (action === 'edit') {
          state.adminEditingDecreeId = decree.id;
          document.getElementById('admin-decree-type').value = decree.decree_type || 'phap-chi';
          document.getElementById('admin-decree-title').value = String(decree.title || '');
          document.getElementById('admin-decree-content').value = String(decree.content || '');
          document.getElementById('admin-decree-pinned').checked = Boolean(decree.is_pinned);
          if (cancelEditButton) cancelEditButton.hidden = false;
          const submitButton = document.getElementById('admin-decree-submit');
          if (submitButton) submitButton.textContent = '💾 Lưu Chiếu Thư';
          activateAdminPanel('admin-panel-decrees');
          form.scrollIntoView({ behavior: 'smooth', block: 'center' });
          return;
        }
        if (action === 'delete' && !window.confirm(`Xóa chiếu thư “${decree.title}” khỏi Tông Môn?`)) return;
        target.disabled = true;
        try {
          const query = supabaseClient.from('tong_chu_decrees');
          const result = action === 'delete'
            ? await query.delete().eq('id', decree.id).select('id').maybeSingle()
            : await query.update({ is_pinned: !decree.is_pinned }).eq('id', decree.id).select('id').maybeSingle();
          if (result.error) throw result.error;
          if (!result.data) throw new Error('Không có chiếu thư nào được cập nhật; hãy kiểm tra quyền truy cập.');
          if (action === 'delete') {
            state.decrees = state.decrees.filter(item => String(item.id) !== String(decree.id));
            renderFeaturedDecree();
            renderAdminDecreeList();
          } else {
            decree.is_pinned = !decree.is_pinned;
          }
          await loadTongChuDecrees({ throwOnError: true });
          setAdminToolStatus('admin-decree-status', action === 'delete'
            ? 'Đã xóa chiếu thư.'
            : 'Đã cập nhật trạng thái ghim.');
        } catch (error) {
          setAdminToolStatus('admin-decree-status', `Không thể cập nhật chiếu thư: ${error.message || 'Lỗi kết nối.'}`, true);
        } finally {
          target.disabled = false;
        }
      });
  }

  async function saveTongChuDecree(decree, decreeId) {
    const table = supabaseClient.from('tong_chu_decrees');
    const write = payload => decreeId
      ? table.update(payload).eq('id', decreeId).select('id').maybeSingle()
      : table.insert(payload).select('id').maybeSingle();
    const { data, error } = await write(decree);
    if (!error) {
      if (!data) throw new Error('Không có chiếu thư nào được lưu; hãy kiểm tra quyền truy cập Supabase.');
      return;
    }
    const missingSupplementalColumn = ['title', 'author_title', 'decree_type']
      .some(column => isMissingDatabaseColumn(error, column));
    if (!missingSupplementalColumn) throw error;
    const fallbackResult = await write({
      content: decree.content,
      is_pinned: decree.is_pinned
    });
    if (fallbackResult.error) throw fallbackResult.error;
    if (!fallbackResult.data) throw new Error('Không có chiếu thư nào được lưu; hãy kiểm tra quyền truy cập Supabase.');
  }

  function initAdminUserCultivationControl() {
    const form = document.getElementById('admin-user-cultivation-form');
    if (!form) return;
    const refreshButton = document.getElementById('admin-cultivation-users-refresh');
    if (refreshButton) {
      document.addEventListener('click', event => {
        const button = event.target instanceof Element
          ? event.target.closest('#admin-cultivation-users-refresh')
          : null;
        if (button) void loadAdminCultivationProfiles();
      });
    }
    document.addEventListener('click', event => {
      const button = event.target instanceof Element
        ? event.target.closest('#admin-cultivation-users-list [data-user-email]')
        : null;
      if (!button) return;
      const emailInput = document.getElementById('admin-user-cultivation-id');
      const pointsInput = document.getElementById('admin-user-cultivation-points');
      if (!emailInput || !pointsInput) return;
      emailInput.value = button.dataset.userEmail;
      pointsInput.value = button.dataset.tuVi || '0';
      emailInput.focus();
    });
    document.addEventListener('submit', async event => {
      if (event.target.id !== 'admin-user-cultivation-form') return;
      event.preventDefault();
      if (!isAdminUser()) {
        setAdminToolStatus('admin-user-cultivation-status', 'Chỉ Tông Chủ mới được điều chỉnh Tu Vi.', true);
        return;
      }
      const email = document.getElementById('admin-user-cultivation-id').value.trim().toLowerCase();
      const emailPattern = email.replace(/[\\%_]/g, '\\$&');
      const points = Number(document.getElementById('admin-user-cultivation-points').value);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !Number.isSafeInteger(points) || points < 0) {
        setAdminToolStatus('admin-user-cultivation-status', 'Hãy nhập Gmail hợp lệ và số Tu Vi nguyên không âm.', true);
        return;
      }
      const userForm = event.target;
      const submitButton = userForm.querySelector('button[type="submit"]');
      if (submitButton) submitButton.disabled = true;
      setAdminToolStatus('admin-user-cultivation-status', 'Đang khắc ghi Tu Vi…');
      try {
        const { data: existing, error: fetchError } = await supabaseClient.from('user_cultivation')
          .select('*')
          .ilike('email', emailPattern)
          .maybeSingle();
        if (fetchError) throw fetchError;
        if (!existing || !existing.user_id) {
          throw new Error(`Không tìm thấy hồ sơ Tu Vi với Gmail ${email}.`);
        }
        const targetUser = {
          id: existing.user_id,
          email: existing.email || email,
          user_metadata: { display_name: existing.display_name || '' }
        };
        const nextProfile = buildCultivationPayload(targetUser, existing, {
          tu_vi: String(existing.user_id) === String(authenticatedUser.id) ? 9999 : points
        });
        await upsertCultivationProfile(nextProfile);
        if (String(existing.user_id) === String(authenticatedUser.id)) applyCultivationProfile(nextProfile);
        await loadCultivationLeaderboard();
        await loadAdminCultivationProfiles();
        setAdminToolStatus('admin-user-cultivation-status', 'Đã cập nhật Tu Vi và làm mới Bảng Vàng.');
      } catch (error) {
        setAdminToolStatus('admin-user-cultivation-status', `Không thể lưu Tu Vi: ${error.message || 'Lỗi kết nối.'}`, true);
      } finally {
        if (submitButton) submitButton.disabled = false;
      }
    });
  }

  async function loadAdminCultivationProfiles() {
    const list = document.getElementById('admin-cultivation-users-list');
    const refreshButton = document.getElementById('admin-cultivation-users-refresh');
    if (!list) return;
    if (!isAdminUser() || !supabaseClient) {
      setAdminToolStatus('admin-user-cultivation-status', 'Không thể tải hồ sơ: tài khoản Admin hoặc kết nối Supabase chưa sẵn sàng.', true);
      return;
    }
    if (refreshButton) refreshButton.disabled = true;
    list.textContent = 'Đang triệu hồi hồ sơ Tu Vi…';
    try {
      const { data, error } = await supabaseClient.from('user_cultivation')
        .select('*')
        .limit(100);
      if (error) throw error;
      const profiles = (data || []).sort((left, right) =>
        getCultivationPoints(right) - getCultivationPoints(left)
      );
      list.replaceChildren();
      if (!profiles.length) {
        list.textContent = 'Chưa có hồ sơ Tu Vi nào.';
        return;
      }
      profiles.forEach(profile => {
        const row = document.createElement('div');
        row.className = 'admin-cultivation-user-row';
        const identity = document.createElement('div');
        const name = document.createElement('strong');
        name.textContent = String(profile.display_name || 'Đạo Hữu');
        const email = document.createElement('span');
        email.className = 'admin-cultivation-user-email';
        email.textContent = String(profile.email || 'Chưa có Gmail đồng bộ');
        const streak = document.createElement('span');
        streak.className = 'admin-cultivation-user-streak';
        streak.textContent = `🔥 Chuỗi ${Math.max(0, Number(profile.streak_days) || 0)} ngày`;
        identity.append(name, email, streak);
        const points = document.createElement('span');
        points.className = 'admin-cultivation-user-points';
        const profileTuVi = getCultivationPoints(profile);
        points.textContent = `${profileTuVi} Tu Vi`;
        const editButton = document.createElement('button');
        editButton.type = 'button';
        editButton.className = 'admin-secondary-button';
        editButton.textContent = 'Chọn';
        if (profile.email) {
          editButton.dataset.userEmail = String(profile.email);
          editButton.dataset.tuVi = String(profileTuVi);
        } else {
          editButton.disabled = true;
          editButton.title = 'Đạo hữu cần đăng nhập lại để đồng bộ Gmail.';
        }
        row.append(identity, points, editButton);
        list.appendChild(row);
      });
    } catch (error) {
      console.error('Không thể tải danh sách Tu Vi cho Admin:', error);
      list.textContent = `Không thể tải danh sách Tu Vi: ${error.message || 'Lỗi truy vấn user_cultivation.'}`;
      setAdminToolStatus('admin-user-cultivation-status', `Không thể tải hồ sơ: ${error.message || 'Lỗi truy vấn user_cultivation.'}`, true);
    } finally {
      if (refreshButton) refreshButton.disabled = false;
    }
  }

  function initAuthPortal() {
    const modal = document.getElementById('auth-modal');
    const headerButton = document.getElementById('btn-header-auth');
    const loginForm = document.getElementById('auth-login-form');
    const signupForm = document.getElementById('auth-signup-form');
    if (!modal || !loginForm || !signupForm) return;

    renderAuthState(authenticatedUser);
    if (headerButton) {
      headerButton.addEventListener('click', () => {
        openAuthModal();
        const title = document.getElementById('auth-modal-title');
        if (title) title.textContent = 'Cổng Đạo Hữu';
      });
    }
    const cultivationBadge = document.getElementById('nav-cultivation-badge');
    if (cultivationBadge) {
      cultivationBadge.addEventListener('click', () => {
        openAuthModal(authenticatedUser ? '' : 'Đạo hữu đăng nhập để khai mở Động Phủ Tu Luyện nhé!');
        const title = document.getElementById('auth-modal-title');
        if (title) title.textContent = authenticatedUser ? 'Động Phủ Tu Luyện' : 'Cổng Đạo Hữu';
        if (authenticatedUser) {
          window.requestAnimationFrame(() => {
            document.getElementById('auth-cultivation-card')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          });
        }
      });
    }

    const closeButton = document.getElementById('auth-modal-close');
    const backdrop = document.getElementById('auth-modal-backdrop');
    if (closeButton) closeButton.addEventListener('click', () => closeAuthModal(true));
    if (backdrop) backdrop.addEventListener('click', () => closeAuthModal(true));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && modal.classList.contains('active')) closeAuthModal(true);
    });

    const loginTab = document.getElementById('auth-tab-login');
    const signupTab = document.getElementById('auth-tab-signup');
    if (loginTab) loginTab.addEventListener('click', () => setAuthMode('login'));
    if (signupTab) signupTab.addEventListener('click', () => setAuthMode('signup'));
    initAdminSettingsControls();

    const googleButton = document.getElementById('auth-google-sign-in');
    if (googleButton) {
      googleButton.addEventListener('click', async () => {
        if (!supabaseClient) {
          setAdminStatus('Dịch vụ tài khoản chưa sẵn sàng. Vui lòng kiểm tra kết nối mạng.', true);
          return;
        }
        googleButton.disabled = true;
        setAdminStatus('Đang mở cổng ghi danh Google…');
        try {
          const { error } = await supabaseClient.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: window.location.href }
          });
          if (error) throw error;
        } catch (error) {
          setAdminStatus(`Không thể đăng nhập bằng Google: ${error.message || 'Lỗi xác thực.'}`, true);
          googleButton.disabled = false;
        }
      });
    }

    loginForm.addEventListener('submit', async event => {
      event.preventDefault();
      if (!supabaseClient) {
        setAdminStatus('Dịch vụ tài khoản chưa sẵn sàng. Vui lòng kiểm tra kết nối mạng.', true);
        return;
      }

      const submitButton = loginForm.querySelector('button[type="submit"]');
      if (submitButton) submitButton.disabled = true;
      setAdminStatus('Đang xác thực Đạo Hữu…');
      try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
          email: document.getElementById('auth-login-email').value.trim(),
          password: document.getElementById('auth-login-password').value
        });
        if (error) throw error;
        setAuthenticatedUser(data.session && data.session.user);
        loginForm.reset();
        setAdminStatus('Đăng nhập thành công.');
      } catch (error) {
        setAdminStatus(authErrorMessage(error, 'login'), true);
      } finally {
        if (submitButton) submitButton.disabled = false;
      }
    });

    signupForm.addEventListener('submit', async event => {
      event.preventDefault();
      if (!supabaseClient) {
        setAdminStatus('Dịch vụ tài khoản chưa sẵn sàng. Vui lòng kiểm tra kết nối mạng.', true);
        return;
      }

      const nameInput = document.getElementById('auth-signup-name');
      const emailInput = document.getElementById('auth-signup-email');
      const name = nameInput.value.trim().replace(/\s+/g, ' ');
      const email = emailInput.value.trim();
      const password = document.getElementById('auth-signup-password').value;
      const nameError = validateSignupName(name);
      if (nameError) {
        setAdminStatus(nameError, true);
        nameInput.focus();
        return;
      }
      const emailError = validateSignupEmail(email);
      if (emailError || !emailInput.checkValidity()) {
        setAdminStatus(emailError || 'Email chưa đúng định dạng. Vui lòng kiểm tra lại.', true);
        emailInput.focus();
        return;
      }
      if (password.length < 6) {
        setAdminStatus('Mật khẩu cần có ít nhất 6 ký tự.', true);
        return;
      }

      const submitButton = signupForm.querySelector('button[type="submit"]');
      if (submitButton) submitButton.disabled = true;
      setAdminStatus('Đang lập danh tính Đạo Hữu…');
      try {
        const options = { data: { display_name: name } };
        const { data, error } = await supabaseClient.auth.signUp({ email, password, options });
        if (error) throw error;
        signupForm.reset();
        if (data.session && data.session.user) {
          setAuthenticatedUser(data.session.user);
          setAdminStatus('Đăng ký thành công.');
        } else {
          document.getElementById('auth-login-email').value = email;
          setAuthMode('login');
          setAdminStatus('Đăng ký thành công. Vui lòng xác nhận email để hoàn tất rồi đăng nhập.');
        }
      } catch (error) {
        setAdminStatus(authErrorMessage(error, 'signup'), true);
      } finally {
        if (submitButton) submitButton.disabled = false;
      }
    });

    const signOutButton = document.getElementById('auth-sign-out');
    if (signOutButton) {
      signOutButton.addEventListener('click', async () => {
        if (!supabaseClient) return;
        signOutButton.disabled = true;
        try {
          const { error } = await supabaseClient.auth.signOut();
          if (error) throw error;
          setAuthenticatedUser(null);
          activeAuthMode = 'login';
          renderAuthState(null);
          setAuthMode('login');
          setAdminStatus('Đã đăng xuất.');
        } catch (error) {
          setAdminStatus(`Không thể đăng xuất: ${error.message || 'Lỗi kết nối.'}`, true);
        } finally {
          signOutButton.disabled = false;
        }
      });
    }

    if (supabaseClient) {
      supabaseClient.auth.onAuthStateChange((_event, session) => {
        setAuthenticatedUser(session && session.user);
      });
      supabaseClient.auth.getSession()
        .then(({ data, error }) => {
          if (error) throw error;
          setAuthenticatedUser(data.session && data.session.user);
        })
        .catch(error => {
          console.warn('Không thể tải phiên Đạo Hữu:', error);
          if (modal.classList.contains('active')) {
            setAdminStatus(`Không thể kiểm tra phiên đăng nhập: ${error.message || 'Lỗi kết nối.'}`, true);
          }
        });
    }

    document.addEventListener('submit', async event => {
      if (event.target.id !== 'admin-memory-form') return;
      event.preventDefault();
      const currentForm = event.target;
      if (!isAdminUser()) {
        setAdminStatus('Chỉ chủ bảo tàng mới được đăng kỷ niệm.', true);
        return;
      }
      if (!supabaseClient) {
        setAdminStatus('Chưa thể kết nối dịch vụ lưu trữ. Vui lòng thử lại khi có mạng.', true);
        return;
      }

      const stageId = document.getElementById('admin-stage').value;
      const title = document.getElementById('admin-memory-title').value.trim();
      const time = document.getElementById('admin-memory-time').value.trim();
      const description = document.getElementById('admin-memory-description').value.trim();
      const type = document.getElementById('admin-memory-type').value === 'story' ? 'story' : 'photo';
      const imageUrlInput = document.getElementById('admin-memory-image-url');
      const enteredImageUrl = imageUrlInput.value.trim();
      const fileInput = document.getElementById('admin-memory-image');
      const file = fileInput.files && fileInput.files[0];
      const editing = state.adminEditingMemory;
      const submitButton = currentForm.querySelector('button[type="submit"]');
      const videoExtension = file && (file.type.startsWith('video/') || isVideoUrl(file.name))
        ? getVideoExtension(file)
        : '';
      const videoFile = Boolean(videoExtension);
      if (file && !file.type.startsWith('image/') && !videoFile) {
        setAdminStatus('Hãy chọn ảnh hoặc video MP4, WebM, MOV, OGV hợp lệ.', true);
        return;
      }
      if (enteredImageUrl) {
        try {
          const parsedUrl = new URL(enteredImageUrl);
          if (!['http:', 'https:'].includes(parsedUrl.protocol)) throw new Error('URL không an toàn.');
        } catch (error) {
          setAdminStatus('Link ảnh phải là URL HTTP hoặc HTTPS hợp lệ.', true);
          imageUrlInput.focus();
          return;
        }
      }
      if (type === 'photo' && !file && !enteredImageUrl &&
        !(editing && editing.memory.image && editing.memory.image[0])) {
        setAdminStatus('Ảnh Kỷ Niệm cần chọn file ảnh hoặc dán link URL.', true);
        return;
      }
      if (type === 'story' && !description) {
        setAdminStatus('Tâm Ma Bí Lục cần có nội dung mô tả.', true);
        return;
      }

      if (submitButton) submitButton.disabled = true;
      setAdminStatus(editing
        ? 'Đang cập nhật kỷ niệm…'
        : file ? videoFile ? 'Đang tải video và khai ấn kỷ niệm…' : 'Đang nén ảnh và khai ấn kỷ niệm…'
          : 'Đang lưu kỷ niệm…');
      let uploadedPath = '';
      let uploadedBucket = 'memories';
      let recordInserted = false;
      try {
        let publicUrl = editing && editing.memory.image && editing.memory.image[0]
          ? editing.memory.image[0]
          : enteredImageUrl;
        if (enteredImageUrl) publicUrl = enteredImageUrl;
        if (file) {
          const uploadedFile = videoFile ? file : await compressImage(file);
          const extension = videoFile ? videoExtension : 'jpg';
          const filePath = `${stageId}/${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${extension}`;
          const { data: uploaded, error: uploadError } = await supabaseClient.storage
            .from(uploadedBucket)
            .upload(filePath, uploadedFile, {
              contentType: videoFile ? getVideoContentType(file, extension) : 'image/jpeg',
              upsert: false
            });
          if (uploadError) throw uploadError;
          uploadedPath = uploaded.path;

          const { data: publicData } = supabaseClient.storage.from(uploadedBucket).getPublicUrl(uploadedPath);
          if (!publicData || !publicData.publicUrl) throw new Error('Không lấy được đường dẫn ảnh công khai.');
          publicUrl = publicData.publicUrl;
        }

        const targetStage = state.data.stages.find(item => item.id === stageId);
        if (!targetStage) throw new Error('Không tìm thấy giai đoạn đã chọn.');
        const existingCount = targetStage.memories.filter(item => item.isDynamic && item !== (editing && editing.memory)).length;
        const recordFields = {
          stage_id: stageId,
          year: stageId,
          type,
          title,
          caption: description,
          story: type === 'story' ? description : '',
          date_label: time,
          is_deleted: false,
          sort_order: existingCount * 10
        };
        const row = editing
          ? await updateDynamicMemoryRecord(editing.memory, recordFields, publicUrl)
          : await insertDynamicMemory(recordFields, publicUrl);
        recordInserted = true;
        const memory = mapDynamicMemory(row);
        if (!memory) throw new Error('Bản ghi đã lưu nhưng thiếu mã kỷ niệm hợp lệ.');
        if (editing) {
          const previousStage = editing.stage;
          previousStage.memories = previousStage.memories.filter(item => item !== editing.memory);
          targetStage.memories.push(memory);
          if (file && editing.memory.image && editing.memory.image[0]) {
            const oldImage = getMemoryStorageReference(editing.memory.image[0]);
            if (oldImage) {
              const { error: oldImageError } = await supabaseClient.storage.from(oldImage.bucket).remove([oldImage.path]);
              if (oldImageError) console.warn('Đã sửa kỷ niệm nhưng chưa dọn được ảnh cũ:', oldImageError);
            }
          }
          if (previousStage !== targetStage) refreshOpenArchive(previousStage);
        } else {
          targetStage.memories.push(memory);
        }
        targetStage.memories.sort((left, right) =>
          Number(Boolean(left.isDynamic)) - Number(Boolean(right.isDynamic)) ||
          (left.isDynamic && right.isDynamic ? left.sortOrder - right.sortOrder : 0)
        );
        updateStageMemoryCounts();
        let refreshError = null;
        try {
          await loadDynamicMemories({ throwOnError: true });
        } catch (error) {
          refreshError = error;
          console.warn('Đã lưu kỷ niệm nhưng không tải lại được danh sách:', error);
        }
        renderAdminMemoryList();
        refreshOpenArchive(targetStage);
        resetAdminMemoryForm();
        setAdminStatus(refreshError
          ? `Đã lưu kỷ niệm nhưng không tải lại được danh sách: ${refreshError.message || 'Lỗi truy vấn.'}`
          : editing ? 'Đã cập nhật kỷ niệm thành công.' : 'Đã thêm kỷ niệm mới!',
        Boolean(refreshError));
      } catch (error) {
        let cleanupMessage = '';
        if (uploadedPath && !recordInserted) {
          try {
            const { error: cleanupError } = await supabaseClient.storage
              .from(uploadedBucket)
              .remove([uploadedPath]);
            if (cleanupError) cleanupMessage = ' Không thể xóa ảnh đã tải lên dở dang.';
          } catch (cleanupError) {
            cleanupMessage = ' Không thể xóa ảnh đã tải lên dở dang.';
          }
        }
        setAdminStatus(`Không thể đăng kỷ niệm: ${error.message || 'Lỗi lưu trữ.'}${cleanupMessage}`, true);
      } finally {
        if (submitButton) submitButton.disabled = false;
      }
    });

    const cancelEditButton = document.getElementById('admin-memory-cancel-edit');
    if (cancelEditButton) {
      document.addEventListener('click', event => {
        const cancel = event.target instanceof Element
          ? event.target.closest('#admin-memory-cancel-edit')
          : null;
        if (!cancel) return;
        resetAdminMemoryForm();
        setAdminStatus('Đã hủy chỉnh sửa.');
      });
    }

    if (new URLSearchParams(window.location.search).get('admin') === '1') {
      openAuthModal();
    }
  }

  function initCultivationOracle() {
    const control = {
      button: document.getElementById('btn-draw-oracle-home'),
      quote: document.getElementById('home-oracle-quote'),
      status: document.getElementById('home-oracle-status'),
      card: document.getElementById('home-oracle-flip-card'),
      tube: document.getElementById('home-oracle-tube'),
      repeatNote: document.getElementById('home-oracle-repeat-note')
    };
    if (!control.button || !control.quote || !control.status) return;
    control.button.addEventListener('click', () => {
      void drawCultivationOracle(control);
    });
  }

  async function drawCultivationOracle(control) {
    const { button, quote: quoteElement, status, card, tube } = control;
    const user = authenticatedUser;
    const maxims = document.querySelector('.thien-co-maxims');
    if (maxims) maxims.scrollIntoView({ behavior: 'smooth', block: 'center' });
    if (!user) {
      openOracleAuthSeal();
      return;
    }
    const today = vietnamDateKey();
    const storageKey = `tmtc-daily-oracle-${user.id}`;
    let previousClaim = null;
    let storageAvailable = true;

    try {
      const savedClaim = window.localStorage.getItem(storageKey);
      if (savedClaim) {
        try {
          previousClaim = JSON.parse(savedClaim);
        } catch (error) {
          console.warn('Không thể đọc quẻ đã lưu:', error);
          window.localStorage.removeItem(storageKey);
        }
      }
    } catch (error) {
      storageAvailable = false;
      console.error('Không thể kiểm tra lượt rút quẻ hôm nay:', error);
    }

    const alreadyClaimed = storageAvailable && previousClaim &&
      previousClaim.date === today && previousClaim.quote;
    const quote = alreadyClaimed
      ? previousClaim.quote
      : CULTIVATION_MAXIMS[Math.floor(Math.random() * CULTIVATION_MAXIMS.length)];
    if (!alreadyClaimed && storageAvailable) {
      try {
        window.localStorage.setItem(storageKey, JSON.stringify({ date: today, quote }));
      } catch (error) {
        storageAvailable = false;
        console.error('Không thể lưu lượt rút quẻ hôm nay:', error);
      }
    }
    if (control.repeatNote) {
      control.repeatNote.hidden = true;
      control.repeatNote.textContent = '';
    }
    button.disabled = true;
    button.classList.add('is-drawing');
    if (tube) tube.classList.add('is-shaking');
    if (card) {
      card.classList.remove('is-revealed');
    }
    status.classList.remove('is-error');
    status.textContent = 'Ống xăm đang rung, thiên cơ sắp hiện…';

    const delay = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 0
      : 520;
    await new Promise(resolve => window.setTimeout(resolve, delay));

    quoteElement.textContent = `“${quote}”`;
    quoteElement.hidden = false;
    if (card) card.classList.add('is-revealed');
    if (tube) window.setTimeout(() => tube.classList.remove('is-shaking'), 180);

    try {
      if (alreadyClaimed) {
        status.textContent = 'Hôm nay đạo hữu đã rút quẻ rồi — mai quay lại xin thêm thiên cơ nhé.';
        if (control.repeatNote) {
          control.repeatNote.textContent = ORACLE_REPEAT_NOTES[
            Math.floor(Math.random() * ORACLE_REPEAT_NOTES.length)
          ];
          control.repeatNote.hidden = false;
        }
        return;
      }
      if (!storageAvailable) {
        status.textContent = 'Đã hiện lời răn, nhưng trình duyệt không lưu được lượt nhận thưởng hôm nay.';
        status.classList.add('is-error');
        return;
      }

      const isAdmin = isAdminUser(user);
      const awarded = isAdmin || await awardCultivation(5, 'Rút Quẻ Lời Răn Của Lão Tổ', {
        sourceElement: button
      });
      if (!awarded) {
        window.localStorage.removeItem(storageKey);
        status.textContent = 'Chưa thể ghi nhận phần thưởng Tu Vi. Đạo hữu thử rút lại sau nhé.';
        status.classList.add('is-error');
        return;
      }
      status.textContent = isAdmin
        ? 'Quẻ đã lưu; Tông Chủ Chí Tôn đã đạt mức Tu Vi tối đa.'
        : 'Đã nhận quẻ hôm nay và được cộng +5 Tu Vi.';
    } catch (error) {
      try {
        window.localStorage.removeItem(storageKey);
      } catch (storageError) {
        console.error('Không thể hoàn tác lượt rút quẻ:', storageError);
      }
      console.error('Không thể lưu lượt rút quẻ:', error);
      status.textContent = `Chưa thể lưu lượt rút quẻ: ${error.message || 'Lỗi lưu trữ trình duyệt.'}`;
      status.classList.add('is-error');
    } finally {
      button.disabled = false;
      button.classList.remove('is-drawing');
    }
  }

  function renderAdminMemoryList() {
    const list = document.getElementById('admin-memory-list');
    if (!list || !state.data) return;
    list.replaceChildren();
    const filter = state.adminMemoryFilter || 'all';
    const search = String(document.getElementById('admin-memory-search')?.value || '')
      .trim().toLocaleLowerCase('vi');
    document.querySelectorAll('[data-admin-memory-filter]').forEach(button => {
      const active = button.dataset.adminMemoryFilter === filter;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    const memories = state.data.stages
      .filter(stage => filter === 'all' || stage.id === filter)
      .flatMap(stage => {
      const dynamicMemories = stage.memories
        .filter(memory => memory.isDynamic)
        .sort((left, right) => left.sortOrder - right.sortOrder)
        .map((memory, index, stageMemories) => ({ stage, memory, index, stageMemories }));
      const originalMemories = (state.originalMemoriesByStage.get(stage.id) || [])
        .map(memory => ({ stage, memory, isOriginal: true }));
      return [...dynamicMemories, ...originalMemories];
    })
      .filter(({ stage, memory }) => !search ||
        `${stage.period} ${stage.title} ${memory.title} ${memory.time} ${memory.description || ''}`
          .toLocaleLowerCase('vi').includes(search));
    if (!memories.length) {
      const empty = document.createElement('p');
      empty.className = 'admin-memory-empty';
      empty.textContent = search
        ? 'Không tìm thấy ảnh hoặc kỷ niệm phù hợp.'
        : filter === 'all'
        ? 'Chưa có kỷ niệm nào trong kho lưu trữ.'
        : 'Giai đoạn này chưa có ảnh hoặc kỷ niệm.';
      list.appendChild(empty);
      return;
    }

    memories.forEach(({ stage, memory, index, stageMemories, isOriginal }) => {
      const item = document.createElement('div');
      item.className = 'admin-memory-item';
      const label = document.createElement('span');
      const isHidden = isOriginal && state.hiddenMemories.has(String(memory.id));
      label.textContent = `${stage.period} · ${isOriginal ? 'Ảnh gốc' : 'Kỷ niệm động'}${isHidden ? ' · Đã ẩn' : ''} · ${memory.title}`;
      const actions = document.createElement('div');
      actions.className = 'admin-memory-actions';
      if (!isOriginal) {
        const editButton = document.createElement('button');
        editButton.type = 'button';
        editButton.className = 'admin-secondary-button';
        editButton.dataset.memoryAction = 'edit';
        editButton.dataset.stageId = stage.id;
        editButton.dataset.memoryId = String(memory.id);
        editButton.textContent = 'Sửa';
        const moveUpButton = document.createElement('button');
        moveUpButton.type = 'button';
        moveUpButton.className = 'admin-secondary-button';
        moveUpButton.dataset.memoryAction = 'up';
        moveUpButton.dataset.stageId = stage.id;
        moveUpButton.dataset.memoryId = String(memory.id);
        moveUpButton.textContent = '↑';
        moveUpButton.setAttribute('aria-label', `Di chuyển ${memory.title} lên`);
        moveUpButton.disabled = index === 0;
        const moveDownButton = document.createElement('button');
        moveDownButton.type = 'button';
        moveDownButton.className = 'admin-secondary-button';
        moveDownButton.dataset.memoryAction = 'down';
        moveDownButton.dataset.stageId = stage.id;
        moveDownButton.dataset.memoryId = String(memory.id);
        moveDownButton.textContent = '↓';
        moveDownButton.setAttribute('aria-label', `Di chuyển ${memory.title} xuống`);
        moveDownButton.disabled = index === stageMemories.length - 1;
        actions.append(editButton, moveUpButton, moveDownButton);
      }
      const removeButton = document.createElement('button');
      removeButton.type = 'button';
      removeButton.className = 'admin-delete-button';
      removeButton.dataset.memoryAction = isOriginal ? 'hide-original' : 'delete';
      removeButton.dataset.stageId = stage.id;
      removeButton.dataset.memoryId = String(memory.id);
      removeButton.textContent = isOriginal ? '🗑️ Ẩn Ảnh / Kỷ Niệm Gốc' : '🗑️ Xóa Ảnh / Kỷ Niệm';
      actions.appendChild(removeButton);
      item.append(label, actions);
      list.appendChild(item);
    });
  }

  async function loadDeletedMemories() {
    const list = document.getElementById('admin-deleted-memory-list');
    if (!list) return false;
    if (!supabaseClient || !isAdminUser()) {
      state.deletedMemories = [];
      list.textContent = 'Không thể tải ảnh đã xóa: cần kết nối Supabase và đăng nhập Admin.';
      return false;
    }

    list.textContent = 'Đang tải ảnh/kỷ niệm đã xóa…';
    try {
      const { data, error } = await supabaseClient.from('memories')
        .select('*')
        .eq('is_deleted', true)
        .order('created_at', { ascending: false });
      if (error) throw error;
      state.deletedMemories = (data || []).filter(memory => memory.is_deleted === true);
      renderDeletedMemoryList();
      return true;
    } catch (error) {
      console.error('Không thể tải danh sách kỷ niệm đã xóa:', error);
      state.deletedMemories = [];
      list.textContent = `Không thể tải ảnh/kỷ niệm đã xóa: ${error.message || 'Lỗi truy vấn bảng memories.'}`;
      return false;
    }
  }

  function renderDeletedMemoryList() {
    const list = document.getElementById('admin-deleted-memory-list');
    if (!list) return;
    list.replaceChildren();
    if (!state.deletedMemories.length) {
      const empty = document.createElement('p');
      empty.className = 'admin-memory-empty';
      empty.textContent = 'Hiện không có ảnh nào đã xóa';
      list.appendChild(empty);
      return;
    }

    state.deletedMemories.forEach(row => {
      const item = document.createElement('article');
      item.className = 'admin-deleted-memory-item';
      const memory = mapDynamicMemory(row);
      const imageUrl = memory && memory.image[0];
      if (imageUrl && memory.mediaType !== 'video') {
        const thumbnail = document.createElement('img');
        thumbnail.src = imageUrl;
        thumbnail.alt = `Ảnh thu nhỏ: ${memory.title}`;
        thumbnail.loading = 'lazy';
        item.appendChild(thumbnail);
      } else {
        const placeholder = document.createElement('span');
        placeholder.className = 'admin-deleted-memory-thumbnail-placeholder';
        placeholder.textContent = memory && memory.mediaType === 'video' ? 'Video' : 'Ký ức';
        item.appendChild(placeholder);
      }

      const details = document.createElement('div');
      details.className = 'admin-deleted-memory-details';
      const title = document.createElement('strong');
      title.textContent = String(row.title || 'Kỷ niệm đã xóa');
      const stage = findStageForMemoryRow(row);
      const period = stage ? stage.period : String(row.stage_id || row.year || 'Chưa rõ giai đoạn');
      const year = document.createElement('span');
      year.textContent = `${period} · ${String(row.date_label || row.time || '')}`.trim();
      details.append(title, year);

      const restoreButton = document.createElement('button');
      restoreButton.type = 'button';
      restoreButton.className = 'admin-secondary-button';
      restoreButton.dataset.memoryAction = 'restore';
      restoreButton.dataset.memoryId = String(row.id);
      restoreButton.textContent = '♻️ Khôi Phục';
      item.append(details, restoreButton);
      list.appendChild(item);
    });
  }

  async function restoreDeletedMemory(row, button) {
    if (!isAdminUser() || !supabaseClient) {
      setAdminStatus('Chỉ Admin mới được khôi phục kỷ niệm.', true);
      return;
    }
    const stage = findStageForMemoryRow(row);
    if (!stage) {
      setAdminStatus('Không thể khôi phục: không tìm thấy giai đoạn của kỷ niệm.', true);
      return;
    }
    button.disabled = true;
    setAdminStatus('Đang khôi phục ảnh/kỷ niệm…');
    try {
      const { data: restoredRow, error } = await supabaseClient.from('memories')
        .update({ is_deleted: false })
        .eq('id', row.id)
        .select('id')
        .maybeSingle();
      if (error) throw error;
      if (!restoredRow) throw new Error('Không tìm thấy bản ghi hoặc không có quyền khôi phục.');

      const restoredMemory = mapDynamicMemory({ ...row, is_deleted: false });
      if (restoredMemory && !stage.memories.some(memory => String(memory.dbId) === String(row.id))) {
        stage.memories.push(restoredMemory);
        stage.memories.sort((left, right) =>
          Number(Boolean(left.isDynamic)) - Number(Boolean(right.isDynamic)) ||
          (left.isDynamic && right.isDynamic ? left.sortOrder - right.sortOrder : 0)
        );
      }
      state.deletedMemories = state.deletedMemories.filter(item => String(item.id) !== String(row.id));
      updateStageMemoryCounts();
      renderAdminMemoryList();
      renderDeletedMemoryList();
      refreshOpenArchive(stage);

      let refreshError = null;
      try {
        await loadDynamicMemories({ throwOnError: true });
        if (!await loadDeletedMemories()) {
          throw new Error('Không tải lại được danh sách ảnh đã xóa.');
        }
      } catch (error) {
        refreshError = error;
        console.warn('Đã khôi phục kỷ niệm nhưng không tải lại được danh sách:', error);
      }
      setAdminStatus(refreshError
        ? `Đã khôi phục ảnh thành công nhưng không tải lại được danh sách: ${refreshError.message || 'Lỗi truy vấn.'}`
        : 'Đã khôi phục ảnh thành công!', Boolean(refreshError));
    } catch (error) {
      setAdminStatus(`Không thể khôi phục ảnh/kỷ niệm: ${error.message || 'Lỗi cập nhật dữ liệu.'}`, true);
      button.disabled = false;
    }
  }

  async function hideOriginalMemory(stage, memory, button) {
    if (!isAdminUser() || !supabaseClient) {
      setAdminStatus('Chỉ chủ bảo tàng mới được ẩn kỷ niệm gốc.', true);
      return;
    }
    if (state.hiddenMemories.has(String(memory.id))) {
      setAdminStatus('Kỷ niệm này đã được ẩn khỏi trang.');
      return;
    }
    if (!window.confirm(`Ẩn vĩnh viễn ảnh/kỷ niệm “${memory.title}” khỏi trang?`)) return;
    button.disabled = true;
    setAdminStatus('Đang ẩn kỷ niệm gốc…');
    const nextHidden = [...state.hiddenMemories, String(memory.id)];
    try {
      await saveSiteSetting('hidden_memories', nextHidden);
      state.hiddenMemories = new Set(nextHidden);
      applyHiddenMemories();
      renderStages();
      if (state.currentStageForModal) refreshOpenArchive(state.currentStageForModal);
      renderAdminMemoryList();
      setAdminStatus('Đã ẩn ảnh/kỷ niệm gốc khỏi trang.');
    } catch (error) {
      button.disabled = false;
      setAdminStatus(`Không thể ẩn kỷ niệm: ${error.message || 'Lỗi kết nối.'}`, true);
    }
  }

  function editDynamicMemory(stage, memory) {
    const form = document.getElementById('admin-memory-form');
    const title = document.getElementById('admin-memory-form-title');
    const stageInput = document.getElementById('admin-stage');
    const imageInput = document.getElementById('admin-memory-image');
    const submitButton = document.getElementById('admin-memory-submit');
    const cancelButton = document.getElementById('admin-memory-cancel-edit');
    if (!form || !stageInput || !imageInput) return;
    activateAdminPanel('admin-panel-memory', 'admin-panel-add-memory');
    state.adminEditingMemory = { stage, memory };
    stageInput.value = stage.id;
    document.getElementById('admin-memory-title').value = memory.title;
    document.getElementById('admin-memory-time').value = memory.time;
    document.getElementById('admin-memory-description').value = memory.description;
    document.getElementById('admin-memory-type').value = memory.type || (memory.tag === 'Tâm sự' ? 'story' : 'photo');
    document.getElementById('admin-memory-image-url').value = memory.image && memory.image[0] || '';
    imageInput.value = '';
    document.getElementById('admin-memory-image-url').dispatchEvent(new Event('input', { bubbles: true }));
    imageInput.required = false;
    if (title) title.textContent = 'Sửa Kỷ Niệm';
    if (submitButton) submitButton.textContent = 'Lưu thay đổi';
    if (cancelButton) cancelButton.hidden = false;
    form.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function resetAdminMemoryForm() {
    const form = document.getElementById('admin-memory-form');
    const imageInput = document.getElementById('admin-memory-image');
    const title = document.getElementById('admin-memory-form-title');
    const submitButton = document.getElementById('admin-memory-submit');
    const cancelButton = document.getElementById('admin-memory-cancel-edit');
    if (form) form.reset();
    if (imageInput) imageInput.required = false;
    if (adminPreviewObjectUrl) URL.revokeObjectURL(adminPreviewObjectUrl);
    adminPreviewObjectUrl = '';
    const preview = document.getElementById('admin-memory-image-preview');
    if (preview) {
      preview.removeAttribute('src');
      preview.hidden = true;
    }
    if (title) title.textContent = 'Thêm Kỷ Niệm Mới';
    if (submitButton) submitButton.textContent = '💾 Lưu Kỷ Niệm';
    if (cancelButton) cancelButton.hidden = true;
    state.adminEditingMemory = null;
  }

  async function moveDynamicMemory(stage, memory, direction) {
    if (!isAdminUser() || !supabaseClient || memory.dbId == null) return;
    const sorted = stage.memories.filter(item => item.isDynamic)
      .sort((left, right) => left.sortOrder - right.sortOrder);
    const index = sorted.indexOf(memory);
    const other = sorted[index + direction];
    if (!other || other.dbId == null) return;
    const firstOrder = index * 10;
    const secondOrder = (index + direction) * 10;
    setAdminStatus('Đang sắp xếp kỷ niệm…');
    try {
      const updates = await Promise.all([
        supabaseClient.from('memories').update({ sort_order: secondOrder }).eq('id', memory.dbId),
        supabaseClient.from('memories').update({ sort_order: firstOrder }).eq('id', other.dbId)
      ]);
      const failed = updates.find(result => result.error);
      if (failed) throw failed.error;
      memory.sortOrder = secondOrder;
      other.sortOrder = firstOrder;
      stage.memories.sort((left, right) =>
        Number(Boolean(left.isDynamic)) - Number(Boolean(right.isDynamic)) ||
        (left.isDynamic && right.isDynamic ? left.sortOrder - right.sortOrder : 0)
      );
      updateStageMemoryCounts();
      refreshOpenArchive(stage);
      renderAdminMemoryList();
      setAdminStatus('Đã cập nhật thứ tự kỷ niệm.');
    } catch (error) {
      console.error('Không thể sắp xếp kỷ niệm:', error);
      setAdminStatus(`Không thể sắp xếp kỷ niệm: ${error.message || 'Lỗi kết nối.'}`, true);
      void loadDynamicMemories();
    }
  }

  async function deleteDynamicMemory(stage, memory, button) {
    if (!isAdminUser() || !supabaseClient || memory.dbId == null) {
      setAdminStatus('Chỉ chủ bảo tàng mới được xóa kỷ niệm.', true);
      return;
    }
    if (!window.confirm(`Chuyển kỷ niệm “${memory.title}” vào danh sách đã xóa?`)) return;
    button.disabled = true;
    setAdminStatus('Đang chuyển kỷ niệm vào danh sách đã xóa…');

    try {
      const { data: deletedRow, error } = await supabaseClient.from('memories')
        .update({ is_deleted: true })
        .eq('id', memory.dbId)
        .select('id')
        .maybeSingle();
      if (error) throw error;
      if (!deletedRow) throw new Error('Không tìm thấy bản ghi hoặc không có quyền xóa mềm.');
      stage.memories = stage.memories.filter(item => item !== memory);
      updateStageMemoryCounts();
      renderAdminMemoryList();
      refreshOpenArchive(stage);
      if (!await loadDeletedMemories()) {
        setAdminStatus('Đã xóa mềm kỷ niệm nhưng không tải được danh sách khôi phục.', true);
        return;
      }
      setAdminStatus('Đã chuyển kỷ niệm vào danh sách đã xóa.');
    } catch (error) {
      button.disabled = false;
      setAdminStatus(`Không thể xóa kỷ niệm: ${error.message || 'Lỗi kết nối.'}`, true);
    }
  }

  function getMemoryStorageReference(imageUrl) {
    if (typeof imageUrl !== 'string') return null;
    try {
      const pathname = new URL(imageUrl).pathname;
      for (const bucket of ['memories', 'museum-images']) {
        const marker = `/storage/v1/object/public/${bucket}/`;
        const index = pathname.indexOf(marker);
        if (index >= 0) {
          return {
            bucket,
            path: decodeURIComponent(pathname.slice(index + marker.length))
          };
        }
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  async function insertDynamicMemory(fields, publicUrl) {
    let includeSortOrder = true;
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const payload = { ...fields, image_url: publicUrl };
      if (!includeSortOrder) delete payload.sort_order;
      const result = await supabaseClient.from('memories').insert(payload).select().single();
      if (!result.error) return result.data;
      if (includeSortOrder && isMissingDatabaseColumn(result.error, 'sort_order')) {
        includeSortOrder = false;
        continue;
      }
      throw result.error;
    }
    throw new Error('Không thể tạo bản ghi kỷ niệm sau khi tương thích cấu trúc dữ liệu.');
  }

  async function updateDynamicMemoryRecord(memory, fields, publicUrl) {
    let includeSortOrder = true;
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const payload = { ...fields, image_url: publicUrl };
      if (!includeSortOrder) delete payload.sort_order;
      const result = await supabaseClient.from('memories')
        .update(payload)
        .eq('id', memory.dbId)
        .select()
        .single();
      if (!result.error) return result.data;
      if (includeSortOrder && isMissingDatabaseColumn(result.error, 'sort_order')) {
        includeSortOrder = false;
        continue;
      }
      throw result.error;
    }
    throw new Error('Không thể cập nhật bản ghi kỷ niệm.');
  }

  function isMissingDatabaseColumn(error, column) {
    const message = `${error.message || ''} ${error.details || ''}`.toLowerCase();
    return message.includes(column) && /column|schema cache|does not exist|not found/.test(message);
  }

  function compressImage(file) {
    return new Promise((resolve, reject) => {
      const objectUrl = URL.createObjectURL(file);
      const image = new Image();
      image.onload = () => {
        const scale = Math.min(1, 1200 / image.naturalWidth);
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
        canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
        const context = canvas.getContext('2d');
        if (!context) {
          URL.revokeObjectURL(objectUrl);
          reject(new Error('Trình duyệt không hỗ trợ nén ảnh.'));
          return;
        }
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(blob => {
          URL.revokeObjectURL(objectUrl);
          if (blob) resolve(blob);
          else reject(new Error('Không thể chuyển ảnh sang JPEG.'));
        }, 'image/jpeg', 0.8);
      };
      image.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Không thể đọc ảnh đã chọn.'));
      };
      image.src = objectUrl;
    });
  }

  function initCultivationBackground() {
    const background = document.getElementById('cultivation-bg');
    if (!background) return;

    let updateScheduled = false;
    const updateJourneyProgress = () => {
      if (updateScheduled) return;
      updateScheduled = true;
      window.requestAnimationFrame(() => {
        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollableHeight > 0
          ? Math.min(1, Math.max(0, window.scrollY / scrollableHeight))
          : 0;
        background.style.setProperty('--meridian-progress', `${progress * 100}%`);
        background.classList.toggle('is-tribulation', progress >= 0.76);
        updateScheduled = false;
      });
    };

    updateJourneyProgress();
    window.addEventListener('scroll', updateJourneyProgress, { passive: true });
    window.addEventListener('resize', updateJourneyProgress, { passive: true });
  }

  function initXianxiaCanvas() {
    const canvas = document.getElementById('xianxia-canvas');
    if (!canvas || typeof canvas.getContext !== 'function') return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobile = () => window.innerWidth < 768;
    const stars = Array.from({ length: mobile() ? 90 : 190 }, () => ({
      x: Math.random(),
      y: Math.random(),
      radius: Math.random() * 1.35 + 0.25,
      phase: Math.random() * Math.PI * 2,
      color: Math.random() > 0.78 ? '#f5d98b' : Math.random() > 0.55 ? '#8de8d4' : '#e8f5f2'
    }));
    const motes = Array.from({ length: mobile() ? 18 : 38 }, () => ({
      x: Math.random(),
      y: Math.random(),
      speed: Math.random() * 0.018 + 0.006,
      sway: Math.random() * 0.025 + 0.006,
      phase: Math.random() * Math.PI * 2,
      radius: Math.random() * 1.8 + 0.7,
      jade: Math.random() > 0.5
    }));
    const leaves = Array.from({ length: mobile() ? 8 : 13 }, () => ({
      x: Math.random(),
      y: Math.random(),
      speed: Math.random() * 0.035 + 0.012,
      sway: Math.random() * 0.035 + 0.01,
      phase: Math.random() * Math.PI * 2,
      size: Math.random() * 5 + 4
    }));
    const flyers = [
      { period: 42, offset: 0.08, trail: [] },
      { period: 57, offset: 0.58, trail: [] }
    ];
    let width = 0;
    let height = 0;
    let frameId = 0;
    let lastFrameTime = 0;
    let resizeTimer = 0;
    let animationPaused = false;
    let meteor = null;
    let nextMeteorAt = 6;
    const startedAt = performance.now();

    const resize = () => {
      if (mobile() && motes.length > 25) motes.length = 25;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      draw(reducedMotion ? 0 : (performance.now() - startedAt) / 1000);
    };

    const drawCultivator = (x, y, angle, scale) => {
      context.save();
      context.translate(x, y);
      context.rotate(angle);
      context.scale(scale, scale);
      context.fillStyle = 'rgba(7, 18, 19, 0.82)';
      context.strokeStyle = 'rgba(173, 235, 213, 0.64)';
      context.lineWidth = 0.8;
      context.beginPath();
      context.moveTo(-2, -3);
      context.quadraticCurveTo(-7, 1, -8, 8);
      context.quadraticCurveTo(-3, 7, 0, 4);
      context.quadraticCurveTo(5, 9, 9, 8);
      context.quadraticCurveTo(7, 1, 2, -3);
      context.closePath();
      context.fill();
      context.stroke();
      context.beginPath();
      context.arc(0, -6, 2.2, 0, Math.PI * 2);
      context.fill();
      context.beginPath();
      context.moveTo(-2, -8);
      context.quadraticCurveTo(0, -13, 5, -9);
      context.stroke();
      context.restore();
    };

    function draw(seconds) {
      context.clearRect(0, 0, width, height);
      context.save();
      context.globalCompositeOperation = 'lighter';

      stars.forEach(star => {
        const opacity = 0.28 + (Math.sin(seconds * 1.3 + star.phase) + 1) * 0.3;
        context.globalAlpha = opacity;
        context.fillStyle = star.color;
        context.beginPath();
        context.arc(star.x * width, star.y * height * 0.78, star.radius, 0, Math.PI * 2);
        context.fill();
      });

      motes.forEach(mote => {
        const progress = ((mote.y - seconds * mote.speed + 1) % 1 + 1) % 1;
        const x = (mote.x + Math.sin(seconds * 0.55 + mote.phase) * mote.sway + 1) % 1;
        const y = progress * height;
        const glow = context.createRadialGradient(x * width, y, 0, x * width, y, mote.radius * 5);
        glow.addColorStop(0, mote.jade ? 'rgba(111, 255, 207, 0.8)' : 'rgba(255, 213, 120, 0.8)');
        glow.addColorStop(1, 'rgba(255, 255, 255, 0)');
        context.globalAlpha = 0.35 + (Math.sin(seconds * 2 + mote.phase) + 1) * 0.25;
        context.fillStyle = glow;
        context.beginPath();
        context.arc(x * width, y, mote.radius * 5, 0, Math.PI * 2);
        context.fill();
      });

      flyers.forEach((flyer, index) => {
        const progress = ((seconds / flyer.period + flyer.offset) % 1);
        if (typeof flyer.lastProgress === 'number' && progress < flyer.lastProgress) {
          flyer.trail.length = 0;
        }
        flyer.lastProgress = progress;
        const x = width * (0.08 + progress * 0.84);
        const y = height * (0.29 + Math.sin(progress * Math.PI * 2 + index) * 0.12);
        const angle = Math.atan2(Math.cos(progress * Math.PI * 2 + index) * 0.12 * height, width * 0.84);
        flyer.trail.push({ x, y });
        if (flyer.trail.length > 22) flyer.trail.shift();

        if (flyer.trail.length > 1) {
          context.beginPath();
          flyer.trail.forEach((point, pointIndex) => {
            if (pointIndex === 0) context.moveTo(point.x, point.y);
            else context.lineTo(point.x, point.y);
          });
          const trail = context.createLinearGradient(flyer.trail[0].x, flyer.trail[0].y, x, y);
          trail.addColorStop(0, 'rgba(45, 212, 191, 0)');
          trail.addColorStop(1, 'rgba(186, 255, 228, 0.55)');
          context.globalAlpha = 0.55;
          context.strokeStyle = trail;
          context.lineWidth = index === 0 ? 2 : 1.2;
          context.shadowBlur = 12;
          context.shadowColor = '#55e6c1';
          context.stroke();
          context.shadowBlur = 0;
        }

        context.save();
        context.translate(x, y);
        context.rotate(angle);
        context.globalAlpha = 0.82;
        context.shadowBlur = 12;
        context.shadowColor = '#86ffe0';
        context.fillStyle = index === 0 ? '#d5fff1' : '#f6d88c';
        context.beginPath();
        context.moveTo(-15, 0);
        context.lineTo(9, -1.6);
        context.lineTo(17, 0);
        context.lineTo(9, 1.6);
        context.lineTo(-15, 0);
        context.fill();
        context.restore();
        if (index === 0) drawCultivator(x - 1, y - 9, angle, 0.9);
      });

      leaves.forEach(leaf => {
        const progress = (leaf.y + seconds * leaf.speed) % 1;
        const x = (leaf.x + Math.sin(seconds * 0.4 + leaf.phase) * leaf.sway + 1) % 1;
        const y = progress * height;
        context.save();
        context.translate(x * width, y);
        context.rotate(Math.sin(seconds * 0.5 + leaf.phase) * 0.65 + 0.4);
        context.globalAlpha = 0.38;
        context.fillStyle = 'rgba(112, 190, 130, 0.8)';
        context.beginPath();
        context.ellipse(0, 0, leaf.size, leaf.size * 0.24, 0, 0, Math.PI * 2);
        context.fill();
        context.restore();
      });

      if (!reducedMotion && seconds > nextMeteorAt) {
        meteor = { x: Math.random() * width * 0.7, y: Math.random() * height * 0.36, age: 0 };
        nextMeteorAt = seconds + 7 + Math.random() * 10;
      }
      if (meteor) {
        meteor.age += 1 / 60;
        context.globalAlpha = Math.max(0, 1 - meteor.age / 0.8);
        context.strokeStyle = 'rgba(224, 255, 241, 0.9)';
        context.lineWidth = 1.5;
        context.shadowBlur = 12;
        context.shadowColor = '#a8ffe1';
        context.beginPath();
        context.moveTo(meteor.x + meteor.age * 180, meteor.y + meteor.age * 90);
        context.lineTo(meteor.x + meteor.age * 180 - 48, meteor.y + meteor.age * 90 - 24);
        context.stroke();
        if (meteor.age >= 0.8) meteor = null;
      }
      context.restore();
    }

    const animate = now => {
      if (mobile() && now - lastFrameTime < 1000 / 30) {
        frameId = window.requestAnimationFrame(animate);
        return;
      }
      lastFrameTime = now;
      draw((now - startedAt) / 1000);
      frameId = window.requestAnimationFrame(animate);
    };
    const start = () => {
      if (reducedMotion || document.hidden || animationPaused || frameId) return;
      frameId = window.requestAnimationFrame(animate);
    };
    const stop = () => {
      if (!frameId) return;
      window.cancelAnimationFrame(frameId);
      frameId = 0;
    };
    pauseXianxiaAnimation = paused => {
      animationPaused = paused;
      if (paused) stop();
      else start();
    };
    const scheduleResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 150);
    };

    resize();
    start();
    window.addEventListener('resize', scheduleResize, { passive: true });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stop();
      else start();
    });
  }

  // ========================================================
  // 2. HERO SECTION SETUP
  // ========================================================
  function initModalNavbarSync() {
    const modalSelectors = [
      '#lightbox-modal.active',
      '#filmstrip-modal.active',
      '#game-modal.active',
      '#cinema-modal.active',
      '#authSealModal.active',
      '.feature-modal.active'
    ];

    function syncModalNavbar() {
      const hasOpenModal = modalSelectors.some(selector => document.querySelector(selector)) ||
        Boolean(document.querySelector('.admin-modal.active'));
      document.body.classList.toggle('modal-open', hasOpenModal);
      if (pauseCanvasAnimation) pauseCanvasAnimation(hasOpenModal);
      if (pauseXianxiaAnimation) pauseXianxiaAnimation(hasOpenModal);

      const nav = document.getElementById('sticky-header');
      if (nav) nav.style.display = hasOpenModal ? 'none' : '';
    }

    syncModalNavbar();
    const filmstripBody = document.querySelector('.filmstrip-grid-body');
    if (filmstripBody) {
      filmstripBody.addEventListener('scroll', () => {
        if (filmstripBody.scrollTop + filmstripBody.clientHeight >= filmstripBody.scrollHeight - 360 &&
            state.archive.renderedCount < state.archive.memories.length) {
          appendFilmstripBatch();
        }
      }, { passive: true });
    }

    if ('MutationObserver' in window) {
      const observer = new MutationObserver(syncModalNavbar);
      observer.observe(document.body, {
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'aria-hidden']
      });
    }
  }

  function initHeroSection() {
    const siteInfo = state.data?.siteInfo;
    if (!siteInfo) return;

    const heroTitle = document.getElementById('hero-title');
    const heroIntro = document.getElementById('hero-intro');
    if (heroTitle) {
      const [firstWord, ...remainingWords] = SITE_NAME.split(' ');
      heroTitle.innerHTML = `${firstWord} <span class="text-gradient">${remainingWords.join(' ')}</span>`;
    }
    if (heroIntro) heroIntro.textContent = HERO_INTRO;

    document.querySelectorAll('[data-invite-friends]').forEach(inviteButton => {
      inviteButton.addEventListener('click', async () => {
        if (!navigator.clipboard || typeof navigator.clipboard.writeText !== 'function') {
          showCultivationToast('Trình duyệt chưa hỗ trợ sao chép. Hãy mở trang bằng HTTPS rồi thử lại.', '⚠️');
          return;
        }

        try {
          await navigator.clipboard.writeText(INVITE_MESSAGE);
          showCultivationToast('Đã sao chép thiệp mời! Mau gửi cho đồng đạo cùng độ kiếp!', '📜');
        } catch (error) {
          console.warn('Không thể sao chép thiệp mời:', error);
          showCultivationToast('Chưa thể sao chép thiệp mời. Hãy kiểm tra quyền clipboard của trình duyệt.', '⚠️');
        }
      });
    });

    const zaloLink = document.getElementById('footer-zalo-link');
    if (zaloLink) {
      zaloLink.addEventListener('click', async () => {
        try {
          if (!navigator.clipboard || typeof navigator.clipboard.writeText !== 'function') {
            throw new Error('Trình duyệt chưa hỗ trợ sao chép.');
          }
          await navigator.clipboard.writeText('0988305473');
          showCultivationToast('Đã sao chép số Zalo 0988305473 vào linh phù!', '💬');
        } catch (error) {
          console.warn('Không thể sao chép số Zalo:', error);
          showCultivationToast('Chưa thể sao chép số Zalo. Đạo hữu có thể sao chép thủ công: 0988305473.', '⚠️');
        }
      });
    }

    const genesisImg = document.getElementById('genesis-img');
    if (genesisImg) {
      genesisImg.src = GENESIS_IMAGE;
      genesisImg.alt = 'Tông Chủ Hải Thành của Thiên Mệnh Chi Thành';
    }

    const genesisTitle = document.getElementById('genesis-title');
    const genesisDescription = document.getElementById('genesis-description');
    if (genesisTitle) genesisTitle.textContent = 'Hải Thành Lão Tổ • Đệ Nhất Gõ Phím';
    if (genesisDescription) genesisDescription.textContent = GENESIS_PREFACE;

    const genesisCard = document.getElementById('genesis-card');
    const btnFlipBack = document.getElementById('btn-flip-back');
    const btnOpenInfo = document.getElementById('btn-open-genesis-info');

    if (genesisCard) {
      genesisCard.addEventListener('click', function (e) {
        if (e.target?.id === 'btn-flip-back') return;
        genesisCard.classList.toggle('flipped');
      });

      genesisCard.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          genesisCard.classList.toggle('flipped');
        }
      });
    }

    if (btnFlipBack && genesisCard) {
      btnFlipBack.addEventListener('click', function (e) {
        e.stopPropagation();
        genesisCard.classList.remove('flipped');
      });
    }

    if (btnOpenInfo && genesisCard) {
      btnOpenInfo.addEventListener('click', function () {
        genesisCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => genesisCard.classList.add('flipped'), 400);
      });
    }
  }

  // ========================================================
  // 3. STICKY TOP NAV & SCROLL SPY
  // ========================================================
  function initStickyNav() {
    const navBar = document.getElementById('nav-chapters-bar');
    if (!navBar) return;
    navBar.innerHTML = '';

    state.data.stages.forEach(stage => {
      const chip = document.createElement('a');
      chip.className = 'nav-chip';
      chip.href = `#stage-${stage.id}`;
      chip.dataset.stageId = stage.id;
      chip.textContent = stage.period;
      navBar.appendChild(chip);
    });

    // Scroll Progress & Active Chapter Tracking
    const scrollLine = document.getElementById('scroll-progress');
    const navChips = navBar.querySelectorAll('.nav-chip');

    const updateScrollProgress = () => {
      if (window.innerWidth <= 768) return;
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      if (scrollLine) scrollLine.style.width = `${progress}%`;
    };

    const activeSections = new Map();
    const updateActiveChapter = () => {
      if (window.innerWidth <= 768) return;
      const current = [...activeSections.entries()]
        .sort((left, right) => Math.abs(left[1]) - Math.abs(right[1]))[0];
      const currentSectionId = current ? current[0] : '';
      navChips.forEach(chip => {
        if (chip.dataset.stageId === currentSectionId) {
          chip.classList.add('active');
        } else {
          chip.classList.remove('active');
        }
      });
    };

    if ('IntersectionObserver' in window) {
      const stageObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          const stageId = entry.target.id.replace('stage-', '');
          if (entry.isIntersecting) activeSections.set(stageId, entry.boundingClientRect.top - 120);
          else activeSections.delete(stageId);
        });
        updateActiveChapter();
      }, { rootMargin: '-120px 0px -70% 0px', threshold: 0 });
      document.querySelectorAll('.stage-section').forEach(section => stageObserver.observe(section));
    }

    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    window.addEventListener('resize', updateScrollProgress, { passive: true });
  }

  // ========================================================
  // 4. RENDER STAGES, RPG CARDS, MUSIC PLAYERS & HIGHLIGHTS
  // ========================================================
  function renderStages() {
    const container = document.getElementById('stages-container');
    if (!container) return;
    renderHomeCultivationAttributes();
    try {
      container.innerHTML = '';

      if (!state.data || !Array.isArray(state.data.stages) || state.data.stages.length === 0) {
        console.warn('Không có dữ liệu giai đoạn để render.');
        return;
      }

      state.data.stages.forEach((stage, index) => {
        if (!stage) return;
        const section = document.createElement('section');
      section.className = 'stage-section';
      section.id = `stage-${stage.id}`;

      const presentation = getStagePresentation(stage, index, state.data.stages.length);
      const cultivationEyebrow = presentation.eyebrow
        .replace('KIẾP NẠN THỨ ', 'KIẾP NẠN ')
        .replace(/(\d+) \/ (\d+)/, '$1/$2')
        .replace(' • THUỞ KHAI LINH', '');
      section.setAttribute('aria-label', `${presentation.eyebrow} • ${presentation.title}`);
      const cultivationExpanded = state.cultivationCardExpansion.get(stage.id) === true;
      const cultivationDetailsId = `rpg-details-${stage.id}`;

      let html = `
        <div class="container">
          <div class="stage-top-grid">
            <div class="rpg-card rpg-card-collapsible${cultivationExpanded ? ' is-expanded' : ''}" data-cultivation-stage-id="${escapeHtml(stage.id)}">
              <button type="button" class="rpg-collapsed-summary" aria-expanded="${cultivationExpanded}" aria-hidden="${cultivationExpanded}" aria-controls="${escapeHtml(cultivationDetailsId)}" ${cultivationExpanded ? 'inert' : ''}>
                <span class="rpg-collapsed-header">
                  <span class="stage-index-tag">✦ ${escapeHtml(cultivationEyebrow)}</span>
                  <span class="rpg-toggle-label" aria-hidden="true">✧ Khai Mở ▾</span>
                </span>
                <span class="rpg-collapsed-content">
                  <span class="rpg-avatar rpg-summary-avatar" data-stage-id="${escapeHtml(stage.id)}">
                    <img src="${escapeHtml(stage.coverImage)}" alt="${escapeHtml(stage.title)}" loading="lazy" decoding="async">
                    <span class="rpg-avatar-lv">${escapeHtml(getCultivationLevel(stage))}</span>
                  </span>
                  <span class="rpg-summary-copy">
                    <span class="rpg-summary-title">${escapeHtml(presentation.title)}</span>
                    <span class="rpg-level-name">☯ ${escapeHtml(getCultivationLevelName(stage))}</span>
                    <span class="rpg-summary-hint">✧ Chạm để khai mở Mệnh Cách &amp; chỉ số căn cốt</span>
                  </span>
                </span>
              </button>

              <div class="rpg-expanded-panel" id="${escapeHtml(cultivationDetailsId)}" aria-hidden="${!cultivationExpanded}" ${cultivationExpanded ? '' : 'inert'}>
                <button type="button" class="rpg-expanded-summary" aria-expanded="${cultivationExpanded}" aria-hidden="${!cultivationExpanded}" aria-controls="${escapeHtml(cultivationDetailsId)}">
                  <span class="rpg-expanded-topline">
                    <span class="rpg-expanded-eyebrow">✦ ${escapeHtml(cultivationEyebrow)}</span>
                    <span class="rpg-toggle-label" aria-hidden="true">✧ Thu Gọn ▴</span>
                  </span>
                  <span class="rpg-avatar rpg-expanded-avatar" data-stage-id="${escapeHtml(stage.id)}">
                    <img src="${escapeHtml(stage.coverImage)}" alt="${escapeHtml(stage.title)}" loading="lazy" decoding="async">
                    <span class="rpg-avatar-lv">${escapeHtml(getCultivationLevel(stage))}</span>
                  </span>
                  <span class="rpg-expanded-title">
                    <span class="stage-main-title">${escapeHtml(presentation.title)}</span>
                    <span class="rpg-level-name">☯ ${escapeHtml(getCultivationLevelName(stage))}</span>
                  </span>
                </button>

                <div class="rpg-expanded-body">
                  <div class="rpg-fate-badge">🔮 Mệnh Cách: ${escapeHtml(getCultivationFate(stage.id))}</div>
                  <div class="rpg-stats-container">
                <div class="rpg-stat-col">
                  <div class="rpg-stat-col-title">
                    <span>❖ LINH CĂN &amp; CĂN CỐT CHÍNH</span>
                  </div>
                  <div class="stat-bar-group">
      `;

      html += renderMainStatsMarkup(stage);

      html += `
                  </div>
                </div>

                <!-- Secondary Stats (Gold Stars) -->
                <div class="rpg-stat-col">
                  <div class="rpg-stat-col-title">
                    <span>◈ THIÊN PHÚ &amp; HUYẾT MẠCH PHỤ</span>
                  </div>
                  <div class="rpg-substats-grid">
      `;

      html += renderSubStatsMarkup(stage);

      html += `
                  </div>
                </div>
                </div>
                    <button type="button" class="rpg-toggle-label rpg-collapse-trigger" aria-expanded="${cultivationExpanded}" aria-controls="${escapeHtml(cultivationDetailsId)}">
                      ✧ Thu Gọn Bảng Thuộc Tính ▴
                    </button>
                </div>
              </div>
            </div>

            <!-- Mini Vinyl Music Player -->
            <div class="music-player-card" data-stage-id="${stage.id}">
              <div class="player-header">
                <span class="player-badge">🎵 NHẠC CHỦ ĐỀ GIAI ĐOẠN</span>
                <span class="player-status-dot" id="dot-${stage.id}"></span>
              </div>

              <div class="player-body">
                <div class="vinyl-container">
                  <div class="vinyl-disc" id="vinyl-${stage.id}">
                    <div class="vinyl-center">
                      <div class="vinyl-hole"></div>
                    </div>
                  </div>
                </div>

                <div class="player-info">
                  <div class="track-label">Đang phát</div>
                  <div class="track-title" title="${stage.themeSong.title}">${stage.themeSong.title || 'Giai điệu hoài niệm'}</div>
                  
                  <div class="player-controls-row">
                    <button class="play-toggle-btn" id="play-btn-${stage.id}" aria-label="Phát nhạc">
                      <span class="play-icon">▶</span>
                    </button>
                    
                    <div class="audio-progress-wrap">
                      <div class="audio-progress-bar" id="progress-bar-${stage.id}">
                        <div class="audio-progress-fill" id="progress-fill-${stage.id}"></div>
                      </div>
                      <div class="audio-time-row">
                        <span id="time-curr-${stage.id}">00:00</span>
                        <span id="time-dur-${stage.id}">--:--</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Hidden Audio Element -->
              <audio id="audio-${stage.id}" preload="none">
                <source src="${encodeURI(stage.themeSong.src)}" type="audio/mpeg">
              </audio>
            </div>

          </div>

          ${(() => {
            const quotes = stage.memories.filter(m => (!m.image || m.image.length === 0) || m.tag === 'Tâm sự');
            if (!quotes.length) return '';
            return `
          <div class="stage-quotes-toggle" data-stage-id="${stage.id}">
            <button class="btn-toggle-stage-quotes" type="button" aria-expanded="false" aria-controls="stage-quotes-${stage.id}">
              <span class="quote-toggle-label">
                <svg class="quote-scroll-icon" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
                  <path d="M8 5.5h15a3 3 0 0 1 3 3v15a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3v-15a3 3 0 0 1 3-3Z" fill="none" stroke="currentColor" stroke-width="1.6"/>
                  <path d="M9 10h12M9 14h12M9 18h9M9 22h7M5 8H3.5v16H5m21-16h2v16h-2" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.35"/>
                  <path d="m22 4 2 2-2 2M10 27l-2 2-2-2" fill="none" stroke="#f8dfa0" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.4"/>
                </svg>
                <span class="quote-toggle-text">Khai Mở Tâm Ma Bí Lục</span>
              </span>
              <span class="quotes-count">${quotes.length} chương</span>
            </button>
            <div class="stage-quotes-content" id="stage-quotes-${stage.id}" hidden>
              ${quotes.map(q => `
                <article class="stage-quote-item">
                  <span class="stage-quote-time">${escapeHtml(q.time || '')}</span>
                  <h4>${escapeHtml(q.title || 'Tâm sự')}</h4>
                  <p>“${escapeHtml(q.description || '')}”</p>
                  ${memoryLikeButtonMarkup(stage, q, 'quote-memory-like')}
                </article>
              `).join('')}
            </div>
          </div>`;
          })()}

          <!-- Bottom CTA: View Full Stage Archive -->
          <div class="stage-archive-row">
            ${pageName === 'home'
              ? `<a class="btn-open-gallery" href="gallery.html"><span class="archive-icon" aria-hidden="true"><svg viewBox="0 0 32 32" focusable="false"><path d="M7 5.5h15a3 3 0 0 1 3 3v15a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-15a3 3 0 0 1 3-3Z" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M8 9h13M8 13h13M8 17h13M8 21h8M22 4v23M25 8l3 2-3 2m0 7 3 2-3 2" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M6 6.5 3.8 4.3m0 0v3m0-3h3" fill="none" stroke="#f8dfa0" stroke-linecap="round" stroke-width="1.2"/></svg></span><span>Xem toàn bộ ảnh &amp; ký ức tại Tàng Kinh Các</span></a>`
              : `<button class="btn-open-archive" data-stage-id="${stage.id}">
                  <span class="archive-icon" aria-hidden="true">
                    <svg viewBox="0 0 32 32" focusable="false">
                      <path d="M7 5.5h15a3 3 0 0 1 3 3v15a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-15a3 3 0 0 1 3-3Z" fill="none" stroke="currentColor" stroke-width="1.6"/>
                      <path d="M8 9h13M8 13h13M8 17h13M8 21h8M22 4v23M25 8l3 2-3 2m0 7 3 2-3 2" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/>
                      <path d="M6 6.5 3.8 4.3m0 0v3m0-3h3" fill="none" stroke="#f8dfa0" stroke-linecap="round" stroke-width="1.2"/>
                    </svg>
                  </span>
                  <span>Khai Ấn Ngọc Giản: Ký Ức ${stage.period} (${stage.memories.length} mảnh tàn hồn)</span>
                </button>`}
          </div>

          <button type="button" class="milestone-comments-open btn btn-glass" data-stage-id="${escapeHtml(stage.id)}" aria-haspopup="dialog" aria-controls="milestoneCommentsModal">
            🗣️ Tường Truyền Âm • Mốc ${escapeHtml(stage.period || stage.title)} (${Math.max(0, Number(state.milestoneCommentCounts.get(stage.id)) || 0)} lời nhắn)
          </button>

        </div>
      `;

      section.innerHTML = html;
      container.appendChild(section);

      // Attach Music Player Events for this stage
      setupStageAudioPlayer(stage.id);
    });

    // Attach Event Listeners to Memory Cards (Lightbox triggers)
    attachMemoryCardEvents();
    attachArchiveButtons();

    initStageCultivationCardControls();
    document.querySelectorAll('.stage-quotes-toggle').forEach(bindStageQuoteToggle);
    refreshVisibleMemoryLikes();
    initGlassInteractions();
    initMilestoneComments();
    applyFeatureToggles();
    } catch (e) {
      console.error('Lỗi render 7 giai đoạn:', e);
    }
  }

  function formatMilestoneCommentTime(value) {
    const date = new Date(value);
    if (!Number.isFinite(date.getTime())) return 'vừa xong';
    const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
    const formatter = new Intl.RelativeTimeFormat('vi', { numeric: 'auto' });
    if (seconds < 60) return formatter.format(-seconds, 'second');
    if (seconds < 3600) return formatter.format(-Math.floor(seconds / 60), 'minute');
    if (seconds < 86400) return formatter.format(-Math.floor(seconds / 3600), 'hour');
    return formatter.format(-Math.floor(seconds / 86400), 'day');
  }

  function renderMilestoneComment(comment, profileByUser, discipleByUser) {
    const item = document.createElement('li');
    item.className = 'milestone-comment-item';

    const header = document.createElement('div');
    header.className = 'milestone-comment-meta';
    const author = document.createElement('strong');
    author.className = 'milestone-comment-author';
    author.textContent = String(comment.display_name || 'Đạo Hữu');
    header.appendChild(author);

    const profile = profileByUser.get(String(comment.user_id || ''));
    if (profile) {
      const badge = document.createElement('span');
      badge.className = 'milestone-comment-rank';
      badge.textContent = getCultivationRank(getCultivationPoints(profile)).name;
      header.appendChild(badge);
    }
    const disciple = discipleByUser && discipleByUser.get(String(comment.user_id || ''));
    if (disciple && disciple.sect_title) {
      const titleBadge = document.createElement('span');
      titleBadge.className = 'milestone-comment-sect-title';
      titleBadge.textContent = String(disciple.sect_title);
      header.appendChild(titleBadge);
    }

    const time = document.createElement('time');
    time.className = 'milestone-comment-time';
    time.dateTime = String(comment.created_at || '');
    time.textContent = formatMilestoneCommentTime(comment.created_at);
    header.appendChild(time);

    const content = document.createElement('p');
    content.className = 'milestone-comment-content';
    content.textContent = String(comment.content || '');
    item.append(header, content);

    const mayDelete = authenticatedUser &&
      (String(comment.user_id) === String(authenticatedUser.id) || isAdminUser());
    if (mayDelete && comment.id != null) {
      const deleteButton = document.createElement('button');
      deleteButton.type = 'button';
      deleteButton.className = 'milestone-comment-delete';
      deleteButton.dataset.commentId = String(comment.id);
      deleteButton.setAttribute('aria-label', `Xóa lời nhắn của ${author.textContent}`);
      deleteButton.textContent = '✕';
      item.appendChild(deleteButton);
    }
    return item;
  }

  async function loadMilestoneComments(section) {
    const stageId = section.dataset.stageId;
    const list = section.querySelector('.milestone-comment-list');
    const status = section.querySelector('.milestone-comments-status');
    if (!stageId || !list || !status) return;
    if (!supabaseClient) {
      list.replaceChildren();
      status.textContent = 'Linh phù truyền âm hiện chưa kết nối được Supabase.';
      return;
    }

    status.textContent = 'Đang nhận lời nhắn từ linh phù…';
    try {
      const { data, error, count } = await supabaseClient.from('milestone_comments')
        .select('*', { count: 'exact' })
        .eq('stage_id', stageId)
        .order('created_at', { ascending: false })
        .limit(40);
      if (error) throw error;

      const comments = data || [];
      const userIds = [...new Set(comments.map(comment => String(comment.user_id || '')).filter(Boolean))];
      const profileByUser = new Map();
      const discipleByUser = new Map();
      if (userIds.length) {
        const [profileResult, discipleResult] = await Promise.all([
          supabaseClient.from('user_cultivation').select('user_id,tu_vi').in('user_id', userIds),
          supabaseClient.from('disciples').select('user_id,sect_title').in('user_id', userIds)
        ]);
        if (profileResult.error) console.warn('Không thể tải Cảnh Giới của người truyền âm:', profileResult.error);
        else (profileResult.data || []).forEach(profile =>
          profileByUser.set(String(profile.user_id), profile));
        if (discipleResult.error) console.warn('Không thể tải chức vụ của người truyền âm:', discipleResult.error);
        else (discipleResult.data || []).forEach(disciple =>
          discipleByUser.set(String(disciple.user_id), disciple));
      }

      list.replaceChildren();
      if (!comments.length) {
        const empty = document.createElement('li');
        empty.className = 'milestone-comments-empty';
        empty.textContent = 'Chưa có đạo hữu truyền âm ở mốc này. Hãy khai lời đầu tiên!';
        list.appendChild(empty);
      } else {
        comments.forEach(comment => list.appendChild(renderMilestoneComment(comment, profileByUser, discipleByUser)));
      }
      const totalCount = Math.max(comments.length, Number(count) || 0);
      state.milestoneCommentCounts.set(stageId, totalCount);
      updateMilestoneCommentButtons(stageId, totalCount);
      status.textContent = totalCount > comments.length
        ? `Đang hiển thị ${comments.length} lời nhắn gần nhất trong tổng số ${totalCount}.`
        : '';
    } catch (error) {
      console.error(`Không thể tải lời truyền âm ${stageId}:`, error);
      list.replaceChildren();
      status.textContent = 'Linh phù truyền âm tạm thời mất kết nối. Vui lòng thử lại sau.';
      status.classList.add('is-error');
      return;
    }
    status.classList.remove('is-error');
  }

  function vietnamDayUtcBounds(dateKey) {
    const start = new Date(`${dateKey}T00:00:00+07:00`);
    const end = new Date(`${shiftDateKey(dateKey, 1)}T00:00:00+07:00`);
    return { start: start.toISOString(), end: end.toISOString() };
  }

  async function hasCommentRewardToday(userId) {
    const { start, end } = vietnamDayUtcBounds(vietnamDateKey());
    const { data, error } = await supabaseClient.from('milestone_comments')
      .select('id')
      .eq('user_id', userId)
      .gte('created_at', start)
      .lt('created_at', end)
      .limit(1);
    if (error) throw error;
    return Boolean(data && data.length);
  }

  function updateMilestoneCommentButtons(stageId, count) {
    const stage = state.data && state.data.stages.find(item => item.id === stageId);
    const label = stage ? stage.period || stage.title : stageId;
    document.querySelectorAll('.milestone-comments-open').forEach(button => {
      if (button.dataset.stageId !== stageId) return;
      button.textContent = `🗣️ Tường Truyền Âm • Mốc ${label} (${count} lời nhắn)`;
    });
  }

  function syncFeatureModalScrollLock() {
    const activeModal = document.querySelector('.feature-modal.active, .admin-modal.active, .archive-lock-modal.active, .modal.active, .lightbox-modal.active');
    document.body.style.overflow = activeModal ? 'hidden' : '';
  }

  function setFeatureModalOpen(modal, isOpen) {
    if (!modal) return;
    modal.hidden = !isOpen;
    modal.classList.toggle('active', isOpen);
    modal.setAttribute('aria-hidden', String(!isOpen));
    syncFeatureModalScrollLock();
  }

  function openMilestoneCommentsModal(stageId) {
    const stage = state.data && state.data.stages.find(item => item.id === stageId);
    const modal = document.getElementById('milestoneCommentsModal');
    const section = document.getElementById('milestone-comments-modal-content');
    const title = document.getElementById('milestone-comments-modal-title');
    const stageLabel = document.getElementById('milestone-comments-modal-stage');
    if (!stage || !modal || !section) return;

    state.currentMilestoneStage = stageId;
    section.dataset.stageId = stageId;
    if (title) title.textContent = `🗣️ Tường Truyền Âm • ${stage.period || stage.title}`;
    if (stageLabel) stageLabel.textContent = 'Linh phù đã mở — hãy để lại lời nhắn văn minh, tối đa 220 ký tự.';
    const list = section.querySelector('.milestone-comment-list');
    const status = section.querySelector('.milestone-comments-status');
    const form = section.querySelector('.milestone-comment-form');
    if (list) {
      list.replaceChildren();
      const loading = document.createElement('li');
      loading.className = 'milestone-comments-empty';
      loading.textContent = 'Đang nhận lời nhắn từ linh phù…';
      list.appendChild(loading);
    }
    if (status) {
      status.textContent = '';
      status.classList.remove('is-error');
    }
    if (form) {
      form.reset();
      const count = form.querySelector('.milestone-comment-count');
      if (count) count.textContent = '0/220';
    }
    setFeatureModalOpen(modal, true);
    void loadMilestoneComments(section);
    modal.querySelector('.feature-modal-dialog')?.focus({ preventScroll: true });
  }

  function initMilestoneComments() {
    void loadMilestoneCommentCounts();
    document.querySelectorAll('.milestone-comments-open').forEach(button => {
      if (button.dataset.bound === 'true') return;
      button.dataset.bound = 'true';
      button.addEventListener('click', () => openMilestoneCommentsModal(button.dataset.stageId));
    });

    const modal = document.getElementById('milestoneCommentsModal');
    const section = document.getElementById('milestone-comments-modal-content');
    const form = document.getElementById('milestone-comment-modal-form');
    if (!modal || !section || !form || form.dataset.bound === 'true') return;
    form.dataset.bound = 'true';
    const textarea = form.querySelector('textarea[name="content"]');
    const count = form.querySelector('.milestone-comment-count');
    if (!textarea || !count) return;
    textarea.addEventListener('input', () => {
      count.textContent = `${textarea.value.length}/220`;
    });
    form.addEventListener('submit', event => {
      event.preventDefault();
      void submitMilestoneComment(section, form, textarea.value.trim());
    });
    section.querySelector('.milestone-comment-list')?.addEventListener('click', event => {
      const target = event.target instanceof Element ? event.target : null;
      const deleteButton = target && target.closest('.milestone-comment-delete');
      if (!deleteButton) return;
      void deleteMilestoneComment(section, deleteButton.dataset.commentId);
    });
  }

  function loadMilestoneCommentCounts() {
    if (!supabaseClient || !state.data || state.milestoneCountsPromise) return;
    state.milestoneCountsPromise = (async () => {
      try {
        const { data, error } = await supabaseClient.from('milestone_comments').select('stage_id');
        if (error) throw error;
        const counts = new Map();
        (data || []).forEach(comment => {
          const stageId = String(comment.stage_id || '');
          if (stageId) counts.set(stageId, (counts.get(stageId) || 0) + 1);
        });
        state.data.stages.forEach(stage => {
          const total = counts.get(stage.id) || 0;
          state.milestoneCommentCounts.set(stage.id, total);
          updateMilestoneCommentButtons(stage.id, total);
        });
      } catch (error) {
        console.warn('Không thể tải số lời nhắn của các mốc:', error);
      }
    })();
  }

  function initFeatureModals() {
    const thienCoButton = document.getElementById('nav-thien-co-btn');
    const thienCoModal = document.getElementById('thienCoModal');
    if (thienCoButton && thienCoModal) {
      thienCoButton.addEventListener('click', () => {
        if (!authenticatedUser) {
          openOracleAuthSeal();
          return;
        }
        setFeatureModalOpen(thienCoModal, true);
        thienCoModal.querySelector('.feature-modal-dialog')?.focus({ preventScroll: true });
      });
    }

    const historyButton = document.getElementById('open-decree-history');
    const historyModal = document.getElementById('decreeHistoryModal');
    if (historyButton && historyModal) {
      historyButton.addEventListener('click', () => {
        renderDecreeHistory();
        setFeatureModalOpen(historyModal, true);
        historyModal.querySelector('.feature-modal-dialog')?.focus({ preventScroll: true });
      });
    }

    document.querySelectorAll('[data-modal-close]').forEach(button => {
      if (button.dataset.modalBound === 'true') return;
      button.dataset.modalBound = 'true';
      button.addEventListener('click', () => {
        const modal = document.getElementById(button.dataset.modalClose);
        if (modal) setFeatureModalOpen(modal, false);
      });
    });

    document.addEventListener('keydown', event => {
      if (event.key !== 'Escape') return;
      document.querySelectorAll('.feature-modal.active').forEach(modal => setFeatureModalOpen(modal, false));
    });
  }

  async function submitMilestoneComment(section, form, content) {
    const stageId = section.dataset.stageId;
    const textarea = form.querySelector('textarea[name="content"]');
    const submitButton = form.querySelector('button[type="submit"]');
    const status = section.querySelector('.milestone-comments-status');
    if (!stageId || !textarea || !submitButton || !status || !content) return;
    if (content.length > 220) {
      status.textContent = 'Lời truyền âm tối đa 220 ký tự.';
      status.classList.add('is-error');
      return;
    }
    if (!authenticatedUser) {
      openArchiveLockModal(stageId);
      const authButton = document.getElementById('archive-lock-auth');
      status.textContent = 'Hãy ghi danh để truyền âm lời nhắn của đạo hữu.';
      if (authButton) {
        authButton.dataset.action = 'comment';
        authButton.dataset.commentText = content;
        authButton.dataset.commentFormId = form.id || '';
      }
      return;
    }
    if (!hasDiscipleFeatureAccess(status)) return;

    const user = authenticatedUser;
    submitButton.disabled = true;
    status.classList.remove('is-error');
    status.textContent = 'Đang gửi linh phù…';
    let rewardAvailable = false;
    try {
      rewardAvailable = !(isAdminUser(user)) && !(await hasCommentRewardToday(user.id));
      const { error } = await supabaseClient.from('milestone_comments').insert({
        stage_id: stageId,
        user_id: user.id,
        display_name: getUserDisplayName(user),
        content
      });
      if (error) throw error;

      form.reset();
      const count = form.querySelector('.milestone-comment-count');
      if (count) count.textContent = '0/220';
      await loadMilestoneComments(section);
      status.classList.remove('is-error');

      if (rewardAvailable) {
        const awarded = await awardCultivation(5, 'Gửi Truyền Âm', { sourceElement: submitButton });
        if (awarded) {
          status.textContent = 'Linh phù đã truyền đi, nhận +5 Tu Vi đầu tiên hôm nay!';
        } else {
          status.textContent = 'Linh phù đã truyền đi; phần thưởng Tu Vi chưa đồng bộ được.';
          status.classList.add('is-error');
        }
      } else {
        status.classList.remove('is-error');
        status.textContent = 'Linh phù đã truyền đi thành công!';
      }
    } catch (error) {
      console.error('Không thể gửi linh phù truyền âm:', error);
      status.textContent = 'Không thể gửi lời nhắn lúc này. Vui lòng thử lại.';
      status.classList.add('is-error');
    } finally {
      submitButton.disabled = false;
    }
  }

  async function deleteMilestoneComment(section, commentId) {
    if (!authenticatedUser || !commentId || !supabaseClient) return;
    const status = section.querySelector('.milestone-comments-status');
    try {
      const { error } = await supabaseClient.from('milestone_comments')
        .delete()
        .eq('id', commentId);
      if (error) throw error;
      if (status) {
        status.classList.remove('is-error');
        status.textContent = 'Đã xóa lời truyền âm.';
      }
      await loadMilestoneComments(section);
    } catch (error) {
      console.error('Không thể xóa lời truyền âm:', error);
      if (status) {
        status.textContent = 'Không thể xóa lời truyền âm. Vui lòng thử lại.';
        status.classList.add('is-error');
      }
    }
  }

  // ========================================================
  // 5. MEMORY CARD HTML BUILDER (Photo / Stack / Quote)
  // ========================================================
  function renderMemoryMediaMarkup(url, alt, className = '', options = {}) {
    const source = escapeHtml(url);
    const safeClass = escapeHtml(className);
    if (isVideoUrl(url)) {
      return `<video class="${safeClass}" src="${source}" ${options.controls ? 'controls' : ''} playsinline preload="metadata" aria-label="${escapeHtml(alt)}"></video>`;
    }
    const focalStyle = options.focalPoint
      ? `style="object-position: ${escapeHtml(options.focalPoint)};"`
      : '';
    return `<img class="${safeClass}" src="${source}" alt="${escapeHtml(alt)}" loading="lazy" decoding="async" ${focalStyle}>`;
  }

  function renderMemoryCardHTML(mem) {
    const imgList = mem.image || [];
    const hasImages = imgList.length > 0;
    const isMultiImage = imgList.length >= 2;
    const memoryId = escapeHtml(mem.id);
    const memoryTitle = escapeHtml(mem.title);
    const memoryTime = escapeHtml(mem.time);
    const memoryDescription = escapeHtml(mem.description);
    const memoryTag = escapeHtml(mem.tag || 'Kỷ niệm');

    // Type 1: Quote Card (No image -> Warm Paper Journal Card)
    if (!hasImages) {
      return `
        <div class="memory-card card-quote" data-type="quote" data-id="${memoryId}">
          <div>
            <div class="quote-top-row">
              <span class="quote-tag">${escapeHtml(mem.tag || 'Tâm sự')}</span>
              <span class="quote-time">${memoryTime}</span>
            </div>
            <h4 class="quote-heading">${memoryTitle}</h4>
            <p class="quote-content">"${memoryDescription}"</p>
          </div>
          <div class="quote-footer">
            <span class="quote-author">Trang nhật ký</span>
            <span class="quote-symbol">✒️</span>
          </div>
        </div>
      `;
    }

    // Type 2: Photo Stack Card (2 or more images)
    if (isMultiImage) {
      const extraCount = imgList.length - 1;
      return `
        <div class="memory-card card-stack" data-type="photo" data-id="${memoryId}">
          <div class="stack-wrapper" data-memory-id="${memoryId}">
            <div class="stack-badge">+${extraCount} ảnh</div>
            <span class="card-tag-badge">${memoryTag}</span>

            <!-- Stack Layers -->
            <div class="stack-layer stack-layer-1">
              ${renderMemoryMediaMarkup(imgList[1], mem.title, '', { focalPoint: mem.focalPoint })}
            </div>
            ${imgList.length > 2 ? `
              <div class="stack-layer stack-layer-2">
                ${renderMemoryMediaMarkup(imgList[2], mem.title, '', { focalPoint: mem.focalPoint })}
              </div>
            ` : ''}
            <div class="stack-layer stack-layer-main">
              ${renderMemoryMediaMarkup(imgList[0], mem.title, '', { focalPoint: mem.focalPoint })}
            </div>
          </div>

          <div class="card-body-content">
            <div class="card-time-text">${memoryTime}</div>
            <h4 class="card-heading">${memoryTitle}</h4>
            <p class="card-note-text">${memoryDescription || 'Bộ ảnh kỷ niệm đặc biệt.'}</p>
          </div>
        </div>
      `;
    }

    // Type 3: Standard Single Photo Card
    return `
      <div class="memory-card card-photo" data-type="photo" data-id="${memoryId}">
        <div class="card-img-container" data-memory-id="${memoryId}">
          <span class="card-tag-badge">${memoryTag}</span>
          ${renderMemoryMediaMarkup(imgList[0], mem.title, '', { controls: isVideoUrl(imgList[0]), focalPoint: mem.focalPoint })}
        </div>
        <div class="card-body-content">
          <div class="card-time-text">${memoryTime}</div>
          <h4 class="card-heading">${memoryTitle}</h4>
          ${memoryDescription ? `<p class="card-note-text">${memoryDescription}</p>` : ''}
        </div>
      </div>
    `;
  }

  // ========================================================
  // 6. AUDIO PLAYER LOGIC
  // ========================================================
  function setupStageAudioPlayer(stageId) {
    const audio = document.getElementById(`audio-${stageId}`);
    const playBtn = document.getElementById(`play-btn-${stageId}`);
    const vinyl = document.getElementById(`vinyl-${stageId}`);
    const dot = document.getElementById(`dot-${stageId}`);
    const progressBar = document.getElementById(`progress-bar-${stageId}`);
    const progressFill = document.getElementById(`progress-fill-${stageId}`);
    const timeCurr = document.getElementById(`time-curr-${stageId}`);
    const timeDur = document.getElementById(`time-dur-${stageId}`);

    if (!audio || !playBtn) return;

    const stage = state.data?.stages?.find(item => item.id === stageId);
    const stageStartTime = stage?.themeSong?.startTime;
    applyStartTimeOnce(audio, stageStartTime);

    // Handle duration loaded
    audio.addEventListener('loadedmetadata', () => {
      timeDur.textContent = formatTime(audio.duration);
    });

    // Time update & Progress fill
    audio.addEventListener('timeupdate', () => {
      if (audio.duration) {
        const pct = (audio.currentTime / audio.duration) * 100;
        progressFill.style.width = `${pct}%`;
        timeCurr.textContent = formatTime(audio.currentTime);
      }
    });

    // Audio Ended
    audio.addEventListener('ended', () => {
      resetPlayerUI(playBtn, vinyl, dot, progressFill, timeCurr);
      state.currentAudio = null;
      if (state.bgMusic && !state.bgMusic.isUserMuted) {
        playBgMusic();
      }
    });

    // Audio Error Handling (Graceful fallback)
    audio.addEventListener('error', () => {
      console.warn(`File nhạc cho giai đoạn ${stageId} không thể tải hoặc chưa tồn tại.`);
      playBtn.style.opacity = '0.5';
      playBtn.style.cursor = 'not-allowed';
      playBtn.title = 'File nhạc đang được chuẩn bị';
    });

    // Click to Play/Pause
    playBtn.addEventListener('click', () => {
      if (audio.error) {
        alert('File nhạc cho giai đoạn này hiện đang được cập nhật.');
        return;
      }

      if (audio.paused) {
        // Stop background music
        pauseBgMusic(true);

        // Stop currently playing other audio if any
        if (state.currentAudio && state.currentAudio !== audio) {
          state.currentAudio.pause();
          if (state.currentAudioBtn && state.currentVinyl) {
            state.currentAudioBtn.innerHTML = '<span class="play-icon">▶</span>';
            state.currentVinyl.classList.remove('spinning');
            if (state.currentDot) state.currentDot.classList.remove('active');
          }
        }

        audio.play().then(() => {
          playBtn.innerHTML = '<span class="pause-icon">⏸</span>';
          vinyl.classList.add('spinning');
          dot.classList.add('active');

          state.currentAudio = audio;
          state.currentAudioBtn = playBtn;
          state.currentVinyl = vinyl;
          state.currentDot = dot;

          // Update sticky nav audio status
          const globalAudioBtn = document.getElementById('global-audio-toggle');
          if (globalAudioBtn) globalAudioBtn.classList.add('playing');
        }).catch(err => {
          console.warn('Playback error:', err);
        });
      } else {
        audio.pause();
        playBtn.innerHTML = '<span class="play-icon">▶</span>';
        vinyl.classList.remove('spinning');
        dot.classList.remove('active');
        state.currentAudio = null;

        const globalAudioBtn = document.getElementById('global-audio-toggle');
        if (globalAudioBtn) globalAudioBtn.classList.remove('playing');

        // Resume background music if not muted by user
        if (state.bgMusic && !state.bgMusic.isUserMuted) {
          playBgMusic();
        }
      }
    });

    // Scrub Progress Bar
    progressBar.addEventListener('click', (e) => {
      if (!audio.duration) return;
      const rect = progressBar.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newPct = Math.max(0, Math.min(1, clickX / rect.width));
      audio.currentTime = newPct * audio.duration;
    });
  }

  function resetPlayerUI(btn, vinyl, dot, fill, curr) {
    btn.innerHTML = '<span class="play-icon">▶</span>';
    vinyl.classList.remove('spinning');
    dot.classList.remove('active');
    fill.style.width = '0%';
    curr.textContent = '00:00';
  }

  // ========================================================
  // 7. MEMORY CARD EVENTS & LIGHTBOX TRIGGER
  // ========================================================
  function attachMemoryCardEvents() {
    const cardTriggers = document.querySelectorAll('[data-memory-id]');

    cardTriggers.forEach(el => {
      el.addEventListener('click', event => {
        if (event.target instanceof Element && event.target.closest('video')) return;
        const memId = el.dataset.memoryId;
        const memory = findMemoryById(memId);
        if (memory && memory.image && memory.image.length > 0) {
          openLightbox(memory, 0);
        }
      });
    });
  }

  function findMemoryById(memId) {
    for (const stage of state.data.stages) {
      const found = stage.memories.find(m => m.id === memId);
      if (found) return found;
    }
    return null;
  }

  // ========================================================
  // 8. GLOBAL FILTER (Tất cả | Khoảnh khắc | Tâm sự)
  // ========================================================

  // ========================================================
  // 9. FILMSTRIP GRID MODAL (35mm Cuộn Phim Toàn Bộ Kỷ Niệm)
  // ========================================================
  function attachArchiveButtons() {
    const archiveBtns = document.querySelectorAll('.btn-open-archive');
    archiveBtns.forEach(btn => {
      btn.addEventListener('click', event => {
        const archiveButton = event.target instanceof Element
          ? event.target.closest('.btn-open-archive')
          : null;
        if (!archiveButton || archiveButton !== btn) return;
        const stageId = archiveButton.dataset.stageId;
        if (authenticatedUser) {
          openFilmstripModal(stageId);
        } else {
          openArchiveLockModal(stageId);
        }
      });
    });
  }

  function openArchiveLockModal(stageId) {
    const modal = document.getElementById('authSealModal');
    const authButton = document.getElementById('archive-lock-auth');
    if (!modal || !authButton) return;
    authButton.dataset.stageId = stageId;
    authButton.dataset.action = 'archive';
    delete authButton.dataset.commentText;
    delete authButton.dataset.commentFormId;
    const message = modal.querySelector('.archive-lock-dialog p');
    if (message) {
      message.textContent = 'Đạo hữu chưa ghi danh nhập môn nên thiên cơ bất khả lộ — mau đăng nhập để phá giải phong ấn, chiêm ngưỡng toàn bộ ký ức bí truyền của Hải Thành Lão Tổ!';
    }
    modal.hidden = false;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function openFeatureAuthSeal(action) {
    const modal = document.getElementById('authSealModal');
    const authButton = document.getElementById('archive-lock-auth');
    if (!modal || !authButton) return;
    const featureName = action === 'game' ? 'Đố Vui Độ Kiếp' : 'nhận Thẻ Đệ Tử';
    const message = modal.querySelector('.archive-lock-dialog p');
    if (message) {
      message.textContent = `Kết giới tông môn đang phong ấn! Đạo hữu cần ghi danh nhập môn (đăng nhập) mới có thể tham gia ${featureName}.`;
    }
    delete authButton.dataset.stageId;
    delete authButton.dataset.commentText;
    delete authButton.dataset.commentFormId;
    authButton.dataset.action = action;
    modal.hidden = false;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function openOracleAuthSeal() {
    const modal = document.getElementById('authSealModal');
    const authButton = document.getElementById('archive-lock-auth');
    if (!modal || !authButton) return;
    delete authButton.dataset.stageId;
    authButton.dataset.action = 'oracle';
    const message = modal.querySelector('.archive-lock-dialog p');
    if (message) {
      message.textContent = 'Đạo hữu chưa ghi danh nhập môn nên thiên cơ bất khả lộ — mau đăng nhập để phá giải phong ấn, xin quẻ chỉ dẫn từ Thiên Cơ Lão Tổ!';
    }
    modal.hidden = false;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeArchiveLockModal() {
    const modal = document.getElementById('authSealModal');
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    modal.hidden = true;
    syncFeatureModalScrollLock();
  }

  function initSpiritParticlesCanvas() {
    const canvas = document.getElementById('spiritParticlesCanvas');
    const context = canvas && canvas.getContext ? canvas.getContext('2d') : null;
    if (!canvas || !context) {
      console.warn('Không thể khởi tạo canvas hạt linh khí.');
      return;
    }

    const reducedMotionQuery = window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)')
      : { matches: false, addEventListener: null };
    const particles = Array.from({ length: 25 }, () => ({
      x: Math.random(),
      y: Math.random(),
      radius: 0.7 + Math.random() * 1.8,
      speedX: (Math.random() - 0.5) * 0.012,
      speedY: (Math.random() - 0.5) * 0.012,
      phase: Math.random() * Math.PI * 2,
      gold: Math.random() > 0.56
    }));
    let width = 0;
    let height = 0;
    let frameId = 0;
    let lastFrameTime = 0;
    let resizeTimer = 0;
    let canvasPaused = false;
    let nextSwordAt = 6 + Math.random() * 6;
    let swordTrail = null;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.max(1, Math.round(width * ratio));
      canvas.height = Math.max(1, Math.round(height * ratio));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      drawParticles(0, 0);
    };

    const drawParticles = (time, delta) => {
      context.clearRect(0, 0, width, height);
      particles.forEach(particle => {
        if (!reducedMotionQuery.matches && delta > 0) {
          particle.x = (particle.x + particle.speedX * delta + 1) % 1;
          particle.y = (particle.y + particle.speedY * delta + 1) % 1;
        }
        const x = particle.x * width;
        const y = particle.y * height;
        const pulse = 0.4 + (Math.sin(time * 0.0012 + particle.phase) + 1) * 0.24;
        context.beginPath();
        context.fillStyle = particle.gold
          ? `rgba(255, 222, 130, ${pulse})`
          : `rgba(112, 255, 220, ${pulse})`;
        context.shadowBlur = 9;
        context.shadowColor = particle.gold ? 'rgba(255, 195, 75, 0.75)' : 'rgba(45, 212, 191, 0.8)';
        context.arc(x, y, particle.radius, 0, Math.PI * 2);
        context.fill();
      });

      if (!reducedMotionQuery.matches) {
        const seconds = time / 1000;
        if (!swordTrail && seconds >= nextSwordAt) {
          swordTrail = {
            x: Math.random() * width * 0.8,
            y: Math.random() * height * 0.58,
            age: 0
          };
          nextSwordAt = seconds + 7 + Math.random() * 9;
        }
        if (swordTrail) {
          swordTrail.age += delta;
          const progress = swordTrail.age / 0.72;
          if (progress >= 1) {
            swordTrail = null;
          } else {
            const x = swordTrail.x + progress * 150;
            const y = swordTrail.y + progress * 74;
            const gradient = context.createLinearGradient(x - 64, y - 32, x, y);
            gradient.addColorStop(0, 'rgba(112, 255, 220, 0)');
            gradient.addColorStop(0.65, 'rgba(112, 255, 220, 0.75)');
            gradient.addColorStop(1, 'rgba(255, 227, 151, 0)');
            context.save();
            context.globalAlpha = Math.sin(progress * Math.PI);
            context.strokeStyle = gradient;
            context.lineWidth = 1.2;
            context.shadowBlur = 12;
            context.shadowColor = 'rgba(45, 212, 191, 0.82)';
            context.beginPath();
            context.moveTo(x - 64, y - 32);
            context.lineTo(x, y);
            context.stroke();
            context.restore();
          }
        }
      }
    };

    const animate = now => {
      if (window.innerWidth < 768 && lastFrameTime && now - lastFrameTime < 1000 / 30) {
        frameId = window.requestAnimationFrame(animate);
        return;
      }
      const delta = lastFrameTime ? Math.min((now - lastFrameTime) / 1000, 0.05) : 0;
      lastFrameTime = now;
      drawParticles(now, delta);
      frameId = window.requestAnimationFrame(animate);
    };
    const start = () => {
      if (reducedMotionQuery.matches || document.hidden || canvasPaused || frameId) return;
      lastFrameTime = 0;
      frameId = window.requestAnimationFrame(animate);
    };
    const stop = () => {
      if (!frameId) return;
      window.cancelAnimationFrame(frameId);
      frameId = 0;
    };
    const syncMotion = () => {
      if (reducedMotionQuery.matches || document.hidden) {
        stop();
        drawParticles(0, 0);
      } else {
        start();
      }
    };
    pauseCanvasAnimation = paused => {
      canvasPaused = paused;
      if (paused) stop();
      else start();
    };
    const scheduleResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 150);
    };

    resize();
    start();
    window.addEventListener('resize', scheduleResize, { passive: true });
    document.addEventListener('visibilitychange', syncMotion);
    if (reducedMotionQuery.addEventListener) {
      reducedMotionQuery.addEventListener('change', syncMotion);
    }
  }

  function initGlassInteractions() {
    const targets = document.querySelectorAll(
      '.genesis-card-wrapper, .rpg-card, .public-leaderboard-card, .btn-open-archive, ' +
      '.btn-toggle-stage-quotes, .milestone-comments-open, .nav-actions > .nav-btn, .btn-invite, .utility-launch-btn'
    );

    targets.forEach(target => {
      if (target.dataset.glassInteractionBound === 'true') return;
      target.dataset.glassInteractionBound = 'true';
      target.classList.add('glass-tilt-target');

      if (!target.matches('.genesis-card-wrapper')) {
        const glint = document.createElement('span');
        glint.className = 'glass-pointer-glint';
        glint.setAttribute('aria-hidden', 'true');
        target.appendChild(glint);
      }

      const baseTransform = target.style.transform;
      let pointerBounds = null;
      const reset = () => {
        target.classList.remove('is-glass-pointed');
        target.style.transform = baseTransform;
        pointerBounds = null;
      };
      target.addEventListener('pointerenter', () => {
        pointerBounds = target.getBoundingClientRect();
      }, { passive: true });
      target.addEventListener('pointermove', event => {
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        if (!pointerBounds) pointerBounds = target.getBoundingClientRect();
        if (!pointerBounds.width || !pointerBounds.height) return;
        const x = Math.max(0, Math.min(1, (event.clientX - pointerBounds.left) / pointerBounds.width));
        const y = Math.max(0, Math.min(1, (event.clientY - pointerBounds.top) / pointerBounds.height));
        const rotateY = (x - 0.5) * 7;
        const rotateX = (0.5 - y) * 7;
        target.style.setProperty('--glass-pointer-x', `${x * 100}%`);
        target.style.setProperty('--glass-pointer-y', `${y * 100}%`);
        target.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        target.classList.add('is-glass-pointed');
      }, { passive: true });
      target.addEventListener('pointerleave', reset, { passive: true });
      target.addEventListener('pointercancel', reset, { passive: true });
      target.addEventListener('pointerup', event => {
        if (event.pointerType === 'touch') reset();
      }, { passive: true });
    });
  }

  function initArchiveLockModal() {
    const modal = document.getElementById('authSealModal');
    const closeButton = document.getElementById('archive-lock-close');
    const dismissButton = document.getElementById('archive-lock-dismiss');
    const authButton = document.getElementById('archive-lock-auth');
    if (!modal || !closeButton || !dismissButton || !authButton) return;
    closeButton.addEventListener('click', closeArchiveLockModal);
    dismissButton.addEventListener('click', closeArchiveLockModal);
    modal.addEventListener('click', event => {
      if (event.target === modal) closeArchiveLockModal();
    });
    authButton.addEventListener('click', () => {
      const stageId = authButton.dataset.stageId;
      const action = authButton.dataset.action || 'archive';
      const commentText = authButton.dataset.commentText || '';
      const commentFormId = authButton.dataset.commentFormId || '';
      closeArchiveLockModal();
      authButton.dataset.action = 'archive';
      delete authButton.dataset.commentText;
      delete authButton.dataset.commentFormId;
      if (action === 'oracle') {
        const openOracle = () => {
          const oracleModal = document.getElementById('thienCoModal');
          setFeatureModalOpen(oracleModal, true);
          oracleModal?.querySelector('.feature-modal-dialog')?.focus({ preventScroll: true });
        };
        if (!requireAuth(openOracle)) return;
        openOracle();
        return;
      }
      if (action === 'game' || action === 'ticket') {
        const button = document.getElementById(action === 'game' ? 'btn-nav-game' : 'nav-ticket-btn');
        const resumeFeature = () => button?.click();
        if (!requireAuth(resumeFeature)) return;
        resumeFeature();
        return;
      }
      if (action === 'comment') {
        setFeatureModalOpen(document.getElementById('milestoneCommentsModal'), false);
        const continueComment = () => {
          openMilestoneCommentsModal(stageId);
          const form = document.getElementById(commentFormId);
          const section = form && form.closest('.milestone-comments');
          const textarea = form && form.querySelector('textarea[name="content"]');
          if (form && section && textarea) {
            textarea.value = commentText;
            const count = form.querySelector('.milestone-comment-count');
            if (count) count.textContent = `${textarea.value.length}/220`;
            void submitMilestoneComment(section, form, commentText);
          }
        };
        if (!requireAuth(continueComment)) return;
        continueComment();
        return;
      }
      if (!requireAuth(() => openFilmstripModal(stageId))) {
        return;
      }
      openFilmstripModal(stageId);
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && modal.classList.contains('active')) {
        closeArchiveLockModal();
      }
    });
  }

  function openFilmstripModal(stageId) {
    const stage = state.data.stages.find(s => s.id === stageId);
    if (!stage) return;

    state.currentStageForModal = stage;
    state.currentModalMonth = 'all';

    const modal = document.getElementById('filmstrip-modal');
    if (state.archive.closeTimer) {
      window.clearTimeout(state.archive.closeTimer);
      state.archive.closeTimer = null;
    }
    if (modal) modal.classList.remove('is-closing');
    const modalTitle = document.getElementById('modal-stage-title');
    const modalSubtitle = document.getElementById('modal-stage-subtitle');
    if (modalTitle) modalTitle.textContent = stage.title;
    if (modalSubtitle) modalSubtitle.textContent = `Kho lưu trữ gồm ${stage.memories.length} khoảnh khắc & tư liệu`;

    // 1. Tự động tạm dừng các nhạc khác và phát nhạc chủ đề của giai đoạn (Nâng cấp 3)
    playStageAudio(stageId);

    // Build Month Filter Chips
    buildModalMonthChips(stage);

    // Render Filmstrip Grid items
    renderFilmstripGrid(stage, 'all');

    // Show Modal
    if (modal) {
      modal.hidden = false;
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      modal.inert = false;
    }
    document.body.style.overflow = 'hidden';
  }

  function closeFilmstripModal() {
    const modal = document.getElementById('filmstrip-modal');
    if (modal) {
      modal.setAttribute('aria-hidden', 'true');
      modal.inert = true;
      if (!modal.classList.contains('is-closing')) {
        modal.classList.add('is-closing');
        state.archive.closeTimer = window.setTimeout(() => {
          window.requestAnimationFrame(() => {
            const grid = document.getElementById('modal-filmstrip-grid');
            if (grid) {
              grid.querySelectorAll('img').forEach(image => image.removeAttribute('src'));
              grid.querySelectorAll('video').forEach(video => {
                video.pause();
                video.removeAttribute('src');
                video.load();
              });
              grid.replaceChildren();
            }
            state.archive.memories = [];
            state.archive.renderedCount = 0;
            modal.classList.remove('active', 'is-closing');
            modal.hidden = true;
            state.archive.closeTimer = null;
          });
        }, 160);
      }
    }
    document.body.style.overflow = '';

    // Tạm dừng nhạc giai đoạn và khôi phục nhạc nền nếu có
    if (state.currentAudio) {
      state.currentAudio.pause();
      if (state.currentAudioBtn) state.currentAudioBtn.innerHTML = '<span class="play-icon">▶</span>';
      if (state.currentVinyl) state.currentVinyl.classList.remove('spinning');
      if (state.currentDot) state.currentDot.classList.remove('active');
      state.currentAudio = null;
      const globalAudioBtn = document.getElementById('global-audio-toggle');
      if (globalAudioBtn) globalAudioBtn.classList.remove('playing');
    }

    if (state.bgMusic && !state.bgMusic.isUserMuted) {
      playBgMusic();
    }
  }

  function buildModalMonthChips(stage) {
    const chipsContainer = document.getElementById('modal-month-chips');
    chipsContainer.innerHTML = '';

    // Collect distinct months present in this stage
    const monthsSet = new Set();
    let hasOther = false;

    stage.memories.forEach(m => {
      if (m.month !== null && m.month !== undefined) {
        monthsSet.add(m.month);
      } else {
        hasOther = true;
      }
    });

    const sortedMonths = Array.from(monthsSet).sort((a, b) => a - b);

    // 1. "Tất cả" chip
    const allChip = document.createElement('button');
    allChip.className = 'month-chip active';
    allChip.dataset.month = 'all';
    allChip.textContent = `Tất cả (${stage.memories.length})`;
    chipsContainer.appendChild(allChip);

    // 2. Month chips T1 - T12
    sortedMonths.forEach(mNum => {
      const count = stage.memories.filter(m => m.month === mNum).length;
      const chip = document.createElement('button');
      chip.className = 'month-chip';
      chip.dataset.month = mNum.toString();
      chip.textContent = `Tháng ${mNum} (${count})`;
      chipsContainer.appendChild(chip);
    });

    // 3. Other / Childhood chip if any
    if (hasOther) {
      const otherCount = stage.memories.filter(m => m.month === null || m.month === undefined).length;
      const otherChip = document.createElement('button');
      otherChip.className = 'month-chip';
      otherChip.dataset.month = 'other';
      otherChip.textContent = `Tuổi thơ / Khác (${otherCount})`;
      chipsContainer.appendChild(otherChip);
    }

    // Attach click events to month chips
    chipsContainer.querySelectorAll('.month-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        chipsContainer.querySelectorAll('.month-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        state.currentModalMonth = chip.dataset.month;
        const gridBody = document.querySelector('.filmstrip-grid-body');
        if (gridBody) gridBody.scrollTop = 0;
        renderFilmstripGrid(stage, chip.dataset.month);
      });
    });
  }

  function renderFilmstripGrid(stage, monthFilter) {
    const grid = document.getElementById('modal-filmstrip-grid');
    const emptyState = document.getElementById('modal-empty-state');
    grid.replaceChildren();

    let filtered = stage.memories;
    if (monthFilter === 'other') {
      filtered = stage.memories.filter(m => m.month === null || m.month === undefined);
    } else if (monthFilter !== 'all') {
      const targetMonth = parseInt(monthFilter, 10);
      filtered = stage.memories.filter(m => m.month === targetMonth);
    }

    if (filtered.length === 0) {
      state.archive.memories = [];
      state.archive.renderedCount = 0;
      emptyState.style.display = 'block';
      return;
    }
    emptyState.style.display = 'none';
    state.archive.memories = filtered;
    state.archive.renderedCount = 0;
    appendFilmstripBatch();
  }

  function appendFilmstripBatch() {
    const grid = document.getElementById('modal-filmstrip-grid');
    if (!grid) return;
    const batch = state.archive.memories.slice(state.archive.renderedCount, state.archive.renderedCount + 12);
    batch.forEach((mem, batchIndex) => {
      const idx = state.archive.renderedCount + batchIndex;
      const frameNumber = (idx + 1).toString().padStart(2, '0');
      const frame = document.createElement('div');
      frame.className = 'film-frame';
      frame.dataset.memoryId = mem.id;

      const imgSource = (mem.image && mem.image.length > 0) 
        ? mem.image[0] 
        : 'images/Lúc nhỏ/IMG_0025_Original.JPG';

      const focalStyle = mem.focalPoint ? `style="object-position: ${escapeHtml(mem.focalPoint)};"` : '';
      const mediaMarkup = isVideoUrl(imgSource)
        ? `<video src="${escapeHtml(imgSource)}" muted playsinline preload="metadata" aria-label="${escapeHtml(mem.title)}"></video>`
        : `<img src="${escapeHtml(imgSource)}" alt="${escapeHtml(mem.title)}" loading="lazy" decoding="async" ${focalStyle} onerror="this.src='images/Lúc nhỏ/IMG_0025_Original.JPG';">`;

      const stage = state.currentStageForModal;
      frame.innerHTML = `
        <span class="film-number">#${frameNumber}</span>
        <div class="film-thumb-box">
          ${mediaMarkup}
        </div>
        <div class="film-frame-info">
          <span class="film-frame-time">${escapeHtml(mem.time)}</span>
          <h5 class="film-frame-title">${escapeHtml(mem.title)}</h5>
        </div>
        ${stage ? memoryLikeButtonMarkup(stage, mem, 'film-frame-like') : ''}
      `;

      frame.addEventListener('click', event => {
        if (event.target instanceof Element && event.target.closest('[data-memory-like-button]')) return;
        if (mem.image && mem.image.length > 0) {
          openLightbox(mem, 0, stage || null);
        }
      });

      grid.appendChild(frame);
    });
    state.archive.renderedCount += batch.length;
    refreshVisibleMemoryLikes(grid);
  }

  // ========================================================
  // 10. LIGHTBOX VIEWER
  // ========================================================
  function setLightboxTransform(scale, panX, panY) {
    const lightbox = state.lightbox;
    lightbox.scale = Math.max(1, Math.min(2.5, scale));
    lightbox.panX = panX;
    lightbox.panY = panY;
    lightbox.isZoomed = lightbox.scale > 1;
    if (lightbox.transformFrameId) {
      window.cancelAnimationFrame(lightbox.transformFrameId);
    }
    lightbox.transformFrameId = window.requestAnimationFrame(() => {
      lightbox.transformFrameId = 0;
      const image = document.getElementById('lightbox-img');
      if (!image) return;
      image.style.setProperty('--lightbox-scale', String(lightbox.scale));
      image.style.setProperty('--lightbox-pan-x', `${lightbox.panX}px`);
      image.style.setProperty('--lightbox-pan-y', `${lightbox.panY}px`);
    });
  }

  function bindLightboxPan(wrapper) {
    if (!wrapper || wrapper.dataset.panBound === 'true') return;
    wrapper.dataset.panBound = 'true';
    wrapper.addEventListener('pointerdown', event => {
      if (!state.lightbox.isZoomed || (event.pointerType === 'mouse' && event.button !== 0)) return;
      state.lightbox.dragOrigin = {
        pointerId: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        panX: state.lightbox.panX,
        panY: state.lightbox.panY
      };
      wrapper.setPointerCapture(event.pointerId);
    }, { passive: true });
    wrapper.addEventListener('pointermove', event => {
      const origin = state.lightbox.dragOrigin;
      if (!origin || origin.pointerId !== event.pointerId) return;
      setLightboxTransform(
        state.lightbox.scale,
        origin.panX + event.clientX - origin.x,
        origin.panY + event.clientY - origin.y
      );
    }, { passive: true });
    const finishPan = event => {
      if (state.lightbox.dragOrigin?.pointerId === event.pointerId) {
        state.lightbox.dragOrigin = null;
      }
    };
    wrapper.addEventListener('pointerup', finishPan, { passive: true });
    wrapper.addEventListener('pointercancel', finishPan, { passive: true });
    wrapper.addEventListener('lostpointercapture', finishPan, { passive: true });
  }

  function openLightbox(memory, startIndex, stageForCollection = null) {
    if (!memory || !memory.image || memory.image.length === 0) return;
    const stage = stageForCollection || state.data.stages.find(s => s.memories.some(m => m.id === memory.id)) || null;

    if (stage) {
      const items = [];
      stage.memories.forEach(mem => {
        (mem.image || []).forEach(imgUrl => items.push({ memory: mem, imgUrl }));
      });
      state.lightbox.items = items;
      state.lightbox.images = items.map(item => item.imgUrl);
      const matchingIndex = items.findIndex(item => item.memory.id === memory.id && item.imgUrl === memory.image[startIndex || 0]);
      state.lightbox.currentIndex = matchingIndex >= 0 ? matchingIndex : 0;
    } else {
      state.lightbox.items = memory.image.map(imgUrl => ({ memory, imgUrl }));
      state.lightbox.images = memory.image;
      state.lightbox.currentIndex = startIndex || 0;
    }

    state.lightbox.memory = state.lightbox.items[state.lightbox.currentIndex]?.memory || memory;
    setLightboxTransform(1, 0, 0);

    updateLightboxView();

    const modal = document.getElementById('lightbox-modal');
    if (modal) {
      modal.hidden = false;
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      modal.inert = false;
    }
    document.body.classList.add('lightbox-qi-active');
    document.body.style.overflow = 'hidden';
  }

  function updateLightboxView() {
    const { items, images, currentIndex } = state.lightbox;
    const memory = items[currentIndex]?.memory || state.lightbox.memory;
    state.lightbox.memory = memory;
    const currentImgUrl = images[currentIndex];

    const imgEl = document.getElementById('lightbox-img');
    const videoEl = document.getElementById('lightbox-video');
    const counterEl = document.getElementById('lightbox-counter');
    const tagEl = document.getElementById('lightbox-tag');
    const titleEl = document.getElementById('lightbox-title');
    const descEl = document.getElementById('lightbox-desc');
    const timeEl = document.getElementById('lightbox-time');
    const thumbsContainer = document.getElementById('lightbox-thumbs');
    const prevBtn = document.getElementById('lightbox-btn-prev');
    const nextBtn = document.getElementById('lightbox-btn-next');
    const wrapper = document.getElementById('lightbox-img-wrapper');
    const likeButton = document.getElementById('lightbox-memory-like');

    if (!imgEl || !counterEl || !tagEl || !titleEl || !descEl || !timeEl || !thumbsContainer || !prevBtn || !nextBtn || !wrapper) return;

    // Reset zoom
    wrapper.classList.remove('zoomed');
    setLightboxTransform(1, 0, 0);

    // Image/video & counter
    const isVideo = isVideoUrl(currentImgUrl);
    imgEl.hidden = isVideo;
    if (videoEl) {
      if (isVideo) {
        videoEl.hidden = false;
        videoEl.src = currentImgUrl;
        videoEl.load();
      } else {
        videoEl.pause();
        videoEl.removeAttribute('src');
        videoEl.load();
        videoEl.hidden = true;
      }
    }
    if (!isVideo) {
      imgEl.src = currentImgUrl;
      imgEl.alt = memory.title;
    } else {
      imgEl.removeAttribute('src');
    }
    counterEl.textContent = `${currentIndex + 1} / ${images.length}`;

    // Nav buttons visibility
    prevBtn.style.visibility = images.length > 1 ? 'visible' : 'hidden';
    nextBtn.style.visibility = images.length > 1 ? 'visible' : 'hidden';

    // Caption
    tagEl.textContent = memory.tag || 'Khoảnh khắc';
    titleEl.textContent = memory.title;
    descEl.textContent = memory.description || '';
    timeEl.textContent = memory.time;
    if (likeButton) {
      const stage = state.data.stages.find(item => item.memories.some(itemMemory => itemMemory.id === memory.id));
      likeButton.dataset.stageId = stage ? stage.id : '';
      likeButton.dataset.memoryId = memory.id;
      likeButton.disabled = !stage;
      if (stage) refreshMemoryLikeButton(likeButton, stage, memory);
    }

    // Thumbnails
    thumbsContainer.innerHTML = '';
    if (images.length > 1) {
      images.forEach((imgUrl, idx) => {
        const thumb = document.createElement('div');
        thumb.className = `lightbox-thumb ${idx === currentIndex ? 'active' : ''}`;
        thumb.innerHTML = isVideoUrl(imgUrl)
          ? `<video src="${escapeHtml(imgUrl)}" muted playsinline preload="metadata" aria-label="Video ${idx + 1}"></video>`
          : `<img src="${escapeHtml(imgUrl)}" alt="Thumb" loading="lazy" decoding="async">`;
        thumb.addEventListener('click', () => {
          state.lightbox.currentIndex = idx;
          updateLightboxView();
        });
        thumbsContainer.appendChild(thumb);
      });
    }
  }

  function closeLightbox() {
    const modal = document.getElementById('lightbox-modal');
    if (modal) {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      modal.inert = true;
      modal.hidden = true;
    }
    document.body.classList.remove('lightbox-qi-active');
    const wrapper = document.getElementById('lightbox-img-wrapper');
    if (wrapper) wrapper.classList.remove('zoomed');
    setLightboxTransform(1, 0, 0);
    const img = document.getElementById('lightbox-img');
    if (img) img.removeAttribute('src');
    const thumbs = document.getElementById('lightbox-thumbs');
    if (thumbs) {
      thumbs.querySelectorAll('img, video').forEach(media => {
        if (media instanceof HTMLVideoElement) {
          media.pause();
          media.load();
        }
        media.removeAttribute('src');
      });
      thumbs.replaceChildren();
    }
    // Only reset body overflow if filmstrip modal isn't also open
    const filmModal = document.getElementById('filmstrip-modal');
    if (!filmModal.classList.contains('active')) {
      document.body.style.overflow = '';
    }
    const video = document.getElementById('lightbox-video');
    if (video) {
      video.pause();
      video.removeAttribute('src');
      video.load();
      video.hidden = true;
    }
    state.lightbox.images = [];
    state.lightbox.items = [];
    state.lightbox.memory = null;
    state.lightbox.dragOrigin = null;
  }

  function prevLightboxImage() {
    const { images, currentIndex } = state.lightbox;
    if (images.length <= 1) return;
    state.lightbox.currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateLightboxView();
  }

  function nextLightboxImage() {
    const { images, currentIndex } = state.lightbox;
    if (images.length <= 1) return;
    state.lightbox.currentIndex = (currentIndex + 1) % images.length;
    updateLightboxView();
  }

  // ========================================================
  // 11. MINI-GAME: THỬ THÁCH ĐOÁN NĂM (GUESS THE YEAR)
  // ========================================================
  function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function buildGameImagePool() {
    const pool = [];
    const seenImages = new Set();
    if (!state.data || !state.data.stages) return pool;

    state.data.stages.forEach(stage => {
      stage.memories.forEach(mem => {
        const imgs = mem.image || [];
        imgs.forEach(imgUrl => {
          if (imgUrl && typeof imgUrl === 'string' && !isVideoUrl(imgUrl) && !seenImages.has(imgUrl)) {
            seenImages.add(imgUrl);
            pool.push({
              imageUrl: imgUrl,
              stageId: stage.id,
              stageTitle: stage.title,
              period: stage.period,
              title: mem.title || 'Khoảnh khắc kỷ niệm',
              time: mem.time || stage.period,
              description: mem.description || ''
            });
          }
        });
      });
    });

    (Array.isArray(state.siteSettings.quiz_special_questions) ? state.siteSettings.quiz_special_questions : [])
      .forEach(question => {
        const imageUrl = String(question.image_url || '').trim();
        if (!imageUrl || seenImages.has(imageUrl) || !/^https?:\/\//i.test(imageUrl)) return;
        seenImages.add(imageUrl);
        pool.push({
          imageUrl,
          stageId: 'special',
          stageTitle: 'Câu Hỏi Đặc Biệt',
          period: String(question.period || ''),
          title: 'Câu hỏi đặc biệt',
          time: String(question.period || ''),
          description: String(question.description || '')
        });
      });

    return pool;
  }

  function getGameAnswer(question) {
    const text = `${question.period || ''} ${question.time || ''}`;
    const year = text.match(/\b(?:19|20)\d{2}\b/);
    return year ? year[0] : String(question.period || question.time || 'Tuổi thơ').trim();
  }

  function stopGameTimer() {
    if (state.game.timerId) window.clearInterval(state.game.timerId);
    state.game.timerId = null;
  }

  function renderGameTimer() {
    const countdown = document.getElementById('game-countdown');
    const lives = document.getElementById('game-lives');
    if (countdown) {
      countdown.hidden = state.game.mode !== 'death';
      countdown.textContent = `${state.game.timeLeft} giây`;
      countdown.classList.toggle('is-urgent', state.game.timeLeft <= 5 && state.game.mode === 'death');
    }
    if (lives) {
      lives.hidden = state.game.mode !== 'death';
      lives.textContent = `❤️ ${'♥'.repeat(Math.max(0, state.game.lives))}${'♡'.repeat(Math.max(0, 3 - state.game.lives))}`;
    }
  }

  function startNewGame() {
    if (!authenticatedUser) { openFeatureAuthSeal('game'); return; }
    if (!hasDiscipleFeatureAccess()) return;
    const pool = buildGameImagePool();
    if (pool.length < 4) {
      alert('Không đủ hình ảnh để bắt đầu trò chơi.');
      return;
    }

    stopGameTimer();
    const shuffledPool = shuffleArray(pool);
    const questionsCount = state.game.mode === 'death'
      ? Math.min(30, shuffledPool.length)
      : Math.min(10, shuffledPool.length);
    state.game.questions = shuffledPool.slice(0, questionsCount);
    state.game.pool = pool;
    state.game.currentIndex = 0;
    state.game.score = 0;
    state.game.streak = 0;
    state.game.bestStreak = 0;
    state.game.combo = 0;
    state.game.bestCombo = 0;
    state.game.correctAnswers = 0;
    state.game.lives = 3;
    state.game.timeLeft = 15;
    state.game.resultSaved = false;
    state.game.hasAnswered = false;
    state.game.usedPowerups = new Set();
    state.game.powerups = { fifty: false, hint: false, freeze: false };
    setLeaderboardStatus('leaderboard-save-status', '');

    document.querySelectorAll('[data-game-powerup]').forEach(button => { button.disabled = false; });
    document.querySelectorAll('[data-game-mode]').forEach(button => {
      button.classList.toggle('active', button.dataset.gameMode === state.game.mode);
      button.setAttribute('aria-pressed', String(button.dataset.gameMode === state.game.mode));
    });
    document.getElementById('game-play-screen').style.display = 'flex';
    document.getElementById('game-result-screen').style.display = 'none';

    // Show Game Modal
    const modal = document.getElementById('game-modal');
    if (modal) {
      modal.hidden = false;
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      modal.inert = false;
    }
    document.body.style.overflow = 'hidden';

    // Render Question 0
    renderGameQuestion(0);
  }

  function closeGameModal() {
    stopGameTimer();
    const modal = document.getElementById('game-modal');
    if (modal) {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      modal.inert = true;
      modal.hidden = true;
    }
    const filmModal = document.getElementById('filmstrip-modal');
    const lightboxModal = document.getElementById('lightbox-modal');
    if ((!filmModal || !filmModal.classList.contains('active')) &&
        (!lightboxModal || !lightboxModal.classList.contains('active'))) {
      document.body.style.overflow = '';
    }
  }

  function renderGameQuestion(index) {
    stopGameTimer();
    const { questions } = state.game;
    if (index >= questions.length || state.game.lives <= 0) {
      showGameResult();
      return;
    }

    const gameDialog = document.querySelector('.year-guess-dialog');
    if (gameDialog) gameDialog.scrollTop = 0;

    state.game.hasAnswered = false;
    state.game.questionStartedAt = Date.now();
    const currentQ = questions[index];
    state.game.timeLeft = 15;

    document.getElementById('game-q-counter').textContent = `Câu ${index + 1} / ${questions.length}`;
    document.getElementById('game-score-badge').textContent =
      `Điểm: ${state.game.score} | Combo: ${state.game.combo}🔥`;
    const progressPct = ((index + 1) / questions.length) * 100;
    document.getElementById('game-progress-fill').style.width = `${progressPct}%`;
    renderGameTimer();

    // Hide reveal card
    const revealCard = document.getElementById('game-reveal-card');
    revealCard.style.display = 'none';
    revealCard.classList.remove('is-correct', 'is-wrong');
    const revealHint = document.getElementById('reveal-hint');
    if (revealHint) {
      revealHint.hidden = true;
      revealHint.textContent = '';
    }

    const imgEl = document.getElementById('game-current-img');
    imgEl.src = currentQ.imageUrl;
    imgEl.alt = 'Bức ảnh bí ẩn cần đoán năm';

    const yearInput = document.getElementById('game-year-input');
    const submitBtn = document.getElementById('game-year-submit');
    const choices = document.getElementById('game-year-choices');
    const correctAnswer = getGameAnswer(currentQ);
    const answerOptions = Array.from(new Set([
      correctAnswer,
      ...shuffleArray(Array.from(new Set(state.game.pool.map(getGameAnswer)
        .filter(answer => answer && answer !== correctAnswer)))).slice(0, 3)
    ]));
    state.game.choices = shuffleArray(answerOptions);
    if (choices) {
      choices.replaceChildren();
      state.game.choices.forEach(answer => {
        const choice = document.createElement('button');
        choice.type = 'button';
        choice.className = 'game-year-choice';
        choice.textContent = answer;
        choice.addEventListener('click', () => handleGameYearAnswer(currentQ, answer));
        choices.appendChild(choice);
      });
    }
    if (yearInput) {
      yearInput.value = '';
      yearInput.disabled = false;
    }
    if (submitBtn) submitBtn.disabled = false;

    if (yearInput) {
      yearInput.maxLength = 40;
      yearInput.oninput = () => { yearInput.value = yearInput.value.slice(0, 40); };
      yearInput.onkeydown = event => {
        if (event.key === 'Enter') {
          event.preventDefault();
          submitYearAnswer();
        }
      };
    }

    if (submitBtn) {
      submitBtn.onclick = submitYearAnswer;
    }

    function submitYearAnswer() {
      if (!yearInput || state.game.hasAnswered) return;
      const guessedAnswer = yearInput.value.trim();
      if (!guessedAnswer) {
        yearInput.focus();
        yearInput.classList.remove('game-input-shake');
        window.requestAnimationFrame(() => yearInput.classList.add('game-input-shake'));
        return;
      }
      handleGameYearAnswer(currentQ, guessedAnswer);
    }

    if (state.game.mode === 'death') {
      state.game.timerId = window.setInterval(() => {
        if (state.game.hasAnswered || state.game.mode !== 'death') return;
        state.game.timeLeft = Math.max(0, state.game.timeLeft - 1);
        renderGameTimer();
        if (state.game.timeLeft <= 0) handleGameYearAnswer(currentQ, '', true);
      }, 1000);
    }
  }

  function handleGameYearAnswer(question, guessedAnswer, timedOut = false) {
    if (state.game.hasAnswered) return;
    state.game.hasAnswered = true;
    stopGameTimer();

    const yearInput = document.getElementById('game-year-input');
    const submitBtn = document.getElementById('game-year-submit');
    if (yearInput) yearInput.disabled = true;
    if (submitBtn) submitBtn.disabled = true;
    document.querySelectorAll('.game-year-choice').forEach(button => { button.disabled = true; });

    const actualAnswer = getGameAnswer(question);
    const isCorrect = !timedOut && String(guessedAnswer || '').trim().toLocaleLowerCase('vi') ===
      actualAnswer.toLocaleLowerCase('vi');

    const revealCard = document.getElementById('game-reveal-card');
    const statusIcon = document.getElementById('reveal-status-icon');
    const statusText = document.getElementById('reveal-status-text');
    const revealHeader = revealCard.querySelector('.reveal-header');
    const revealHint = document.getElementById('reveal-hint');

    const correctLines = [
      'Đỉnh nóc kịch trần! Trí nhớ siêu việt như ổ cứng SSD NVMe!',
      'Chuẩn không cần chỉnh! Bạn đích thị là nhà sử học cấp cao của Hải Thành!',
      '10 điểm không có nhưng! Bộ não này vừa nâng cấp lên bản Pro Max!',
      'Xử đẹp! Cỗ máy thời gian của bạn hoạt động ổn áp không lag!',
      'Chính xác! Nhân phẩm câu hỏi hôm nay cộng trọn 100 điểm!',
      'Trúng phóc! Trí nhớ này còn hơn cả bản lưu đám mây!',
      'Tuyệt phẩm! Bạn vừa hồi sinh cột mốc trong bộ nhớ siêu tốc!',
      'Chuẩn pro! Đáp án này xanh lá ngay từ lúc nhập!',
      'Quá đỉnh! Bạn giống navigator phiên bản cộng hưởng ký ức!',
      'Đúng luôn! Não bộ vừa mở khóa achievement “Bảo tàng sống”!',
      'Bão à? Câu này rơi đúng vào skill điểm mạnh của bạn!',
      'Chốt đơn thành công! Trí nhớ cấp SSS đã ra trận!',
      'Không trượt phát nào! Bạn đang cày ký ức ở chế độ thần tốc!',
      'Tạch? Không có! Bạn vừa buffet sạch cả dòng thời gian!',
      'Đúng gắt gao! Cột mốc này phải cúi đầu gọi bạn là sư phụ!',
      'Excellent! Tư liệu bảo tàng đã mở khóa full bản đồ!'
    ];

    const wrongLines = [
      'Trật lất rồi! Đáp án này hơi lag so với dòng thời gian thực tế!',
      'Suýt trúng... nếu bạn quay ngược cỗ máy thời gian của Doraemon!',
      'Hệ thống phát hiện trí nhớ đang bảo trì, thử nhập lại phát nữa xem nào!',
      'Ơ kìa, mốc thời gian này vừa dỗi nên đi lạc 1 vài năm!',
      'Sai tí thôi nhưng cũng đủ để GPS ký ức chạy ngược đường!',
      'Bạn đang ở nhánh timeline song song, quay lại phiên bản chính nào!',
      'Đáp án chưa về! Ký ức vừa bị rơi gói gói dữ liệu!',
      'Chưa chuẩn nha, não bộ đang loading vòng xoay hoài niệm!',
      'Lag nhẹ từ server ký ức, nhưng lần sau chắc trúng!',
      'Cái mốc này trốn trong game rồi, bạn đoán lệch cả quest!',
      'Sai rồi ơi là sai, nhưng sai vui là thành công một nửa!',
      'Bạn đang cúi tìm đáp án ở 1 năm khác trong album ảnh đấy!',
      'Lệch timeline! Hãy để bản đồ ký ức dẫn đường lại nhé!',
      'Phát hiện gacha ký ức trật rare, làm thêm lượt nữa là lên!',
      'Năm nhập vào đang ở trạng thái AFK, đáp án lại muốn khác!',
      'Sai một ly, đi một năm... trật một ly là lệch cả bức ảnh!'
    ];

    if (isCorrect) {
      const elapsedSeconds = Math.max(0, Math.floor((Date.now() - state.game.questionStartedAt) / 1000));
      state.game.correctAnswers += 1;
      state.game.streak += 1;
      state.game.bestStreak = Math.max(state.game.bestStreak, state.game.streak);
      state.game.combo += 1;
      state.game.bestCombo = Math.max(state.game.bestCombo, state.game.combo);
      const speedBonus = state.game.mode === 'death'
        ? state.game.timeLeft * 10
        : Math.max(0, 50 - Math.round(elapsedSeconds * 3));
      const multiplier = state.game.mode === 'death' ? Math.min(3, Math.max(1, state.game.combo)) : 1;
      state.game.score += (100 + speedBonus) * multiplier;
      if (!isDiscipleBanned()) {
        void awardCultivation(5, 'Trả lời đúng Đoán Năm', {
          sourceElement: document.getElementById('game-year-submit')
        });
      }
      revealCard.classList.add('is-correct');
      revealHeader.className = 'reveal-header is-correct';
      statusIcon.textContent = '🎉';
      let line;
      do { line = correctLines[Math.floor(Math.random() * correctLines.length)]; } while (line === state.game.lastCorrectLine);
      state.game.lastCorrectLine = line;
      statusText.textContent = line;
      if (revealHint) {
        revealHint.hidden = true;
        revealHint.textContent = '';
      }
      const gameDialog = document.querySelector('.year-guess-dialog');
      if (gameDialog && state.game.combo >= 2) {
        gameDialog.classList.remove('is-combo-lightning');
        window.requestAnimationFrame(() => gameDialog.classList.add('is-combo-lightning'));
        window.setTimeout(() => gameDialog.classList.remove('is-combo-lightning'), 900);
      }
    } else {
      state.game.streak = 0;
      state.game.combo = 0;
      if (state.game.mode === 'death') state.game.lives = Math.max(0, state.game.lives - 1);
      revealCard.classList.add('is-wrong');
      let line;
      do { line = wrongLines[Math.floor(Math.random() * wrongLines.length)]; } while (line === state.game.lastWrongLine);
      state.game.lastWrongLine = line;
      const hint = timedOut
        ? `⏳ Hết thời gian! Đáp án là ${actualAnswer}.`
        : `💡 Đáp án đúng: ${actualAnswer}`;
      revealHeader.className = 'reveal-header is-wrong';
      statusIcon.textContent = '😅';
      statusText.textContent = line;
      if (revealHint) {
        revealHint.textContent = hint;
        revealHint.hidden = false;
      }
    }
    renderGameTimer();
    document.getElementById('game-score-badge').textContent =
      `Điểm: ${state.game.score} | Combo: ${state.game.combo}🔥`;

    // Populate Reveal Memory Details
    document.getElementById('reveal-memory-title').textContent = question.title;
    document.getElementById('reveal-memory-time').textContent = `📅 Thời gian: ${question.time}`;
    document.getElementById('reveal-memory-desc').textContent = question.description || 'Khoảnh khắc quý giá được lưu giữ trong bảo tàng.';

    // Next Button Text
    const nextBtn = document.getElementById('btn-game-next');
    const isLast = state.game.currentIndex === state.game.questions.length - 1 || state.game.lives <= 0;
    nextBtn.innerHTML = isLast 
      ? `<span>${state.game.lives <= 0 ? 'Kết thúc Độ Kiếp' : 'Xem kết quả tổng kết'}</span> <span>🏆</span>` 
      : `<span>Câu tiếp theo</span> <span>→</span>`;

    // Show Reveal Card
    revealCard.style.display = 'flex';
    const modalContainer = document.querySelector('.year-guess-dialog');
    if (modalContainer) {
      requestAnimationFrame(() => {
        modalContainer.scrollTo({
          top: modalContainer.scrollHeight,
          behavior: 'smooth'
        });
        revealCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    }
  }

  function setLeaderboardStatus(elementId, message, isError = false) {
    const status = document.getElementById(elementId);
    if (!status) return;
    status.textContent = message;
    status.classList.toggle('is-error', isError);
  }

  const CULTIVATION_PODIUM_TITLES = [
    'Đệ Nhất Thiên Kiêu • Độc Cô Cầu Bại',
    'Trưởng Lão Cày Đêm',
    'Chân Truyền Đệ Tử'
  ];

  function renderCultivationLeaderboard(rows, nameByUser) {
    const list = document.getElementById('cultivation-leaderboard-list');
    if (!list) return;
    list.replaceChildren();
    if (!rows.length) {
      const emptyRow = document.createElement('li');
      emptyRow.textContent = 'Bảng Tu Vi còn trống! Đạo Hữu đăng nhập điểm danh nhận thưởng theo chuỗi, kẻo Linh Thạch mọc rêu nhé.';
      list.appendChild(emptyRow);
      return;
    }

    rows.forEach((row, index) => {
      const rankNumber = index + 1;
      const currentAdmin = isAdminUser() && String(row.user_id) === String(authenticatedUser.id);
      const item = document.createElement('li');
      item.className = `cultivation-leaderboard-row${rankNumber <= 3 ? ` podium-rank-${rankNumber}` : ''}${currentAdmin ? ' admin-champion' : ''}`;
      const place = document.createElement('span');
      place.className = 'leaderboard-place';
      place.textContent = currentAdmin ? '👑 Hạng 1' : `Hạng ${rankNumber}`;

      const identity = document.createElement('span');
      identity.className = 'leaderboard-identity';
      if (rankNumber <= 3) {
        const title = document.createElement('span');
        title.className = 'podium-title';
        title.textContent = currentAdmin
          ? 'Độ Kiếp Chí Tôn • Thành Chủ Sáng Thế'
          : CULTIVATION_PODIUM_TITLES[rankNumber - 1];
        identity.appendChild(title);
      }

      const name = document.createElement('span');
      name.className = 'leaderboard-name';
      name.textContent = String(row.display_name || nameByUser.get(String(row.user_id)) || 'Đạo Hữu');
      const rank = document.createElement('span');
      rank.className = 'cultivation-rank-badge';
      rank.textContent = currentAdmin
        ? 'Độ Kiếp Chí Tôn'
        : getCultivationRank(getCultivationPoints(row)).name;
      const streak = document.createElement('span');
      streak.className = 'cultivation-streak-badge leaderboard-streak-badge';
      streak.textContent = `🔥 Chuỗi ${Math.max(0, Number(row.streak_days) || 0)} ngày`;
      identity.append(name, streak, rank);

      const points = document.createElement('span');
      points.className = 'leaderboard-score';
      points.textContent = `${getCultivationPoints(row)} Tu Vi`;
      item.append(place, identity, points);
      list.appendChild(item);
    });
  }

  function renderGameLeaderboard(rows) {
    const list = document.getElementById('game-leaderboard-list');
    if (!list) return;
    list.replaceChildren();
    if (!rows.length) {
      const emptyRow = document.createElement('li');
      emptyRow.textContent = 'Chưa ai đoán năm thắng cả — mời Đạo Hữu thử vận, đừng để bảng trống tới hóa thạch!';
      list.appendChild(emptyRow);
      return;
    }

    rows.forEach((row, index) => {
      const item = document.createElement('li');
      item.className = 'game-leaderboard-row';
      const place = document.createElement('span');
      place.className = 'leaderboard-place';
      place.textContent = `Hạng ${index + 1}`;
      const name = document.createElement('span');
      name.className = 'leaderboard-name';
      name.textContent = String(row.full_name || row.display_name || 'Đạo Hữu');
      const score = document.createElement('span');
      score.className = 'leaderboard-score';
      score.textContent = `${Number(row.quiz_best_score ?? row.best_score) || 0} điểm · ${Number(row.quiz_max_combo ?? row.best_streak) || 0}🔥`;
      item.append(place, name, score);
      list.appendChild(item);
    });
  }

  async function loadCultivationLeaderboard() {
    const statusId = 'cultivation-leaderboard-status';
    setLeaderboardStatus(statusId, 'Đang triệu hồi Bảng Tu Vi...');
    try {
      const { data, error } = await supabaseClient.from('user_cultivation')
        .select('*')
      if (error) throw error;
      const rows = (data || []).filter(row => {
        if (!state.featureToggles.hideAdminFromLeaderboard) return true;
        const rowEmail = String(row.email || '').trim().toLowerCase();
        const isCurrentAdmin = isAdminUser() &&
          String(row.user_id) === String(authenticatedUser.id);
        return rowEmail !== ADMIN_EMAIL && !isCurrentAdmin;
      });
      rows.sort((left, right) => getCultivationPoints(right) - getCultivationPoints(left));
      if (isAdminUser()) {
        rows.sort((left, right) =>
          String(right.user_id) === String(authenticatedUser.id) ? 1 :
            String(left.user_id) === String(authenticatedUser.id) ? -1 : 0
        );
      }
      const idsWithoutNames = rows
        .filter(row => !row.display_name)
        .map(row => String(row.user_id || ''))
        .filter(Boolean);
      const nameByUser = new Map();

      if (authenticatedUser) {
        nameByUser.set(String(authenticatedUser.id), getUserDisplayName(authenticatedUser));
      }
      if (idsWithoutNames.length) {
        try {
          const { data: names, error } = await supabaseClient.from('leaderboard')
            .select('*')
            .in('user_id', idsWithoutNames);
          if (error) throw error;
          (names || []).forEach(row => {
            if (row.display_name) nameByUser.set(String(row.user_id), String(row.display_name));
          });
        } catch (error) {
          console.warn('Không thể tải Đạo Hiệu cho Bảng Tu Vi:', error);
        }
      }

      renderCultivationLeaderboard(rows, nameByUser);
      setLeaderboardStatus(statusId, '');
    } catch (error) {
      console.error('Không thể tải Bảng Tu Vi:', error);
      const list = document.getElementById('cultivation-leaderboard-list');
      if (list) {
        list.replaceChildren();
        const row = document.createElement('li');
        row.textContent = 'Bảng Tu Vi tạm thời ẩn trong màn sương.';
        list.appendChild(row);
      }
      setLeaderboardStatus(statusId, 'Linh mạch bảng xếp hạng đang tạm nghẽn; các Đạo Hữu cứ thong thả thử lại.', false);
    }
  }

  async function loadGameLeaderboard() {
    const statusId = 'game-leaderboard-status';
    setLeaderboardStatus(statusId, 'Đang triệu hồi Cao Thủ Đoán Niên Hiệu...');
    try {
      if (!authenticatedUser || !state.discipleStatusReady) {
        const { data: legacyRows, error: legacyError } = await supabaseClient.from('leaderboard')
          .select('user_id,display_name,best_score,best_streak')
          .order('best_score', { ascending: false })
          .order('best_streak', { ascending: false })
          .limit(10);
        if (legacyError) throw legacyError;
        renderGameLeaderboard(legacyRows || []);
        setLeaderboardStatus(statusId, '');
        return;
      }
      const { data, error } = await supabaseClient.from('disciples')
        .select('user_id,full_name,sect_title,quiz_best_score,quiz_max_combo')
        .order('quiz_best_score', { ascending: false })
        .order('quiz_max_combo', { ascending: false })
        .limit(10);
      if (error) {
        console.warn('Chưa thể đọc Bảng Phong Thần từ Sổ Môn Đồ; thử bảng tương thích:', error);
        const { data: legacyRows, error: legacyError } = await supabaseClient.from('leaderboard')
          .select('user_id,display_name,best_score,best_streak')
          .order('best_score', { ascending: false })
          .order('best_streak', { ascending: false })
          .limit(10);
        if (legacyError) throw legacyError;
        renderGameLeaderboard(legacyRows || []);
        setLeaderboardStatus(statusId, 'Bảng đang hiển thị dữ liệu tương thích; cấp quyền đọc công khai cho Bảng Phong Thần để đồng bộ điểm từ disciples.');
        return;
      }
      renderGameLeaderboard((data || []).filter(row =>
        Number(row.quiz_best_score) > 0 || Number(row.quiz_max_combo) > 0
      ));
      setLeaderboardStatus(statusId, '');
    } catch (error) {
      console.error('Không thể tải Cao Thủ Đoán Niên Hiệu:', error);
      const list = document.getElementById('game-leaderboard-list');
      if (list) {
        list.replaceChildren();
        const row = document.createElement('li');
        row.textContent = 'Bảng Đoán Niên Hiệu tạm thời ẩn trong màn sương.';
        list.appendChild(row);
      }
      setLeaderboardStatus(statusId, 'Bảng Đoán Niên Hiệu đang lạc trong sương mù; mời Đạo Hữu quay lại sau.', false);
    }
  }

  async function loadLeaderboard() {
    if (!supabaseClient) {
      setLeaderboardStatus('cultivation-leaderboard-status', 'Bảng Tu Vi chưa kết nối được linh mạch dữ liệu.', true);
      setLeaderboardStatus('game-leaderboard-status', 'Bảng Đoán Niên Hiệu chưa kết nối được linh mạch dữ liệu.', true);
      return;
    }
    await Promise.all([loadCultivationLeaderboard(), loadGameLeaderboard()]);
  }

  function initLeaderboardTabs() {
    const tabs = [
      {
        button: document.getElementById('leaderboard-tab-cultivation'),
        panel: document.getElementById('cultivation-leaderboard-panel')
      },
      {
        button: document.getElementById('leaderboard-tab-game'),
        panel: document.getElementById('game-leaderboard-panel')
      }
    ];
    tabs.forEach((tab, index) => {
      if (!tab.button || !tab.panel) return;
      tab.button.addEventListener('click', () => {
        tabs.forEach((item, itemIndex) => {
          if (!item.button || !item.panel) return;
          const active = itemIndex === index;
          item.button.classList.toggle('active', active);
          item.button.setAttribute('aria-selected', String(active));
          item.panel.hidden = !active;
        });
      });
    });
  }

  async function saveGameScore() {
    if (!supabaseClient || !authenticatedUser || !state.discipleStatusReady || isDiscipleBanned()) return;
    setLeaderboardStatus('leaderboard-save-status', 'Đang khắc thành tích vào Thiên Kiêu Bảng…');
    try {
      const { data: previous, error: readError } = await supabaseClient.from('disciples')
        .select('quiz_best_score,quiz_max_combo')
        .eq('user_id', authenticatedUser.id)
        .maybeSingle();
      if (readError) throw readError;

      const score = Math.max(Number(previous && previous.quiz_best_score) || 0, state.game.score);
      const bestCombo = Math.max(Number(previous && previous.quiz_max_combo) || 0, state.game.bestCombo);
      const { data: saved, error: saveError } = await supabaseClient.from('disciples').update({
        quiz_best_score: score,
        quiz_max_combo: bestCombo,
        last_seen: new Date().toISOString()
      }).eq('user_id', authenticatedUser.id).select('*').maybeSingle();
      if (saveError) throw saveError;
      if (!saved) {
        const { data: inserted, error: insertError } = await supabaseClient.from('disciples').upsert({
        user_id: authenticatedUser.id,
          email: String(authenticatedUser.email || ''),
          full_name: getMemberFullName(authenticatedUser),
          avatar_url: getMemberAvatar(authenticatedUser),
          sect_title: String(state.disciple.sect_title || 'Ngoại Môn Đệ Tử'),
          is_banned: false,
          visit_count: 1,
          last_seen: new Date().toISOString(),
          quiz_best_score: score,
          quiz_max_combo: bestCombo
        }, { onConflict: 'user_id' }).select('*').single();
        if (insertError) throw insertError;
        state.disciple = inserted;
      } else {
        state.disciple = saved;
      }

      let legacySynced = true;
      const { error: legacyError } = await supabaseClient.from('leaderboard').upsert({
        user_id: authenticatedUser.id,
        display_name: getMemberFullName(authenticatedUser),
        best_score: score,
        best_streak: bestCombo,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });
      if (legacyError) {
        legacySynced = false;
        console.warn('Điểm đã lưu vào Sổ Môn Đồ nhưng chưa đồng bộ sang bảng công khai tương thích:', legacyError);
      }

      setLeaderboardStatus('leaderboard-save-status', legacySynced
        ? 'Thành tích đã được lưu vào Bảng Phong Thần.'
        : 'Điểm đã lưu trong Sổ Môn Đồ; bảng công khai tương thích chưa đồng bộ được.');
    } catch (error) {
      console.error('Không thể lưu thành tích:', error);
      setLeaderboardStatus('leaderboard-save-status', 'Chưa thể lưu thành tích vào Sổ Môn Đồ. Kiểm tra quyền bảng disciples và thử lại.', true);
    }
  }

  function showGameResult() {
    document.getElementById('game-play-screen').style.display = 'none';
    const resultScreen = document.getElementById('game-result-screen');
    resultScreen.style.display = 'flex';

    stopGameTimer();
    const score = state.game.score;
    const total = state.game.questions.length;
    const correct = state.game.correctAnswers;
    document.getElementById('result-score-highlight').textContent =
      `${score} điểm · ${correct}/${total} câu đúng`;

    let trophy = '🏆';
    let rank = '';
    let commentary = '';

    if (correct === total) {
      trophy = '👑';
      rank = 'BẬC THẦY KÝ ỨC TUYỆT ĐỐI';
      commentary = 'Trí nhớ đỉnh của chóp! Bạn nhớ từng chi tiết nhỏ nhất trong cuộc đời mình, như thể bạn có gắn chip nhớ SSD 1TB trong đầu vậy!';
    } else if (correct >= Math.ceil(total * 0.8)) {
      trophy = '🏆';
      rank = 'CHIẾN THẦN HOÀI NIỆM';
      commentary = 'Phong độ quá đẳng cấp! Bạn chỉ nhầm một chút ở những góc chụp hiểm hóc thôi, ký ức của bạn cực kỳ sắc bén!';
    } else if (correct >= Math.ceil(total * 0.6)) {
      trophy = '🌟';
      rank = 'NGƯỜI LỮ HÀNH TỈNH TÁO';
      commentary = 'Khá lắm! Đa số các mốc thời gian lớn bạn đều bắt chuẩn, chỉ có vài tấm quậy phá làm bạn hơi lú một tẹo.';
    } else if (correct >= Math.ceil(total * 0.4)) {
      trophy = '🤔';
      rank = 'KÝ ỨC CHẠY MẠNG 3G';
      commentary = 'Hình như não bộ đang load dữ liệu qua mạng 3G chập chờn? Lúc nhớ lúc quên, nhưng nhìn lại ảnh vẫn thấy xúc động đúng không!';
    } else {
      trophy = '🐟';
      rank = 'BỘ NHỚ CÁ VÀNG - CẦN RESET NÃO';
      commentary = 'Ủa đây là tôi sao? Ai chụp lúc nào vậy?! Bạn cần ngay một chuyến tham quan lại toàn bộ bảo tàng để phục hồi ký ức khẩn cấp!';
    }

    document.getElementById('result-trophy-icon').textContent = trophy;
    document.getElementById('result-rank-badge').textContent = rank;
    document.getElementById('result-commentary').textContent = commentary;
    if (!state.game.resultSaved) {
      state.game.resultSaved = true;
      if (authenticatedUser) {
        void saveGameScore().finally(() => { void loadLeaderboard(); });
      } else {
        const saveStatus = document.getElementById('leaderboard-save-status');
        if (saveStatus) saveStatus.textContent = 'Đăng nhập để lưu thành tích của lượt chơi này.';
        loadLeaderboard();
      }
    }
  }

  // ========================================================
  // 12. CHẾ ĐỘ CHIẾU PHIM TỰ ĐỘNG (CINEMA MEMORY REEL)
  // ========================================================
  function buildCinemaSlides(targetStageId) {
    const slides = [];
    if (!state.data || !state.data.stages) return slides;

    if (!targetStageId || targetStageId === 'all') {
      // Full Journey: All highlight memories from Lúc nhỏ to 2026
      state.data.stages.forEach(st => {
        const highlights = st.memories.filter(m => m.isHighlight);
        highlights.forEach(m => {
          slides.push({
            id: m.id,
            stageId: st.id,
            stageTitle: st.title,
            period: st.period,
            themeSong: st.themeSong,
            title: m.title,
            time: m.time || st.period,
            description: m.description || '',
            isQuote: (!m.image || m.image.length === 0),
            image: (m.image && m.image.length > 0) ? m.image[0] : null
          });
        });
      });
    } else {
      // Single Stage: Memories of this specific stage
      const stage = state.data.stages.find(s => s.id === targetStageId);
      if (stage) {
        let mems = stage.memories.filter(m => m.isHighlight);
        if (mems.length < 4) {
          const additional = stage.memories.filter(m => !m.isHighlight).slice(0, 6 - mems.length);
          mems = [...mems, ...additional];
        }
        mems.forEach(m => {
          slides.push({
            id: m.id,
            stageId: stage.id,
            stageTitle: stage.title,
            period: stage.period,
            themeSong: stage.themeSong,
            title: m.title,
            time: m.time || stage.period,
            description: m.description || '',
            isQuote: (!m.image || m.image.length === 0),
            image: (m.image && m.image.length > 0) ? m.image[0] : null
          });
        });
      }
    }

    return slides;
  }

  function startCinemaReel(targetStageId) {
    // 0. Pause background playlist
    pauseBgMusic(true);

    // 1. Pause any background audio from vinyl players
    if (state.currentAudio && !state.currentAudio.paused) {
      state.currentAudio.pause();
      if (state.currentAudioBtn) state.currentAudioBtn.innerHTML = '<span class="play-icon">▶</span>';
      if (state.currentVinyl) state.currentVinyl.classList.remove('spinning');
      if (state.currentDot) state.currentDot.classList.remove('active');
      const globalAudioToggle = document.getElementById('global-audio-toggle');
      if (globalAudioToggle) globalAudioToggle.classList.remove('playing');
    }

    // 2. Prepare Slides
    const slides = buildCinemaSlides(targetStageId);
    if (slides.length === 0) {
      alert('Không có kỷ niệm nào để trình chiếu.');
      return;
    }

    state.cinema.slides = slides;
    state.cinema.currentIndex = 0;
    state.cinema.isPlaying = true;
    state.cinema.elapsedMs = 0;
    state.cinema.currentTrackSrc = null;

    // 3. Update Mode Badge
    const badgeEl = document.getElementById('cinema-badge-mode');
    if (!targetStageId || targetStageId === 'all') {
      badgeEl.textContent = 'CHIẾU PHIM TOÀN HÀNH TRÌNH (2007 - 2026)';
    } else {
      const stage = state.data.stages.find(s => s.id === targetStageId);
      badgeEl.textContent = `PHIM KỶ NIỆM • ${stage ? stage.period.toUpperCase() : ''}`;
    }

    // 4. Render Progress Segment Bars (Stories style)
    const progRow = document.getElementById('cinema-progress-row');
    progRow.innerHTML = '';
    slides.forEach((_, idx) => {
      const seg = document.createElement('div');
      seg.className = 'cinema-seg';
      seg.dataset.index = idx;
      seg.innerHTML = '<div class="cinema-seg-fill"></div>';
      progRow.appendChild(seg);
    });

    // 5. Open Cinema Modal
    const modal = document.getElementById('cinema-modal');
    if (modal) {
      modal.hidden = false;
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      modal.inert = false;
    }
    document.body.style.overflow = 'hidden';

    // 6. Reset Controls UI
    document.getElementById('cinema-pause-icon').textContent = '⏸';
    const audioIcon = document.getElementById('cinema-audio-icon');
    audioIcon.textContent = state.cinema.isMuted ? '🔇' : '🔊';

    // 7. Show Slide 0 and start timer
    showCinemaSlide(0);
    startCinemaTimer();
  }

  function showCinemaSlide(index) {
    const { slides } = state.cinema;
    if (index < 0 || index >= slides.length) return;

    state.cinema.currentIndex = index;
    state.cinema.elapsedMs = 0;
    const slide = slides[index];

    // Update Progress Bars
    const segs = document.querySelectorAll('#cinema-progress-row .cinema-seg');
    segs.forEach((seg, sIdx) => {
      const fill = seg.querySelector('.cinema-seg-fill');
      if (sIdx < index) {
        seg.classList.add('completed');
        fill.style.width = '100%';
      } else if (sIdx === index) {
        seg.classList.remove('completed');
        fill.style.width = '0%';
      } else {
        seg.classList.remove('completed');
        fill.style.width = '0%';
      }
    });

    // Update Subtitles
    document.getElementById('cinema-sub-stage').textContent = slide.period;
    document.getElementById('cinema-sub-time').textContent = slide.time;
    document.getElementById('cinema-sub-title').textContent = slide.title;
    document.getElementById('cinema-sub-desc').textContent = slide.description || '';

    // Render Slide in Viewport
    const viewport = document.getElementById('cinema-slides-viewport');
    viewport.innerHTML = '';

    const slideEl = document.createElement('div');
    if (slide.isQuote) {
      slideEl.className = 'cinema-slide cinema-slide-quote active';
      slideEl.innerHTML = `
        <div class="cinema-quote-box">
          <div class="cinema-quote-mark">“</div>
          <h3 class="cinema-quote-title">${slide.title}</h3>
          <p class="cinema-quote-text">"${slide.description}"</p>
          <div class="cinema-quote-time">${slide.time}</div>
        </div>
      `;
    } else {
      slideEl.className = 'cinema-slide cinema-slide-photo active';
      slideEl.innerHTML = `
        <img class="cinema-img" src="${slide.image}" alt="${slide.title}" loading="lazy" decoding="async">
      `;
    }
    viewport.appendChild(slideEl);

    // Audio Synchronization
    const cinemaAudio = document.getElementById('cinema-audio');
    if (slide.themeSong && slide.themeSong.src) {
      if (state.cinema.currentTrackSrc !== slide.themeSong.src) {
        cinemaAudio.src = encodeURI(slide.themeSong.src);
        state.cinema.currentTrackSrc = slide.themeSong.src;
        cinemaAudio.muted = state.cinema.isMuted;
        cinemaAudio.dataset.startTimeApplied = 'false';
        applyStartTimeOnce(cinemaAudio, slide.themeSong.startTime);
        if (state.cinema.isPlaying) {
          cinemaAudio.play().catch(e => console.warn('Cinema audio play error:', e));
        }
      }
    }
  }

  function startCinemaTimer() {
    clearInterval(state.cinema.timer);
    const intervalMs = 50;

    state.cinema.timer = setInterval(() => {
      if (!state.cinema.isPlaying) return;

      state.cinema.elapsedMs += intervalMs;
      const pct = Math.min(100, (state.cinema.elapsedMs / state.cinema.slideDurationMs) * 100);

      const currentSeg = document.querySelector(`#cinema-progress-row .cinema-seg[data-index="${state.cinema.currentIndex}"] .cinema-seg-fill`);
      if (currentSeg) {
        currentSeg.style.width = `${pct}%`;
      }

      if (state.cinema.elapsedMs >= state.cinema.slideDurationMs) {
        nextCinemaSlide();
      }
    }, intervalMs);
  }

  function nextCinemaSlide() {
    const { slides, currentIndex } = state.cinema;
    if (currentIndex < slides.length - 1) {
      showCinemaSlide(currentIndex + 1);
    } else {
      closeCinemaReel();
    }
  }

  function prevCinemaSlide() {
    const { currentIndex } = state.cinema;
    if (currentIndex > 0) {
      showCinemaSlide(currentIndex - 1);
    } else {
      showCinemaSlide(0);
    }
  }

  function toggleCinemaPause() {
    state.cinema.isPlaying = !state.cinema.isPlaying;
    const icon = document.getElementById('cinema-pause-icon');
    icon.textContent = state.cinema.isPlaying ? '⏸' : '▶';

    const cinemaAudio = document.getElementById('cinema-audio');
    if (state.cinema.isPlaying) {
      cinemaAudio.play().catch(e => console.warn(e));
    } else {
      cinemaAudio.pause();
    }
  }

  function toggleCinemaAudio() {
    state.cinema.isMuted = !state.cinema.isMuted;
    const cinemaAudio = document.getElementById('cinema-audio');
    cinemaAudio.muted = state.cinema.isMuted;
    const icon = document.getElementById('cinema-audio-icon');
    icon.textContent = state.cinema.isMuted ? '🔇' : '🔊';
  }

  function closeCinemaReel() {
    clearInterval(state.cinema.timer);
    state.cinema.isPlaying = false;

    const cinemaAudio = document.getElementById('cinema-audio');
    if (cinemaAudio) {
      cinemaAudio.pause();
      cinemaAudio.currentTime = 0;
      state.cinema.currentTrackSrc = null;
    }

    const modal = document.getElementById('cinema-modal');
    if (modal) {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      modal.inert = true;
      modal.hidden = true;
    }

    const filmModal = document.getElementById('filmstrip-modal');
    const lightboxModal = document.getElementById('lightbox-modal');
    const gameModal = document.getElementById('game-modal');
    if (!filmModal.classList.contains('active') && !lightboxModal.classList.contains('active') && (!gameModal || !gameModal.classList.contains('active'))) {
      document.body.style.overflow = '';
    }

    // Resume background music if user has not muted
    if (state.bgMusic && !state.bgMusic.isUserMuted) {
      playBgMusic();
    }
  }

  // ========================================================
  // 13. GLOBAL EVENTS BINDING
  // ========================================================
  function initUtilityPanels() {
    const sections = {
      'rpg-achievements': document.getElementById('rpg-achievements'),
      'time-capsule': document.getElementById('time-capsule'),
      'ticket-station': document.getElementById('ticket-station')
    };

    function closeUtility(targetId) {
      const section = sections[targetId];
      const button = document.querySelector(`[data-utility-target="${targetId}"]`);
      if (section) {
        section.hidden = true;
        section.classList.remove('open');
      }
      if (button) button.setAttribute('aria-expanded', 'false');
    }

    function toggleUtility(targetId, shouldOpen = null) {
      const section = sections[targetId];
      if (!section) return;
      const isOpen = shouldOpen !== null ? shouldOpen : section.hidden;

      if (isOpen) {
        Object.keys(sections).forEach(id => {
          if (id !== targetId) closeUtility(id);
        });
        section.hidden = false;
        section.classList.add('open');
        const button = document.querySelector(`[data-utility-target="${targetId}"]`);
        if (button) button.setAttribute('aria-expanded', 'true');
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        closeUtility(targetId);
      }
    }

    function requestUtilityToggle(targetId) {
      const section = sections[targetId];
      if (!section) return;
      const shouldOpen = section.hidden;
      if (shouldOpen && (targetId === 'time-capsule' || targetId === 'ticket-station')) {
        if (targetId === 'ticket-station' && !authenticatedUser) {
          openFeatureAuthSeal('ticket');
          return;
        }
        if (targetId === 'ticket-station' && !hasDiscipleFeatureAccess()) return;
        if (!requireAuth(() => toggleUtility(targetId, true))) return;
      }
      toggleUtility(targetId, shouldOpen);
    }

    document.querySelectorAll('.utility-launch-btn').forEach(button => {
      button.addEventListener('click', () => {
        requestUtilityToggle(button.dataset.utilityTarget);
      });
    });

    document.querySelectorAll('.utility-section').forEach(section => {
      const closeBtn = document.createElement('button');
      closeBtn.type = 'button';
      closeBtn.className = 'utility-close-btn';
      closeBtn.setAttribute('aria-label', 'Thu gọn khu vực');
      closeBtn.textContent = '✕ Thu gọn';
      closeBtn.addEventListener('click', () => closeUtility(section.id));
      section.appendChild(closeBtn);
    });

    const navTicketBtn = document.getElementById('nav-ticket-btn');
    if (navTicketBtn) {
      navTicketBtn.addEventListener('click', () => {
        if (!authenticatedUser) {
          openFeatureAuthSeal('ticket');
          return;
        }
        if (!hasDiscipleFeatureAccess()) return;
        if (!requireAuth(() => toggleUtility('ticket-station', true))) return;
        toggleUtility('ticket-station', true);
      });
    }

    const heroTicketBtn = document.getElementById('btn-hero-ticket');
    if (heroTicketBtn) {
      heroTicketBtn.addEventListener('click', e => {
        e.preventDefault();
        if (!authenticatedUser) {
          openFeatureAuthSeal('ticket');
          return;
        }
        if (!hasDiscipleFeatureAccess()) return;
        if (!requireAuth(() => toggleUtility('ticket-station', true))) return;
        toggleUtility('ticket-station', true);
      });
    }
  }

  function bindGlobalEvents() {
    // Close Filmstrip Modal Events
    const btnCloseFilmstrip = document.getElementById('btn-close-filmstrip');
    const modalFilmstripBackdrop = document.getElementById('modal-filmstrip-backdrop');
    if (btnCloseFilmstrip) btnCloseFilmstrip.addEventListener('click', closeFilmstripModal);
    if (modalFilmstripBackdrop) modalFilmstripBackdrop.addEventListener('click', closeFilmstripModal);

    // Lightbox Controls Events
    const btnLightboxClose = document.getElementById('lightbox-btn-close');
    const lightboxBackdrop = document.getElementById('lightbox-backdrop');
    const btnLightboxPrev = document.getElementById('lightbox-btn-prev');
    const btnLightboxNext = document.getElementById('lightbox-btn-next');
    if (btnLightboxClose) btnLightboxClose.addEventListener('click', closeLightbox);
    if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
    if (btnLightboxPrev) btnLightboxPrev.addEventListener('click', prevLightboxImage);
    if (btnLightboxNext) btnLightboxNext.addEventListener('click', nextLightboxImage);
    document.addEventListener('click', event => {
      const target = event.target instanceof Element ? event.target : null;
      const likeButton = target && target.closest('[data-memory-like-button], #lightbox-memory-like');
      if (!likeButton) return;
      const found = findMemoryForLikeButton(likeButton);
      if (found) handleMemoryLikeClick(found.memory, found.stage, likeButton);
    });

    // Zoom Toggle in Lightbox
    const zoomBtn = document.getElementById('lightbox-btn-zoom');
    if (zoomBtn) {
      zoomBtn.addEventListener('click', () => {
        const wrapper = document.getElementById('lightbox-img-wrapper');
        if (!wrapper) return;
        state.lightbox.isZoomed = !state.lightbox.isZoomed;
        wrapper.classList.toggle('zoomed', state.lightbox.isZoomed);
        setLightboxTransform(state.lightbox.isZoomed ? 2.5 : 1, 0, 0);
      });
    }
    const lightboxWrapper = document.getElementById('lightbox-img-wrapper');
    if (lightboxWrapper) bindLightboxPan(lightboxWrapper);

    // Global Audio Toggle Button (Sticky Nav)
    const globalAudioToggle = document.getElementById('global-audio-toggle');
    if (globalAudioToggle) {
      globalAudioToggle.addEventListener('click', () => {
        if (state.currentAudio) {
          if (!state.currentAudio.paused) {
            state.currentAudio.pause();
            if (state.currentAudioBtn) state.currentAudioBtn.innerHTML = '<span class="play-icon">▶</span>';
            if (state.currentVinyl) state.currentVinyl.classList.remove('spinning');
            if (state.currentDot) state.currentDot.classList.remove('active');
            state.currentAudio = null;
            globalAudioToggle.classList.remove('playing');
            if (state.bgMusic && !state.bgMusic.isUserMuted) {
              playBgMusic();
            }
          }
        } else {
          toggleBgMusic();
        }
      });
    }

    // Game Trigger & Control Events
    const startAuthenticatedGame = () => {
      if (!authenticatedUser) {
        openFeatureAuthSeal('game');
        return;
      }
      if (!hasDiscipleFeatureAccess()) return;
      if (!requireAuth(startNewGame)) return;
      startNewGame();
    };
    const btnHeroGame = document.getElementById('btn-hero-game');
    if (btnHeroGame) btnHeroGame.addEventListener('click', startAuthenticatedGame);

    const btnNavGame = document.getElementById('btn-nav-game');
    if (btnNavGame) btnNavGame.addEventListener('click', startAuthenticatedGame);

    const btnCloseGame = document.getElementById('btn-close-game');
    if (btnCloseGame) btnCloseGame.addEventListener('click', closeGameModal);

    const modalGameBackdrop = document.getElementById('modal-game-backdrop');
    if (modalGameBackdrop) modalGameBackdrop.addEventListener('click', closeGameModal);

    document.querySelectorAll('[data-game-mode]').forEach(button => {
      button.addEventListener('click', () => {
        const mode = button.dataset.gameMode === 'death' ? 'death' : 'normal';
        if (state.game.mode === mode) return;
        state.game.mode = mode;
        document.querySelectorAll('[data-game-mode]').forEach(item => {
          const active = item.dataset.gameMode === mode;
          item.classList.toggle('active', active);
          item.setAttribute('aria-pressed', String(active));
        });
        if (document.getElementById('game-modal')?.classList.contains('active')) startAuthenticatedGame();
      });
    });

    document.querySelectorAll('[data-game-powerup]').forEach(button => {
      button.addEventListener('click', () => {
        const power = button.dataset.gamePowerup;
        const status = document.getElementById('game-hint-status');
        if (!power || state.game.usedPowerups.has(power) || state.game.hasAnswered) return;
        if (power === 'freeze' && state.game.mode !== 'death') {
          if (status) {
            status.textContent = 'Định Thần Phù chỉ có tác dụng trong chế độ Độ Kiếp Sinh Tử.';
            status.hidden = false;
          }
          return;
        }
        state.game.usedPowerups.add(power);
        button.disabled = true;
        if (power === 'fifty') {
          const correct = getGameAnswer(state.game.questions[state.game.currentIndex]);
          const wrongChoices = Array.from(document.querySelectorAll('.game-year-choice'))
            .filter(choice => choice.textContent !== correct);
          shuffleArray(wrongChoices).slice(0, Math.max(0, wrongChoices.length - 1))
            .forEach(choice => { choice.hidden = true; });
          if (status) status.textContent = 'Thiên Cơ Kính đã khai mở hai đáp án sai.';
        } else if (power === 'hint') {
          const question = state.game.questions[state.game.currentIndex];
          if (status) status.textContent = question.description || 'Tàn hồn này lưu dấu một khoảnh khắc trong hành trình tu luyện.';
        } else if (power === 'freeze') {
          stopGameTimer();
          if (status) status.textContent = 'Định Thần Phù đã đóng băng đồng hồ của câu hỏi này.';
        }
        if (status) status.hidden = false;
      });
    });

    const btnGameNext = document.getElementById('btn-game-next');
    if (btnGameNext) {
      btnGameNext.addEventListener('click', () => {
        state.game.currentIndex += 1;
        if (state.game.currentIndex < state.game.questions.length) {
          renderGameQuestion(state.game.currentIndex);
        } else {
          showGameResult();
        }
      });
    }

    const btnGameReplay = document.getElementById('btn-game-replay');
    if (btnGameReplay) btnGameReplay.addEventListener('click', startAuthenticatedGame);

    const btnGameExit = document.getElementById('btn-game-exit');
    if (btnGameExit) btnGameExit.addEventListener('click', closeGameModal);

    // Cinema Reel Trigger & Control Events
    const btnHeroCinema = document.getElementById('btn-hero-cinema');
    if (btnHeroCinema) {
      btnHeroCinema.addEventListener('click', () => {
        startCinemaReel('all');
      });
    }

    const cinemaBtnPause = document.getElementById('cinema-btn-pause');
    if (cinemaBtnPause) cinemaBtnPause.addEventListener('click', toggleCinemaPause);

    const cinemaBtnAudio = document.getElementById('cinema-btn-audio');
    if (cinemaBtnAudio) cinemaBtnAudio.addEventListener('click', toggleCinemaAudio);

    const cinemaBtnClose = document.getElementById('cinema-btn-close');
    if (cinemaBtnClose) cinemaBtnClose.addEventListener('click', closeCinemaReel);

    const zonePrev = document.getElementById('cinema-zone-prev');
    if (zonePrev) zonePrev.addEventListener('click', prevCinemaSlide);

    const zoneNext = document.getElementById('cinema-zone-next');
    if (zoneNext) zoneNext.addEventListener('click', nextCinemaSlide);

    const arrowPrev = document.getElementById('cinema-arrow-prev');
    if (arrowPrev) arrowPrev.addEventListener('click', prevCinemaSlide);

    const arrowNext = document.getElementById('cinema-arrow-next');
    if (arrowNext) arrowNext.addEventListener('click', nextCinemaSlide);

    // Keyboard Shortcuts (Esc to close modals, Arrow keys for Lightbox/Cinema)
    window.addEventListener('keydown', (e) => {
      const lightboxModal = document.getElementById('lightbox-modal');
      const filmModal = document.getElementById('filmstrip-modal');
      const gameModal = document.getElementById('game-modal');
      const cinemaModal = document.getElementById('cinema-modal');

      if (e.key === 'Escape') {
        if (cinemaModal && cinemaModal.classList.contains('active')) {
          closeCinemaReel();
        } else if (lightboxModal && lightboxModal.classList.contains('active')) {
          closeLightbox();
        } else if (filmModal && filmModal.classList.contains('active')) {
          closeFilmstripModal();
        } else if (gameModal && gameModal.classList.contains('active')) {
          closeGameModal();
        }
      } else if (cinemaModal && cinemaModal.classList.contains('active')) {
        if (e.key === 'ArrowLeft') {
          prevCinemaSlide();
        } else if (e.key === 'ArrowRight') {
          nextCinemaSlide();
        } else if (e.key === ' ') {
          e.preventDefault();
          toggleCinemaPause();
        }
      } else if (lightboxModal && lightboxModal.classList.contains('active')) {
        if (e.key === 'ArrowLeft') {
          prevLightboxImage();
        } else if (e.key === 'ArrowRight') {
          nextLightboxImage();
        }
      }
    });

    // Mobile Swipe Support for Lightbox
    let touchStartX = 0;
    let touchEndX = 0;
    const lightboxStage = document.querySelector('.lightbox-stage');

    if (lightboxStage) {
      lightboxStage.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0]?.screenX || 0;
      }, { passive: true });

      lightboxStage.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0]?.screenX || 0;
        handleSwipe();
      }, { passive: true });
    }

    function handleSwipe() {
      if (state.lightbox.isZoomed) return;
      const diff = touchEndX - touchStartX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          prevLightboxImage(); // Swiped right -> previous
        } else {
          nextLightboxImage(); // Swiped left -> next
        }
      }
    }

    // Global image-error guard: ẩn thẻ kỷ niệm nếu ảnh 404
    window.addEventListener('error', function (e) {
      const target = e.target;
      if (target && target.tagName === 'IMG') {
        // Tìm thẻ cha gần nhất là memory-card hoặc rpg-avatar (ảnh bìa stage)
        const card = target.closest('.memory-card');
        if (card) {
          card.style.display = 'none';
          return;
        }
        // Với ảnh cover trong rpg-avatar, chỉ ẩn img tránh khung vỡ
        const avatar = target.closest('.rpg-avatar');
        if (avatar) {
          target.style.visibility = 'hidden';
        }
      }
    }, true /* capture phase – bắt trước khi bubble */);
  }

  // ========================================================
  // 14. BƯỚC 4: QUẦY IN VÉ THAM QUAN LƯU NIỆM (SOUVENIR TICKET)
  // ========================================================
  function loadHtml2CanvasScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = () => {
        if (typeof window.html2canvas === 'function') resolve(window.html2canvas);
        else reject(new Error('Tập lệnh html2canvas đã tải nhưng không cung cấp thư viện.'));
      };
      script.onerror = () => reject(new Error(`Không thể tải html2canvas từ ${src}.`));
      document.head.appendChild(script);
    });
  }

  function ensureHtml2Canvas() {
    if (typeof window.html2canvas === 'function') return Promise.resolve(window.html2canvas);
    if (!html2CanvasPromise) {
      html2CanvasPromise = loadHtml2CanvasScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js')
        .catch(async cdnError => {
          try {
            return await loadHtml2CanvasScript('js/html2canvas.min.js');
          } catch (localError) {
            console.error('Không thể tải thư viện html2canvas:', cdnError, localError);
            throw localError;
          }
        })
        .catch(error => {
          html2CanvasPromise = null;
          throw error;
        });
    }
    return html2CanvasPromise;
  }

  function initTicketStation() {
    const stageSelect = document.getElementById('ticket-stage-select');
    const visitorInput = document.getElementById('ticket-visitor-name');
    const btnPrint = document.getElementById('btn-print-ticket');
    const btnDownload = document.getElementById('btn-download-ticket');
    const ticketEl = document.getElementById('souvenir-ticket');

    if (!ticketEl) return;

    // 1. Populate Stage Dropdown
    if (stageSelect && state.data && state.data.stages) {
      stageSelect.innerHTML = '';
      state.data.stages.forEach(stage => {
        const option = document.createElement('option');
        option.value = stage.id;
        option.textContent = `${stage.title} (${stage.yearRange || ''})`;
        stageSelect.appendChild(option);
      });
    }

    // 2. Extract pool of memorable quotes from memories.js
    const quotesPool = [];
    if (state.data && state.data.stages) {
      state.data.stages.forEach(stage => {
        if (stage.rpgProfile && stage.rpgProfile.quote) {
          quotesPool.push({
            text: stage.rpgProfile.quote,
            source: `${stage.title} • Nhật ký RPG`
          });
        }
        stage.memories.forEach(mem => {
          const desc = (mem.description || '').trim();
          if (desc && desc.length >= 25 && desc.length <= 260) {
            quotesPool.push({
              text: desc,
              source: `${mem.title} • ${mem.time || stage.title}`
            });
          } else if (mem.title && mem.title.length >= 25 && !mem.title.startsWith('IMG_') && !mem.title.startsWith('PXL_')) {
            quotesPool.push({
              text: mem.title,
              source: `${stage.title} • ${mem.time || ''}`
            });
          }
        });
      });
    }

    // Fallback quotes if pool is small
    if (quotesPool.length === 0) {
      quotesPool.push(
        { text: "Mỗi bức ảnh, mỗi dòng ghi chú ở đây đều là một mảnh ký ức thật trên hành trình lớn lên từ thuở nhỏ đến năm 2026.", source: SITE_NAME },
        { text: "Nơi lưu giữ những mảnh ghép thời gian, những cột mốc trưởng thành và cả những ngày bình yên không cần chụp ảnh.", source: "Lời tựa Khởi nguyên" },
        { text: "Thời gian trôi đi không lấy lại được, nhưng ký ức sẽ mãi ở lại trong tim người trân trọng nó.", source: "Góc tâm sự Tiến hóa" },
        { text: "Dù đi thật xa, hãy luôn nhớ về những ngày đầu tiên non nớt và ngây thơ nhất.", source: "Hành trình Tuổi thơ" },
        { text: "Cảm ơn bạn đã ghé thăm chuyến tàu thời gian và đồng hành cùng những ký ức tuyệt đẹp này.", source: "Lưu Niệm Tiến Hóa" }
      );
    }

    // 3. Helper to update ticket display
    function updateTicket(isInteractive = false) {
      // Visitor Name
      const rawName = visitorInput ? visitorInput.value.trim() : '';
      const visitorName = rawName || 'Khách tham quan ẩn danh';
      const stubVisitorName = visitorName.length > 14 ? visitorName.substring(0, 14) + '...' : visitorName;

      // Stage Title
      let stageTitle = 'Tuổi thơ hoài niệm';
      if (stageSelect) {
        const selectedOpt = stageSelect.options[stageSelect.selectedIndex];
        if (selectedOpt) {
          stageTitle = selectedOpt.textContent.split(' (')[0];
        }
      }

      // Real-time Visit Clock
      const now = new Date();
      const pad = (n) => String(n).padStart(2, '0');
      const d = pad(now.getDate());
      const m = pad(now.getMonth() + 1);
      const y = now.getFullYear();
      const h = pad(now.getHours());
      const min = pad(now.getMinutes());
      const sec = pad(now.getSeconds());
      const fullTimeStr = `${d}/${m}/${y} • ${h}:${min}:${sec}`;
      const shortDateStr = `${d}/${m}/${y}`;

      // Random Serial
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const serialCode = `#MEM-2026-${randomSuffix}`;
      const barcodeDigits = `2 0 2 6  ${randomSuffix}  ${Math.floor(100 + Math.random() * 900)}`;

      // Random Quote
      const randomQuote = quotesPool[Math.floor(Math.random() * quotesPool.length)];

      // DOM Updates
      const dispVisitor = document.getElementById('ticket-disp-visitor');
      const dispStubVisitor = document.getElementById('ticket-disp-stub-visitor');
      const dispStage = document.getElementById('ticket-disp-stage');
      const dispTime = document.getElementById('ticket-disp-time');
      const dispStubDate = document.getElementById('ticket-disp-stub-date');
      const dispSerial = document.getElementById('ticket-disp-serial');
      const dispStubSerial = document.getElementById('ticket-disp-stub-serial');
      const dispBarcode = document.getElementById('ticket-disp-barcode-num');
      const dispQuote = document.getElementById('ticket-disp-quote');
      const dispQuoteSource = document.getElementById('ticket-disp-quote-source');
      const stampYear = document.getElementById('ticket-stamp-year');

      if (dispVisitor) dispVisitor.textContent = visitorName;
      if (dispStubVisitor) dispStubVisitor.textContent = stubVisitorName;
      if (dispStage) dispStage.textContent = stageTitle;
      if (dispTime) dispTime.textContent = fullTimeStr;
      if (dispStubDate) dispStubDate.textContent = shortDateStr;
      if (dispSerial) dispSerial.textContent = serialCode;
      if (dispStubSerial) dispStubSerial.textContent = serialCode;
      if (dispBarcode) dispBarcode.textContent = barcodeDigits;
      if (dispQuote) dispQuote.textContent = `"${randomQuote.text}"`;
      if (dispQuoteSource) dispQuoteSource.textContent = `— ${randomQuote.source}`;
      if (stampYear) stampYear.textContent = y.toString();

      if (isInteractive) {
        ticketEl.classList.remove('print-pulse');
        window.requestAnimationFrame(() => ticketEl.classList.add('print-pulse'));
      }
    }

    // Initial render of ticket with live time
    updateTicket(false);

    // 4. Print Button Click Event
    if (btnPrint) {
      btnPrint.addEventListener('click', () => {
        if (!requireAuth(() => btnPrint.click())) return;
        if (!hasDiscipleFeatureAccess()) return;
        updateTicket(true);
        void awardCultivation(15, 'In Vé Lưu Niệm', {
          claimField: 'ticket_claimed',
          sourceElement: btnPrint
        });
      });
    }

    // 5. Download Ticket as PNG Event (html2canvas)
    if (btnDownload) {
      btnDownload.addEventListener('click', async () => {
        if (!requireAuth(() => btnDownload.click())) return;
        if (!hasDiscipleFeatureAccess()) return;
        let renderHtml2Canvas;
        try {
          renderHtml2Canvas = await ensureHtml2Canvas();
        } catch (error) {
          alert('Không thể tải thư viện tạo ảnh vé. Vui lòng kiểm tra kết nối mạng và thử lại.');
          return;
        }

        const dlText = document.getElementById('btn-dl-text');
        const originalText = dlText ? dlText.textContent : 'Tải vé về máy (.PNG)';
        
        btnDownload.disabled = true;
        if (dlText) dlText.textContent = '⏳ Đang kết xuất ảnh vé...';

        const dispSerial = document.getElementById('ticket-disp-serial');
        const serialNum = dispSerial ? dispSerial.textContent.replace(/[^a-zA-Z0-9-]/g, '') : 'MEM-2026';

        // Options for sharp, high-DPI output with zero canvas taint
        renderHtml2Canvas(ticketEl, {
          scale: 2, // 2x high resolution Retina canvas
          useCORS: true,
          logging: false,
          backgroundColor: null,
          onclone: (clonedDoc) => {
            const clonedTicket = clonedDoc.getElementById('souvenir-ticket');
            if (clonedTicket) {
              clonedTicket.style.width = '780px';
              clonedTicket.style.maxWidth = '780px';
              clonedTicket.style.minWidth = '780px';
              clonedTicket.style.transform = 'none';
            }
          }
        }).then(canvas => {
          const imageURL = canvas.toDataURL('image/png');
          const downloadLink = document.createElement('a');
          downloadLink.download = `ve-luu-niem-${serialNum}.png`;
          downloadLink.href = imageURL;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);

          if (dlText) dlText.textContent = '✅ Đã tải vé thành công!';
          setTimeout(() => {
            if (dlText) dlText.textContent = originalText;
            btnDownload.disabled = false;
          }, 2400);
        }).catch(err => {
          console.error('Lỗi khi xuất ảnh vé bằng html2canvas:', err);
          alert('Có lỗi xảy ra khi tạo ảnh vé. Vui lòng thử lại!');
          if (dlText) dlText.textContent = originalText;
          btnDownload.disabled = false;
        });
      });
    }
  }

  // ========================================================
  // 15. PHÁT NHẠC GIAI ĐOẠN ĐỒNG BỘ (NÂNG CẤP 3)
  // ========================================================
  function playStageAudio(stageId) {
    const audio = document.getElementById(`audio-${stageId}`);
    const playBtn = document.getElementById(`play-btn-${stageId}`);
    const vinyl = document.getElementById(`vinyl-${stageId}`);
    const dot = document.getElementById(`dot-${stageId}`);

    if (!audio || !playBtn) return;

    // 1. Tạm dừng nhạc nền tổng
    pauseBgMusic(true);

    // 2. Tạm dừng các giai đoạn khác đang phát
    if (state.currentAudio && state.currentAudio !== audio) {
      state.currentAudio.pause();
      if (state.currentAudioBtn) state.currentAudioBtn.innerHTML = '<span class="play-icon">▶</span>';
      if (state.currentVinyl) state.currentVinyl.classList.remove('spinning');
      if (state.currentDot) state.currentDot.classList.remove('active');
    }

    // 3. Kích hoạt phát nhạc giai đoạn này
    audio.play().then(() => {
      playBtn.innerHTML = '<span class="pause-icon">⏸</span>';
      if (vinyl) vinyl.classList.add('spinning');
      if (dot) dot.classList.add('active');

      state.currentAudio = audio;
      state.currentAudioBtn = playBtn;
      state.currentVinyl = vinyl;
      state.currentDot = dot;

      const globalAudioBtn = document.getElementById('global-audio-toggle');
      if (globalAudioBtn) globalAudioBtn.classList.add('playing');
    }).catch(err => {
      console.warn(`Không thể phát nhạc cho giai đoạn ${stageId}:`, err);
    });
  }

  // ========================================================
  // 16. NHẠC NỀN PHÁT THEO YÊU CẦU & TRÁO NGẪU NHIÊN (NÂNG CẤP 2)
  // ========================================================
  function initBackgroundMusic() {
    // ── Danh sách nhạc nền thực tế trong audio/nhạc nền/ ──
    const BG_TRACKS = [
      {
        src: encodeURI('audio/nhạc nền/YTDown.com_YouTube_Media_-yHCeSZ-Nik_Multifandom-Dancin_009_128k.mp3'),
        title: 'Dancin – Multifandom',
        startTime: 15
      },
      {
        src: encodeURI('audio/nhạc nền/YTSave.to_YouTube_Media_a-q4IO-plBo_Tinh-Vệ-精卫-Kasber-Remix-Nhạc-Trung-Tu-Tiên-Remix-Suy_009_vbr.mp3'),
        title: 'Tinh Vệ – Kasber Remix'
      },
      {
        src: encodeURI('audio/nhạc nền/YTSave.to_YouTube_Media_GrAchTdepsU_24kGoldn-Mood-Official-Video-ft-iann-dior_009_vbr.mp3'),
        title: 'Mood – 24kGoldn ft. iann dior',
        startTime: 6
      },
      {
        src: encodeURI('audio/nhạc nền/YTSave.to_YouTube_Media_JGwWNGJdvx8_Ed-Sheeran-Shape-of-You-Official-Music-Video_011_vbr.mp3'),
        title: 'Shape of You – Ed Sheeran',
        startTime: 5
      },
      {
        src: encodeURI('audio/nhạc nền/YTSave.to_YouTube_Media_kqFLQG484pg_Lukas-Graham-7-Years_009_vbr.mp3'),
        title: '7 Years – Lukas Graham',
        startTime: 15
      },
      {
        src: encodeURI('audio/nhạc nền/YTSave.to_YouTube_Media_VmdfTTJ3NaA_Passenger-let-her-go-lyrics_009_vbr.mp3'),
        title: 'Let Her Go – Passenger',
        startTime: 26
      }
    ];

    // Tráo ngẫu nhiên danh sách (Fisher-Yates) để bài đầu tiên là ngẫu nhiên
    const shuffled = [...BG_TRACKS];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    state.bgMusic.playlist = shuffled;
    state.bgMusic.currentIndex = 0;
    state.bgMusic.audio.volume = 0.5;
    state.bgMusic.audio.preload = 'none';
    state.bgMusic.isUserMuted = true;
    state.bgMusic.isPlaying = false;
    state.bgMusic.savedPlaybackState = readBackgroundMusicState();
    if (state.bgMusic.savedPlaybackState) {
      const savedSource = normalizeMusicSource(state.bgMusic.savedPlaybackState.src);
      const savedIndex = shuffled.findIndex(track => normalizeMusicSource(track.src) === savedSource);
      if (savedIndex >= 0) {
        state.bgMusic.resumeTime = Math.max(0, Number(state.bgMusic.savedPlaybackState.currentTime) || 0);
        loadBgMusicTrack(savedIndex);
        restoreBackgroundMusicPosition();
      }
    }

    // Hết bài → chuyển ngẫu nhiên bài khác (tránh lặp bài vừa phát)
    state.bgMusic.audio.addEventListener('ended', () => {
      nextBgMusicTrack();
    });

    state.bgMusic.audio.addEventListener('play', () => {
      state.bgMusic.isPlaying = true;
      state.bgMusic.isUserMuted = false;
      updateBgMusicUI();
    });

    state.bgMusic.audio.addEventListener('pause', () => {
      if (state.bgMusic.isUserMuted) {
        state.bgMusic.isPlaying = false;
        updateBgMusicUI();
      }
    });

    updateBgMusicUI();

    // Nút Bật/Tắt nhạc nền nổi
    const toggleBtn = document.getElementById('bg-music-toggle-btn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', toggleBgMusic);
    }

    const playerWidget = document.getElementById('floating-bg-player');
    const collapseBtn = document.getElementById('bg-music-collapse-btn');
    if (toggleBtn && playerWidget) {
      toggleBtn.addEventListener('click', event => {
        if (window.matchMedia && window.matchMedia('(max-width: 767px)').matches &&
            !playerWidget.classList.contains('is-expanded')) {
          event.stopImmediatePropagation();
          playerWidget.classList.add('is-expanded');
          toggleBtn.setAttribute('aria-expanded', 'true');
          updateBgMusicUI();
        }
      }, true);
    }
    if (collapseBtn && playerWidget && toggleBtn) {
      collapseBtn.addEventListener('click', () => {
        playerWidget.classList.remove('is-expanded');
        toggleBtn.setAttribute('aria-expanded', 'false');
        updateBgMusicUI();
      });
    }

    // Nút Chuyển ngẫu nhiên bài kế tiếp
    const nextBtn = document.getElementById('bg-music-next-btn');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextBgMusicTrack();
      });
    }

    registerBackgroundMusicPersistence();
  }

  function normalizeMusicSource(source) {
    if (!source) return '';
    try {
      return new URL(source, window.location.href).href;
    } catch (error) {
      return '';
    }
  }

  function readBackgroundMusicState() {
    try {
      const saved = JSON.parse(window.sessionStorage.getItem(MUSIC_SESSION_KEY) || 'null');
      if (!saved || typeof saved !== 'object') return null;
      return {
        isPlaying: saved.isPlaying === true,
        currentTime: Number.isFinite(Number(saved.currentTime)) ? Math.max(0, Number(saved.currentTime)) : 0,
        src: typeof saved.src === 'string' ? saved.src : ''
      };
    } catch (error) {
      console.warn('Không thể khôi phục trạng thái nhạc giữa các trang:', error);
      return null;
    }
  }

  function persistBackgroundMusicState() {
    const audio = state.bgMusic.audio;
    const src = audio.currentSrc || audio.src ||
      (state.bgMusic.playlist[state.bgMusic.currentIndex] || {}).src || '';
    try {
      window.sessionStorage.setItem(MUSIC_SESSION_KEY, JSON.stringify({
        isPlaying: Boolean(
          state.bgMusic.autoplayAwaitingGesture ||
          (state.bgMusic.isPlaying && !state.bgMusic.isUserMuted && !audio.paused)
        ),
        currentTime: Number.isFinite(audio.currentTime) ? audio.currentTime : 0,
        src
      }));
    } catch (error) {
      console.warn('Không thể lưu trạng thái nhạc giữa các trang:', error);
    }
  }

  function registerBackgroundMusicPersistence() {
    window.addEventListener('pagehide', persistBackgroundMusicState);
    document.addEventListener('click', event => {
      const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
      if (!link || link.target === '_blank') return;
      try {
        const destination = new URL(link.href, window.location.href);
        if (destination.origin === window.location.origin &&
            destination.pathname !== window.location.pathname) {
          persistBackgroundMusicState();
        }
      } catch (error) {
        console.warn('Không thể lưu trạng thái trước khi chuyển trang:', error);
      }
    }, true);
  }

  function restoreBackgroundMusicPosition() {
    const audio = state.bgMusic.audio;
    const applyPosition = () => {
      if (!state.bgMusic.resumeTime || !Number.isFinite(audio.duration)) return;
      audio.currentTime = Math.min(state.bgMusic.resumeTime, Math.max(0, audio.duration - 0.1));
      state.bgMusic.resumeTime = 0;
    };
    if (audio.readyState >= 1) applyPosition();
    else audio.addEventListener('loadedmetadata', applyPosition, { once: true });
  }

  async function startConfiguredBackgroundMusic(forceAutoplay = false) {
    const saved = state.bgMusic.savedPlaybackState;
    const shouldResume = saved && saved.isPlaying;
    if (!forceAutoplay && !shouldResume && !state.featureToggles.autoPlayMusic) return;
    if (!forceAutoplay && saved && !saved.isPlaying) return;

    if (!state.bgMusic.audio.src && state.bgMusic.playlist.length > 0) {
      loadBgMusicTrack(state.bgMusic.currentIndex || 0);
    }
    restoreBackgroundMusicPosition();
    state.bgMusic.isUserMuted = false;
    state.bgMusic.autoplayAwaitingGesture = true;
    updateBgMusicUI();
    const played = await playBgMusic();
    if (played) {
      state.bgMusic.autoplayAwaitingGesture = false;
      return;
    }
    installAutoplayGestureListeners();
  }

  function installAutoplayGestureListeners() {
    if (state.bgMusic.autoplayGestureHandler) return;
    const handler = event => {
      if (!state.bgMusic.autoplayAwaitingGesture) return;
      const target = event.target instanceof Element ? event.target : null;
      if (target && target.closest('#bg-music-toggle-btn, #global-audio-toggle')) return;
      state.bgMusic.isUserMuted = false;
      void playBgMusic().then(played => {
        if (!played) return;
        state.bgMusic.autoplayAwaitingGesture = false;
        removeAutoplayGestureListeners();
      });
    };
    state.bgMusic.autoplayGestureHandler = handler;
    ['pointerdown', 'touchstart', 'click', 'keydown', 'scroll'].forEach(type => {
      window.addEventListener(type, handler, { capture: true, passive: true });
    });
  }

  function removeAutoplayGestureListeners() {
    const handler = state.bgMusic.autoplayGestureHandler;
    if (!handler) return;
    ['pointerdown', 'touchstart', 'click', 'keydown', 'scroll'].forEach(type => {
      window.removeEventListener(type, handler, true);
    });
    state.bgMusic.autoplayGestureHandler = null;
  }

  function loadBgMusicTrack(index) {
    if (!state.bgMusic.playlist || state.bgMusic.playlist.length === 0) return;
    state.bgMusic.currentIndex = index % state.bgMusic.playlist.length;
    const track = state.bgMusic.playlist[state.bgMusic.currentIndex];
    state.bgMusic.startTimeApplied = false;
    state.bgMusic.audio.dataset.startTimeApplied = 'false';
    state.bgMusic.audio.src = track.src;
    applyStartTimeOnce(state.bgMusic.audio, track.startTime);

    const titleEl = document.getElementById('bg-music-current-title');
    if (titleEl) {
      titleEl.textContent = track.title;
      titleEl.title = track.title;
    }
  }

  function playBgMusic() {
    // Quy tắc chống đè nhạc: Chỉ 1 nguồn phát tại một thời điểm
    if (state.currentAudio && !state.currentAudio.paused) return Promise.resolve(false);
    if (state.cinema && state.cinema.isPlaying) return Promise.resolve(false);

    if (!state.bgMusic.audio.src && state.bgMusic.playlist.length > 0) {
      loadBgMusicTrack(state.bgMusic.currentIndex || 0);
    }

    return state.bgMusic.audio.play().then(() => {
      state.bgMusic.isPlaying = true;
      updateBgMusicUI();
      persistBackgroundMusicState();
      return true;
    }).catch(err => {
      console.warn('Không thể tự phát nhạc nền:', err);
      return false;
    });
  }

  function pauseBgMusic(temporary = false) {
    if (!state.bgMusic.audio) return;
    state.bgMusic.audio.pause();
    state.bgMusic.isPlaying = false;
    if (!temporary) {
      state.bgMusic.isUserMuted = true;
      persistBackgroundMusicState();
    }
    updateBgMusicUI();
  }

  function toggleBgMusic() {
    if (state.bgMusic.isPlaying && !state.bgMusic.isUserMuted) {
      // Đang phát thật sự → tắt
      pauseBgMusic(false);
    } else {
      // Đang tắt (do user mute hoặc bị block autoplay) → bật
      state.bgMusic.isUserMuted = false;
      // Dừng nhạc giai đoạn nếu có
      if (state.currentAudio) {
        state.currentAudio.pause();
        if (state.currentAudioBtn) state.currentAudioBtn.innerHTML = '<span class="play-icon">▶</span>';
        if (state.currentVinyl) state.currentVinyl.classList.remove('spinning');
        if (state.currentDot) state.currentDot.classList.remove('active');
        state.currentAudio = null;
      }
      playBgMusic();
    }
    persistBackgroundMusicState();
  }

  function nextBgMusicTrack() {
    // Chọn ngẫu nhiên bài khác (tránh lặp bài vừa phát nếu có >= 2 bài)
    const list = state.bgMusic.playlist;
    let nextIdx = state.bgMusic.currentIndex;
    if (list.length > 1) {
      do {
        nextIdx = Math.floor(Math.random() * list.length);
      } while (nextIdx === state.bgMusic.currentIndex);
    }
    loadBgMusicTrack(nextIdx);
    if (state.bgMusic.isUserMuted) state.bgMusic.isUserMuted = false;
    if (!state.currentAudio && (!state.cinema || !state.cinema.isPlaying)) {
      playBgMusic();
    }
    persistBackgroundMusicState();
  }

  function updateBgMusicUI() {
    const playerWidget = document.getElementById('floating-bg-player');
    const diskIcon = document.getElementById('bg-disk-icon');
    const toggleBtn = document.getElementById('bg-music-toggle-btn');
    const globalAudioToggle = document.getElementById('global-audio-toggle');

    const isActive = !state.bgMusic.isUserMuted;
    const isMobile = Boolean(window.matchMedia && window.matchMedia('(max-width: 767px)').matches);
    const isExpanded = Boolean(playerWidget && playerWidget.classList.contains('is-expanded'));

    if (isActive && !state.currentAudio) {
      if (playerWidget) playerWidget.classList.add('playing');
      if (globalAudioToggle) globalAudioToggle.classList.add('playing');
    } else {
      if (playerWidget) playerWidget.classList.remove('playing');
      if (globalAudioToggle && !state.currentAudio) globalAudioToggle.classList.remove('playing');
    }
    if (diskIcon) diskIcon.textContent = '🎵';
    if (toggleBtn) {
      toggleBtn.title = isMobile && !isExpanded
        ? 'Mở trình phát nhạc'
        : isActive ? 'Tạm dừng nhạc nền' : 'Bật nhạc nền tổng';
      toggleBtn.setAttribute('aria-label', toggleBtn.title);
      toggleBtn.setAttribute('aria-expanded', String(isMobile && isExpanded));
    }
    if (globalAudioToggle) {
      globalAudioToggle.title = isActive ? 'Tạm dừng Nhạc Dưỡng Thần' : 'Bật Nhạc Dưỡng Thần';
      globalAudioToggle.setAttribute('aria-label', 'Nhạc Dưỡng Thần');
    }
  }

  // ========================================================
  // MỤC 1: RPG ACHIEVEMENTS
  // ========================================================
  function initAchievements() {
    const cards = document.querySelectorAll('.achievement-card');
    if (!cards.length) return;

    // Toast helper for locked achievements or messages
    let toastEl = document.getElementById('rpg-achievement-toast');
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.id = 'rpg-achievement-toast';
      toastEl.className = 'rpg-toast';
      toastEl.setAttribute('role', 'alert');
      document.body.appendChild(toastEl);
    }

    let toastTimer = null;
    function showToast(message, icon = '🔒') {
      if (toastTimer) clearTimeout(toastTimer);
      toastEl.innerHTML = `<span style="font-size: 1.25rem;">${icon}</span><span>${message}</span>`;
      toastEl.classList.add('show');
      toastTimer = setTimeout(() => {
        toastEl.classList.remove('show');
      }, 3500);
    }

    function handleCardActivation(card) {
      const isLocked = card.dataset.locked === 'true';
      if (isLocked) {
        showToast('Cần đạt Level 22 (năm 2027) để mở khóa thành tựu này!', '🔒');
        return;
      }

      const targetId = card.dataset.targetStage;
      if (!targetId) return;

      const targetElement = document.getElementById(targetId);
      if (!targetElement) {
        console.warn('Không tìm thấy mục tiêu giai đoạn:', targetId);
        return;
      }

      // Smooth scroll to target stage
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Trigger 2-second border highlight pulse
      targetElement.classList.remove('achievement-highlight-pulse');
      const aura = document.createElement('span');
      aura.className = 'achievement-highlight-aura';
      aura.setAttribute('aria-hidden', 'true');
      targetElement.appendChild(aura);
      window.requestAnimationFrame(() => targetElement.classList.add('achievement-highlight-pulse'));

      setTimeout(() => {
        targetElement.classList.remove('achievement-highlight-pulse');
        aura.remove();
      }, 2000);
    }

    cards.forEach(card => {
      card.addEventListener('click', () => handleCardActivation(card));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardActivation(card);
        }
      });
    });
  }

  // ========================================================
  // MỤC 2: HỘP THỜI GIAN GỬI TUỔI 22 (TIME CAPSULE)
  // ========================================================
  function initTimeCapsule() {
    const section = document.getElementById('time-capsule');
    if (!section) return;

    // Toast helper
    let toastEl = document.getElementById('rpg-achievement-toast');
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.id = 'rpg-achievement-toast';
      toastEl.className = 'rpg-toast';
      toastEl.setAttribute('role', 'alert');
      document.body.appendChild(toastEl);
    }

    let toastTimer = null;
    function showToast(message, icon = '🔒') {
      if (toastTimer) clearTimeout(toastTimer);
      toastEl.innerHTML = `<span style="font-size: 1.25rem;">${icon}</span><span>${message}</span>`;
      toastEl.classList.add('show');
      toastTimer = setTimeout(() => {
        toastEl.classList.remove('show');
      }, 3500);
    }

    // 1. Countdown Logic
    const daysEl = document.getElementById('countdown-days');
    const hoursEl = document.getElementById('countdown-hours');
    const minsEl = document.getElementById('countdown-mins');
    const secsEl = document.getElementById('countdown-secs');
    const targetDate = new Date('2027-01-01T00:00:00');

    function updateCountdown() {
      const now = new Date();
      const diff = targetDate - now;

      if (diff <= 0) {
        if (daysEl) daysEl.textContent = '000';
        if (hoursEl) hoursEl.textContent = '00';
        if (minsEl) minsEl.textContent = '00';
        if (secsEl) secsEl.textContent = '00';
        return;
      }

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);

      if (daysEl) daysEl.textContent = d.toString().padStart(3, '0');
      if (hoursEl) hoursEl.textContent = h.toString().padStart(2, '0');
      if (minsEl) minsEl.textContent = m.toString().padStart(2, '0');
      if (secsEl) secsEl.textContent = s.toString().padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // 2. Storage & Default Data
    const STORAGE_KEY = 'haithanh_time_capsules';
    const DEFAULT_CAPSULES = [
      {
        id: 'capsule-default-1',
        sender: 'Hải Thành (Bản thể 2026)',
        tag: 'goal',
        tagLabel: '🎯 Mục tiêu tuổi 22',
        date: '20/11/2026, 12:00',
        message: 'Tốt nghiệp đúng hạn, master thêm một framework mới, tự tin làm chủ các dự án lớn và có một chuyến đi xa khám phá thế giới!',
        isDefault: true
      },
      {
        id: 'capsule-default-2',
        sender: 'Hải Thành',
        tag: 'wish',
        tagLabel: '💌 Lời nhắn nhủ',
        date: '20/11/2026, 14:30',
        message: 'Dù sau này cuộc sống có bận rộn hay deadline dồn dập đến đâu, nhớ giữ gìn sức khỏe, ngủ đủ giấc và đừng quên lý do mình đã bắt đầu hành trình này!',
        isDefault: true
      },
      {
        id: 'capsule-default-3',
        sender: 'Chiến hữu phòng code',
        tag: 'prophecy',
        tagLabel: '😂 Lời tiên tri hài hước',
        date: '20/11/2026, 18:15',
        message: 'Tiên tri tuổi 22: Hải Thành vẫn chưa chịu hết bug ngay từ lần đầu compile, nhưng tài khoản ngân hàng sẽ nhảy số nhiều hơn năm nay và skill fix bug thì lên tầm thượng thừa :))',
        isDefault: true
      }
    ];

    function loadCapsules() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {
        console.warn('Lỗi đọc time capsules:', e);
      }
      return [...DEFAULT_CAPSULES];
    }

    function saveCapsules(list) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      } catch (e) {
        console.warn('Lỗi lưu time capsules:', e);
      }
    }

    let capsules = loadCapsules();

    // 3. Render Capsules List
    const listContainer = document.getElementById('capsule-items-container');
    const badgeCount = document.getElementById('capsule-total-badge');
    let unlockTimer = null;

    function normalizeUnlockDate(value) {
      const timestamp = Date.parse(value || '');
      return Number.isFinite(timestamp) ? new Date(timestamp).toISOString() : '';
    }

    function guestbookFingerprint(item) {
      return `${item.sender || ''}\u0000${item.message || ''}\u0000${normalizeUnlockDate(item.unlockDate)}`;
    }

    function formatCapsuleDate(value) {
      const date = new Date(value);
      return Number.isNaN(date.getTime())
        ? String(value || '')
        : date.toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' });
    }

    async function loadGuestbook() {
      if (!supabaseClient) return;
      try {
        const { data, error } = await supabaseClient
          .from('guestbook')
          .select('sender_name, message, unlock_date');
        if (error) throw error;
        if (!Array.isArray(data)) return;

        const remoteEntries = data.map((row, index) => ({
          id: `guestbook-${index}`,
          isGuestbook: true,
          isDefault: false,
          sender: String(row.sender_name || 'Người bạn ẩn danh'),
          tag: 'wish',
          tagLabel: '💌 Lời nhắn nhủ',
          date: formatCapsuleDate(row.unlock_date),
          message: String(row.message || ''),
          unlockDate: row.unlock_date || ''
        }));
        const remoteFingerprints = new Set(remoteEntries.map(guestbookFingerprint));
        const localEntries = capsules.filter(item =>
          !item.isGuestbook || !remoteFingerprints.has(guestbookFingerprint(item))
        );
        capsules = [...remoteEntries, ...localEntries];
        renderCapsules();
      } catch (error) {
        console.warn('Không thể tải Sổ Lưu Bút trực tuyến; tiếp tục dùng lời nhắn cục bộ:', error);
      }
    }

    function renderCapsules() {
      if (!listContainer) return;
      listContainer.innerHTML = '';
      if (unlockTimer) clearTimeout(unlockTimer);

      if (badgeCount) {
        badgeCount.textContent = `${capsules.length} viên nang`;
      }

      const nextUnlock = capsules
        .filter(item => item.isGuestbook && item.unlockDate)
        .map(item => Date.parse(item.unlockDate))
        .filter(timestamp => Number.isFinite(timestamp) && timestamp > Date.now())
        .sort((left, right) => left - right)[0];
      if (nextUnlock) {
        unlockTimer = setTimeout(
          renderCapsules,
          Math.min(nextUnlock - Date.now() + 50, 2147483647)
        );
      }

      if (capsules.length === 0) {
        listContainer.innerHTML = `
          <div class="capsule-empty-state">
            <div class="capsule-empty-icon">⏳</div>
            <p>Hộp thời gian đang trống. Hãy là người đầu tiên niêm phong một thông điệp ý nghĩa!</p>
          </div>
        `;
        return;
      }

      capsules.forEach(c => {
        const unlockTimestamp = c.isGuestbook && c.unlockDate ? Date.parse(c.unlockDate) : NaN;
        const dateLocked = Number.isFinite(unlockTimestamp) && unlockTimestamp > Date.now();
        const lockMessage = dateLocked
          ? `Đang phong ấn tới ${formatCapsuleDate(c.unlockDate)}`
          : 'Nội dung đã niêm phong';
        const card = document.createElement('div');
        card.className = 'capsule-card';
        if (dateLocked) card.classList.add('is-date-locked');
        card.id = `card-${escapeHtml(c.id)}`;
        const cultivationBadge = c.cultivationRank
          ? `<span class="cultivation-rank-badge">${escapeHtml(c.cultivationRank)}</span>`
          : '';

        card.innerHTML = `
          <div class="capsule-card-top">
            <div class="capsule-sender-info">
              <span class="capsule-sender-icon">${c.isDefault ? '💎' : '👤'}</span>
              <span class="capsule-sender-name">${escapeHtml(c.sender)}</span>
              ${cultivationBadge}
            </div>
            <span class="capsule-tag-pill tag-${escapeHtml(c.tag)}">${escapeHtml(c.tagLabel)}</span>
          </div>
          <div class="capsule-meta-date">
            <span>🕒 Niêm phong: ${escapeHtml(c.date)}</span>
          </div>
          <div class="capsule-sealed-banner">
            <div class="capsule-sealed-status">
              <span class="status-icon">🔒</span>
              <span class="status-text">${escapeHtml(lockMessage)}</span>
            </div>
            <button type="button" class="capsule-btn-toggle" data-id="${escapeHtml(c.id)}" aria-label="${dateLocked ? escapeHtml(lockMessage) : 'Mở niêm phong thông điệp'}" ${dateLocked ? 'disabled' : ''}>
              <span class="toggle-text">${dateLocked ? `🔒 ${escapeHtml(lockMessage)}` : '👁️ Mở niêm phong'}</span>
            </button>
          </div>
          <div class="capsule-message-body">
            <p>${escapeHtml(c.message)}</p>
          </div>
          ${!c.isDefault && !c.isGuestbook ? `
          <div class="capsule-card-footer">
            <button type="button" class="capsule-btn-delete" data-id="${escapeHtml(c.id)}" title="Xóa viên nang này" aria-label="Xóa">
              <span>🗑️ Xóa</span>
            </button>
          </div>` : ''}
        `;

        // Toggle Open/Close Event
        const toggleBtn = card.querySelector('.capsule-btn-toggle');
        const toggleText = card.querySelector('.toggle-text');
        const statusIcon = card.querySelector('.status-icon');
        const statusText = card.querySelector('.status-text');

        toggleBtn.addEventListener('click', () => {
          if (dateLocked) return;
          const isRevealed = card.classList.toggle('revealed');
          if (isRevealed) {
            toggleText.textContent = '🔒 Thu gọn';
            statusIcon.textContent = '🔓';
            statusText.textContent = 'Đã mở khóa xem';
          } else {
            toggleText.textContent = '👁️ Mở niêm phong';
            statusIcon.textContent = '🔒';
            statusText.textContent = 'Nội dung đã niêm phong';
          }
        });

        // Delete Event (User created only)
        const deleteBtn = card.querySelector('.capsule-btn-delete');
        if (deleteBtn) {
          deleteBtn.addEventListener('click', () => {
            if (confirm('Bạn có chắc chắn muốn xóa viên nang này khỏi Hộp Thời Gian không?')) {
              capsules = capsules.filter(item => item.id !== c.id);
              saveCapsules(capsules);
              renderCapsules();
              showToast('Đã xóa viên nang thành công!', '🗑️');
            }
          });
        }

        listContainer.appendChild(card);
      });
    }

    renderCapsules();
    void loadGuestbook();

    // 4. Form Character Counter
    const senderInput = document.getElementById('capsule-sender');
    const tagSelect = document.getElementById('capsule-tag');
    const messageInput = document.getElementById('capsule-message');
    const charCountEl = document.getElementById('capsule-char-count');
    const sealBtn = document.getElementById('btn-seal-capsule');

    if (messageInput && charCountEl) {
      messageInput.addEventListener('input', () => {
        charCountEl.textContent = messageInput.value.length;
      });
    }

    // 5. Seal Submission Handler
    if (sealBtn) {
      sealBtn.addEventListener('click', async () => {
        if (!requireAuth(() => sealBtn.click())) return;
        if (!hasDiscipleFeatureAccess()) return;
        const sender = senderInput.value.trim() || 'Người bạn bí ẩn';
        const tagVal = tagSelect.value;
        const tagText = tagSelect.options[tagSelect.selectedIndex].text;
        const message = messageInput.value.trim();

        if (!message) {
          showToast('Vui lòng nhập nội dung trước khi niêm phong!', '⚠️');
          messageInput.focus();
          return;
        }

        sealBtn.disabled = true;
        const now = new Date();
        const formattedDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}, ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

        const unlockDate = new Date('2027-01-01T00:00:00+07:00').toISOString();
        let savedOnline = false;
        let syncError = null;
        if (supabaseClient) {
          try {
            let result = await supabaseClient.from('guestbook').insert({
              user_id: authenticatedUser.id,
              sender_name: sender,
              message,
              unlock_date: unlockDate
            });
            if (result.error && /user_id/i.test(`${result.error.message || ''} ${result.error.details || ''}`)) {
              console.warn('Bảng guestbook chưa có cột user_id; lời nhắn sẽ được lưu nhưng thiếu liên kết Cảnh Giới.');
              result = await supabaseClient.from('guestbook').insert({
                sender_name: sender,
                message,
                unlock_date: unlockDate
              });
            }
            if (result.error) throw result.error;
            savedOnline = true;
          } catch (error) {
            syncError = error;
            console.warn('Không thể đồng bộ lời nhắn lên sổ lưu bút:', error);
          }
        }

        if (savedOnline) {
          await awardCultivation(20, 'Gửi lời nhắn Sổ Lưu Bút', {
            claimField: 'guestbook_claimed',
            sourceElement: sealBtn
          });
        }

        const newCapsule = {
          id: 'capsule-' + Date.now(),
          sender: sender,
          cultivationRank: savedOnline ? getCultivationRank(state.cultivation.tuVi).name : '',
          tag: tagVal,
          tagLabel: tagText,
          date: formattedDate,
          message: message,
          isDefault: false,
          isGuestbook: savedOnline,
          unlockDate
        };

        capsules.unshift(newCapsule);
        saveCapsules(capsules);

        // Reset form
        messageInput.value = '';
        senderInput.value = '';
        if (charCountEl) charCountEl.textContent = '0';

        renderCapsules();

        // Highlight newly added card
        const newCard = document.getElementById(`card-${newCapsule.id}`);
        if (newCard) {
          newCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          newCard.style.borderColor = 'var(--primary-gold)';
          setTimeout(() => {
            newCard.style.borderColor = '';
          }, 2000);
        }

        if (savedOnline) {
          showToast('Đã lưu lời nhắn vào sổ lưu bút trực tuyến!', '🎉');
        } else {
          const reason = syncError ? ' Chưa thể đồng bộ lên sổ trực tuyến.' : ' Hiện chỉ lưu trên thiết bị này.';
          showToast(`Đã lưu lời nhắn cục bộ.${reason}`, '📡');
        }
        sealBtn.disabled = false;
      });
    }
  }

  // DOM Content Loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
