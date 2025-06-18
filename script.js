/* -------------------- BANCO DE PREGUNTAS -------------------- */
const questions = {
  en: [
    { question: "What does AI stand for?",
      options: ["Adobe Illustrator", "Artificial Intelligence", "Amazing Idea"],
      correct: 1 },
    { question: "AI systems can learn from _____ to improve over time.",
      options: ["paintings", "data", "magic"],
      correct: 1 },
    { question: "Which of these is an example of AI?",
      options: ["Smartphone voice assistant", "Regular light bulb", "Paper notebook"],
      correct: 0 },
    { question: "AI is basically…",
      options: [
        "robots plotting to steal snacks 🤖🍪",
        "computer systems that can perform tasks that need intelligence",
        "a secret superhero league"
      ],
      correct: 1 }
  ],
  es: [
    { question: "¿Qué significa IA?",
      options: ["Inteligencia Artificial", "Isla Atlántica", "Insectos Alegres"],
      correct: 0 },
    { question: "Los sistemas de IA mejoran porque aprenden de los _____.",
      options: ["datos", "chismes", "dibujos"],
      correct: 0 },
    { question: "¿Cuál de estos es un ejemplo de IA?",
      options: ["Asistente de voz del móvil", "Bombilla normal", "Cuaderno de papel"],
      correct: 0 },
    { question: "La IA es básicamente…",
      options: [
        "robots que planean robar galletas 🤖🍪",
        "sistemas informáticos capaces de tareas que requieren inteligencia",
        "un club secreto de superhéroes"
      ],
      correct: 1 }
  ]
};

/* --------------------------------- Estado -------------------------------- */
let language = "en";
let current  = 0;
let musicOn  = true;

/* --------------------------------- Música -------------------------------- */
const bgMusic = new Audio("sounds/Vivid Beat.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.3;
bgMusic.preload = "auto";
bgMusic.muted = true;
const MUSIC_START_OFFSET = 1;
bgMusic.addEventListener("loadedmetadata", () => {
  if (MUSIC_START_OFFSET < bgMusic.duration) bgMusic.currentTime = MUSIC_START_OFFSET;
});

/* --------- Efectos de sonido --------- */
function createSFX(name){
  const a = new Audio(`sounds/${name}.ogg`);
  if (!a.canPlayType("audio/ogg")) a.src = `sounds/${name}.mp3`;
  a.preload = "auto";
  a.volume  = 0.6;
  return a;
}
const sfxCorrect = createSFX("correct");
const sfxWrong   = createSFX("wrong");
const sfxWin     = createSFX("victory");

/* ---------------------- Utilidad: scroll al fondo ------------------------ */
function scrollToBottom() {
  requestAnimationFrame(() => {
    const anchor = document.getElementById("bottom-anchor");
    if (anchor) anchor.scrollIntoView({ behavior: "smooth", block: "end" });
  });
}

/* --------------- Configuración inicial de botones ------------------------ */
window.addEventListener("DOMContentLoaded", () => {
  /* crea ancla invisible al final del body (una sola vez) */
  if (!document.getElementById("bottom-anchor")) {
    const a = document.createElement("div");
    a.id = "bottom-anchor";
    a.style.height = "1px";
    document.body.appendChild(a);
  }

  const helpBtn  = document.getElementById("help-btn");
  const musicBtn = document.getElementById("music-toggle");

  if (helpBtn) helpBtn.textContent = "💡 Need a hint? Ask AI";

  if (musicBtn) {
    musicBtn.textContent = "🔊";
    musicBtn.addEventListener("click", () => {
      musicOn ? bgMusic.pause() : bgMusic.play().catch(() => {});
      musicOn = !musicOn;
      musicBtn.textContent = musicOn ? "🔊" : "🔇";
    });
  }
});

/* --------------------------- Cambio de idioma ---------------------------- */
function setLanguage(lang) {
  language = lang;
  current  = 0;

  document.getElementById("landing")?.style.setProperty("display", "none");
  document.getElementById("language-selector")?.style.setProperty("display", "none");
  document.getElementById("game")?.style.setProperty("display", "block");

  const changeBtn = document.getElementById("change-lang-btn");
  const helpBtn   = document.getElementById("help-btn");
  if (changeBtn) changeBtn.textContent = language === "en" ? "Change language" : "Cambiar idioma";
  if (helpBtn)   helpBtn.textContent   = language === "en"
    ? "💡 Need a hint? Ask AI"
    : "💡 ¿Necesitas una pista? Pregunta a la IA";

  if (bgMusic.muted) bgMusic.muted = false;
  bgMusic.play().catch(() => {});
  showQuestion();
}

/* -------------------------- Flujo del juego ------------------------------ */
function showQuestion() {
  const q = questions[language][current];
  const babyImg   = document.getElementById("baby-img");
  const feedback  = document.getElementById("feedback");
  const options   = document.getElementById("options");
  const qContainer= document.getElementById("question-container");

  babyImg.src = ""; babyImg.alt = "";
  feedback.innerHTML = "";

  if (!q) {
    qContainer.textContent = language === "en"
      ? "🎉 You've completed all the questions!"
      : "🎉 ¡Has completado todas las preguntas!";
    options.innerHTML = "";
    babyImg.src = "images/party-baby.png";
    babyImg.alt = "Celebrating baby";
    sfxWin.play();
    scrollToBottom();
    return;
  }

  qContainer.textContent = q.question;
  options.innerHTML = "";

  q.options.forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.addEventListener("click", () => checkAnswer(idx));
    options.appendChild(btn);
  });

  scrollToBottom();
}

