const practiceQuestions = [
  { question: 'Solve: 3x + 5 = 20', answer: 5, hint: 'Subtract 5 first, then divide by 3.' },
  { question: 'Solve: y/4 = 3', answer: 12, hint: 'Multiply both sides by 4.' },
  { question: 'Evaluate: 2(6 - 1)', answer: 10, hint: 'Do parentheses first.' },
  { question: 'Solve: 7 + n = 15', answer: 8, hint: 'Subtract 7 from both sides.' }
];

const checkBtn = document.getElementById('check-btn');
const nextQuestionBtn = document.getElementById('next-question-btn');
const questionEl = document.getElementById('question');
const answerInput = document.getElementById('answer');
const feedback = document.getElementById('feedback');
const scoreEl = document.getElementById('score');

const progressBoxes = document.querySelectorAll('.progress');
const progressText = document.getElementById('progress-text');

let currentQuestion = 0;
let correctAnswers = 0;
let attempts = 0;

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

checkBtn.addEventListener('click', () => {
  const rawValue = answerInput.value.trim();
  if (rawValue === '') {
    feedback.textContent = 'Enter an answer first.';
    feedback.className = 'bad';
    return;
  }

  const studentAnswer = Number(rawValue);
  const activeQuestion = practiceQuestions[currentQuestion];
  attempts += 1;

  if (studentAnswer === activeQuestion.answer) {
    correctAnswers += 1;
    feedback.textContent = 'Correct ✅';
    feedback.className = 'good';
  } else {
    feedback.textContent = `Not quite. Hint: ${activeQuestion.hint}`;
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
showQuestion(currentQuestion);
updateProgress();
updateScore();
