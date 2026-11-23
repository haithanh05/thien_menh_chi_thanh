(() => {
  let idleHandle = 0;
  let fallbackTimer = 0;
  const mount = () => {
    const existing = document.getElementById('game-modal');
    if (existing) return existing;
    if (idleHandle && typeof window.cancelIdleCallback === 'function') {
      window.cancelIdleCallback(idleHandle);
    }
    if (fallbackTimer) window.clearTimeout(fallbackTimer);
    document.removeEventListener('pointerdown', ensureOnInteraction, true);
    document.removeEventListener('click', ensureOnInteraction, true);
    document.removeEventListener('focusin', ensureOnInteraction, true);
    document.body.insertAdjacentHTML('beforeend', `
    <div id="game-modal" class="modal game-modal year-guess-modal" aria-hidden="true" inert hidden role="dialog" aria-labelledby="game-modal-title">
      <div class="modal-backdrop" id="modal-game-backdrop"></div>
      <div class="modal-dialog game-dialog year-guess-dialog">
        <div class="game-modal-header">
          <div class="game-title-group">
            <span class="game-tag-badge">🎮 MINI-GAME TRÍ NHỚ</span>
            <h2 class="game-modal-title" id="game-modal-title">⚔️ Đố Vui Độ Kiếp</h2>
            <span class="game-score-badge" id="game-score-badge">Điểm: 0 | Chuỗi: 0🔥</span>
          </div>
          <button type="button" class="modal-close-btn" id="btn-close-game" aria-label="Đóng trò chơi">×</button>
        </div>
        <div class="game-mode-selector" role="group" aria-label="Chọn chế độ chơi">
          <button type="button" class="game-mode-button active" data-game-mode="normal">🧘 Tu Luyện · 10 ải</button>
          <button type="button" class="game-mode-button" data-game-mode="death">⚔️ Độ Kiếp · 3 mạng</button>
        </div>
        <div class="game-status-bar" id="game-status-bar">
          <div class="game-status-info">
            <span class="game-q-counter" id="game-q-counter">Câu 1 / 10</span>
            <span id="game-countdown" class="game-countdown" hidden>15 giây</span>
            <span id="game-lives" class="game-lives" hidden></span>
          </div>
          <div class="game-progress-track">
            <div class="game-progress-fill" id="game-progress-fill" style="width: 10%;"></div>
          </div>
        </div>
        <div class="game-body" id="game-play-screen">
          <div class="game-powerups" id="game-powerups">
            <button type="button" data-game-powerup="fifty" aria-label="Thiên Cơ Kính: loại hai đáp án sai">🔮 Thiên Cơ</button>
            <button type="button" data-game-powerup="hint" aria-label="Mảnh Tàn Hồn: xem gợi ý">📜 Tàn Hồn</button>
            <button type="button" data-game-powerup="freeze" aria-label="Định Thần Phù: đóng băng đồng hồ">⏳ Định Thần</button>
          </div>
          <p id="game-hint-status" class="game-hint-status" role="status" aria-live="polite" hidden></p>
          <div class="game-photo-box">
            <div class="game-photo-wrap">
              <img id="game-current-img" src="" alt="Bức ảnh bí ẩn cần đoán năm" loading="eager" decoding="async">
            </div>
            <div class="game-photo-hint">❓ Bức ảnh này được chụp ở giai đoạn / năm nào?</div>
          </div>
          <div class="game-year-input-wrap">
            <input id="game-year-input" type="text" maxlength="40" placeholder="Nhập năm hoặc giai đoạn (VD: 2022, Tuổi thơ)..." autocomplete="off" aria-label="Nhập năm hoặc giai đoạn đoán">
            <button type="button" class="btn btn-primary game-year-submit" id="game-year-submit">Kiểm tra</button>
          </div>
          <div id="game-year-choices" class="game-year-choices" role="group" aria-label="Chọn niên hiệu"></div>
          <div class="game-reveal-card" id="game-reveal-card" style="display: none;">
            <div class="reveal-header">
              <span class="reveal-status-icon" id="reveal-status-icon">🎉</span>
              <span class="reveal-status-text" id="reveal-status-text">Chính xác!</span>
            </div>
            <div class="game-reveal-hint" id="reveal-hint" hidden></div>
            <div class="reveal-info-body">
              <h4 class="reveal-memory-title" id="reveal-memory-title">Tiêu đề ảnh gốc</h4>
              <div class="reveal-memory-time" id="reveal-memory-time">📅 Thời gian: ...</div>
              <p class="reveal-memory-desc" id="reveal-memory-desc">Ghi chú gốc...</p>
            </div>
            <button class="btn btn-primary game-next-btn" id="btn-game-next"><span>Câu tiếp theo</span><span>→</span></button>
          </div>
        </div>
        <div class="game-result-screen" id="game-result-screen" style="display: none;">
          <div class="result-trophy-box" id="result-trophy-icon">🏆</div>
          <h3 class="result-title">KẾT QUẢ THỬ THÁCH</h3>
          <div class="result-score-highlight" id="result-score-highlight">8 / 10</div>
          <div class="result-badge-pill" id="result-rank-badge">Bậc Thầy Hoài Niệm</div>
          <p class="result-commentary" id="result-commentary">Bạn nhớ được hầu hết các cột mốc quan trọng trên hành trình lớn lên!</p>
          <div class="result-actions">
            <button class="btn btn-primary" id="btn-game-replay"><span>🔄 Chơi lại lượt mới</span></button>
            <button class="btn btn-glass" id="btn-game-exit"><span>🏛️ Quay lại Bảo Tàng</span></button>
          </div>
        </div>
      </div>
    </div>
    `);
    const modal = document.getElementById('game-modal');
    document.dispatchEvent(new Event('game-modal:ready'));
    return modal;
  };
  const ensureOnInteraction = event => {
    const target = event.target instanceof Element ? event.target : null;
    if (target && target.closest('#btn-hero-game, [data-game-launch]')) mount();
  };

  window.ensureGameModal = mount;
  document.addEventListener('pointerdown', ensureOnInteraction, true);
  document.addEventListener('click', ensureOnInteraction, true);
  document.addEventListener('focusin', ensureOnInteraction, true);
  if (typeof window.requestIdleCallback === 'function') {
    idleHandle = window.requestIdleCallback(mount, { timeout: 1600 });
  } else {
    fallbackTimer = window.setTimeout(mount, 120);
  }
})();
