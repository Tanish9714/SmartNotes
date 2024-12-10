require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const groqAPI = require('./groqAPI');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));


// Note Schema
const noteSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    keyword: { type: String, sparse: true }, // Use sparse to allow nulls
    createdAt: { type: Date, default: Date.now },
    pinned: { type: Boolean, default: false },
});
const Note = mongoose.model('Note', noteSchema);

// API endpoints
app.post('/api/summarize', async (req, res) => {
    const { content } = req.body;
    try {
        const summary = await groqAPI.summarize(content);
        res.json({ summary });
    } catch (error) {
        res.status(500).json({ error: 'Error summarizing note.' });
    }
});

app.post('/api/identify-themes', async (req, res) => {
    const { content } = req.body;
    try {
        const themes = await groqAPI.identifyThemes(content);
        res.json({ themes });
    } catch (error) {
        res.status(500).json({ error: 'Error identifying themes.' });
    }
});

app.post('/api/check-grammar', async (req, res) => {
    const { content } = req.body;
    try {
        const suggestions = await groqAPI.checkGrammar(content);
        res.json({ suggestions });
    } catch (error) {
        res.status(500).json({ error: 'Error checking grammar.' });
    }
});

// API endpoint for saving notes without encryption
app.post('/api/notes', async (req, res) => {
    const { title, content, keyword = `default-${Date.now()}` } = req.body; // Default keyword
    try {
        const newNote = new Note({ title, content, keyword });
        await newNote.save();
        res.status(201).json({ message: 'Note saved successfully', note: newNote });
    } catch (error) {
        res.status(500).json({ error: 'Error saving note.', details: error.message });
    }
});

// API endpoint for updating notes without encryption
app.put('/api/notes/:id', async (req, res) => {
    const { title, content } = req.body; // Include keyword if required
    try {
        const updatedNote = await Note.findByIdAndUpdate(req.params.id, { title, content }, { new: true });
        if (!updatedNote) {
            return res.status(404).json({ error: 'Note not found' });
        }
        res.json({ message: 'Note updated successfully', note: updatedNote });
    } catch (error) {
        res.status(500).json({ error: 'Error updating note.', details: error.message });
    }
});

// New endpoint for toggling the pinned status
app.patch('/api/notes/:id', async (req, res) => {
    const { pinned } = req.body; // Get the pinned value from the request body
    try {
        const note = await Note.findByIdAndUpdate(req.params.id, { pinned }, { new: true });
        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }
        res.json({ message: 'Note pinned status updated successfully', note });
    } catch (error) {
        res.status(500).json({ error: 'Error updating pinned status.', details: error.message });
    }
});

app.delete('/api/notes/:id', async (req, res) => {
    try {
        const deletedNote = await Note.findByIdAndDelete(req.params.id);
        if (!deletedNote) {
            return res.status(404).json({ error: 'Note not found' });
        }
        res.json({ message: 'Note deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting note.', details: error.message });
    }
});

app.get('/api/notes', async (req, res) => {
    try {
        const notes = await Note.find().sort({ pinned: -1, createdAt: -1 });
        res.json(notes);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving notes.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
