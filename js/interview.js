/* ==========================================================================
   FlutterHub Interview Hub Controller
   Interactive MCQs Quiz Engine, Company Questions & Score Tracker
   ========================================================================== */

const InterviewHub = {
  currentScore: 0,
  userAnswers: {},

  selectOption: function (questionId, optionIndex, correctIndex) {
    this.userAnswers[questionId] = optionIndex;
    const isCorrect = optionIndex === correctIndex;

    const feedbackEl = document.getElementById(`mcq-feedback-${questionId}`);
    if (feedbackEl) {
      if (isCorrect) {
        feedbackEl.innerHTML = `<span style="color:#10b981; font-weight:bold;">✓ Correct Answer!</span>`;
      } else {
        feedbackEl.innerHTML = `<span style="color:#f43f5e; font-weight:bold;">✕ Incorrect. Try again!</span>`;
      }
    }
  },

  renderMCQsHTML: function () {
    return FLUTTER_DATA.interview.mcqs.map((q, qIndex) => `
      <div class="glass-panel" style="padding:1.5rem; margin-bottom:1.25rem;">
        <div style="font-size:0.8rem; color:var(--accent-cyan-light); font-weight:700; margin-bottom:0.5rem;">QUESTION ${qIndex + 1}</div>
        <h4 style="font-size:1.1rem; font-weight:700; color:var(--text-bright); margin-bottom:1rem;">${q.question}</h4>
        <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:1rem;">
          ${q.options.map((opt, oIdx) => `
            <button class="btn btn-secondary" style="text-align:left; justify-content:flex-start;" onclick="InterviewHub.selectOption('${q.id}', ${oIdx}, ${q.correctIndex})">
              ${String.fromCharCode(65 + oIdx)}. ${opt}
            </button>
          `).join('')}
        </div>
        <div id="mcq-feedback-${q.id}" style="font-size:0.875rem;"></div>
      </div>
    `).join('');
  },

  renderCompanyQuestionsHTML: function () {
    return FLUTTER_DATA.interview.companyQuestions.map(cq => `
      <div class="glass-panel" style="padding:1.5rem; margin-bottom:1.25rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
          <span class="badge badge-emerald">${cq.company}</span>
          <span style="font-size:0.8rem; color:var(--text-muted);">${cq.role}</span>
        </div>
        <h4 style="font-size:1.15rem; font-weight:700; color:var(--text-bright); margin-bottom:0.75rem;">${cq.question}</h4>
        <div style="background:var(--bg-tertiary); padding:1rem; border-radius:12px; border:1px solid var(--border-color); font-size:0.9rem; color:var(--text-secondary);">
          <strong style="color:var(--accent-cyan-light);">Detailed Solution:</strong><br/>
          ${cq.answer}
        </div>
      </div>
    `).join('');
  }
};
