import React, { useState, useEffect } from 'react';
import NoteForm from './NoteForm';
import NotesList from './NoteList';
import axios from 'axios';

const NotesContainer = () => {
    const [notes, setNotes] = useState([]);

    const fetchNotes = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/notes');
            setNotes(response.data);
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    return (
        <div>
            <NoteForm fetchNotes={fetchNotes} />
            <NotesList notes={notes} fetchNotes={fetchNotes} />
        </div>
    );
};

export default NotesContainer;
