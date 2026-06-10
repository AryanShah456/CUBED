'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // Hamburger
  document.querySelector('.nav-hamburger')?.addEventListener('click', () => {
    document.querySelector('.nav-links').classList.toggle('open');
  });

  // Highlight active notation card on hover
  document.querySelectorAll('.notation-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      document.querySelectorAll('.notation-card').forEach(c => c.classList.remove('highlight'));
      card.classList.add('highlight');
    });
  });

  // Interactive quiz
  const quizData = [
    { q: "What does R mean?", a: "Right face clockwise", options: ["Right face clockwise", "Rotate all", "Left face counter-clockwise", "Right face counter-clockwise"] },
    { q: "What does U' mean?", a: "Up face counter-clockwise", options: ["Up face clockwise", "Up face counter-clockwise", "Down face clockwise", "Undo last move"] },
    { q: "What does F2 mean?", a: "Front face twice (180°)", options: ["Front face clockwise", "Front face twice (180°)", "Front face counter-clockwise", "Two front moves"] },
    { q: "Which move turns the bottom face?", a: "D", options: ["B", "U", "D", "F"] },
    { q: "What does L' do?", a: "Left face counter-clockwise", options: ["Left face clockwise", "Left face twice", "Left face counter-clockwise", "Look at left face"] },
  ];

  let current = 0;
  let score = 0;

  const qEl = document.getElementById('quiz-question');
  const optContainer = document.getElementById('quiz-options');
  const scoreEl = document.getElementById('quiz-score');
  const feedbackEl = document.getElementById('quiz-feedback');
  const nextBtn = document.getElementById('quiz-next');
  const progressEl = document.getElementById('quiz-progress');

  function loadQuestion() {
    if (!qEl) return;
    const q = quizData[current];
    qEl.textContent = q.q;
    optContainer.innerHTML = '';
    feedbackEl.textContent = '';
    feedbackEl.className = 'quiz-feedback';
    if (nextBtn) nextBtn.style.display = 'none';

    if (progressEl) progressEl.textContent = `${current + 1} / ${quizData.length}`;

    q.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'quiz-opt';
      btn.textContent = opt;
      btn.addEventListener('click', () => {
        const correct = opt === q.a;
        btn.classList.add(correct ? 'correct' : 'wrong');
        optContainer.querySelectorAll('.quiz-opt').forEach(b => b.disabled = true);
        if (correct) {
          score++;
          feedbackEl.textContent = '✓ Correct!';
          feedbackEl.className = 'quiz-feedback ok';
        } else {
          feedbackEl.textContent = `✗ The answer is: ${q.a}`;
          feedbackEl.className = 'quiz-feedback err';
          // Highlight correct
          optContainer.querySelectorAll('.quiz-opt').forEach(b => {
            if (b.textContent === q.a) b.classList.add('correct');
          });
        }
        if (scoreEl) scoreEl.textContent = score;
        if (nextBtn) nextBtn.style.display = 'inline-flex';
      });
      optContainer.appendChild(btn);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      current++;
      if (current >= quizData.length) {
        qEl.textContent = `Quiz complete! You scored ${score}/${quizData.length}.`;
        optContainer.innerHTML = '';
        feedbackEl.textContent = score === quizData.length ? '🎉 Perfect score!' : 'Keep practising!';
        feedbackEl.className = 'quiz-feedback ok';
        nextBtn.style.display = 'none';
        if (progressEl) progressEl.textContent = `${quizData.length} / ${quizData.length}`;
      } else {
        loadQuestion();
      }
    });
  }

  loadQuestion();
});
