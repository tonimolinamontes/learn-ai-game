let language = "en"; // por defecto inglés
let current = 0;

let questions = {
  en: [
    {
      question: "What is Artificial Intelligence?",
      options: [
        "A video game",
        "A cooking technique",
        "The ability of a machine to imitate human intelligence",
        "A type of hardware"
      ],
      correct: 2
    },
    {
      question: "Which one is a real use of AI?",
      options: [
        "Painting walls",
        "Forecasting the weather",
        "Making sandwiches",
        "Charging batteries"
      ],
      correct: 1
    },
    {
      question: "What does a neural network try to mimic?",
      options: [
        "The human brain",
        "A telephone line",
        "A factory",
        "A rocket engine"
      ],
      correct: 0
    }
  ],
  es: [
    {
      question: "¿Qué es la Inteligencia Artificial?",
      options: [
        "Un videojuego",
        "Una técnica de cocina",
        "La capacidad de una máquina para imitar la inteligencia humana",
        "Un tipo de hardware"
      ],
      correct: 2
    },
    {
      question: "¿Cuál es un uso real de la IA?",
      options: [
        "Pintar paredes",
        "Predecir el clima",
        "Hacer bocadillos",
        "Cargar baterías"
      ],
      correct: 1
    },
    {
      question: "¿Qué intenta imitar una red neuronal?",
      options: [
        "El cerebro humano",
        "Una línea telefónica",
        "Una fábrica",
        "Un motor de cohete"
      ],
      correct: 0
    }
  ]
};

function setLanguage(lang) {
  language = lang;
  current = 0;

  // Ocultar la imagen de portada
  const hero = document.getElementById("landing-hero");
  if (hero) hero.style.display = "none";
  // Ocultar selector e iniciar juego
  document.getElementById("language-selector").style.display = "none";
  document.getElementById("game").style.display = "block";

  // Actualiza botón cambiar idioma
  const changeBtn = document.getElementById("change-lang-btn");
  changeBtn.textContent = language === "en" ? "Change language" : "Cambiar idioma";

  // Actualiza texto del botón de ayuda según idioma
  const helpBtn = document.getElementById("help-btn");
  helpBtn.textContent = language === "en"
    ? "💡 Need a hint? Ask AI"
    : "💡 ¿Necesitas una pista? Pregunta a la IA";

  showQuestion();
}

function showQuestion() {
  const q = questions[language][current];
  const babyImg = document.getElementById("baby-img");
  babyImg.src = "";
  babyImg.alt = "";

  document.getElementById("feedback").innerHTML = "";

  if (!q) {
    document.getElementById("question-container").textContent =
      language === "en"
        ? "🎉 You've completed all the questions!"
        : "🎉 ¡Has completado todas las preguntas!";
    document.getElementById("options").innerHTML = "";
    babyImg.src = "images/party-baby.png";
    babyImg.alt = "Celebrating baby";
    return;
  }

  document.getElementById("question-container").textContent = q.question;
  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  q.options.forEach((opt, index) => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.onclick = () => checkAnswer(index);
    optionsDiv.appendChild(btn);
  });
}

function checkAnswer(selected) {
  const correct = questions[language][current].correct;
  const feedback = document.getElementById("feedback");
  const babyImg = document.getElementById("baby-img");

  if (selected === correct) {
    feedback.innerHTML = `<div class="chat-bubble">${
      language === "en" ? "🎉 Correct!" : "🎉 ¡Correcto!"
    }</div>`;
    babyImg.src = "images/happy-baby.png";
    babyImg.alt = "Happy baby";
    current++;
    setTimeout(showQuestion, 1500);
  } else {
    feedback.innerHTML = `<div class="chat-bubble">${
      language === "en" ? "😮 Try again!" : "😮 ¡Intenta de nuevo!"
    }</div>`;
    babyImg.src = "images/sad-baby.png";
    babyImg.alt = "Sad baby";
  }
}

function resetGame() {
  language = "en";
  current = 0;

  // Mostrar la imagen de portada
  const hero = document.getElementById("landing-hero");
  if (hero) hero.style.display = "block";
  // Ocultar juego y volver a selector
  document.getElementById("game").style.display = "none";
  document.getElementById("language-selector").style.display = "block";

  // Restaurar texto de botones a inglés por defecto
  const changeBtn = document.getElementById("change-lang-btn");
  changeBtn.textContent = "Change language";
  const helpBtn = document.getElementById("help-btn");
  helpBtn.textContent = "💡 Need a hint? Ask AI";

  // Limpiar estado visual
  const babyImg = document.getElementById("baby-img");
  babyImg.src = "";
  babyImg.alt = "";
  document.getElementById("feedback").innerHTML = "";
}

// ✅ FUNCIÓN para pedir ayuda a la IA con icono
async function askAI() {
  const helpPrompt = language === "en"
    ? "Explain in simple terms what Artificial Intelligence is."
    : "Explica en términos simples qué es la Inteligencia Artificial.";

  try {
    const response = await fetch(
      "https://701313b5-4ba0-45aa-b9d9-9341d55bb444-00-25qs3s0o42ffx.picard.replit.dev/ask",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: helpPrompt })
      }
    );

    const data = await response.json();
    const feedback = document.getElementById("feedback");
    const iconIA = '🤖';
    feedback.innerHTML = `<div class="chat-bubble">${iconIA} ${
      data.response || (language === "en" ? "No response from the AI." : "No hay respuesta de la IA.")
    }</div>`;
  } catch (error) {
    console.error("Error contacting AI:", error);
    const feedback = document.getElementById("feedback");
    const iconIA = '🤖';
    feedback.innerHTML = `<div class="chat-bubble">${iconIA} ${
      language === "en" ? "Error contacting AI." : "Error al contactar la IA."
    }</div>`;
  }
}

// Inicializa al cargar la página
window.addEventListener('load', () => {
  // Ajusta botón de ayuda según idioma inicial
  const helpBtn = document.getElementById("help-btn");
  helpBtn.textContent = "💡 Need a hint? Ask AI";
});

// Exponer funciones a nivel global
window.setLanguage = setLanguage;
window.resetGame = resetGame;
window.askAI = askAI;
