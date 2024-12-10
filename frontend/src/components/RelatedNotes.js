import React, { useState, useEffect } from 'react';
import { findRelatedNotes } from '../api/groqAPI';
import notesData from '../data';

const RelatedNotes = ({ content }) => {
  const [relatedNotes, setRelatedNotes] = useState([]);

  useEffect(() => {
    if (content) {
      const related = findRelatedNotes(content, notesData);
      setRelatedNotes(related);
    }
  }, [content]);

  return (
    <div className="related-notes">
      <ul>
        {relatedNotes.map((note, index) => (
          <li key={index}>{note.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default RelatedNotes;
