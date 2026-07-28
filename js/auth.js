/* ==========================================================================
   FlutterHub Authentication Session Manager
   ========================================================================== */

const AuthManager = {
  currentUser: null,

  init: function() {
    const saved = localStorage.getItem('flutterhub_user');
    if (saved) {
      try {
        this.currentUser = JSON.parse(saved);
      } catch (e) {
        this.currentUser = null;
      }
    } else {
      // Default initial user session for seamless UX
      this.currentUser = {
        name: 'Akshat Sharma',
        email: 'akshat@flutterhub.dev',
        isPro: false, // Default Free tier, upgradable via Razorpay modal to true!
        avatar: 'A',
        bookmarks: ['comp_01'],
        downloadsCount: 14,
        joinedDate: 'July 2026'
      };
      this.saveSession();
    }
    this.updateUI();
  },

  saveSession: function() {
    localStorage.setItem('flutterhub_user', JSON.stringify(this.currentUser));
  },

  login: function(email, name) {
    this.currentUser = {
      name: name || email.split('@')[0],
      email: email,
      isPro: false,
      avatar: (name || email)[0].toUpperCase(),
      bookmarks: [],
      downloadsCount: 0,
      joinedDate: 'July 2026'
    };
    this.saveSession();
    this.updateUI();
    App.showToast('Successfully logged in!', 'success');
  },

  upgradeToPro: function() {
    if (!this.currentUser) {
      this.login('user@flutterhub.dev', 'Flutter Developer');
    }
    this.currentUser.isPro = true;
    this.saveSession();
    this.updateUI();
    App.renderComponentGrid(); // Refresh component grid to unlock premium items!
    App.showToast('🎉 Congratulations! You are now a FlutterHub Pro member!', 'success');
  },

  toggleBookmark: function(id) {
    if (!this.currentUser) return;
    const idx = this.currentUser.bookmarks.indexOf(id);
    if (idx > -1) {
      this.currentUser.bookmarks.splice(idx, 1);
      App.showToast('Removed from Bookmarks', 'info');
    } else {
      this.currentUser.bookmarks.push(id);
      App.showToast('Saved to Bookmarks! ❤️', 'success');
    }
    this.saveSession();
  },

  updateUI: function() {
    const userBtn = document.getElementById('nav-user-btn');
    const proContainer = document.getElementById('nav-pro-container');
    
    if (userBtn) {
      if (this.currentUser) {
        userBtn.innerHTML = `
          <div style="display:flex; align-items:center; gap:6px; background:var(--bg-tertiary); padding:3px 8px 3px 4px; border-radius:20px; border:1px solid var(--border-color);" title="${this.currentUser.name}">
            <div style="width:28px; height:28px; border-radius:50%; background:var(--grad-flutter); color:#fff; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:12px;">
              ${this.currentUser.avatar}
            </div>
            <span style="font-size:0.8rem; font-weight:600; color:var(--text-bright);">${this.currentUser.name.split(' ')[0]}</span>
          </div>
        `;
      }
    }

    if (proContainer) {
      if (this.currentUser && this.currentUser.isPro) {
        proContainer.innerHTML = `<span class="badge badge-pro" style="padding:0.35rem 0.75rem; font-size:0.75rem;">✨ PRO</span>`;
      } else {
        proContainer.innerHTML = `<button id="nav-get-pro-btn" class="btn btn-premium btn-sm" onclick="PaymentGateway.openCheckout()">Get Premium ₹29/mo</button>`;
      }
    }
  }
};
