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

async function getJoke() {
    const typingIndicator = document.getElementById("typing-indicator");
    const mainDiv = document.getElementById("message-section");

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