// Load environment variables from .env file
require('dotenv').config();
const fs = require('fs');
const path = require('path');

// Import Google's Generative AI library
const {
    GoogleGenerativeAI,
} = require("@google/generative-ai");

// Import WhatsApp Web client and QR code generator
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Configuration constants
const MODEL_NAME = "gemini-2.0-flash";
const API_KEY = process.env.API_KEY;
const SESSION_DATA_PATH = path.join(__dirname, '.wwebjs_auth');
const CHAT_HISTORY_PATH = path.join(__dirname, 'chat_histories.json');

// Checks if chat_histories.json exists. Create session directory if it doesn't exist
if (!fs.existsSync(SESSION_DATA_PATH)) {
    fs.mkdirSync(SESSION_DATA_PATH);
}

// Load existing chat histories from file
let chatHistories = {};
if (fs.existsSync(CHAT_HISTORY_PATH)) {
    chatHistories = JSON.parse(fs.readFileSync(CHAT_HISTORY_PATH, 'utf8'));
}

// Initialize WhatsApp client with local authentication
const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: SESSION_DATA_PATH
    }),
});

// Initialize Google's Generative AI model
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

// Function to save chat histories to file
function saveChatHistories() {
    fs.writeFileSync(CHAT_HISTORY_PATH, JSON.stringify(chatHistories, null, 2));
}

// Handle QR code generation for WhatsApp Web authentication
client.on('qr', qr => {
    console.log('Scan this QR code with your WhatsApp:');
    qrcode.generate(qr, { small: true });
});

// Handle client ready event
client.on('ready', () => {
    console.log('>> Bot is Ready! <<');
});

// Handle incoming messages
client.on('message', async message => {
    // Get chat information
    const chat = await message.getChat();
    // Ignore group messages
    if (chat.isGroup) {
        return;
    }
    // Ignore status messages
    if (message.isStatus) {
        return;
    }

    const chatId = message.from;
    const userMessage = message.body;

    console.log(`Received message from ${chatId}: "${userMessage}"`);

    // Initialize chat history for new users
    if (!chatHistories[chatId]) {
        chatHistories[chatId] = [];
        console.log(`Initialized new chat history for ${chatId}`);
    }

    // Limit chat history length
    const maxHistoryLength = 20;
    if (chatHistories[chatId].length > maxHistoryLength) {
        chatHistories[chatId] = chatHistories[chatId].slice(-maxHistoryLength);
    }

    try {
        // Start AI chat with history
        const aiChat = model.startChat({
            history: chatHistories[chatId],
        });

        // Get AI response
        const result = await aiChat.sendMessage(userMessage);
        const response = result.response;
        const aiResponseText = response.text();

        console.log(`AI Response for ${chatId}:`, aiResponseText);

        // Send response back to user
        await message.reply(aiResponseText);

        // Update chat history
        chatHistories[chatId].push({ role: 'user', parts: [{ text: userMessage }] });
        chatHistories[chatId].push({ role: 'model', parts: [{ text: aiResponseText }] });
        
        // Save updated chat histories
        saveChatHistories();

    } catch (error) {
        console.error(`Error processing message from ${chatId}:`, error);
        // Send error message to user
        await message.reply('Sorry, I encountered an error trying to process your message. Please try again later.');
    }
});

// Handle client disconnection
client.on('disconnected', (reason) => {
    console.log('Client was logged out: ', reason);
});

// Initialize the WhatsApp client
client.initialize();