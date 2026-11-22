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
  const GENESIS_PREFACE = '"Nơi lưu giữ toàn bộ quá trình độ kiếp từ một phàm nhân hay ngủ nướng thành Kiến Trúc Sư Gõ Phím tuổi 21. Đạo hữu ghé thăm xin nhẹ tay tặng chút Linh Thạch, chớ dại trêu chọc Thành Chủ kẻo bị tế lên Thiên Kiêu Bảng!"';
  const HERO_INTRO = '"Chào mừng đạo hữu hạ phàm ghé thăm thánh địa của Thành Chủ Hải Thành! Nơi đây phong ấn toàn bộ huyết lệ từ thuở luyện khí còn sợ bug đến khi độ kiếp thành chiến thần gõ phím Lv.21. Đã lỡ chân bước vào thì đừng vội quay xe — hãy dâng chút Linh Thạch lấy hên rồi cùng khám phá thiên cơ!"';
  const INVITE_URL = 'https://haithanh05.github.io/thien_menh_chi_thanh';
  const INVITE_MESSAGE = `Mời đạo hữu ghé thăm Thiên Mệnh Chi Thành – nơi Thành Chủ Hải Thành lưu giữ hành trình độ kiếp từ phàm nhân sợ bug đến chiến thần gõ phím: ${INVITE_URL}`;
  const GENESIS_IMAGE = 'images/%E1%BA%A3nh%20ch%C3%ADnh/avt.jpg';
  const CULTIVATION_PROFILE_COLUMNS = 'user_id,display_name,tu_vi,last_daily_claim,daily_like_xp,last_like_date,ticket_claimed,guestbook_claimed,updated_at';
  const supabaseClient = window.supabase && typeof window.supabase.createClient === 'function'
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;
  let authenticatedUser = null;
  let pendingAuthAction = null;
  let activeAuthMode = 'login';
  let pauseCanvasAnimation = null;

  // State Management
  const state = {
    data: null,
    currentFilter: 'all', // 'all' | 'photos' | 'quotes'
    siteSettings: {},
    cultivationOverrides: {},
    customAttributes: {},
    originalMemoriesByStage: new Map(),
    hiddenMemories: new Set(),
    adminMemoryFilter: 'all',
    archive: {
      memories: [],
      renderedCount: 0,
      closeTimer: null
    },
    adminEditingMemory: null,
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
      isPlaying: true,
      isUserMuted: false
    },
    lightbox: {
      images: [],
      items: [],
      currentIndex: 0,
      memory: null,
      isZoomed: false
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
      lastWrongLine: ''
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
      const pointsRank = getCultivationRank(displayedPoints);
      const rankLabel = pointsRank.name
        .replace(' Nhập Môn', '')
        .replace(' Kỳ', '')
        .replace(' Đại Năng', '');
      navLabel.textContent = rankLabel;
      if (navTotal) {
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
        ? 'Chí Tôn • 9999'
        : `${rankLabel} • ${displayedPoints}`);
    }
    if (!authenticatedUser) return;
    const points = Math.max(0, Number(state.cultivation.tuVi) || 0);
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

  function localDateKey(date = new Date()) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
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
    state.data.stages.forEach(stage => {
      const section = document.getElementById(`stage-${stage.id}`);
      if (!section) return;
      const levelBadge = section.querySelector('.rpg-avatar-lv');
      const levelName = section.querySelector('.rpg-level-name');
      const fate = section.querySelector('.rpg-fate-badge');
      const mainStats = section.querySelector('.stat-bar-group');
      const subStats = section.querySelector('.rpg-substats-grid');
      if (levelBadge) levelBadge.textContent = getCultivationLevel(stage);
      if (levelName) levelName.textContent = getCultivationLevelName(stage);
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
        .in('key', ['cultivation_overrides', 'custom_attributes', 'visitor_config', 'hidden_memories']);
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
      const visitorConfig = state.siteSettings.visitor_config || {};
      state.visitor.visible = visitorConfig.visible === true;
      refreshCultivationStageCards();
      renderStages();
      renderAdminMemoryList();
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
      if (count != null) state.visitor.count = count;

      const { data: configRow, error: settingsError } = await supabaseClient.from('site_settings')
        .select('value')
        .eq('key', 'visitor_config')
        .maybeSingle();
      if (settingsError) throw settingsError;
      const config = parseSettingValue(configRow && configRow.value);
      state.siteSettings.visitor_config = config;
      state.visitor.visible = config.visible === true;
      if (count == null) {
        state.visitor.count = getVisitorCount(config.count ?? config.visitor_count) || 0;
      }
      updateVisitorBadge();
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
    state.cultivation.tuVi = Math.max(0, Number(effectiveProfile && effectiveProfile.tu_vi) || 0);
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
    return {
      user_id: user.id,
      display_name: String(values.display_name || getUserDisplayName(user)),
      tu_vi: Math.max(0, Number(values.tu_vi) || 0),
      last_daily_claim: normalizeDateKey(values.last_daily_claim),
      daily_like_xp: Math.max(0, Number(values.daily_like_xp) || 0),
      last_like_date: normalizeDateKey(values.last_like_date),
      ticket_claimed: Boolean(values.ticket_claimed),
      guestbook_claimed: Boolean(values.guestbook_claimed),
      updated_at: new Date().toISOString()
    };
  }

  async function fetchCultivationProfile(userId) {
    const result = await supabaseClient.from('user_cultivation')
      .select(CULTIVATION_PROFILE_COLUMNS)
      .eq('user_id', userId)
      .maybeSingle();
    if (result.error) throw result.error;
    return result.data;
  }

  async function claimDailyCultivation(user, profile) {
    const today = localDateKey();
    if (normalizeDateKey(profile && profile.last_daily_claim) === today) return false;
    const updatedProfile = buildCultivationPayload(user, profile, {
      tu_vi: (Number(profile && profile.tu_vi) || 0) + 20,
      last_daily_claim: today
    });
    const { error } = await supabaseClient.from('user_cultivation')
      .upsert(updatedProfile, { onConflict: 'user_id' });
    if (error) throw error;

    applyCultivationProfile(updatedProfile);
    showCultivationToast('+20 Tu Vi · Điểm danh hằng ngày', '☀️');
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
      const { error } = await supabaseClient.from('user_cultivation')
        .upsert(syncedProfile, { onConflict: 'user_id' });
      if (error) throw error;
      applyCultivationProfile(syncedProfile);
      const dailyClaim = state.cultivation.awardQueue.then(async () => {
        const latestProfile = await fetchCultivationProfile(user.id);
        if (state.cultivation.userId !== user.id) return;
        if (isAdminUser(user)) {
          applyCultivationProfile({ ...(latestProfile || syncedProfile), tu_vi: 9999 });
        } else {
          await claimDailyCultivation(user, latestProfile);
        }
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
        tu_vi: (Number(profile && profile.tu_vi) || 0) + awardedPoints
      });

      const { error } = await supabaseClient.from('user_cultivation')
        .upsert(updatedProfile, { onConflict: 'user_id' });
      if (error) throw error;
      if (authenticatedUser?.id !== user.id) return false;

      applyCultivationProfile({ ...(profile || {}), ...updatedProfile });
      showCultivationToast(`+${awardedPoints} Tu Vi · ${reason}`, '✨');
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

  function getMemoryLikeId(stage, memory) {
    return String(memory.dbId != null ? memory.dbId : `${stage.id}:${memory.id}`);
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
      setMemoryLikeStatus(button, 'Linh mạch dữ liệu hiện chưa kết nối.', true);
      return;
    }

    const memoryId = getMemoryLikeId(stage, memory);
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
      if (button.dataset.memoryId !== String(memory.id)) return;

      const count = Number(countResult.count) || 0;
      const isLiked = Boolean(ownResult.data);
      const countLabel = button.querySelector('.memory-like-count');
      if (countLabel) countLabel.textContent = String(count);
      button.classList.toggle('is-liked', isLiked);
      button.setAttribute('aria-pressed', String(isLiked));
      setMemoryLikeStatus(button, '');
    } catch (error) {
      console.error('Không thể tải số Linh Thạch:', error);
      if (button.dataset.memoryId === String(memory.id)) {
        setMemoryLikeStatus(button, 'Chưa thể tải Linh Thạch. Vui lòng thử lại.', true);
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
    const memoryId = getMemoryLikeId(stage, memory);
    button.disabled = true;
    setMemoryLikeStatus(button, 'Đang truyền Linh Thạch…');
    try {
      const { data: existingLike, error: lookupError } = await supabaseClient.from('memory_likes')
        .select('memory_id')
        .eq('memory_id', memoryId)
        .eq('user_id', authenticatedUser.id)
        .maybeSingle();
      if (lookupError) throw lookupError;

      if (existingLike) {
        const { error } = await supabaseClient.from('memory_likes')
          .delete()
          .eq('memory_id', memoryId)
          .eq('user_id', authenticatedUser.id);
        if (error) throw error;
      } else {
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
        await awardCultivation(10, 'Dâng Linh Thạch', { dailyLike: true });
      }
    } catch (error) {
      console.error('Không thể cập nhật Linh Thạch:', error);
      setMemoryLikeStatus(button, 'Không thể cập nhật Linh Thạch. Vui lòng thử lại.', true);
    } finally {
      button.disabled = false;
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
        memories: Array.isArray(stage.memories) ? [...stage.memories] : [],
        themeSong: stage.themeSong || { title: 'Giai điệu hoài niệm', src: '', startTime: 0 }
      }));
      state.originalMemoriesByStage = new Map(state.data.stages.map(stage => [
        stage.id,
        stage.memories.filter(memory => !memory.isDynamic)
      ]));

      initHeroSection();
      initStickyNav();
      initThemeSwitcher();
      renderStages();
      initCultivationBackground();
      initXianxiaCanvas();
      initAchievements();
      initTimeCapsule();
      initTicketStation();
      initBackgroundMusic();
      bindGlobalEvents();
      initModalNavbarSync();
      initUtilityPanels();
      initAuthPortal();
      initLeaderboardTabs();
      void loadDynamicMemories();
      void loadSiteSettings().then(() => initVisitorCounter());
      void loadLeaderboard();
    } catch (e) {
      console.error('Không thể khởi tạo trang:', e);
    }
  }

  function findStageForMemoryRow(row) {
    const stageKey = String(row.stage || row.stage_id || '');
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
      isDynamic: true,
      sortOrder: row.sort_order == null ? Number.MAX_SAFE_INTEGER : Number(row.sort_order) || 0,
      title: String(row.title || 'Kỷ niệm mới'),
      time: String(row.time || row.created_at || ''),
      month: row.month == null || row.month === '' ? null : Number(row.month),
      description: String(row.description || ''),
      image: images,
      mediaType: isVideoUrl(images[0]) ? 'video' : 'image',
      tag: 'Kỷ niệm',
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
      if (indexTag) {
        indexTag.textContent = `${presentation.eyebrow} • ${count} MẢNH KÝ ỨC`;
      }
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

  async function loadDynamicMemories() {
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
    document.body.style.overflow = '';
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
    void visibleForm.offsetWidth;
    visibleForm.classList.add('auth-form-enter');
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
      if (admin) renderAdminMemoryList();
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
    authenticatedUser = user || null;
    renderAuthState(authenticatedUser);
    refreshVisibleMemoryLikes();
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
      if (cultivationSync) void cultivationSync.finally(action);
      else action();
    } else if (!authenticatedUser && wasAuthenticated) {
      pendingAuthAction = null;
      closeProtectedFeatures();
    }
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
    if (!status) return;
    status.textContent = message;
    status.classList.toggle('is-error', isError);
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
    if (!status) return;
    status.textContent = message;
    status.classList.toggle('is-error', isError);
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

  function activateAdminPanel(panelId) {
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
  }

  function syncAdminSettingsForm() {
    const visitorToggle = document.getElementById('admin-visitor-visible');
    if (visitorToggle) visitorToggle.checked = state.visitor.visible;
    const stageSelect = document.getElementById('admin-cultivation-stage');
    if (stageSelect) populateAdminCultivationForm(stageSelect.value);
  }

  function initAdminSettingsControls() {
    const dashboardTabs = Array.from(document.querySelectorAll('[data-admin-panel-target]'));
    dashboardTabs.forEach(tab => {
      tab.addEventListener('click', () => activateAdminPanel(tab.dataset.adminPanelTarget));
    });
    const initialDashboardTab = dashboardTabs.find(tab => tab.getAttribute('aria-selected') === 'true') || dashboardTabs[0];
    if (initialDashboardTab) activateAdminPanel(initialDashboardTab.dataset.adminPanelTarget);

    document.querySelectorAll('[data-admin-memory-filter]').forEach(button => {
      button.addEventListener('click', () => {
        const filter = button.dataset.adminMemoryFilter;
        const hasStage = filter === 'all' || state.data.stages.some(stage => stage.id === filter);
        if (!hasStage) return;
        state.adminMemoryFilter = filter;
        renderAdminMemoryList();
      });
    });

    const visitorToggle = document.getElementById('admin-visitor-visible');
    if (visitorToggle) {
      visitorToggle.addEventListener('change', async () => {
        if (!isAdminUser()) {
          visitorToggle.checked = state.visitor.visible;
          setAdminToolStatus('admin-visitor-status', 'Chỉ Admin mới được đổi cài đặt này.', true);
          return;
        }
        const previousConfig = state.siteSettings.visitor_config || {};
        const nextConfig = { ...previousConfig, visible: visitorToggle.checked };
        visitorToggle.disabled = true;
        try {
          await saveSiteSetting('visitor_config', nextConfig);
          state.visitor.visible = nextConfig.visible;
          updateVisitorBadge();
          setAdminToolStatus('admin-visitor-status', nextConfig.visible
            ? 'Đã bật huy hiệu Đạo Hữu Lỡ Bước Nhập Môn.'
            : 'Đã ẩn huy hiệu Đạo Hữu Lỡ Bước Nhập Môn.');
        } catch (error) {
          visitorToggle.checked = state.visitor.visible;
          setAdminToolStatus('admin-visitor-status', `Không thể lưu cài đặt: ${error.message || 'Lỗi kết nối.'}`, true);
        } finally {
          visitorToggle.disabled = false;
        }
      });
    }

    const stageSelect = document.getElementById('admin-cultivation-stage');
    if (stageSelect) {
      stageSelect.addEventListener('change', () => populateAdminCultivationForm(stageSelect.value));
    }

    const cultivationForm = document.getElementById('admin-cultivation-form');
    if (cultivationForm) {
      cultivationForm.addEventListener('submit', async event => {
        event.preventDefault();
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
  }

  function initAuthPortal() {
    const modal = document.getElementById('auth-modal');
    const headerButton = document.getElementById('btn-header-auth');
    const loginForm = document.getElementById('auth-login-form');
    const signupForm = document.getElementById('auth-signup-form');
    const memoryForm = document.getElementById('admin-memory-form');
    if (!modal || !loginForm || !signupForm || !memoryForm) return;

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

    memoryForm.addEventListener('submit', async event => {
      event.preventDefault();
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
      const fileInput = document.getElementById('admin-memory-image');
      const file = fileInput.files && fileInput.files[0];
      const editing = state.adminEditingMemory;
      const submitButton = memoryForm.querySelector('button[type="submit"]');
      const videoExtension = file && (file.type.startsWith('video/') || isVideoUrl(file.name))
        ? getVideoExtension(file)
        : '';
      const videoFile = Boolean(videoExtension);
      if ((!editing && !file) || (file && !file.type.startsWith('image/') && !videoFile)) {
        setAdminStatus('Hãy chọn ảnh hoặc video MP4, WebM, MOV, OGV hợp lệ.', true);
        return;
      }

      if (submitButton) submitButton.disabled = true;
      setAdminStatus(editing
        ? 'Đang cập nhật kỷ niệm…'
        : videoFile ? 'Đang tải video và khai ấn kỷ niệm…' : 'Đang nén ảnh và khai ấn kỷ niệm…');
      let uploadedPath = '';
      let recordInserted = false;
      try {
        let publicUrl = editing && editing.memory.image && editing.memory.image[0]
          ? editing.memory.image[0]
          : '';
        if (file) {
          const uploadedFile = videoFile ? file : await compressImage(file);
          const extension = videoFile ? videoExtension : 'jpg';
          const filePath = `${stageId}/${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${extension}`;
          const { data: uploaded, error: uploadError } = await supabaseClient.storage
            .from('museum-images')
            .upload(filePath, uploadedFile, {
              contentType: videoFile ? getVideoContentType(file, extension) : 'image/jpeg',
              upsert: false
            });
          if (uploadError) throw uploadError;
          uploadedPath = uploaded.path;

          const { data: publicData } = supabaseClient.storage.from('museum-images').getPublicUrl(uploadedPath);
          if (!publicData || !publicData.publicUrl) throw new Error('Không lấy được đường dẫn ảnh công khai.');
          publicUrl = publicData.publicUrl;
        }

        const targetStage = state.data.stages.find(item => item.id === stageId);
        if (!targetStage) throw new Error('Không tìm thấy giai đoạn đã chọn.');
        const existingCount = targetStage.memories.filter(item => item.isDynamic && item !== (editing && editing.memory)).length;
        const recordFields = {
          stage: stageId,
          title,
          time,
          description,
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
          if (file) {
            const oldImagePath = getMuseumImagePath(editing.memory.image && editing.memory.image[0]);
            if (oldImagePath) {
              const { error: oldImageError } = await supabaseClient.storage.from('museum-images').remove([oldImagePath]);
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
        renderAdminMemoryList();
        refreshOpenArchive(targetStage);
        resetAdminMemoryForm();
        setAdminStatus(editing ? 'Đã cập nhật kỷ niệm.' : 'Đã đăng kỷ niệm mới thành công.');
      } catch (error) {
        let cleanupMessage = '';
        if (uploadedPath && !recordInserted) {
          try {
            const { error: cleanupError } = await supabaseClient.storage
              .from('museum-images')
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
      cancelEditButton.addEventListener('click', () => {
        resetAdminMemoryForm();
        setAdminStatus('Đã hủy chỉnh sửa.');
      });
    }

    if (new URLSearchParams(window.location.search).get('admin') === '1') {
      openAuthModal();
    }
  }

  function renderAdminMemoryList() {
    const list = document.getElementById('admin-memory-list');
    if (!list || !state.data) return;
    list.replaceChildren();
    const filter = state.adminMemoryFilter || 'all';
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
    });
    if (!memories.length) {
      const empty = document.createElement('p');
      empty.className = 'admin-memory-empty';
      empty.textContent = filter === 'all'
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
        editButton.textContent = 'Sửa';
        editButton.addEventListener('click', () => editDynamicMemory(stage, memory));
        const moveUpButton = document.createElement('button');
        moveUpButton.type = 'button';
        moveUpButton.className = 'admin-secondary-button';
        moveUpButton.textContent = '↑';
        moveUpButton.setAttribute('aria-label', `Di chuyển ${memory.title} lên`);
        moveUpButton.disabled = index === 0;
        moveUpButton.addEventListener('click', () => moveDynamicMemory(stage, memory, -1));
        const moveDownButton = document.createElement('button');
        moveDownButton.type = 'button';
        moveDownButton.className = 'admin-secondary-button';
        moveDownButton.textContent = '↓';
        moveDownButton.setAttribute('aria-label', `Di chuyển ${memory.title} xuống`);
        moveDownButton.disabled = index === stageMemories.length - 1;
        moveDownButton.addEventListener('click', () => moveDynamicMemory(stage, memory, 1));
        actions.append(editButton, moveUpButton, moveDownButton);
      }
      const removeButton = document.createElement('button');
      removeButton.type = 'button';
      removeButton.className = 'admin-delete-button';
      removeButton.textContent = '🗑️ Xóa Ảnh / Kỷ Niệm';
      removeButton.addEventListener('click', () => isOriginal
        ? hideOriginalMemory(stage, memory, removeButton)
        : deleteDynamicMemory(stage, memory, removeButton));
      actions.appendChild(removeButton);
      item.append(label, actions);
      list.appendChild(item);
    });
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
    activateAdminPanel('admin-panel-add-memory');
    state.adminEditingMemory = { stage, memory };
    stageInput.value = stage.id;
    document.getElementById('admin-memory-title').value = memory.title;
    document.getElementById('admin-memory-time').value = memory.time;
    document.getElementById('admin-memory-description').value = memory.description;
    imageInput.value = '';
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
    if (imageInput) imageInput.required = true;
    if (title) title.textContent = 'Thêm Kỷ Niệm Mới';
    if (submitButton) submitButton.textContent = 'Tải ảnh/video & khai ấn kỷ niệm';
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
    if (!window.confirm(`Xóa kỷ niệm “${memory.title}”?`)) return;
    button.disabled = true;
    setAdminStatus('Đang xóa kỷ niệm…');

    try {
      const { error } = await supabaseClient.from('memories').delete().eq('id', memory.dbId);
      if (error) throw error;
      stage.memories = stage.memories.filter(item => item !== memory);
      updateStageMemoryCounts();
      renderAdminMemoryList();
      refreshOpenArchive(stage);

      const imagePath = getMuseumImagePath(memory.image[0]);
      if (imagePath) {
        try {
          const { error: storageError } = await supabaseClient.storage.from('museum-images').remove([imagePath]);
          if (storageError) {
            setAdminStatus(`Đã xóa bản ghi nhưng chưa dọn được ảnh: ${storageError.message}`, true);
            return;
          }
        } catch (storageError) {
          setAdminStatus(`Đã xóa bản ghi nhưng chưa dọn được ảnh: ${storageError.message || 'Lỗi kết nối.'}`, true);
          return;
        }
      }
      setAdminStatus('Đã xóa kỷ niệm.');
    } catch (error) {
      button.disabled = false;
      setAdminStatus(`Không thể xóa kỷ niệm: ${error.message || 'Lỗi kết nối.'}`, true);
    }
  }

  function getMuseumImagePath(imageUrl) {
    if (typeof imageUrl !== 'string') return '';
    try {
      const pathname = new URL(imageUrl).pathname;
      const marker = '/storage/v1/object/public/museum-images/';
      const index = pathname.indexOf(marker);
      return index < 0 ? '' : decodeURIComponent(pathname.slice(index + marker.length));
    } catch (error) {
      return '';
    }
  }

  async function insertDynamicMemory(fields, publicUrl) {
    const baseRecord = { ...fields };
    let result = await supabaseClient
      .from('memories')
      .insert({ ...baseRecord, image_url: publicUrl })
      .select()
      .single();

    if (result.error && isMissingDatabaseColumn(result.error, 'image_url')) {
      result = await supabaseClient
        .from('memories')
        .insert({ ...baseRecord, image: publicUrl })
        .select()
        .single();
    }
    if (result.error && isMissingDatabaseColumn(result.error, 'sort_order')) {
      const withoutSortOrder = { ...baseRecord };
      delete withoutSortOrder.sort_order;
      result = await supabaseClient
        .from('memories')
        .insert({ ...withoutSortOrder, image_url: publicUrl })
        .select()
        .single();
      if (result.error && isMissingDatabaseColumn(result.error, 'image_url')) {
        result = await supabaseClient
          .from('memories')
          .insert({ ...withoutSortOrder, image: publicUrl })
          .select()
          .single();
      }
    }
    if (result.error) throw result.error;
    return result.data;
  }

  async function updateDynamicMemoryRecord(memory, fields, publicUrl) {
    let imageField = 'image_url';
    let includeSortOrder = true;
    for (let attempt = 0; attempt < 4; attempt += 1) {
      const payload = { ...fields, [imageField]: publicUrl };
      if (!includeSortOrder) delete payload.sort_order;
      const result = await supabaseClient.from('memories')
        .update(payload)
        .eq('id', memory.dbId)
        .select()
        .single();
      if (!result.error) return result.data;
      if (imageField === 'image_url' && isMissingDatabaseColumn(result.error, 'image_url')) {
        imageField = 'image';
        continue;
      }
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
    const stars = Array.from({ length: 190 }, () => ({
      x: Math.random(),
      y: Math.random(),
      radius: Math.random() * 1.35 + 0.25,
      phase: Math.random() * Math.PI * 2,
      color: Math.random() > 0.78 ? '#f5d98b' : Math.random() > 0.55 ? '#8de8d4' : '#e8f5f2'
    }));
    const motes = Array.from({ length: 38 }, () => ({
      x: Math.random(),
      y: Math.random(),
      speed: Math.random() * 0.018 + 0.006,
      sway: Math.random() * 0.025 + 0.006,
      phase: Math.random() * Math.PI * 2,
      radius: Math.random() * 1.8 + 0.7,
      jade: Math.random() > 0.5
    }));
    const leaves = Array.from({ length: 13 }, () => ({
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
    let meteor = null;
    let nextMeteorAt = 6;
    const startedAt = performance.now();

    const resize = () => {
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
      draw((now - startedAt) / 1000);
      frameId = window.requestAnimationFrame(animate);
    };
    const start = () => {
      if (reducedMotion || document.hidden || canvasPaused || frameId) return;
      frameId = window.requestAnimationFrame(animate);
    };
    const stop = () => {
      if (!frameId) return;
      window.cancelAnimationFrame(frameId);
      frameId = 0;
    };
    let canvasPaused = false;
    pauseCanvasAnimation = paused => {
      canvasPaused = paused;
      if (paused) stop();
      else start();
    };

    resize();
    start();
    window.addEventListener('resize', resize, { passive: true });
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
      '#cinema-modal.active'
    ];

    function syncModalNavbar() {
      const hasOpenModal = modalSelectors.some(selector => document.querySelector(selector)) ||
        Boolean(document.querySelector('.admin-modal.active'));
      document.body.classList.toggle('modal-open', hasOpenModal);
      if (pauseCanvasAnimation) pauseCanvasAnimation(hasOpenModal);

      const nav = document.getElementById('sticky-header');
      const themeDropdown = document.getElementById('theme-selector-dropdown');
      if (nav) nav.style.display = hasOpenModal ? 'none' : '';
      if (themeDropdown) themeDropdown.style.display = hasOpenModal ? 'none' : '';
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

    const inviteButton = document.getElementById('btn-invite-friends');
    if (inviteButton) {
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

    window.addEventListener('scroll', () => {
      if (window.innerWidth <= 768) return;
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      if (scrollLine) scrollLine.style.width = `${progress}%`;

      // Determine active section
      const stageSections = document.querySelectorAll('.stage-section');
      let currentSectionId = '';

      stageSections.forEach(sec => {
        const top = sec.offsetTop - 120;
        const height = sec.offsetHeight;
        if (scrollTop >= top && scrollTop < top + height) {
          currentSectionId = sec.id.replace('stage-', '');
        }
      });

      navChips.forEach(chip => {
        if (chip.dataset.stageId === currentSectionId) {
          chip.classList.add('active');
        } else {
          chip.classList.remove('active');
        }
      });
    }, { passive: true });
  }

  // ========================================================
  // 4. RENDER STAGES, RPG CARDS, MUSIC PLAYERS & HIGHLIGHTS
  // ========================================================
  function renderStages() {
    const container = document.getElementById('stages-container');
    if (!container) return;
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

      // Top Header Block
      let html = `
        <div class="container">
          <div class="stage-header-block">
            <span class="stage-index-tag stage-eyebrow">${escapeHtml(presentation.eyebrow)}</span>
            <h2 class="stage-main-title stage-title">${escapeHtml(presentation.title)}</h2>
          </div>

          <!-- Stage RPG & Music Top Row -->
          <div class="stage-top-grid">
            
            <!-- RPG Character Profile Card -->
            <div class="rpg-card">
              <div class="rpg-header">
                <div class="rpg-avatar" data-stage-id="${escapeHtml(stage.id)}">
                  <img src="${escapeHtml(stage.coverImage)}" alt="${escapeHtml(stage.title)}" loading="lazy" decoding="async">
                  <span class="rpg-avatar-lv">${escapeHtml(getCultivationLevel(stage))}</span>
                </div>
                <div class="rpg-title-group">
                  <span class="rpg-badge-tag">☯ BẢNG THUỘC TÍNH TU TIÊN • CẢNH GIỚI</span>
                  <h3 class="rpg-level-name">${escapeHtml(getCultivationLevelName(stage))}</h3>
                  <div class="rpg-fate-badge">🔮 Mệnh Cách: ${escapeHtml(getCultivationFate(stage.id))}</div>
                </div>
              </div>

              <div class="rpg-stats-container">
                <!-- Primary Stats (Progress Bars) -->
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
            <button class="btn-open-archive" data-stage-id="${stage.id}">
              <span class="archive-icon" aria-hidden="true">
                <svg viewBox="0 0 32 32" focusable="false">
                  <path d="M7 5.5h15a3 3 0 0 1 3 3v15a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-15a3 3 0 0 1 3-3Z" fill="none" stroke="currentColor" stroke-width="1.6"/>
                  <path d="M8 9h13M8 13h13M8 17h13M8 21h8M22 4v23M25 8l3 2-3 2m0 7 3 2-3 2" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/>
                  <path d="M6 6.5 3.8 4.3m0 0v3m0-3h3" fill="none" stroke="#f8dfa0" stroke-linecap="round" stroke-width="1.2"/>
                </svg>
              </span>
              <span>Khai Ấn Ngọc Giản: Ký Ức ${stage.period} (${stage.memories.length} mảnh tàn hồn)</span>
            </button>
          </div>

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

    document.querySelectorAll('.stage-quotes-toggle').forEach(bindStageQuoteToggle);
    } catch (e) {
      console.error('Lỗi render 7 giai đoạn:', e);
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
        openFilmstripModal(stageId);
      });
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
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
    }
    document.body.style.overflow = 'hidden';
  }

  function closeFilmstripModal() {
    const modal = document.getElementById('filmstrip-modal');
    if (modal) {
      modal.setAttribute('aria-hidden', 'true');
      if (!modal.classList.contains('is-closing')) {
        modal.classList.add('is-closing');
        state.archive.closeTimer = window.setTimeout(() => {
          window.requestAnimationFrame(() => {
            const grid = document.getElementById('modal-filmstrip-grid');
            if (grid) grid.replaceChildren();
            state.archive.memories = [];
            state.archive.renderedCount = 0;
            modal.classList.remove('active', 'is-closing');
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

      frame.innerHTML = `
        <span class="film-number">#${frameNumber}</span>
        <div class="film-thumb-box">
          ${mediaMarkup}
        </div>
        <div class="film-frame-info">
          <span class="film-frame-time">${escapeHtml(mem.time)}</span>
          <h5 class="film-frame-title">${escapeHtml(mem.title)}</h5>
        </div>
      `;

      frame.addEventListener('click', () => {
        if (mem.image && mem.image.length > 0) {
          openLightbox(mem, 0, state.currentStageForModal || null);
        }
      });

      grid.appendChild(frame);
    });
    state.archive.renderedCount += batch.length;
  }

  // ========================================================
  // 10. LIGHTBOX VIEWER
  // ========================================================
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
    state.lightbox.isZoomed = false;

    updateLightboxView();

    const modal = document.getElementById('lightbox-modal');
    if (modal) {
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
    }
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
    state.lightbox.isZoomed = false;

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

    return pool;
  }

  function startNewGame() {
    const pool = buildGameImagePool();
    if (pool.length < 4) {
      alert('Không đủ hình ảnh để bắt đầu trò chơi.');
      return;
    }

    // Pick 10 unique random images
    const shuffledPool = shuffleArray(pool);
    const questionsCount = Math.min(10, shuffledPool.length);
    state.game.questions = shuffledPool.slice(0, questionsCount);
    state.game.currentIndex = 0;
    state.game.score = 0;
    state.game.streak = 0;
    state.game.bestStreak = 0;
    state.game.resultSaved = false;
    state.game.hasAnswered = false;
    setLeaderboardStatus('leaderboard-save-status', '');

    // Reset UI screens
    document.getElementById('game-play-screen').style.display = 'flex';
    document.getElementById('game-result-screen').style.display = 'none';

    // Show Game Modal
    const modal = document.getElementById('game-modal');
    if (modal) {
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
    }
    document.body.style.overflow = 'hidden';

    // Render Question 0
    renderGameQuestion(0);
  }

  function closeGameModal() {
    const modal = document.getElementById('game-modal');
    if (modal) {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
    }
    const filmModal = document.getElementById('filmstrip-modal');
    const lightboxModal = document.getElementById('lightbox-modal');
    if (!filmModal.classList.contains('active') && !lightboxModal.classList.contains('active')) {
      document.body.style.overflow = '';
    }
  }

  function renderGameQuestion(index) {
    const { questions } = state.game;
    if (index >= questions.length) {
      showGameResult();
      return;
    }

    const gameDialog = document.querySelector('.year-guess-dialog');
    if (gameDialog) gameDialog.scrollTop = 0;

    state.game.hasAnswered = false;
    const currentQ = questions[index];

    // Update Status Bar
    document.getElementById('game-q-counter').textContent = `Câu ${index + 1} / ${questions.length}`;
    document.getElementById('game-score-badge').textContent = `Điểm: ${state.game.score} | Chuỗi: ${state.game.streak}🔥`;
    const progressPct = ((index + 1) / questions.length) * 100;
    document.getElementById('game-progress-fill').style.width = `${progressPct}%`;

    // Hide reveal card
    const revealCard = document.getElementById('game-reveal-card');
    revealCard.style.display = 'none';
    revealCard.classList.remove('is-correct', 'is-wrong');
    const revealHint = document.getElementById('reveal-hint');
    if (revealHint) {
      revealHint.hidden = true;
      revealHint.textContent = '';
    }

    // Set Image (Strictly no titles, dates, or stage hints)
    const imgEl = document.getElementById('game-current-img');
    imgEl.src = currentQ.imageUrl;
    imgEl.alt = 'Bức ảnh bí ẩn cần đoán năm';

    const yearInput = document.getElementById('game-year-input');
    const submitBtn = document.getElementById('game-year-submit');
    if (yearInput) {
      yearInput.value = '';
      yearInput.disabled = false;
      setTimeout(() => yearInput.focus(), 50);
    }
    if (submitBtn) submitBtn.disabled = false;

    if (yearInput) {
      yearInput.oninput = () => {
        yearInput.value = yearInput.value.replace(/\D/g, '').slice(0, 4);
      };
      yearInput.onpaste = event => {
        const pastedText = event.clipboardData?.getData('text');
        if (typeof pastedText !== 'string') return;

        event.preventDefault();
        const start = yearInput.selectionStart ?? yearInput.value.length;
        const end = yearInput.selectionEnd ?? start;
        const pastedDigits = pastedText.replace(/[^0-9]/g, '');
        yearInput.value = `${yearInput.value.slice(0, start)}${pastedDigits}${yearInput.value.slice(end)}`.slice(0, 4);
        yearInput.dispatchEvent(new Event('input', { bubbles: true }));
      };
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
      const guessedYear = parseInt(yearInput.value.replace(/\D/g, ''), 10);
      if (!Number.isFinite(guessedYear) || yearInput.value.length === 0) {
        yearInput.focus();
        yearInput.classList.remove('game-input-shake');
        void yearInput.offsetWidth;
        yearInput.classList.add('game-input-shake');
        return;
      }
      handleGameYearAnswer(currentQ, guessedYear);
    }
  }

  function handleGameYearAnswer(question, guessedYear) {
    if (state.game.hasAnswered) return;
    state.game.hasAnswered = true;

    const yearInput = document.getElementById('game-year-input');
    const submitBtn = document.getElementById('game-year-submit');
    if (yearInput) yearInput.disabled = true;
    if (submitBtn) submitBtn.disabled = true;

    const period = String(question.period || '');
    const timeText = String(question.time || '');
    const actualYearMatch = period.match(/\d{4}/) || timeText.match(/\d{4}/);
    const actualYear = actualYearMatch ? parseInt(actualYearMatch[0], 10) : 2007;
    const isCorrect = guessedYear === actualYear;

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
      state.game.score += 1;
      state.game.streak += 1;
      state.game.bestStreak = Math.max(state.game.bestStreak, state.game.streak);
      void awardCultivation(5, 'Trả lời đúng Đoán Năm');
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
    } else {
      state.game.streak = 0;
      revealCard.classList.add('is-wrong');
      let line;
      do { line = wrongLines[Math.floor(Math.random() * wrongLines.length)]; } while (line === state.game.lastWrongLine);
      state.game.lastWrongLine = line;
      const hint = guessedYear < actualYear
        ? `💡 Gợi ý: Năm thực tế LỚN HƠN ${guessedYear}`
        : `💡 Gợi ý: Năm thực tế NHỎ HƠN ${guessedYear}`;
      revealHeader.className = 'reveal-header is-wrong';
      statusIcon.textContent = '😅';
      statusText.textContent = line;
      if (revealHint) {
        revealHint.textContent = hint;
        revealHint.hidden = false;
      }
    }
    document.getElementById('game-score-badge').textContent = `Điểm: ${state.game.score} | Chuỗi: ${state.game.streak}🔥`;

    // Populate Reveal Memory Details
    document.getElementById('reveal-memory-title').textContent = question.title;
    document.getElementById('reveal-memory-time').textContent = `📅 Thời gian: ${question.time}`;
    document.getElementById('reveal-memory-desc').textContent = question.description || 'Khoảnh khắc quý giá được lưu giữ trong bảo tàng.';

    // Next Button Text
    const nextBtn = document.getElementById('btn-game-next');
    const isLast = (state.game.currentIndex === state.game.questions.length - 1);
    nextBtn.innerHTML = isLast 
      ? `<span>Xem kết quả tổng kết</span> <span>🏆</span>` 
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
      emptyRow.textContent = 'Bảng Tu Vi còn trống! Đạo Hữu đăng nhập điểm danh nhận +20, kẻo Linh Thạch mọc rêu nhé.';
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
        : getCultivationRank(row.tu_vi).name;
      identity.append(name, rank);

      const points = document.createElement('span');
      points.className = 'leaderboard-score';
      points.textContent = `${Number(row.tu_vi) || 0} Tu Vi`;
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
      name.textContent = String(row.display_name || 'Đạo Hữu');
      const score = document.createElement('span');
      score.className = 'leaderboard-score';
      score.textContent = `${Number(row.best_score) || 0} điểm · ${Number(row.best_streak) || 0}🔥`;
      item.append(place, name, score);
      list.appendChild(item);
    });
  }

  async function loadCultivationLeaderboard() {
    const statusId = 'cultivation-leaderboard-status';
    setLeaderboardStatus(statusId, 'Đang triệu hồi Bảng Tu Vi...');
    try {
      const { data, error } = await supabaseClient.from('user_cultivation')
        .select('user_id,display_name,tu_vi')
        .order('tu_vi', { ascending: false })
        .limit(10);
      if (error) throw error;
      const rows = data || [];
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
      const { data, error } = await supabaseClient.from('leaderboard')
        .select('*')
        .order('best_score', { ascending: false })
        .order('best_streak', { ascending: false })
        .limit(10);
      if (error) throw error;
      renderGameLeaderboard(data || []);
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
    if (!supabaseClient || !authenticatedUser) return;
    setLeaderboardStatus('leaderboard-save-status', 'Đang khắc thành tích vào Thiên Kiêu Bảng…');
    try {
      const { data: previous, error: readError } = await supabaseClient.from('leaderboard')
        .select('*')
        .eq('user_id', authenticatedUser.id)
        .maybeSingle();
      if (readError) throw readError;

      const displayName = getUserDisplayName(authenticatedUser);
      const score = Math.max(Number(previous && previous.best_score) || 0, state.game.score);
      const bestStreak = Math.max(Number(previous && previous.best_streak) || 0, state.game.bestStreak);
      const { error: saveError } = await supabaseClient.from('leaderboard').upsert({
        user_id: authenticatedUser.id,
        display_name: displayName,
        best_score: score,
        best_streak: bestStreak,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });
      if (saveError) throw saveError;

      setLeaderboardStatus('leaderboard-save-status', 'Thành tích đã được lưu vào Thiên Kiêu Bảng.');
    } catch (error) {
      console.error('Không thể lưu thành tích:', error);
      setLeaderboardStatus('leaderboard-save-status', 'Chưa thể lưu thành tích. Kiểm tra cấu hình bảng leaderboard và thử lại.', true);
    }
  }

  function showGameResult() {
    document.getElementById('game-play-screen').style.display = 'none';
    const resultScreen = document.getElementById('game-result-screen');
    resultScreen.style.display = 'flex';

    const score = state.game.score;
    const total = state.game.questions.length;
    document.getElementById('result-score-highlight').textContent = `${score} / ${total}`;

    let trophy = '🏆';
    let rank = '';
    let commentary = '';

    if (score === 10) {
      trophy = '👑';
      rank = 'BẬC THẦY KÝ ỨC TUYỆT ĐỐI';
      commentary = 'Trí nhớ đỉnh của chóp! Bạn nhớ từng chi tiết nhỏ nhất trong cuộc đời mình, như thể bạn có gắn chip nhớ SSD 1TB trong đầu vậy!';
    } else if (score >= 8) {
      trophy = '🏆';
      rank = 'CHIẾN THẦN HOÀI NIỆM';
      commentary = 'Phong độ quá đẳng cấp! Bạn chỉ nhầm một chút ở những góc chụp hiểm hóc thôi, ký ức của bạn cực kỳ sắc bén!';
    } else if (score >= 6) {
      trophy = '🌟';
      rank = 'NGƯỜI LỮ HÀNH TỈNH TÁO';
      commentary = 'Khá lắm! Đa số các mốc thời gian lớn bạn đều bắt chuẩn, chỉ có vài tấm quậy phá làm bạn hơi lú một tẹo.';
    } else if (score >= 4) {
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
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
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
        if (!requireAuth(() => toggleUtility('ticket-station', true))) return;
        toggleUtility('ticket-station', true);
      });
    }

    const heroTicketBtn = document.getElementById('btn-hero-ticket');
    if (heroTicketBtn) {
      heroTicketBtn.addEventListener('click', e => {
        e.preventDefault();
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
    zoomBtn.addEventListener('click', () => {
      const wrapper = document.getElementById('lightbox-img-wrapper');
      state.lightbox.isZoomed = !state.lightbox.isZoomed;
      wrapper.classList.toggle('zoomed', state.lightbox.isZoomed);
    });

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
        void ticketEl.offsetWidth; // Force reflow
        ticketEl.classList.add('print-pulse');
      }
    }

    // Initial render of ticket with live time
    updateTicket(false);

    // 4. Print Button Click Event
    if (btnPrint) {
      btnPrint.addEventListener('click', () => {
        if (!requireAuth(() => btnPrint.click())) return;
        updateTicket(true);
        void awardCultivation(15, 'In Vé Lưu Niệm', { claimField: 'ticket_claimed' });
      });
    }

    // 5. Download Ticket as PNG Event (html2canvas)
    if (btnDownload) {
      btnDownload.addEventListener('click', () => {
        if (!requireAuth(() => btnDownload.click())) return;
        if (typeof html2canvas === 'undefined') {
          alert('Thư viện chụp ảnh html2canvas đang được tải hoặc bị chặn kết nối. Vui lòng tải lại trang hoặc kiểm tra kết nối mạng!');
          return;
        }

        const dlText = document.getElementById('btn-dl-text');
        const originalText = dlText ? dlText.textContent : 'Tải vé về máy (.PNG)';
        
        btnDownload.disabled = true;
        if (dlText) dlText.textContent = '⏳ Đang kết xuất ảnh vé...';

        const dispSerial = document.getElementById('ticket-disp-serial');
        const serialNum = dispSerial ? dispSerial.textContent.replace(/[^a-zA-Z0-9-]/g, '') : 'MEM-2026';

        // Options for sharp, high-DPI output with zero canvas taint
        html2canvas(ticketEl, {
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
  // 16. NHẠC NỀN TỰ ĐỘNG PHÁT & TRÁO NGẪU NHIÊN (NÂNG CẤP 2)
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
    state.bgMusic.isUserMuted = false;  // Mặc định BẬT mỗi lần tải trang
    state.bgMusic.isPlaying = true;

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

    // Nạp bài đầu tiên (đã shuffle → luôn ngẫu nhiên)
    loadBgMusicTrack(0);
    state.bgMusic.audio.autoplay = true;

    // Tự động phát ngay khi trang load
    function startDefaultBgMusic() {
      if (state.bgMusic.isUserMuted) return;
      if (state.currentAudio && !state.currentAudio.paused) return;
      if (state.cinema && state.cinema.isPlaying) return;

      const playPromise = state.bgMusic.audio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          state.bgMusic.isPlaying = true;
          updateBgMusicUI();
        }).catch(() => {
          // Trình duyệt (Safari/Chrome mobile) chặn autoplay trước tương tác đầu tiên
          // → đăng ký 1 lần duy nhất, cất nhạc ngay ở cú chạm/click đầu tiên
          updateBgMusicUI();
          const unlockAutoplay = () => {
            if (!state.bgMusic.isUserMuted && !state.currentAudio && (!state.cinema || !state.cinema.isPlaying)) {
              state.bgMusic.audio.play().then(() => {
                state.bgMusic.isPlaying = true;
                updateBgMusicUI();
              }).catch(() => {});
            }
            ['pointerdown', 'click', 'touchstart', 'keydown'].forEach(ev => {
              window.removeEventListener(ev, unlockAutoplay, true);
            });
          };
          ['pointerdown', 'click', 'touchstart', 'keydown'].forEach(ev => {
            window.addEventListener(ev, unlockAutoplay, { once: true, passive: true, capture: true });
          });
        });
      }
    }

    startDefaultBgMusic();
    updateBgMusicUI();

    // Nút Bật/Tắt nhạc nền nổi
    const toggleBtn = document.getElementById('bg-music-toggle-btn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', toggleBgMusic);
    }

    // Nút Chuyển ngẫu nhiên bài kế tiếp
    const nextBtn = document.getElementById('bg-music-next-btn');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextBgMusicTrack();
      });
    }
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
    if (state.currentAudio && !state.currentAudio.paused) return;
    if (state.cinema && state.cinema.isPlaying) return;

    if (!state.bgMusic.audio.src && state.bgMusic.playlist.length > 0) {
      loadBgMusicTrack(state.bgMusic.currentIndex || 0);
    }

    state.bgMusic.audio.play().then(() => {
      state.bgMusic.isPlaying = true;
      updateBgMusicUI();
    }).catch(err => {
      console.warn('Không thể tự phát nhạc nền:', err);
    });
  }

  function pauseBgMusic(temporary = false) {
    if (!state.bgMusic.audio) return;
    state.bgMusic.audio.pause();
    state.bgMusic.isPlaying = false;
    if (!temporary) {
      state.bgMusic.isUserMuted = true;
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
    if (!state.bgMusic.isUserMuted && !state.currentAudio && (!state.cinema || !state.cinema.isPlaying)) {
      playBgMusic();
    }
  }

  function updateBgMusicUI() {
    const playerWidget = document.getElementById('floating-bg-player');
    const diskIcon = document.getElementById('bg-disk-icon');
    const toggleBtn = document.getElementById('bg-music-toggle-btn');
    const globalAudioToggle = document.getElementById('global-audio-toggle');

    const isActive = !state.bgMusic.isUserMuted;

    if (isActive && !state.currentAudio) {
      if (playerWidget) playerWidget.classList.add('playing');
      if (diskIcon) diskIcon.textContent = '🎵';
      if (toggleBtn) toggleBtn.title = 'Tạm dừng nhạc nền';
      if (globalAudioToggle) globalAudioToggle.classList.add('playing');
    } else {
      if (playerWidget) playerWidget.classList.remove('playing');
      if (diskIcon) diskIcon.textContent = '🔇';
      if (toggleBtn) toggleBtn.title = 'Bật nhạc nền tổng';
      if (globalAudioToggle && !state.currentAudio) globalAudioToggle.classList.remove('playing');
    }
  }

  // ========================================================
  // THEME SWITCHER
  // ========================================================
  function initThemeSwitcher() {
    const dropdown = document.getElementById('theme-selector-dropdown');
    const toggleBtn = document.getElementById('theme-toggle-btn');
    const optionBtns = document.querySelectorAll('.theme-option-btn');
    const btnIcon = document.getElementById('theme-btn-icon');
    const btnText = document.getElementById('theme-btn-text');

    if (!dropdown || !toggleBtn) return;

    const themeIcons = {
      xianxia: '☯',
      obsidian: '🌑',
      sepia: '📜',
      midnight: '🌌',
      daylight: '☁️'
    };

    const themeNames = {
      xianxia: 'Tiên Giới Cổ Phong',
      obsidian: 'Đêm Obsidian',
      sepia: 'Giấy Cũ',
      midnight: 'Xanh Đêm',
      daylight: 'Sáng Tối Giản'
    };

    function applyTheme(theme, save = true) {
      if (!themeIcons[theme]) theme = 'xianxia';
      document.documentElement.setAttribute('data-theme', theme);

      optionBtns.forEach(btn => {
        const isMatch = btn.dataset.theme === theme;
        btn.classList.toggle('active', isMatch);
        btn.setAttribute('aria-selected', isMatch ? 'true' : 'false');
      });

      if (btnIcon) btnIcon.textContent = themeIcons[theme];
      if (btnText) btnText.textContent = themeNames[theme];

      if (save) {
        try {
          localStorage.setItem('museum_theme_v22', theme);
        } catch (e) {
          console.warn('LocalStorage không khả dụng:', e);
        }
      }
    }

    // Load saved theme or default to Xianxia.
    let initialTheme = 'xianxia';
    try {
      const saved = localStorage.getItem('museum_theme_v22');
      if (saved && themeIcons[saved]) {
        initialTheme = saved;
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    applyTheme(initialTheme, false);

    // Toggle dropdown
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = dropdown.classList.toggle('open');
      toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Option click
    optionBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const theme = btn.dataset.theme;
        applyTheme(theme, true);
        dropdown.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && dropdown.classList.contains('open')) {
        dropdown.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    });
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
      void targetElement.offsetWidth; // Force reflow
      targetElement.classList.add('achievement-highlight-pulse');

      setTimeout(() => {
        targetElement.classList.remove('achievement-highlight-pulse');
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
        let { data, error } = await supabaseClient
          .from('guestbook')
          .select('sender_name, message, unlock_date, user_id');
        if (error) {
          ({ data, error } = await supabaseClient
            .from('guestbook')
            .select('sender_name, message, unlock_date'));
        }
        if (error) throw error;
        if (!Array.isArray(data)) return;

        const userIds = [...new Set(data.map(row => String(row.user_id || '')).filter(Boolean))];
        const cultivationByUser = new Map();
        if (userIds.length) {
          try {
            const { data: profiles, error: profileError } = await supabaseClient.from('user_cultivation')
              .select('user_id,tu_vi')
              .in('user_id', userIds);
            if (profileError) throw profileError;
            (profiles || []).forEach(profile => {
              cultivationByUser.set(String(profile.user_id), getCultivationRank(Number(profile.tu_vi) || 0).name);
            });
          } catch (error) {
            console.warn('Không thể tải Cảnh Giới của Sổ Lưu Bút:', error);
          }
        }

        const remoteEntries = data.map((row, index) => ({
          id: `guestbook-${index}`,
          isGuestbook: true,
          isDefault: false,
          sender: String(row.sender_name || 'Người bạn ẩn danh'),
          cultivationRank: cultivationByUser.get(String(row.user_id || '')) || '',
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
          await awardCultivation(20, 'Gửi lời nhắn Sổ Lưu Bút', { claimField: 'guestbook_claimed' });
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
