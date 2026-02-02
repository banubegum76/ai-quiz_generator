import './style.css'
import { generateQuiz } from './api.js'

document.querySelector('#app').innerHTML = `
  <header class="app-header">
    <div class="logo">
      <img src="./logo.png" alt="Logo" style="height: 40px; vertical-align: middle; margin-right: 10px;">
      Restart 
    </div>
    <button id="restart-btn" class="btn btn-secondary" style="display: none;">Go Back</button>
  </header>
  
  <main class="app-main">
    <div id="topic-section">
      <h1 class="title">AI Quiz Generator</h1>
      <p class="subtitle">Enter a topic and let AI create a quiz for you instantly.</p>
      
      <div class="input-container">
        <label class="input-label">What topic do you want to learn?</label>
        <input type="text" id="topic-input" class="modern-input" placeholder="e.g., Photosynthesis, World War II, Python Basics" />
        
        <div class="options-row">
            <div class="option-group">
                <label class="input-label">No. of Questions</label>
                <input type="number" id="count-input" value="5" min="1" max="10" />
            </div>
            
            <div class="option-group">
                <label class="input-label">Difficulty</label>
                <select id="difficulty-input">
                    <option value="Easy">Easy</option>
                    <option value="Medium" selected>Medium</option>
                    <option value="Hard">Hard</option>
                </select>
            </div>
        </div>

        <button id="generate-btn" class="btn btn-large">Generate Quiz</button>
      </div>
    </div>
    
    <div id="results-section" class="hidden">
      <!-- Quiz questions will appear here -->
    </div>

    <footer class="app-footer">
      <p>Created By Banu Begum</p>
    </footer>
  </main>
`

// Initial Logic
const restartBtn = document.getElementById('restart-btn');
const generateBtn = document.getElementById('generate-btn');
const topicInput = document.getElementById('topic-input');
const countInput = document.getElementById('count-input');
const difficultyInput = document.getElementById('difficulty-input');
const topicSection = document.getElementById('topic-section');
const resultsSection = document.getElementById('results-section');

generateBtn.addEventListener('click', async () => {
  const topic = topicInput.value.trim();
  const count = parseInt(countInput.value) || 5;
  const difficulty = difficultyInput.value;

  if (!topic) {
    alert('Please enter a topic');
    return;
  }

  // Basic state switch for now
  topicSection.classList.add('hidden');
  resultsSection.classList.remove('hidden');
  restartBtn.style.display = 'block';

  resultsSection.innerHTML = '<div class="loading">✨ Generating AI Quiz...</div>';

  try {
    const questions = await generateQuiz(topic, count, difficulty);

    if (questions.length === 0) {
      resultsSection.innerHTML = '<p>No questions generated. Try a different topic.</p>';
      return;
    }

    // Store questions globally for scoring
    window.currentQuestions = questions;

    resultsSection.innerHTML = questions.map((q, index) => `
      <div class="question-card" data-index="${index}">
        <div class="question-text">${index + 1}. ${q.question}</div>
        <div class="options-grid">
          ${q.options.map((opt, i) => `
            <div class="option" data-idx="${i}" onclick="selectOption(${index}, ${i})">
              ${opt}
            </div>
          `).join('')}
        </div>
      </div>
    `).join('') + `
      <div style="text-align: center; margin-top: 2rem;">
        <button id="submit-btn" class="btn">Submit Quiz</button>
      </div>
      <div id="score-display" class="hidden"></div>
    `;

    document.getElementById('submit-btn').addEventListener('click', calculateScore);

  } catch (error) {
    resultsSection.innerHTML = `<p style="color: #ef4444">Error: ${error.message}</p>`;
  }
});

// Global functions for interaction
window.selectOption = (questionIndex, optionIndex) => {
  const card = document.querySelector(`.question-card[data-index="${questionIndex}"]`);
  const options = card.querySelectorAll('.option');

  // Deselect all in this card
  options.forEach(opt => opt.classList.remove('selected'));

  // Select the clicked one
  options[optionIndex].classList.add('selected');
};

function calculateScore() {
  const questions = window.currentQuestions;
  let score = 0;

  questions.forEach((q, index) => {
    const card = document.querySelector(`.question-card[data-index="${index}"]`);
    const selectedOption = card.querySelector('.option.selected');
    const options = card.querySelectorAll('.option');

    // Disable interactions
    options.forEach(opt => opt.onclick = null);

    if (selectedOption) {
      const selectedIdx = parseInt(selectedOption.dataset.idx);

      if (selectedIdx === q.correctAnswer) {
        score++;
        selectedOption.classList.add('correct');
      } else {
        selectedOption.classList.add('incorrect');
        // Show correct answer
        options[q.correctAnswer].classList.add('correct');
      }
    } else {
      // No selection, just show correct answer
      options[q.correctAnswer].classList.add('correct');
    }
  });

  const scoreDisplay = document.getElementById('score-display');
  scoreDisplay.innerHTML = `
    <h2>You scored ${score} out of ${questions.length}!</h2>
    <p>${Math.round((score / questions.length) * 100)}% Correct</p>
  `;
  scoreDisplay.classList.remove('hidden');
  document.getElementById('submit-btn').style.display = 'none';
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

restartBtn.addEventListener('click', () => {
  topicInput.value = '';
  topicSection.classList.remove('hidden');
  resultsSection.classList.add('hidden');
  restartBtn.style.display = 'none';
});
