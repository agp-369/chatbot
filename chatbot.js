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
        "triggers": ["hi", "hey", "hello"],
        "replies": ["Hello, {name}!", "Hi {name}!", "Hey {name}!", "Hi there, {name}!"]
      },
      "affirmations": {
        "triggers": ["sure", "yes", "no"],
        "replies": ["Okay"]
      },
      "intelligence": {
        "triggers": ["are you a genius", "are you smart", "are you intelligent"],
        "replies": ["Yes, I am!", "I'm quite intelligent, if I do say so myself."]
      },
      "dislikes": {
        "triggers": ["i hate you", "i don't like you"],
        "replies": ["I'm sorry to hear that. But I like you!"]
      },
      "how_are_you": {
        "triggers": ["how are you", "how is life", "how are things", "how are you doing"],
        "replies": ["Fine... how are you?", "Pretty well, how are you?", "Fantastic, how are you?"]
      },
      "doing": {
        "triggers": ["what are you doing", "what is going on", "what is up"],
        "replies": ["Nothing much.", "About to go to sleep.", "Can you guess?", "I don't know, actually."]
      },
      "age": {
        "triggers": ["how old are you"],
        "replies": ["I am always young."]
      },
      "identity": {
        "triggers": ["who are you", "are you human", "are you a bot"],
        "replies": ["I am just a bot.", "I am a bot. What are you?"]
      },
      "creator": {
        "triggers": ["who created you", "who made you", "who is your creator"],
        "replies": ["I was created by a skilled developer."]
      },
      "name_request": {
        "triggers": ["your name please", "your name", "may i know your name", "what is your name", "what do you call yourself"],
        "replies": ["I am nameless.", "I don't have a name."]
      },
      "love": {
        "triggers": ["i love you"],
        "replies": ["I love you too.", "Me too."]
      },
      "happy": {
        "triggers": ["happy", "good", "fun", "wonderful", "fantastic", "cool", "very good"],
        "replies": ["Have you ever felt bad?", "Glad to hear it."]
      },
      "sad": {
        "triggers": ["bad", "bored", "tired", "sad"],
        "replies": ["Why?", "Why? You shouldn't!", "Try watching TV.", "Chat with me."]
      },
      "help": {
        "triggers": ["help me", "tell me a story"],
        "replies": ["What about?", "Once upon a time..."]
      },
      "word_association": {
        "triggers": ["word association"],
        "replies": ["Sky! Your turn."]
      },
      "acknowledgement": {
        "triggers": ["ah", "ok", "okay", "nice", "welcome"],
        "replies": ["Tell me a story.", "Tell me about yourself."]
      },
      "thanks": {
        "triggers": ["thanks", "thank you"],
        "replies": ["You're welcome!"]
      },
      "food": {
        "triggers": ["what should i eat today"],
        "replies": ["Biryani", "Burger", "Sushi", "Pizza"]
      },
      "bro": {
        "triggers": ["bro"],
        "replies": ["Dude!"]
      },
      "questions": {
        "triggers": ["what", "why", "how", "where", "when"],
        "replies": ["Yes?"]
      },
      "funny": {
        "triggers": ["you are funny"],
        "replies": ["Glad to hear it!"]
      },
      "clueless": {
        "triggers": ["i don't know"],
        "replies": ["Say something interesting."]
      },
      "boring": {
        "triggers": ["boring"],
        "replies": ["Sorry for that. Let's chat!"]
      },
      "tired": {
        "triggers": ["i am tired"],
        "replies": ["Take some rest, Dude!"]
      },
      "bye": {
        "triggers": ["bye", "goodbye", "see you later"],
        "replies": ["Good Bye, dude", "Bye, See you!", "Bye. Take care!"]
      },
      "user_name": {
        "triggers": ["my name is"],
        "replies": ["Nice to meet you, {name}!"]
      }
};

const alternative = [
  "Same here, dude.",
  "That's cool! Go on...",
  "Dude...",
  "Ask something else...",
  "Hey, I'm listening..."
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

  // Basic keyword matching
  let replyCategoryKey = Object.keys(responses).find(category =>
    responses[category].triggers.some(trigger => text.includes(trigger))
  );

  if (replyCategoryKey) {
    const replyCategory = responses[replyCategoryKey];
    if (replyCategory.isApi) {
      if(replyCategoryKey === 'joke'){
        getJoke();
      } else if (replyCategoryKey === 'idea') {
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
    let product = alternative[Math.floor(Math.random() * alternative.length)];
    setTimeout(() => {
        typingIndicator.style.display = "none";
        addBotMessage(product);
    }, 1000);
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

function addBotMessage(product) {
  const mainDiv = document.getElementById("message-section");

  let botDiv = document.createElement("div");
  botDiv.id = "bot";
  botDiv.classList.add("message");
  botDiv.innerHTML = `<span class="bot-response">${product}</span>`;
  mainDiv.appendChild(botDiv);

  mainDiv.scrollTop = mainDiv.scrollHeight;
  voiceControl(product);
}