# AI-Powered Chatbot

This is an advanced, AI-powered chatbot with a responsive UI, productivity tools, and creativity-enhancing features. It uses the Groq API for intelligent, real-time responses and stores user data like to-do lists and notes in the browser's `localStorage`.

## Features

- **Intelligent Conversations:** Powered by the Groq API for natural and intelligent responses to a wide range of questions.
- **Responsive Design:** A modern, clean UI that works seamlessly on both desktop and mobile devices.
- **Theme Switcher:** Toggle between light and dark modes for a personalized experience.
- **Productivity Tools:**
  - **To-Do List:** Add, view, and delete tasks directly from the chat.
  - **Note-Taking:** Save and view notes.
- **Creativity Features:**
  - **Idea Generation:** Get random creative prompts from the Bored API.
  - **Joke Telling:** Fetches jokes from the JokeAPI.
- **Voice Output:** The chatbot speaks its responses using the browser's built-in speech synthesis.

## Setup and Installation

To run this project locally, you will need to have [Node.js](https://nodejs.org/) installed.

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/chatbot.git
cd chatbot
```

### 2. Install Dependencies

Install the necessary Node.js packages for the backend server:

```bash
npm install
```

### 3. Set Up Environment Variables

The project uses a `.env` file to manage the Groq API key.

1.  Create a new file named `.env` in the root of the project.
2.  Copy the contents of `.env.example` into your new `.env` file.
3.  Replace `your_api_key_here` with your actual Groq API key.

Your `.env` file should look like this:

```
# Add your Groq API key here
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 4. Running the Application

You need to run both the backend server and the frontend.

**To run the backend server:**

Open a terminal and run the following command:

```bash
node server.js
```

The server will start on `http://localhost:3000`.

**To run the frontend:**

Simply open the `index.html` file in your web browser. You can do this by double-clicking the file or by navigating to it from your browser's "Open File" menu.

## How to Use

Once the application is running, you can interact with the chatbot using natural language. Here are some examples of commands you can use:

- **General Conversation:** "What is the capital of France?", "Tell me about the history of the internet."
- **To-Do List:**
  - "add to-do 'Buy milk'"
  - "show to-do list"
  - "delete to-do 1"
- **Note-Taking:**
  - "add note 'My brilliant idea is...'"
  - "show notes"
- **Creativity:**
  - "tell me a joke"
  - "give me an idea"