const express = require('express');
const cors = require('cors');
const path = require('path');
const { NlpManager } = require('node-nlp'); // Importing the real NLP library!

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- 1. INITIALIZE NLP ENGINE ---
// ForceNER helps extract entities (like names or dates)
const manager = new NlpManager({ languages: ['en'], forceNER: true });

// --- 2. TRAIN THE NLP MODEL (Machine Learning) ---
// We group different ways a user might ask a question into an "Intent"

// Intent: Ask about Courses
manager.addDocument('en', 'What courses are available?', 'academic.courses');
manager.addDocument('en', 'Tell me about the subjects', 'academic.courses');
manager.addDocument('en', 'Which classes can I take this semester?', 'academic.courses');
manager.addDocument('en', 'I need info on CS subjects', 'academic.courses');

// Intent: Ask about Faculty
manager.addDocument('en', 'Who are the professors?', 'staff.faculty');
manager.addDocument('en', 'Tell me about the faculty', 'staff.faculty');
manager.addDocument('en', 'Who is the head of department?', 'staff.faculty');
manager.addDocument('en', 'I need to speak to a teacher', 'staff.faculty');

// Intent: Ask about Exams
manager.addDocument('en', 'When are the exams?', 'academic.exams');
manager.addDocument('en', 'Show me the exam schedule', 'academic.exams');
manager.addDocument('en', 'mid-term dates', 'academic.exams');
manager.addDocument('en', 'When is my test?', 'academic.exams');

// Intent: Greetings
manager.addDocument('en', 'Hello', 'greetings.hello');
manager.addDocument('en', 'Hi DORA', 'greetings.hello');
manager.addDocument('en', 'Hey there', 'greetings.hello');
manager.addDocument('en', 'Good morning', 'greetings.hello');

// --- 3. DEFINE THE RESPONSES ---
// We tell the bot how to reply when it detects a specific Intent
manager.addAnswer('en', 'academic.courses', 'We offer several courses this semester including CS 101, Data Structures (CS 201), and Web Application Development (CS 305). Click the "Course Info" link on the left for details!');
manager.addAnswer('en', 'staff.faculty', 'Our department is headed by Dr. Alan Turing. Other key faculty include Dr. Ada Lovelace and Prof. Tim Berners-Lee. Check the "Faculty Info" page for their contact details.');
manager.addAnswer('en', 'academic.exams', 'Mid-term exams for Fall 2026 start on October 20. Please check the "Exam Schedule" link for the full room and time timetable.');
manager.addAnswer('en', 'greetings.hello', 'Hello there! I\'m DORA, your smart department assistant. How can I help you with your academic queries today?');

// --- 4. TRAIN AND SAVE THE MODEL ---
// This runs automatically when you start the server
(async () => {
    await manager.train();
    manager.save();
    console.log('🤖 DORA NLP Model trained successfully!');
})();

// --- API ENDPOINTS ---
app.post('/api/chat', async (req, res) => {
    const userMessage = req.body.message;
    
    if (!userMessage) {
        return res.status(400).json({ error: "Message is required" });
    }

    // Process the raw text through the Neural Network to find the Intent
    const response = await manager.process('en', userMessage);

    // Get the answer assigned to the detected intent
    let botReply = response.answer;

    // Fallback if the bot doesn't understand (confidence is too low)
    if (!botReply) {
        botReply = "I'm still learning! Could you please rephrase your question? Alternatively, you can check our FAQs or use the Contact page.";
    }

    // Add a slight artificial delay (500ms) to simulate typing
    setTimeout(() => {
        res.json({ reply: botReply });
    }, 500);
});

// Start the server
app.listen(PORT, () => {
    console.log(`DORA Backend running successfully! Access at: http://localhost:${PORT}`);
});