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

  getMCQs: function() {
    return (window.FLUTTER_DATA && window.FLUTTER_DATA.interview && window.FLUTTER_DATA.interview.mcqs) || [
      {
        id: 'mcq_1',
        question: 'What is the main difference between StatelessWidget and StatefulWidget in Flutter?',
        options: [
          'StatelessWidget can rebuild anytime, while StatefulWidget cannot.',
          'StatelessWidget is immutable and cannot maintain internal state, while StatefulWidget can mutate state with setState().',
          'StatelessWidget renders faster than StatefulWidget in all cases.',
          'StatefulWidget cannot accept constructor parameters.'
        ],
        correctIndex: 1
      },
      {
        id: 'mcq_2',
        question: 'Which key is used to identify elements uniquely across the Flutter widget tree?',
        options: ['GlobalKey', 'UniqueKey', 'ValueKey', 'All of the above'],
        correctIndex: 3
      },
      {
        id: 'mcq_3',
        question: 'What is the role of BuildContext in Flutter?',
        options: [
          'It manages database queries.',
          'It represents a handle to the location of a widget in the widget tree structure.',
          'It compiles Dart code to ARM native binary.',
          'It handles HTTP networking requests.'
        ],
        correctIndex: 1
      }
    ];
  },

  getCompanyQuestions: function() {
    return (window.FLUTTER_DATA && window.FLUTTER_DATA.interview && window.FLUTTER_DATA.interview.companyQuestions) || [
      {
        company: 'Google',
        role: 'Senior Flutter Engineer',
        question: 'How does the Flutter rendering pipeline (Animate -> Build -> Layout -> Paint) work under the hood?',
        answer: 'Flutter executes rendering across three main trees: Widget tree (configuration), Element tree (lifecycle & state link), and RenderObject tree (layout geometry & painting). Frame callbacks trigger build(), layout calculates sizes top-down, and paint renders layer visuals bottom-up.'
      },
      {
        company: 'BMW',
        role: 'Lead Mobile Architect',
        question: 'How do you handle heavy computational tasks in Flutter without freezing the UI main isolate?',
        answer: 'Use Dart Isolates via compute() or Isolate.run() to spawn background worker threads with isolated memory spaces, passing data back and forth via SendPort / ReceivePort.'
      }
    ];
  },

  renderMCQsHTML: function () {
    const mcqs = this.getMCQs();
    return mcqs.map((q, qIndex) => `
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
    const questions = this.getCompanyQuestions();
    return questions.map(cq => `
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
