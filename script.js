const lessons = [
  {
    title: 'Number Skills',
    goal: 'Build confidence with negatives, positives, and operation order.',
    example: '-3 + 8 = 5 because you move 8 steps right from -3.',
    tryPrompt: 'Evaluate: 7 + 2 × (5 - 3)'
  },
  {
    title: 'Fractions, Decimals & Percents',
    goal: 'Switch forms easily and solve everyday percent problems.',
    example: '0.75 = 75% = 3/4.',
    tryPrompt: 'Find 20% of 45.'
  },
  {
    title: 'Variables & Expressions',
    goal: 'Understand variables as values that can change.',
    example: 'If x = 4, then 2x + 3 = 11.',
    tryPrompt: 'Evaluate 3n - 1 when n = 6.'
  },
  {
    title: 'Equations Basics',
    goal: 'Solve equations by undoing operations in reverse order.',
    example: 'x + 9 = 14 → subtract 9 from both sides to get x = 5.',
    tryPrompt: 'Solve: 2y - 6 = 10.'
  },
  {
    title: 'Graphing & Linear Equations',
    goal: 'Read points and understand lines using slope and intercept.',
    example: 'In y = 2x + 1, slope is 2 and y-intercept is 1.',
    tryPrompt: 'If x = 3, what is y in y = 2x + 1?'
  },
  {
    title: 'Algebra Confidence Lab',
    goal: 'Practice mixed skills and review mistakes productively.',
    example: 'Mistake review: if 2(x + 1)=10, divide by 2 first, then solve x+1=5.',
    tryPrompt: 'Solve: 5a + 2 = 27.'
  }
];

const practiceQuestions = [
  {
    question: 'Solve: 3x + 5 = 20',
    answer: 5,
    hint: 'Subtract 5 first, then divide by 3.'
  },
  {
    question: 'Solve: y/4 = 3',
    answer: 12,
    hint: 'Multiply both sides by 4.'
  },
  {
    question: 'Evaluate: 2(6 - 1)',
    answer: 10,
    hint: 'Do parentheses first.'
  },
  {
    question: 'Solve: 7 + n = 15',
    answer: 8,
    hint: 'Subtract 7 from both sides.'
  }
];

const lessonButtons = document.querySelectorAll('.lesson-btn');
const lessonKicker = document.getElementById('lesson-kicker');
const lessonTitle = document.getElementById('lesson-title');
const lessonGoal = document.getElementById('lesson-goal');
const lessonExample = document.getElementById('lesson-example');
const lessonTry = document.getElementById('lesson-try');
const prevLessonBtn = document.getElementById('prev-lesson');
const nextLessonBtn = document.getElementById('next-lesson');

const checkBtn = document.getElementById('check-btn');
const nextQuestionBtn = document.getElementById('next-question-btn');
const questionEl = document.getElementById('question');
const answerInput = document.getElementById('answer');
const feedback = document.getElementById('feedback');
const scoreEl = document.getElementById('score');

const progressBoxes = document.querySelectorAll('.progress');
const progressText = document.getElementById('progress-text');

let currentLesson = 0;
let currentQuestion = 0;
let correctAnswers = 0;
let attempts = 0;

function renderLesson(index) {
  const lesson = lessons[index];
  lessonKicker.textContent = `Class ${index + 1} of ${lessons.length}`;
  lessonTitle.textContent = lesson.title;
  lessonGoal.textContent = lesson.goal;
  lessonExample.textContent = lesson.example;
  lessonTry.textContent = lesson.tryPrompt;

  prevLessonBtn.disabled = index === 0;
  nextLessonBtn.disabled = index === lessons.length - 1;

  localStorage.setItem('mathpath-current-lesson', String(index));
}

function showQuestion(index) {
  const item = practiceQuestions[index];
  questionEl.textContent = item.question;
  answerInput.value = '';
  feedback.textContent = '';
  feedback.className = '';
}

function updateScore() {
  scoreEl.textContent = `Score: ${correctAnswers} correct out of ${attempts} attempts.`;
}

function updateProgress() {
  const total = progressBoxes.length;
  const done = Array.from(progressBoxes).filter((item) => item.checked).length;
  progressText.textContent = `You have completed ${done}/${total} classes.`;
  localStorage.setItem(
    'mathpath-progress',
    JSON.stringify(Array.from(progressBoxes).map((item) => item.checked))
  );
}

function loadProgress() {
  const saved = localStorage.getItem('mathpath-progress');
  if (!saved) {
    return;
  }

  try {
    const states = JSON.parse(saved);
    if (Array.isArray(states)) {
      states.forEach((checked, index) => {
        if (progressBoxes[index]) {
          progressBoxes[index].checked = Boolean(checked);
        }
      });
    }
  } catch {
    localStorage.removeItem('mathpath-progress');
  }
}

function loadLessonState() {
  const savedLesson = Number(localStorage.getItem('mathpath-current-lesson'));
  if (Number.isInteger(savedLesson) && savedLesson >= 0 && savedLesson < lessons.length) {
    currentLesson = savedLesson;
  }
}

lessonButtons.forEach((button) => {
  button.addEventListener('click', () => {
    currentLesson = Number(button.dataset.lessonId);
    renderLesson(currentLesson);
    document.getElementById('lesson-viewer').scrollIntoView({ behavior: 'smooth' });
  });
});

prevLessonBtn.addEventListener('click', () => {
  if (currentLesson > 0) {
    currentLesson -= 1;
    renderLesson(currentLesson);
  }
});

nextLessonBtn.addEventListener('click', () => {
  if (currentLesson < lessons.length - 1) {
    currentLesson += 1;
    renderLesson(currentLesson);
  }
});

checkBtn.addEventListener('click', () => {
  const rawValue = answerInput.value.trim();
  if (rawValue === '') {
    feedback.textContent = 'Enter an answer first, then try again.';
    feedback.className = 'bad';
    return;
  }

  const studentAnswer = Number(rawValue);
  const activeQuestion = practiceQuestions[currentQuestion];
  attempts += 1;

  if (studentAnswer === activeQuestion.answer) {
    correctAnswers += 1;
    feedback.textContent = 'Great job! That is correct ✅';
    feedback.className = 'good';
  } else {
    feedback.textContent = `Nice try. Hint: ${activeQuestion.hint}`;
    feedback.className = 'bad';
  }

  updateScore();
});

nextQuestionBtn.addEventListener('click', () => {
  currentQuestion = (currentQuestion + 1) % practiceQuestions.length;
  showQuestion(currentQuestion);
});

progressBoxes.forEach((box) => {
  box.addEventListener('change', updateProgress);
});

loadProgress();
loadLessonState();
renderLesson(currentLesson);
showQuestion(currentQuestion);
updateProgress();
updateScore();
