import React, { useState } from 'react';
import axios from 'axios';
import DOMPurify from 'dompurify';

const NotesList = ({ notes, fetchNotes }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [currentNote, setCurrentNote] = useState(null);

    const togglePin = async (noteId) => {
        try {
            // Fetch the note to check the current pinned state
            const noteToPin = notes.find(note => note._id === noteId);
            const updatedPinnedState = !noteToPin.pinned; // Toggle the pinned state

            await axios.patch(`http://localhost:5000/api/notes/${noteId}`, { pinned: updatedPinnedState });
            fetchNotes(); // Refresh notes after toggling pin
        } catch (error) {
            console.error('Error updating note:', error);
        }
    };

    const deleteNote = async (noteId) => {
        try {
            await axios.delete(`http://localhost:5000/api/notes/${noteId}`);
            fetchNotes(); // Refresh notes after deleting
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    };

    const handleEditClick = (note) => {
        setCurrentNote(note);
        setIsEditing(true);
    };

    const handleSaveEdit = async () => {
        if (currentNote) {
            try {
                await axios.put(`http://localhost:5000/api/notes/${currentNote._id}`, {
                    title: currentNote.title,
                    content: currentNote.content,
                });
                fetchNotes(); // Refresh notes after editing
                setCurrentNote(null);
                setIsEditing(false);
            } catch (error) {
                console.error('Error updating note:', error);
            }
        }
    };

    const sortedNotes = notes.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

    return (
        <div className="p-6 max-w-3xl mx-auto bg-white shadow-lg rounded-lg mt-10">
            <h2 className="text-2xl font-bold mb-4">All Notes</h2>
            {sortedNotes.length === 0 ? (
                <p>No notes available.</p>
            ) : (
                <ul className="space-y-4">
                    {sortedNotes.map((note) => (
                        <li key={note._id} className={`p-4 rounded-md shadow ${note.pinned ? 'border-l-4 border-yellow-400' : ''}`}>
                            <h3 className="text-xl font-semibold">{note.title}</h3>
                            <div className="overflow-hidden overflow-ellipsis whitespace-nowrap" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(note.content) }} />
                            <small className="block text-gray-500">Created at: {new Date(note.createdAt).toLocaleString()}</small>
                            <button onClick={() => togglePin(note._id)} className="mt-2 bg-yellow-500 text-white py-1 px-3 rounded-md hover:bg-yellow-600">
                                {note.pinned ? 'Unpin' : 'Pin'}
                            </button>
                            <button onClick={() => handleEditClick(note)} className="mt-2 ml-2 bg-indigo-500 text-white py-1 px-3 rounded-md hover:bg-indigo-600">
                                Edit
                            </button>
                            <button onClick={() => deleteNote(note._id)} className="mt-2 ml-2 bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600">
                                Delete
                            </button>
                            <div>
                                {isEditing && currentNote && (
                                    <div className="mt-6 p-4 bg-gray-100 rounded-md">
                                        <h3 className="text-lg font-semibold mb-2">Edit Note</h3>
                                        <input type="text" value={currentNote.title} onChange={(e) => setCurrentNote({ ...currentNote, title: e.target.value })} className="w-full p-2 border border-gray-300 rounded-md mb-2" />
                                        <textarea value={currentNote.content} onChange={(e) => setCurrentNote({ ...currentNote, content: e.target.value })} className="w-full p-2 border border-gray-300 rounded-md mb-2" rows="4" />
                                        <button onClick={handleSaveEdit} className="bg-green-500 text-white py-1 px-3 rounded-md hover:bg-green-600">
                                            Save Changes
                                        </button>
                                        <button onClick={() => { setCurrentNote(null); setIsEditing(false); }} className="bg-gray-500 text-white py-1 px-3 rounded-md hover:bg-gray-600 ml-2">
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </div>
                        </li>

                    ))}
                </ul>
            )}

        </div>
    );
};

export default NotesList;
