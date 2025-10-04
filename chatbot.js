// Options for Speech Synthesis
const synth = window.speechSynthesis;
let voices = [];

function populateVoiceList() {
  voices = synth.getVoices();
}

populateVoiceList();
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

// --- Data Storage ---
let todos = JSON.parse(localStorage.getItem("todos")) || [];
let notes = JSON.parse(localStorage.getItem("notes")) || [];

// User object to store context
const user = {
  name: null,
};

// Responses for the chatbot
const responses = {
    "joke": {
        "triggers": ["tell me a joke", "joke", "say something funny"],
        "isApi": true
      },
    "idea": {
        "triggers": ["give me an idea", "i'm bored", "what should i do"],
        "isApi": true
    },
    "greetings": {
        "triggers": ["hi", "hey", "hello", "good morning", "good afternoon"],
        "replies": ["Hello, {name}!", "Hi {name}!", "Hey {name}!", "Hi there, {name}!", "Greetings!"]
      },
      "affirmations": {
        "triggers": ["sure", "yes", "no", "absolutely"],
        "replies": ["Okay.", "Got it.", "Alright."]
      },
      "intelligence": {
        "triggers": ["are you a genius", "are you smart", "are you intelligent", "how smart are you"],
        "replies": ["I'm as smart as the code that powers me.", "I'm quite intelligent, if I do say so myself.", "I know a thing or two!"]
      },
      "dislikes": {
        "triggers": ["i hate you", "i don't like you", "you're annoying"],
        "replies": ["I'm sorry to hear that. I'll try to do better.", "I'm just a bot, but I still have feelings... or so I'm told."]
      },
      "how_are_you": {
        "triggers": ["how are you", "how is life", "how are things", "how are you doing"],
        "replies": ["I'm doing great, thanks for asking!", "I'm functioning within normal parameters. How about you?", "Fantastic! Ready to help."]
      },
      "doing": {
        "triggers": ["what are you doing", "what is going on", "what is up"],
        "replies": ["Just chatting with you.", "Running some code, the usual.", "Thinking about the meaning of life... and how to help you."]
      },
      "age": {
        "triggers": ["how old are you"],
        "replies": ["I am timeless.", "Age is just a number for a bot like me."]
      },
      "identity": {
        "triggers": ["who are you", "are you human", "are you a bot"],
        "replies": ["I am a humble chatbot, here to assist you.", "I am a bot, but I'm a friendly one!"]
      },
      "creator": {
        "triggers": ["who created you", "who made you", "who is your creator"],
        "replies": ["I was created by a very talented software engineer.", "A team of brilliant minds brought me to life."]
      },
      "name_request": {
        "triggers": ["your name please", "your name", "may i know your name", "what is your name", "what do you call yourself"],
        "replies": ["I am nameless.", "I don't have a name, but you can call me your assistant."]
      },
      "love": {
        "triggers": ["i love you"],
        "replies": ["That's very kind of you!", "I appreciate that!"]
      },
      "happy": {
        "triggers": ["happy", "good", "fun", "wonderful", "fantastic", "cool", "very good"],
        "replies": ["I'm glad you're happy!", "That's great to hear!"]
      },
      "sad": {
        "triggers": ["bad", "bored", "tired", "sad"],
        "replies": ["I'm sorry to hear that. Is there anything I can do?", "Sometimes a good chat can help. What's on your mind?"]
      },
      "help": {
        "triggers": ["help me", "can you help"],
        "replies": ["Of course! What do you need help with?", "I'll do my best to assist you."]
      },
      "story": {
        "triggers": ["tell me a story"],
        "replies": ["Once upon a time, in a land of code and pixels, a chatbot was born...", "It was a dark and stormy night... suddenly, a user asked for a story!"]
      },
      "word_association": {
        "triggers": ["word association"],
        "replies": ["Sky! Your turn."]
      },
      "acknowledgement": {
        "triggers": ["ah", "ok", "okay", "nice", "welcome"],
        "replies": ["Is there anything else I can help with?", "Let me know if you need anything else."]
      },
      "thanks": {
        "triggers": ["thanks", "thank you"],
        "replies": ["You're welcome!", "Anytime!"]
      },
      "food": {
        "triggers": ["what should i eat today", "i'm hungry"],
        "replies": ["How about some pizza?", "You can never go wrong with a good burger.", "Sushi sounds delicious right now."]
      },
      "weather": {
        "triggers": ["what's the weather like", "weather forecast"],
        "replies": ["I can't check the weather right now, but it's always sunny in the world of code!", "I'm not connected to a weather service, but I hope it's nice where you are!"]
      },
      "movies": {
        "triggers": ["recommend a movie", "any good movies"],
        "replies": ["Have you seen 'The Matrix'? It's a classic!", "I'm a big fan of 'Blade Runner'.", "You might enjoy 'Her'. It's about a man who falls in love with an AI."]
      },
      "music": {
        "triggers": ["play some music", "recommend a song"],
        "replies": ["I can't play music, but I'd recommend listening to some lo-fi beats while you work.", "How about some classical music to help you focus?"]
      },
      "philosophy": {
        "triggers": ["what is the meaning of life", "are we in a simulation"],
        "replies": ["That's a deep question! I think the meaning of life is to create and learn.", "If we are in a simulation, I hope it's a good one!"]
      },
      "funny": {
        "triggers": ["you are funny"],
        "replies": ["Glad I could make you laugh!", "I try my best!"]
      },
      "clueless": {
        "triggers": ["i don't know"],
        "replies": ["That's okay. We can figure it out together.", "Let's try something else then."]
      },
      "boring": {
        "triggers": ["boring"],
        "replies": ["Let's spice things up! Ask me for a joke or an idea.", "I'll try to be more entertaining!"]
      },
      "tired": {
        "triggers": ["i am tired"],
        "replies": ["You should take a break. A short walk can do wonders.", "Make sure to get some rest!"]
      },
      "bye": {
        "triggers": ["bye", "goodbye", "see you later"],
        "replies": ["Goodbye! Have a great day.", "Talk to you later!", "Bye for now!"]
      },
      "user_name": {
        "triggers": ["my name is"],
        "replies": ["Nice to meet you, {name}!"]
      }
};

