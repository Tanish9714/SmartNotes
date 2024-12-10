const Groq = require('groq-sdk');

const groq = new Groq({ apiKey:process.env.GROQ_API_KEY});

const summarize = async (content) => {
    const response = await groq.chat.completions.create({
        messages: [{ role: 'user', content: `Summarize this note: ${content}` }],
        model: 'mixtral-8x7b-32768',
    });
    return response.choices[0]?.message?.content || '';
};

const identifyThemes = async (content) => {
    const response = await groq.chat.completions.create({
        messages: [{ role: 'user', content: `Identify key themes in this text: ${content}` }],
        model: 'mixtral-8x7b-32768',
    });
    return response.choices[0]?.message?.content.split(',') || [];
};

const checkGrammar = async (content) => {
    const response = await groq.chat.completions.create({
        messages: [{ role: 'user', content: `Check the grammar of this text and provide suggestions: ${content}` }],
        model: 'mixtral-8x7b-32768',
    });
    return response.choices[0]?.message?.content.split(',') || [];
};

module.exports = { summarize, identifyThemes, checkGrammar };
