/* ==========================================================================
   FlutterHub Dashboards Manager (User & Admin Analytics)
   ========================================================================== */

const Dashboards = {
  renderUserDashboard: function() {
    const user = AuthManager.currentUser;
    const container = document.getElementById('user-dashboard-content');
    if (!container) return;

    container.innerHTML = `
      <div class="glass-panel" style="padding:2rem; margin-bottom:2rem;">
        <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1rem;">
          <div style="display:flex; align-items:center; gap:1.25rem;">
            <div class="avatar-large">${user.avatar}</div>
            <div>
              <h2 style="font-size:1.5rem; font-weight:800; color:var(--text-bright);">${user.name}</h2>
              <p style="color:var(--text-secondary); font-size:0.9rem;">${user.email} • Member since ${user.joinedDate}</p>
            </div>
          </div>
          <div>
            ${user.isPro 
              ? `<span class="badge badge-pro" style="padding:0.5rem 1rem; font-size:0.85rem;">✨ PRO SUBSCRIBER (₹29/mo ACTIVE)</span>`
              : `<button class="btn btn-premium" onclick="PaymentGateway.openCheckout()">Upgrade to Pro ₹29/mo</button>`
            }
          </div>
        </div>
      </div>

      <div class="kpi-grid">
        <div class="kpi-card">
          <span class="kpi-title">Saved Bookmarks</span>
          <span class="kpi-value">${user.bookmarks.length}</span>
          <span class="kpi-trend positive">Saved components</span>
        </div>
        <div class="kpi-card purple">
          <span class="kpi-title">Total Snippets Downloaded</span>
          <span class="kpi-value">${user.downloadsCount}</span>
          <span class="kpi-trend positive">Flutter Dart files</span>
        </div>
        <div class="kpi-card emerald">
          <span class="kpi-title">Plan Status</span>
          <span class="kpi-value">${user.isPro ? 'Pro' : 'Free'}</span>
          <span class="kpi-trend positive">${user.isPro ? 'Unlimited Access' : 'Upgrade available'}</span>
        </div>
        <div class="kpi-card amber">
          <span class="kpi-title">API Keys</span>
          <span class="kpi-value">Active</span>
          <span class="kpi-trend positive">v2.0 Developer SDK</span>
        </div>
      </div>

      <h3 style="font-size:1.25rem; font-weight:700; margin-bottom:1rem; color:var(--text-bright);">Your Bookmarked Components</h3>
      <div class="component-grid">
        ${user.bookmarks.length === 0 
          ? `<div style="grid-column:1/-1; padding:3rem; text-align:center; color:var(--text-muted); background:var(--bg-card); border-radius:16px;">No bookmarked components yet! Click the heart icon on any component to save it here.</div>`
          : FLUTTER_DATA.components
              .filter(c => user.bookmarks.includes(c.id))
              .map(c => App.createComponentCardHTML(c))
              .join('')
        }
      </div>
    `;

    if (user.bookmarks.length > 0) {
      FLUTTER_DATA.components
        .filter(c => user.bookmarks.includes(c.id))
        .forEach(c => {
          if (c.simType) FlutterSim.renderWidget(c.simType, `sim-${c.id}`);
        });
    }
  },

  renderAdminDashboard: function() {
    const container = document.getElementById('admin-dashboard-content');
    if (!container) return;

    container.innerHTML = `
      <div class="dashboard-header">
        <div>
          <h1 style="font-size:2rem; font-weight:800; color:var(--text-bright);">Executive Admin Analytics</h1>
          <p style="color:var(--text-secondary);">Real-time revenue, subscription growth, and content usage</p>
        </div>
        <div style="display:flex; gap:0.75rem;">
          <button class="btn btn-primary btn-sm" onclick="App.showToast('Content sync initiated!', 'info')">+ Publish New Snippet</button>
        </div>
      </div>

      <div class="kpi-grid">
        <div class="kpi-card emerald">
          <span class="kpi-title">Monthly Recurring Revenue</span>
          <span class="kpi-value">₹157,180</span>
          <span class="kpi-trend positive">▲ +24.8% vs last month</span>
        </div>
        <div class="kpi-card purple">
          <span class="kpi-title">Total Active Pro Users</span>
          <span class="kpi-value">5,420</span>
          <span class="kpi-trend positive">▲ +480 new this week</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-title">Total Snippet Downloads</span>
          <span class="kpi-value">89,400</span>
          <span class="kpi-trend positive">▲ +12.4k code downloads</span>
        </div>
        <div class="kpi-card amber">
          <span class="kpi-title">Conversion Rate</span>
          <span class="kpi-value">8.42%</span>
          <span class="kpi-trend positive">▲ Premium paywall conversion</span>
        </div>
      </div>

      <div class="revenue-chart-card">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1rem;">
          <div>
            <h3 style="font-size:1.1rem; font-weight:700; color:var(--text-bright);">Subscription Revenue Trajectory (₹ INR)</h3>
            <p style="font-size:0.85rem; color:var(--text-secondary);">2026 Monthly Breakdown</p>
          </div>
          <span class="badge badge-emerald">₹29/mo Scalability</span>
        </div>
        <div class="chart-bars-container">
          <div class="chart-bar-column"><div class="chart-bar" style="height:35%;"></div><span class="chart-label">Jan</span></div>
          <div class="chart-bar-column"><div class="chart-bar" style="height:45%;"></div><span class="chart-label">Feb</span></div>
          <div class="chart-bar-column"><div class="chart-bar" style="height:55%;"></div><span class="chart-label">Mar</span></div>
          <div class="chart-bar-column"><div class="chart-bar" style="height:65%;"></div><span class="chart-label">Apr</span></div>
          <div class="chart-bar-column"><div class="chart-bar" style="height:80%;"></div><span class="chart-label">May</span></div>
          <div class="chart-bar-column"><div class="chart-bar" style="height:90%;"></div><span class="chart-label">Jun</span></div>
          <div class="chart-bar-column"><div class="chart-bar" style="height:100%; background:var(--grad-hero);"></div><span class="chart-label">Jul</span></div>
        </div>
      </div>

      <div class="data-table-wrapper">
        <div style="padding:1.25rem; border-bottom:1px solid var(--border-color); font-weight:700; color:var(--text-bright);">
          Recent Active Subscribers
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>User Name</th>
              <th>Email</th>
              <th>Subscription</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Rohan Verma</td>
              <td>rohan.v@gmail.com</td>
              <td><span class="badge badge-pro">Pro ₹29</span></td>
              <td>₹29.00</td>
              <td>Today, 13:14</td>
            </tr>
            <tr>
              <td>Sneha Patel</td>
              <td>sneha_p@tech.io</td>
              <td><span class="badge badge-pro">Pro ₹29</span></td>
              <td>₹29.00</td>
              <td>Today, 11:45</td>
            </tr>
            <tr>
              <td>Vikram Malhotra</td>
              <td>vikram@devs.com</td>
              <td><span class="badge badge-pro">Pro ₹29</span></td>
              <td>₹29.00</td>
              <td>Yesterday, 19:20</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  }
};

const DashboardRenderer = Dashboards;

