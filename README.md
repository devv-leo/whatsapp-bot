# WhatsApp Bot with Gemini AI

This is a **Node.js-based WhatsApp bot** that integrates with **Google's Gemini AI** for generating responses. The bot uses the **whatsapp-web.js** library to interact with WhatsApp and the **Google Generative AI SDK** to process and generate text responses.

## Requirements
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or later)
- [npm](https://www.npmjs.com/)
- [Google AI Studio API Key](https://ai.google.dev/)
- A WhatsApp account logged into **WhatsApp Web**

## Installation

1. **Clone the repository** (or download the source files):
   ```sh
   git clone https://github.com/devv-leo/whatsapp-bot.git
   cd whatsapp-bot
   ```

2. **Install dependencies**:
   ```sh
   npm install
   ```

3. **Set up environment variables**:
   - Create a `.env` file in the project directory.
   - Add your Google Gemini API key:
     ```env
     API_KEY=your_google_gemini_api_key
     ```

## Getting the Gemini API Key

1. Go to **[Google AI Studio](https://ai.google.dev/)**.
2. Sign in with your Google account.
3. Navigate to **API Keys** (found under settings or dashboard).
4. Click **Generate API Key**.
5. Copy the key and paste it into the `.env` file as shown above.

## Usage

1. Start the bot by running:
   ```sh
   node index.js
   ```
2. A QR code will appear in the terminal. Scan it using WhatsApp on your phone:
   - Open WhatsApp on your phone.
   - Tap **Linked Devices**.
   - Scan the QR Code.
3. The bot will be ready once you see:
   ```
   >> Bot is Ready! <<
   ```

## Features

- **Chat History**: The bot maintains conversation history for each user
- **Private Chat Only**: Bot only responds to private messages, not group chats
- **Error Handling**: Graceful error handling with user-friendly messages
- **Automatic Session Management**: Uses local authentication to maintain sessions
- **Chat History Limit**: Maintains last 20 messages per user to optimize performance

## Commands

- **Chat with AI:** Send any message, and the bot will respond using the Gemini 1.5 Flash model
- **Stop the bot:** Press `Ctrl + C` in the terminal

## Troubleshooting

- If the QR code does not appear, try:
  ```sh
  npm install whatsapp-web.js
  ```
- If the bot does not respond:
  - Ensure the API key is correct
  - Restart the bot with `node index.js`
- If you get **"Invalid API Key"**:
  - Double-check your key in `.env`
  - Ensure your API key is active in **Google AI Studio**

## License
This project is open-source under the **MIT License**.

---

Feel free to contribute to this project by submitting issues or pull requests! 🚀
