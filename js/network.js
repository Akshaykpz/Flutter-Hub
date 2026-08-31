/* ==========================================================================
   FlutterHub Network & Connectivity Resilience Manager
   Monitors online/offline states, displays non-intrusive status banners,
   prevents UI freezes during network loss, and restores data on reconnection.
   ========================================================================== */

const NetworkManager = {
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine !== false : true,
  wasOffline: false,
  bannerEl: null,
  reconnectCallbacks: [],
  autoDismissTimer: null,
  isChecking: false,

  init: function () {
    // Initial state
    this.isOnline = typeof navigator !== 'undefined' ? navigator.onLine !== false : true;
    
    // Create status banner element in DOM if not present
    this.createBannerElement();

    // Listen to browser network state events
    window.addEventListener('online', () => this.handleOnlineEvent());
    window.addEventListener('offline', () => this.handleOfflineEvent());

    // Also check on window focus/visibility change in case network changed while tab was inactive
    window.addEventListener('focus', () => {
      if (!this.isOnline) {
        this.checkConnection(false);
      }
    });

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && !this.isOnline) {
        this.checkConnection(false);
      }
    });

    // If starting in offline state, show banner immediately
    if (!this.isOnline) {
      this.handleOfflineEvent(false);
    }
  },

  createBannerElement: function () {
    if (document.getElementById('network-status-banner')) {
      this.bannerEl = document.getElementById('network-status-banner');
      return;
    }

    const banner = document.createElement('div');
    banner.id = 'network-status-banner';
    banner.className = 'network-status-banner';
    banner.setAttribute('role', 'status');
    banner.setAttribute('aria-live', 'polite');
    banner.style.display = 'none';

    // Insert before header or as first child of body
    const header = document.querySelector('.site-header');
    if (header && header.parentNode) {
      header.parentNode.insertBefore(banner, header);
    } else {
      document.body.insertBefore(banner, document.body.firstChild);
    }

    this.bannerEl = banner;
  },

  handleOfflineEvent: function (showToastNotification = true) {
    this.isOnline = false;
    this.wasOffline = true;
    document.body.classList.add('is-offline');

    if (this.autoDismissTimer) {
      clearTimeout(this.autoDismissTimer);
      this.autoDismissTimer = null;
    }

    this.renderOfflineBanner();

    if (showToastNotification && window.App && typeof window.App.showToast === 'function') {
      window.App.showToast('📡 Internet connection lost. Switched to offline mode.', 'warning');
    }
  },

  handleOnlineEvent: async function () {
    // Perform a fast probe to verify actual reachability
    const verified = await this.probeReachability();
    if (!verified) {
      // If probe failed, keep offline state
      this.handleOfflineEvent(false);
      return;
    }

    this.isOnline = true;
    document.body.classList.remove('is-offline');

    if (this.wasOffline) {
      this.renderOnlineBanner();

      if (window.App && typeof window.App.showToast === 'function') {
        window.App.showToast('⚡ Internet connection restored! You are back online.', 'success');
      }

      // Execute all registered reconnection hooks
      this.triggerReconnectCallbacks();
      this.wasOffline = false;
    } else {
      this.hideBanner();
    }
  },

  renderOfflineBanner: function () {
    if (!this.bannerEl) this.createBannerElement();
    if (!this.bannerEl) return;

    this.bannerEl.className = 'network-status-banner network-banner-offline';
    this.bannerEl.innerHTML = `
      <div class="network-banner-content">
        <div class="network-banner-left">
          <span class="network-status-indicator offline">
            <span class="network-status-dot pulse-amber"></span>
          </span>
          <div class="network-banner-text">
            <strong>Offline Mode Active:</strong> You are currently disconnected from the internet. Browsing Flutter components and local tools is available. Network actions will sync automatically once reconnected.
          </div>
        </div>
        <div class="network-banner-actions">
          <button type="button" class="network-retry-btn" onclick="NetworkManager.checkConnection(true)">
            <svg class="network-retry-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
            </svg>
            <span>Check Connection</span>
          </button>
        </div>
      </div>
    `;

    this.bannerEl.style.display = 'block';
  },

  renderOnlineBanner: function () {
    if (!this.bannerEl) this.createBannerElement();
    if (!this.bannerEl) return;

    this.bannerEl.className = 'network-status-banner network-banner-online';
    this.bannerEl.innerHTML = `
      <div class="network-banner-content">
        <div class="network-banner-left">
          <span class="network-status-indicator online">
            <span class="network-status-dot pulse-emerald"></span>
          </span>
          <div class="network-banner-text">
            <strong>Back Online!</strong> Your internet connection has been restored. All features and cloud services are synced.
          </div>
        </div>
        <button type="button" class="network-dismiss-btn" onclick="NetworkManager.hideBanner()" aria-label="Dismiss">✕</button>
      </div>
    `;

    this.bannerEl.style.display = 'block';

    if (this.autoDismissTimer) clearTimeout(this.autoDismissTimer);
    this.autoDismissTimer = setTimeout(() => {
      this.hideBanner();
    }, 3800);
  },

  hideBanner: function () {
    if (!this.bannerEl) return;
    this.bannerEl.classList.add('network-banner-hiding');
    setTimeout(() => {
      if (this.bannerEl) {
        this.bannerEl.style.display = 'none';
        this.bannerEl.classList.remove('network-banner-hiding');
      }
    }, 300);
  },

  probeReachability: async function () {
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      return false;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      // Ping lightweight health endpoint with cache busting
      const response = await fetch(`/api/health?_t=${Date.now()}`, {
        method: 'GET',
        cache: 'no-store',
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      return response.ok;
    } catch (e) {
      // Only trust navigator.onLine when the fetch actually failed for a
      // network-level reason; even then navigator.onLine can be inaccurate,
      // so treat an unknown state as "online" rather than blocking the user.
      if (e && e.name === 'AbortError') return true;
      if (typeof navigator !== 'undefined' && navigator.onLine === false) return false;
      return true;
    }
  },

  checkConnection: async function (isManual = false) {
    if (this.isChecking) return;
    this.isChecking = true;

    const retryBtn = this.bannerEl ? this.bannerEl.querySelector('.network-retry-btn') : null;
    if (retryBtn) {
      retryBtn.classList.add('checking');
      retryBtn.innerHTML = `
        <svg class="network-retry-icon spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
        </svg>
        <span>Checking...</span>
      `;
    }

    const isConnected = await this.probeReachability();
    this.isChecking = false;

    if (isConnected) {
      this.handleOnlineEvent();
    } else {
      this.isOnline = false;
      this.renderOfflineBanner();
      if (isManual && window.App && typeof window.App.showToast === 'function') {
        window.App.showToast('⚠️ Still offline. Please check your network connection.', 'error');
      }
    }
  },

  onReconnect: function (callback) {
    if (typeof callback === 'function') {
      this.reconnectCallbacks.push(callback);
    }
  },

  triggerReconnectCallbacks: function () {
    this.reconnectCallbacks.forEach((cb) => {
      try {
        cb();
      } catch (err) {
        console.warn('Reconnection callback execution notice:', err);
      }
    });
  },

  ensureOnline: function (actionName = 'perform this action') {
    if (!this.isOnline) {
      if (window.App && typeof window.App.showToast === 'function') {
        window.App.showToast(`⚠️ You are currently offline. Connect to the internet to ${actionName}.`, 'error');
      }
      return false;
    }
    return true;
  }
};

// Expose globally
if (typeof window !== 'undefined') {
  window.NetworkManager = NetworkManager;
}