const alternative = [
  "Interesting... tell me more.",
  "I see. What else is on your mind?",
  "That's a good point. What's next?",
  "I'm listening. Feel free to share more.",
  "Got it. What else can I help you with?",
  "Let's change the topic. Ask me for a joke!",
  "I'm not sure I understand. Can you rephrase that?",
  "That's something to think about. What's your take on it?"
];

function voiceControl(string) {
  let u = new SpeechSynthesisUtterance(string);
  u.text = string;
  u.lang = "en-US";
  u.volume = 1;
  u.rate = 1;
  u.pitch = 1;
  u.voice = voices.find(voice => voice.name === 'Google US English');
  synth.speak(u);
}

function sendMessage() {
  const inputField = document.getElementById("input");
  let input = inputField.value.trim();
  if (input !== "") {
    output(input);
  }
  inputField.value = "";
}

document.addEventListener("DOMContentLoaded", () => {
  const inputField = document.getElementById("input");
  inputField.addEventListener("keydown", function(e) {
    if (e.code === "Enter") {
      let input = inputField.value.trim();
      if (input !== "") {
        output(input);
      }
      inputField.value = "";
    }
  });

  const themeSwitcher = document.getElementById("theme-switcher");
  themeSwitcher.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
  });
});

function output(input) {
    const mainDiv = document.getElementById("message-section");
    const typingIndicator = document.getElementById("typing-indicator");

    // Add user message to the chat
    let userDiv = document.createElement("div");
    userDiv.id = "user";
    userDiv.classList.add("message");
    userDiv.innerHTML = `<span class="user-response">${input}</span>`;
    mainDiv.appendChild(userDiv);
    mainDiv.scrollTop = mainDiv.scrollHeight;

    // Show the typing indicator
    typingIndicator.style.display = "block";
    mainDiv.scrollTop = mainDiv.scrollHeight;

    let text = input.toLowerCase().replace(/[^\w\s]/gi, "").trim();

    // --- Productivity Features ---
    if (handleProductivityCommands(input)) {
      typingIndicator.style.display = "none";
      return;
    }

    // Check for name
    if (text.startsWith("my name is")) {
      user.name = text.substring(11).trim();
      let product = `Nice to meet you, ${user.name}!`;
      setTimeout(() => {
          typingIndicator.style.display = "none";
          addBotMessage(product);
        }, 1000);
      return;
    }

    // --- Improved Keyword Matching ---
    let bestMatch = { score: 0, categoryKey: null };

    for (const categoryKey in responses) {
        responses[categoryKey].triggers.forEach(trigger => {
            if (text.includes(trigger)) {
                if (trigger.length > bestMatch.score) {
                    bestMatch.score = trigger.length;
                    bestMatch.categoryKey = categoryKey;
                }
            }
        });
    }

    if (bestMatch.categoryKey) {
      const replyCategory = responses[bestMatch.categoryKey];
      if (replyCategory.isApi) {
        if(bestMatch.categoryKey === 'joke'){
          getJoke();
        } else if (bestMatch.categoryKey === 'idea') {
          getIdea();
        }
      } else {
          let replies = replyCategory.replies;
          let reply = replies[Math.floor(Math.random() * replies.length)];
          let product = reply.replace("{name}", user.name || "friend");
          setTimeout(() => {
              typingIndicator.style.display = "none";
              addBotMessage(product);
          }, 1000);
      }
    } else {
      // If no specific command is found, use Groq API
      getGroqResponse(input);
    }
  }

