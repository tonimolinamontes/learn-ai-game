require('dotenv').config({ path: __dirname + '/.env' }); // Asegura carga explícita de .env
const express = require('express');
const { OpenAI } = require('openai');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Sirve HTML, CSS, JS e imágenes

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Sirve el index.html cuando entras a la raíz
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint para la IA
app.post('/ask', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Falta `prompt` en el body." });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Responde de forma clara y útil." },
        { role: "user", content: prompt }
      ]
    });

    const reply = completion.choices[0].message.content;
    res.json({ response: reply });

  } catch (err) {
    console.error("❌ Error al llamar a OpenAI:", err.message);
    res.status(500).json({ error: "Algo salió mal con OpenAI 😓" });
  }
});

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT} o en el puerto asignado por Replit`);
});
