/* ==========================================================================
   FlutterHub Developer Community & Group Discussions
   ========================================================================== */

const CommunityManager = {
  activeGroup: 'all',
  posts: [
    {
      id: 'post_01',
      author: 'Akshat Sharma',
      avatar: 'A',
      badge: 'PRO DEV',
      time: '2 hours ago',
      group: 'Riverpod 2.x',
      title: 'How do you handle global auth state refresh tokens in Riverpod 2.0 AsyncNotifier?',
      content: 'I created an AuthAsyncNotifier extending AsyncNotifier<AuthState>. When the JWT expires during a Dio request, should I trigger the refresh token inside Dio Interceptors or handle it inside the provider build() method?',
      upvotes: 24,
      comments: [
        { author: 'Elena Rostova', avatar: 'E', text: 'Handle it inside the Dio Interceptor onError callback! That keeps HTTP logic decoupled from Riverpod state.' }
      ]
    },
    {
      id: 'post_02',
      author: 'Marcus Vance',
      avatar: 'M',
      badge: 'FLUTTER ARCHITECT',
      time: '5 hours ago',
      group: 'Clean Architecture',
      title: 'Repository Pattern with Hive & Remote REST API Fallback',
      content: 'Here is our production recipe for offline-first Flutter apps using Hive local caching and Dio remote synchronization.',
      upvotes: 42,
      comments: []
    }
  ],

  upvotePost: function (postId) {
    const post = this.posts.find(p => p.id === postId);
    if (post) {
      post.upvotes++;
      this.renderFeed();
      App.showToast('Upvoted post! ▲', 'success');
    }
  },

  addComment: function (postId, text) {
    const post = this.posts.find(p => p.id === postId);
    if (post && text.trim()) {
      post.comments.push({
        author: AuthManager.currentUser ? AuthManager.currentUser.name : 'Flutter Developer',
        avatar: AuthManager.currentUser ? AuthManager.currentUser.avatar : 'F',
        text: text,
      });
      this.renderFeed();
      App.showToast('Comment added!', 'success');
    }
  },

  renderFeed: function () {
    const container = document.getElementById('community-feed-container');
    if (!container) return;

    let list = this.posts;
    if (this.activeGroup !== 'all') {
      list = list.filter(p => p.group === this.activeGroup);
    }

    container.innerHTML = list.map(p => `
      <div class="glass-panel" style="padding:1.5rem; margin-bottom:1.25rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
          <div style="display:flex; align-items:center; gap:10px;">
            <div style="width:36px; height:36px; border-radius:50%; background:var(--grad-flutter); color:#fff; display:flex; align-items:center; justify-content:center; font-weight:700;">
              ${p.avatar}
            </div>
            <div>
              <div style="font-size:0.9rem; font-weight:700; color:var(--text-bright);">${p.author} <span class="badge badge-emerald" style="font-size:10px;">${p.badge}</span></div>
              <div style="font-size:0.75rem; color:var(--text-muted);">${p.time} in <span style="color:var(--accent-cyan-light);">${p.group}</span></div>
            </div>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="CommunityManager.upvotePost('${p.id}')">▲ ${p.upvotes}</button>
        </div>
        <h3 style="font-size:1.15rem; font-weight:700; color:var(--text-bright); margin-bottom:0.5rem;">${p.title}</h3>
        <p style="color:var(--text-secondary); font-size:0.9rem; margin-bottom:1rem;">${p.content}</p>
        
        <div style="border-top:1px solid var(--border-color); padding-top:0.75rem;">
          <div style="font-size:0.8rem; font-weight:700; color:var(--text-muted); margin-bottom:0.5rem;">Comments (${p.comments.length})</div>
          ${p.comments.map(c => `
            <div style="background:var(--bg-tertiary); padding:8px 12px; border-radius:8px; margin-bottom:6px; font-size:0.85rem;">
              <strong>${c.author}:</strong> ${c.text}
            </div>
          `).join('')}
          <div style="display:flex; gap:8px; margin-top:8px;">
            <input type="text" id="comment-input-${p.id}" placeholder="Write a reply..." style="flex:1; background:var(--bg-tertiary); border:1px solid var(--border-color); color:#fff; padding:6px 12px; border-radius:8px; font-size:13px;" />
            <button class="btn btn-primary btn-sm" onclick="CommunityManager.addComment('${p.id}', document.getElementById('comment-input-${p.id}').value)">Reply</button>
          </div>
        </div>
      </div>
    `).join('');
  }
};