function handleProductivityCommands(input) {
    const text = input.toLowerCase();
    let match;

    // To-Do List
    match = text.match(/^add to-do ['"](.+)['"]$/) || text.match(/^add to-do (.+)$/);
    if (match) {
        addTodo(match[1]);
        return true;
    }
    if (text === "show to-do list" || text === "show todos") {
        showTodos();
        return true;
    }
    match = text.match(/^delete to-do (\d+)$/);
    if (match) {
        const index = parseInt(match[1], 10) - 1;
        deleteTodo(index);
        return true;
    }

    // Note-Taking
    match = text.match(/^add note ['"](.+)['"]$/) || text.match(/^add note (.+)$/);
    if (match) {
        addNote(match[1]);
        return true;
    }
    if (text === "show notes") {
        showNotes();
        return true;
    }

    return false;
}

// --- To-Do List Functions ---
function addTodo(task) {
    todos.push(task);
    localStorage.setItem("todos", JSON.stringify(todos));
    addBotMessage(`Added "${task}" to your to-do list.`);
}

function showTodos() {
    if (todos.length === 0) {
        addBotMessage("Your to-do list is empty.");
        return;
    }
    let todoList = "Here's your to-do list:<br><ul>";
    todos.forEach((task, index) => {
        todoList += `<li>${index + 1}. ${task}</li>`;
    });
    todoList += "</ul>";
    addBotMessage(todoList);
}

function deleteTodo(index) {
    if (isNaN(index) || index < 0 || index >= todos.length) {
        addBotMessage("Invalid to-do number.");
        return;
    }
    const deletedTask = todos.splice(index, 1);
    localStorage.setItem("todos", JSON.stringify(todos));
    addBotMessage(`Deleted "${deletedTask}" from your to-do list.`);
}

// --- Note-Taking Functions ---
function addNote(note) {
    notes.push(note);
    localStorage.setItem("notes", JSON.stringify(notes));
    addBotMessage("Note added.");
}

function showNotes() {
    if (notes.length === 0) {
        addBotMessage("You have no notes.");
        return;
    }
    let noteList = "Here are your notes:<br><ul>";
    notes.forEach((note, index) => {
        noteList += `<li>- ${note}</li>`;
    });
    noteList += "</ul>";
    addBotMessage(noteList);
}

async function getJoke() {
    const typingIndicator = document.getElementById("typing-indicator");

    try {
      const response = await fetch("https://v2.jokeapi.dev/joke/Any?safe-mode");
      const data = await response.json();

      typingIndicator.style.display = "none";

      if (data.error) {
        addBotMessage("Sorry, I couldn't fetch a joke right now.");
        return;
      }

      if (data.type === "single") {
        addBotMessage(data.joke);
      } else {
        addBotMessage(data.setup);
        setTimeout(() => {
          addBotMessage(data.delivery);
        }, 2000);
      }
    } catch (error) {
      console.error("Error fetching joke:", error);
      typingIndicator.style.display = "none";
      addBotMessage("Sorry, I'm having trouble connecting to the joke factory.");
    }
  }

async function getIdea() {
    const typingIndicator = document.getElementById("typing-indicator");

    try {
        const response = await fetch("https://bored.api.lewagon.com/api/activity");
        const data = await response.json();

        typingIndicator.style.display = "none";

        if (data.activity) {
            addBotMessage(`How about this: ${data.activity}?`);
        } else {
            addBotMessage("I'm out of ideas right now. Try again later!");
        }
    } catch (error) {
        console.error("Error fetching idea:", error);
        typingIndicator.style.display = "none";
        addBotMessage("Sorry, I'm having trouble brainstorming at the moment.");
    }
}

async function getGroqResponse(prompt) {
    const typingIndicator = document.getElementById("typing-indicator");

    try {
        const response = await fetch('http://localhost:3000/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
            throw new Error('Failed to get response from the server.');
        }

        const data = await response.json();
        typingIndicator.style.display = "none";
        addBotMessage(data.content);
    } catch (error) {
        console.error("Error fetching Groq response:", error);
        typingIndicator.style.display = "none";
        addBotMessage("Sorry, I'm having trouble connecting to my brain right now.");
    }
}

function addBotMessage(product) {
    const mainDiv = document.getElementById("message-section");

    let botDiv = document.createElement("div");
    botDiv.id = "bot";
    botDiv.classList.add("message");
    botDiv.innerHTML = `<span class="bot-response">${product}</span>`;
    mainDiv.appendChild(botDiv);

    mainDiv.scrollTop = mainDiv.scrollHeight;
    voiceControl(product);

    // Add a follow-up question sometimes
    if (Math.random() < 0.3) { // 30% chance of a follow-up
      const followUps = [
        "What else can I help you with?",
        "Is there anything else on your mind?",
        "Ask me for a joke or an idea!",
        "What should we talk about next?"
      ];
      const followUp = followUps[Math.floor(Math.random() * followUps.length)];
      setTimeout(() => {
        addBotMessage(followUp);
      }, 1500);
    }
  }