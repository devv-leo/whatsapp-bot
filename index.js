require('dotenv').config();

const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");const { Client } = require('whatsapp-web.js')
const qrcode = require('qrcode-terminal')

const client = new Client({
  webVersionCache: {
    type: "remote",
    remotePath:
      "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html",
  },
})

client.on('qr', qr => {
  qrcode.generate(qr, {small: true})
})

client.on('ready', () => {
  console.log('>> Bot is Ready! <<')
})

client.on('message', async message => {

  const MODEL_NAME = "gemini-2.0-flash";
  const API_KEY = process.env.API_KEY;

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
      temperature: 1,
      topK: 0,
      topP: 0.95,
      maxOutputTokens: 8192,
    };

    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];

    const chat = model.startChat({
      generationConfig,
      safetySettings,
      history: [
      ],
    });

    const result = await chat.sendMessage(message.body);
    const response = result.response;
    console.log('AI Response:', response.text());
    await message.reply(response.text())
  } catch (error) {
    // Detailed error logging
    console.error('Error message:', error.message);
    
    await message.reply('Cannot process your message. Please resend in few minutes.');
  }
})

client.initialize()
