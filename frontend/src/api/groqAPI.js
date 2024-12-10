const API_URL = 'http://localhost:5000/api'; // Adjust based on your backend URL

export const summarizeNote = async (content) => {
    const response = await fetch(`${API_URL}/summarize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
    });
    const data = await response.json();
    return data.summary;
};

export const identifyThemes = async (content) => {
    const response = await fetch(`${API_URL}/identify-themes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
    });
    const data = await response.json();
    return data.themes;
};

export const checkGrammar = async (content) => {
    const response = await fetch(`${API_URL}/check-grammar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
    });
    const data = await response.json();
    return data.suggestions;
};

export const findRelatedNotes = (content, notes) => {
  // Simple keyword matching for related notes
  const keywords = content.split(' ').map(word => word.toLowerCase());
  return notes.filter(note => 
      keywords.some(keyword => note.content.toLowerCase().includes(keyword))
  );
};
