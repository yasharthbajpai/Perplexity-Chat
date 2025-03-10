import express from 'express';
import { createServer } from 'http';
import { Server as socketIO } from 'socket.io';
import { OpenAI } from 'openai';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

// Handle __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
const app = express();
const server = createServer(app);
const io = new socketIO(server);

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize Perplexity API client
const perplexity = new OpenAI({
  apiKey: process.env.PERPLEXITY_API_KEY,
  baseURL: 'https://api.perplexity.ai'
});

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint for chat
app.post('/api/chat', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        ok: false,
        error: 'Missing required field: prompt'
      });
    }

    const response = await perplexity.chat.completions.create({
      model: process.env.PERPLEXITY_MODEL ,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1024
    });

    res.json({
      ok: true,
      answer: response.choices[0].message.content
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      ok: false,
      error: 'An error occurred while processing your request'
    });
  }
});

// Socket.IO implementation for real-time chat
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('chat message', async (msg) => {
    try {
      const response = await perplexity.chat.completions.create({
        model: process.env.PERPLEXITY_MODEL || 'mistral-7b-instruct',
        messages: [{ role: 'user', content: msg }],
        max_tokens: 1024
      });

      io.emit('chat message', {
        user: 'user',
        message: msg
      });

      io.emit('chat message', {
        user: 'ai',
        message: response.choices[0].message.content
      });
    } catch (error) {
      console.error('Error:', error);
      io.emit('error', 'An error occurred while processing your request');
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
