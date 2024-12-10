import React from 'react';
import NotesContainer from './components/NotesContainer';

const App = () => {
    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-4 mt-4 text-center text-red-600">SmartNotes</h1>
            <NotesContainer />
        </div>
    );
};

export default App;