function checkAnswer(selected) {
  const { correct } = questions[language][current];
  const feedback = document.getElementById("feedback");
  const babyImg  = document.getElementById("baby-img");

  if (selected === correct) {
    feedback.innerHTML = `<div class="chat-bubble">${language === "en" ? "🎉 Correct!" : "🎉 ¡Correcto!"}</div>`;
    babyImg.src = "images/happy-baby.png";
    babyImg.alt = "Happy baby";
    sfxCorrect.currentTime = 0;
    sfxCorrect.play();
    current++;
    setTimeout(showQuestion, 1400);
  } else {
    feedback.innerHTML = `<div class="chat-bubble">${language === "en" ? "😮 Try again!" : "😮 ¡Intenta de nuevo!"}</div>`;
    babyImg.src = "images/sad-baby.png";
    babyImg.alt = "Sad baby";
    sfxWrong.currentTime = 0;
    sfxWrong.play();
    scrollToBottom();
  }
  scrollToBottom();
}

/* ------------------------------ Reiniciar -------------------------------- */
function resetGame() {
  language = "en";
  current  = 0;

  document.getElementById("landing")?.style.setProperty("display", "block");
  document.getElementById("game")?.style.setProperty("display", "none");
  document.getElementById("language-selector")?.style.setProperty("display", "block");

  document.getElementById("question-container").textContent = "";
  document.getElementById("options").innerHTML  = "";
  document.getElementById("feedback").innerHTML = "";
  const babyImg = document.getElementById("baby-img");
  if (babyImg) { babyImg.src = ""; babyImg.alt = ""; }

  const changeBtn = document.getElementById("change-lang-btn");
  const helpBtn   = document.getElementById("help-btn");
  if (changeBtn) changeBtn.textContent = "Change language";
  if (helpBtn)   helpBtn.textContent   = "💡 Need a hint? Ask AI";
}

/* --------------------------- Pedir ayuda IA ------------------------------ */
async function askAI() {
  const prompt = language === "en"
    ? "Explain in simple terms what Artificial Intelligence is."
    : "Explica en términos simples qué es la Inteligencia Artificial.";
  try {
    const res = await fetch(
      "https://701313b5-4ba0-45aa-b9d9-9341d55bb444-00-25qs3s0o42ffx.picard.replit.dev/ask",
      { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt }) }
    );
    const { response } = await res.json();
    showBubble(response || (language === "en" ? "No response from the AI." : "No hay respuesta de la IA."));
  } catch (err) {
    console.error("Error contacting AI:", err);
    showBubble(language === "en" ? "Error contacting AI." : "Error al contactar la IA.");
  }
}

function showBubble(text) {
  document.getElementById("feedback").innerHTML = `<div class="chat-bubble">🤖 ${text}</div>`;
  scrollToBottom();
}

/* --------------------------- Globals (HTML) ------------------------------ */
window.setLanguage = setLanguage;
window.resetGame   = resetGame;
window.askAI       = askAI;
