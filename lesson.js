const lessons = [
  {
    title: 'Number Skills',
    goal: 'Build confidence with negatives, positives, and operation order.',
    example: '-3 + 8 = 5 because you move 8 steps right from -3.',
    tryPrompt: 'Evaluate: 7 + 2 × (5 - 3)',
    quizQuestion: 'Solve: -4 + 9',
    quizAnswer: 5,
    quizHint: 'Think of moving right on a number line.'
  },
  {
    title: 'Fractions, Decimals & Percents',
    goal: 'Switch forms easily and solve everyday percent problems.',
    example: '0.75 = 75% = 3/4.',
    tryPrompt: 'Find 20% of 45.',
    quizQuestion: 'What is 50% of 36?',
    quizAnswer: 18,
    quizHint: '50% means half.'
  },
  {
    title: 'Variables & Expressions',
    goal: 'Understand variables as values that can change.',
    example: 'If x = 4, then 2x + 3 = 11.',
    tryPrompt: 'Evaluate 3n - 1 when n = 6.',
    quizQuestion: 'If n = 5, what is 2n + 1?',
    quizAnswer: 11,
    quizHint: 'Substitute n with 5.'
  },
  {
    title: 'Equations Basics',
    goal: 'Solve equations by undoing operations in reverse order.',
    example: 'x + 9 = 14 → subtract 9 from both sides to get x = 5.',
    tryPrompt: 'Solve: 2y - 6 = 10.',
    quizQuestion: 'Solve: a + 7 = 13',
    quizAnswer: 6,
    quizHint: 'Subtract 7 from both sides.'
  },
  {
    title: 'Graphing & Linear Equations',
    goal: 'Read points and understand lines using slope and intercept.',
    example: 'In y = 2x + 1, slope is 2 and y-intercept is 1.',
    tryPrompt: 'If x = 3, what is y in y = 2x + 1?',
    quizQuestion: 'In y = 3x + 2, what is y when x = 2?',
    quizAnswer: 8,
    quizHint: 'Plug 2 in for x.'
  },
  {
    title: 'Algebra Confidence Lab',
    goal: 'Practice mixed skills and review mistakes productively.',
    example: 'If 2(x + 1)=10, divide by 2 first, then solve x+1=5.',
    tryPrompt: 'Solve: 5a + 2 = 27.',
    quizQuestion: 'Solve: 4m = 28',
    quizAnswer: 7,
    quizHint: 'Divide both sides by 4.'
  }
];

function getClassIndex() {
  const params = new URLSearchParams(window.location.search);
  const classIndex = Number(params.get('class'));
  if (!Number.isInteger(classIndex) || classIndex < 0 || classIndex >= lessons.length) {
    return 0;
  }
  return classIndex;
}

function loadProgressArray() {
  const raw = localStorage.getItem('mathpath-progress');
  if (!raw) {
    return Array.from({ length: lessons.length }, () => false);
  }

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length === lessons.length) {
      return parsed.map((item) => Boolean(item));
    }
  } catch {
    localStorage.removeItem('mathpath-progress');
  }

  return Array.from({ length: lessons.length }, () => false);
}

function saveProgressArray(progress) {
  localStorage.setItem('mathpath-progress', JSON.stringify(progress));
}

function renderLesson(classIndex) {
  const lesson = lessons[classIndex];

  document.getElementById('lesson-kicker').textContent = `Class ${classIndex + 1} of ${lessons.length}`;
  document.getElementById('lesson-title').textContent = lesson.title;
  document.getElementById('lesson-goal').textContent = lesson.goal;
  document.getElementById('lesson-example').textContent = lesson.example;
  document.getElementById('lesson-try').textContent = lesson.tryPrompt;
  document.getElementById('quiz-question').textContent = lesson.quizQuestion;

  const prevIndex = Math.max(0, classIndex - 1);
  const nextIndex = Math.min(lessons.length - 1, classIndex + 1);

  const prevLink = document.getElementById('prev-class-link');
  const nextLink = document.getElementById('next-class-link');

  prevLink.href = `lesson.html?class=${prevIndex}`;
  nextLink.href = `lesson.html?class=${nextIndex}`;

  prevLink.classList.toggle('disabled-link', classIndex === 0);
  nextLink.classList.toggle('disabled-link', classIndex === lessons.length - 1);
}

const classIndex = getClassIndex();
renderLesson(classIndex);

const quizCheck = document.getElementById('quiz-check');
const markComplete = document.getElementById('mark-complete');
const quizAnswerInput = document.getElementById('quiz-answer');
const quizFeedback = document.getElementById('quiz-feedback');

quizCheck.addEventListener('click', () => {
  const value = quizAnswerInput.value.trim();
  if (value === '') {
    quizFeedback.textContent = 'Please enter an answer first.';
    quizFeedback.className = 'bad';
    return;
  }

  const guess = Number(value);
  const lesson = lessons[classIndex];

  if (guess === lesson.quizAnswer) {
    quizFeedback.textContent = 'Correct ✅ Great work!';
    quizFeedback.className = 'good';
  } else {
    quizFeedback.textContent = `Not quite. Hint: ${lesson.quizHint}`;
    quizFeedback.className = 'bad';
  }
});

markComplete.addEventListener('click', () => {
  const progress = loadProgressArray();
  progress[classIndex] = true;
  saveProgressArray(progress);

  quizFeedback.textContent = `Class ${classIndex + 1} marked complete. Return to home to see roadmap progress.`;
  quizFeedback.className = 'good';
});
