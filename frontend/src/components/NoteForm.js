import React, { useState, useEffect } from 'react';
import RichTextEditor from './RichTextEditor';
import { summarizeNote, identifyThemes, checkGrammar } from '../api/groqAPI';
// import RelatedNotes from './RelatedNotes';
import axios from 'axios';
import termsWithExplanations from './terms';

const NoteForm = ({ fetchNotes }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [themes, setThemes] = useState([]);
  const [grammarSuggestions, setGrammarSuggestions] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentNoteId, setCurrentNoteId] = useState(null);
  const [error, setError] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const noteData = { title, content }; // Only title and content
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/notes/${currentNoteId}`, noteData);
        alert('Note updated successfully!');
      } else {
        const response = await axios.post('http://localhost:5000/api/notes', noteData);
        if (response.status === 201) {
          alert('Note saved successfully!');
        }
      }
      resetForm();
      fetchNotes(); // Call fetchNotes after saving
    } catch (error) {
      console.error('Error saving note:', error);
      alert('Failed to save note. Please try again.');
    }
  };


  const resetForm = () => {
    setTitle('');
    setContent('');
    setSummary('');
    setThemes([]);
    setGrammarSuggestions([]);
    setIsEditing(false);
    setCurrentNoteId(null);
  };

  const handleSummarize = async () => {
    const summarizedText = await summarizeNote(content);
    setSummary(summarizedText);
  };

  const handleIdentifyThemes = async () => {
    const themes = await identifyThemes(content);
    setThemes(themes);
  };

  const handleCheckGrammar = async () => {
    const suggestions = await checkGrammar(content);
    setGrammarSuggestions(suggestions);
  };

  const highlightTerms = (text) => {
    // Remove HTML tags and unwanted formatting, including &nbsp;
    const cleanedText = text
      .replace(/<[^>]+>/g, '') // Removes HTML tags
      .replace(/&nbsp;/g, ' ') // Replaces &nbsp; with a regular space
      .replace(/&lt;/g, '<')   // Optional: replace &lt; with <
      .replace(/&gt;/g, '>')   // Optional: replace &gt; with >
      .replace(/&amp;/g, '&')   // Optional: replace &amp; with &
      .replace(/&quot;/g, '"')  // Optional: replace &quot; with "
      .replace(/&apos;/g, "'");  // Optional: replace &apos; with '

    const words = cleanedText.split(' ');

    return words.map((word, index) => {
      // Clean each word of punctuation
      const cleanWord = word.replace(/[.,/#!$%^&*;:{}=\-_~()]/g, '');
      // Check if the cleaned word is in termsWithExplanations
      if (termsWithExplanations[cleanWord]) {
        return (
          <span
            key={index}
            className="bg-yellow-200 px-1"
            title={termsWithExplanations[cleanWord]}
          >
            {word}{' '}
          </span>
        );
      }
      return word + ' ';
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
      <form onSubmit={handleSave} className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <RichTextEditor content={content} setContent={setContent} />
        <div className="flex space-x-2">
          <button type="button" onClick={handleSummarize} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
            Summarize
          </button>
          <button type="button" onClick={handleIdentifyThemes} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
            Identify Key Themes
          </button>
          <button type="button" onClick={handleCheckGrammar} className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600">
            Check Grammar
          </button>
          <button type="submit" className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600">
            {isEditing ? 'Update' : 'Save'}
          </button>
        </div>
      </form>

      {error && <div className="mt-4 text-red-500">{error}</div>}

      <div className="mt-6">
        <strong>Highlighted Content:</strong>
        <div className="mt-2 bg-gray-100 p-4 rounded-md">{highlightTerms(content)}</div>
      </div>

      {summary && (
        <div className="mt-6 border border-blue-500 p-4 rounded-md bg-blue-50">
          <strong className="text-blue-500">Summary:</strong> {summary}
        </div>
      )}

      {themes.length > 0 && (
        <div className="mt-6 border border-green-500 p-4 rounded-md bg-green-50">
          <strong className="text-green-500">Key Themes:</strong> {themes.join(', ')}
        </div>
      )}

      {grammarSuggestions.length > 0 && (
        <div className="mt-6 border border-yellow-500 p-4 rounded-md bg-yellow-50">
          <strong className="text-yellow-500">Grammar Suggestions:</strong>
          <ul className="list-disc list-inside">
            {grammarSuggestions.map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        </div>
      )}

      {/* <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Related Notes</h3>
        <RelatedNotes content={content} />
      </div> */}
    </div>
  );
};

export default NoteForm;
