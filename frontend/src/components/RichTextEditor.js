import React, { useRef, useEffect, useState } from 'react';

const RichTextEditor = ({ content, setContent }) => {
  const editorRef = useRef(null);
  const [fontSize, setFontSize] = useState('3'); 

  const applyFormatting = (command, value = null) => {
    document.execCommand(command, false, value);
  };

  const handleInputChange = () => {
    setContent(editorRef.current.innerHTML);
  };

  const handleFontSizeChange = (e) => {
    const newSize = e.target.value;
    setFontSize(newSize);
    applyFormatting('fontSize', newSize);
  };

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content || '';
    }
  }, [content]);

  return (
    <div>
      <div className="flex space-x-2 mb-4">
        <button type='button' onClick={() => applyFormatting('bold')} className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">
          Bold
        </button>
        <button type='button' onClick={() => applyFormatting('italic')} className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">
          Italic
        </button>
        <button type='button' onClick={() => applyFormatting('underline')} className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">
          Underline
        </button>
        <button type='button' onClick={() => applyFormatting('justifyLeft')} className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">
          Align Left
        </button>
        <button type='button' onClick={() => applyFormatting('justifyCenter')} className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">
          Align Center
        </button>
        <button type='button' onClick={() => applyFormatting('justifyRight')} className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">
          Align Right
        </button>
        <select
          value={fontSize}
          onChange={handleFontSizeChange}
          className="border border-gray-300 px-2 py-1 rounded bg-blue-500 text-white"
        >
          <option value="1">Small</option>
          <option value="2">Normal</option>
          <option value="3">Large</option>
          <option value="4">Larger</option>
          <option value="5">Extra Large</option>
        </select>
      </div>

      <div
        ref={editorRef}
        className="editor border border-gray-300 p-4 rounded-md bg-gray-50 min-h-[150px] focus:outline-none"
        contentEditable="true"
        onInput={handleInputChange}
      ></div>
    </div>
  );
};

export default RichTextEditor;
