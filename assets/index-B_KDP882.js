(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))n(t);new MutationObserver(t=>{for(const e of t)if(e.type==="childList")for(const o of e.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function r(t){const e={};return t.integrity&&(e.integrity=t.integrity),t.referrerPolicy&&(e.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?e.credentials="include":t.crossOrigin==="anonymous"?e.credentials="omit":e.credentials="same-origin",e}function n(t){if(t.ep)return;t.ep=!0;const e=r(t);fetch(t.href,e)}})();const p="AIzaSyAxuw7WZx8y4x98b0wbXc_qYPVcj2wxnF0";async function y(i,s=5,r="Medium"){var t;console.log(`Generating quiz for: ${i}, Count: ${s}, Difficulty: ${r}`);const n=`
    Generate a quiz about "${i}" with ${s} multiple-choice questions.
    Difficulty Level: ${r}.
    Return strictly a JSON array of objects. 
    Each object must have:
    - "question": string
    - "options": array of 4 strings
    - "correctAnswer": integer (index of the correct option, 0-3)
    
    Example format:
    [
      {
        "question": "What is 2+2?",
        "options": ["3", "4", "5", "6"],
        "correctAnswer": 1
      }
    ]
    Do not include markdown formatting like \`\`\`json. Return raw JSON only.
  `;try{const e=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${p}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:n}]}]})});if(!e.ok){const d=await e.json();throw new Error(((t=d.error)==null?void 0:t.message)||"Failed to fetch from Gemini API")}const o=await e.json();if(!o.candidates||o.candidates.length===0)throw new Error("No content generated");const a=o.candidates[0].content.parts[0].text.replace(/```json/g,"").replace(/```/g,"").trim();return JSON.parse(a)}catch(e){console.error("AI Generation Error:",e);try{const o=await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${p}`);if(o.ok){const c=await o.json(),a=c.models?c.models.map(d=>d.name.replace("models/","")).filter(d=>d.includes("gemini")).join(", "):"None";throw new Error(`${e.message} 

(Available Gemini Models: ${a})`)}}catch{}throw new Error(e.message)}}const f="/ai-quiz_generator/assets/logo-DJNvxUGn.png";document.querySelector("#app").innerHTML=`
  <header class="app-header">
    <div class="logo">
      <img src="${f}" alt="Logo" style="height: 40px; vertical-align: middle; margin-right: 10px;">
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
`;const u=document.getElementById("restart-btn"),h=document.getElementById("generate-btn"),m=document.getElementById("topic-input"),v=document.getElementById("count-input"),b=document.getElementById("difficulty-input"),g=document.getElementById("topic-section"),l=document.getElementById("results-section");h.addEventListener("click",async()=>{const i=m.value.trim(),s=parseInt(v.value)||5,r=b.value;if(!i){alert("Please enter a topic");return}g.classList.add("hidden"),l.classList.remove("hidden"),u.style.display="block",l.innerHTML='<div class="loading">✨ Generating AI Quiz...</div>';try{const n=await y(i,s,r);if(n.length===0){l.innerHTML="<p>No questions generated. Try a different topic.</p>";return}window.currentQuestions=n,l.innerHTML=n.map((t,e)=>`
      <div class="question-card" data-index="${e}">
        <div class="question-text">${e+1}. ${t.question}</div>
        <div class="options-grid">
          ${t.options.map((o,c)=>`
            <div class="option" data-idx="${c}" onclick="selectOption(${e}, ${c})">
              ${o}
            </div>
          `).join("")}
        </div>
      </div>
    `).join("")+`
      <div style="text-align: center; margin-top: 2rem;">
        <button id="submit-btn" class="btn">Submit Quiz</button>
      </div>
      <div id="score-display" class="hidden"></div>
    `,document.getElementById("submit-btn").addEventListener("click",w)}catch(n){l.innerHTML=`<p style="color: #ef4444">Error: ${n.message}</p>`}});window.selectOption=(i,s)=>{const n=document.querySelector(`.question-card[data-index="${i}"]`).querySelectorAll(".option");n.forEach(t=>t.classList.remove("selected")),n[s].classList.add("selected")};function w(){const i=window.currentQuestions;let s=0;i.forEach((n,t)=>{const e=document.querySelector(`.question-card[data-index="${t}"]`),o=e.querySelector(".option.selected"),c=e.querySelectorAll(".option");c.forEach(a=>a.onclick=null),o?parseInt(o.dataset.idx)===n.correctAnswer?(s++,o.classList.add("correct")):(o.classList.add("incorrect"),c[n.correctAnswer].classList.add("correct")):c[n.correctAnswer].classList.add("correct")});const r=document.getElementById("score-display");r.innerHTML=`
    <h2>You scored ${s} out of ${i.length}!</h2>
    <p>${Math.round(s/i.length*100)}% Correct</p>
  `,r.classList.remove("hidden"),document.getElementById("submit-btn").style.display="none",window.scrollTo({top:document.body.scrollHeight,behavior:"smooth"})}u.addEventListener("click",()=>{m.value="",g.classList.remove("hidden"),l.classList.add("hidden"),u.style.display="none"});
