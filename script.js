const checkBtn = document.getElementById('check-btn');
const answerInput = document.getElementById('answer');
const feedback = document.getElementById('feedback');
const progressBoxes = document.querySelectorAll('.progress');
const progressText = document.getElementById('progress-text');

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
  const studentAnswer = Number(answerInput.value);

  if (answerInput.value.trim() === '') {
    feedback.textContent = 'Enter an answer first, then try again.';
    feedback.className = 'bad';
    return;
  }

  if (studentAnswer === 5) {
    feedback.textContent = 'Great job! x = 5 is correct ✅';
    feedback.className = 'good';
  } else {
    feedback.textContent = 'Nice try. Hint: subtract 5 first, then divide by 3.';
    feedback.className = 'bad';
  }
});

progressBoxes.forEach((box) => {
  box.addEventListener('change', updateProgress);
});

loadProgress();
updateProgress();
