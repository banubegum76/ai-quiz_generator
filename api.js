const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export async function generateQuiz(topic, count = 5, difficulty = 'Medium') {
    if (!API_KEY || API_KEY === '') {
        throw new Error('API Key is missing. Please set API_KEY in api.js');
    }

    console.log(`Generating quiz for: ${topic}, Count: ${count}, Difficulty: ${difficulty}`);

    const prompt = `
    Generate a quiz about "${topic}" with ${count} multiple-choice questions.
    Difficulty Level: ${difficulty}.
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
  `;

    try {
        // specific model: gemini-1.5-flash
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Failed to fetch from Gemini API');
        }

        const data = await response.json();
        if (!data.candidates || data.candidates.length === 0) {
            throw new Error('No content generated');
        }
        const text = data.candidates[0].content.parts[0].text;

        // Clean up potential markdown code blocks if the AI adds them
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(cleanText);

    } catch (error) {
        console.error("AI Generation Error:", error);

        // Auto-diagnose: List available models to help the user
        try {
            const listResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
            if (listResponse.ok) {
                const listData = await listResponse.json();
                const modelNames = listData.models
                    ? listData.models.map(m => m.name.replace('models/', '')).filter(n => n.includes('gemini')).join(', ')
                    : 'None';
                throw new Error(`${error.message} \n\n(Available Gemini Models: ${modelNames})`);
            }
        } catch (listError) {
            // Ignore list error and throw original
        }

        throw new Error(error.message);
    }
}
