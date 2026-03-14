const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Allows the server to parse JSON bodies

// Serve static frontend files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// --- CHATBOT LOGIC (Simulated NLU) ---
// This function acts as the "intent recognition" and "response generation"
function getBotResponse(message) {
    // Normalize the input to lowercase for easier matching
    const lowerMsg = message.toLowerCase();

    // Keyword matching logic
    if (lowerMsg.includes('course') || lowerMsg.includes('subject') || lowerMsg.includes('class')) {
        return "We offer several courses this semester including CS 101, Data Structures (CS 201), and Web Application Development (CS 305). You can click the 'Course Info' quick link for full details!";
    } 
    else if (lowerMsg.includes('faculty') || lowerMsg.includes('professor') || lowerMsg.includes('teacher')) {
        return "Our department is headed by Dr. Alan Turing. Other key faculty include Dr. Ada Lovelace and Prof. Tim Berners-Lee. Check the 'Faculty Info' page for their office hours and emails.";
    } 
    else if (lowerMsg.includes('exam') || lowerMsg.includes('schedule') || lowerMsg.includes('date')) {
        return "Mid-term exams for Fall 2026 start on October 20. Please check the 'Exam Schedule' link on the left for the full room and time timetable.";
    } 
    else if (lowerMsg.includes('event') || lowerMsg.includes('workshop') || lowerMsg.includes('symposium')) {
        return "We have the Annual Tech Symposium coming up on April 15, and a Web Dev Workshop on April 22. Check the 'Events' tab for locations!";
    }
    else if (lowerMsg.includes('hi') || lowerMsg.includes('hello') || lowerMsg.includes('hey')) {
        return "Hello there! I'm DORA, your smart department assistant. How can I help you today?";
    } 
    else if (lowerMsg.includes('thank')) {
        return "You're very welcome! Let me know if you need anything else.";
    }
    else {
        // Fallback response if intent is not recognized
        return "I'm still learning! Could you please rephrase your question? Alternatively, you can check our FAQs or use the Contact page to reach the administration directly.";
    }
}

// --- API ENDPOINTS ---

// POST endpoint to handle chat messages
app.post('/api/chat', (req, res) => {
    const userMessage = req.body.message;
    
    if (!userMessage) {
        return res.status(400).json({ error: "Message is required" });
    }

    // Get the response from our logic engine
    const botReply = getBotResponse(userMessage);

    // Add a slight artificial delay (500ms) to make it feel like the bot is "typing"
    setTimeout(() => {
        res.json({ reply: botReply });
    }, 500);
});

// Start the server
app.listen(PORT, () => {
    console.log(`DORA Backend running successfully!`);
    console.log(`Access the application at: http://localhost:${PORT}`);
});