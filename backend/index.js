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

// Function to clean text and remove citations
function cleanText(text) {
  // Remove citations like [1][2]
  return text.replace(/\[\d+\](?:\[\d+\])*/g, '').trim();
}

// Function to parse structured response with better formatting
function parseStructuredResponse(text) {
  try {
    // First try to parse as JSON in case the model returns JSON
    try {
      const jsonResponse = JSON.parse(text);
      if (jsonResponse.greeting && jsonResponse.main_output && jsonResponse.summary) {
        return {
          greeting: cleanText(jsonResponse.greeting),
          main_output: cleanText(jsonResponse.main_output),
          summary: cleanText(jsonResponse.summary)
        };
      }
    } catch (e) {
      // Not JSON, continue with regex parsing
    }
    
    // Check if the response already has the expected format
    if (text.includes("GREETING:") && text.includes("MAIN_OUTPUT:") && text.includes("SUMMARY:")) {
      const greetingMatch = text.match(/GREETING:(.*?)(?=MAIN_OUTPUT:|$)/s);
      const mainOutputMatch = text.match(/MAIN_OUTPUT:(.*?)(?=SUMMARY:|$)/s);
      const summaryMatch = text.match(/SUMMARY:(.*?)(?=$)/s);
      
      return {
        greeting: greetingMatch ? cleanText(greetingMatch[1].trim()) : "Hello!",
        main_output: mainOutputMatch ? cleanText(mainOutputMatch[1].trim()) : cleanText(text),
        summary: summaryMatch ? cleanText(summaryMatch[1].trim()) : "No summary provided."
      };
    }
    
    // If the text starts with a greeting-like phrase and ends with a summary-like section
    const firstLine = text.split('\n')[0].trim();
    
    if (firstLine.includes("Hello") || firstLine.includes("Hi") || 
        firstLine.includes("Greetings") || firstLine.includes("Welcome") ||
        firstLine.includes("Hey") || firstLine.includes("Good day")) {
      
      // Check if there's a "Summary:" section
      const summaryIndex = text.lastIndexOf("Summary:");
      
      if (summaryIndex !== -1) {
        const greeting = cleanText(firstLine);
        const summary = cleanText(text.substring(summaryIndex + 8).trim());
        const mainOutput = cleanText(text.substring(firstLine.length, summaryIndex).trim());
        
        return {
          greeting,
          main_output: mainOutput,
          summary
        };
      }
    }
    
    // If all else fails, try to extract the first sentence as greeting
    // and the last paragraph as summary
    const sentences = text.split(/(?<=[.!?])\s+/);
    const paragraphs = text.split(/\n\n+/);
    
    if (sentences.length >= 3 && paragraphs.length >= 2) {
      const greeting = cleanText(sentences[0].trim());
      const summary = cleanText(paragraphs[paragraphs.length - 1].trim());
      const mainOutput = cleanText(text.substring(greeting.length, text.length - summary.length).trim());
      
      return {
        greeting,
        main_output: mainOutput,
        summary
      };
    } else {
      return {
        greeting: "Hello!",
        main_output: cleanText(text.trim()),
        summary: "No summary provided."
      };
    }
  } catch (error) {
    console.error("Error parsing structured response:", error);
    return {
      greeting: "Hello!",
      main_output: cleanText(text),
      summary: "Unable to parse structured response."
    };
  }
}

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
      model: process.env.PERPLEXITY_MODEL || 'mistral-7b-instruct',
      messages: [
        { 
          role: 'system', 
          content: 'You are a helpful assistant. Structure your response in three parts:\n\n1. A friendly greeting\n2. Main content formatted as bullet points (use markdown format with each point starting with "- ")\n3. A brief summary paragraph\n\nFormat your response exactly as follows:\n\nGREETING: [your greeting here]\n\nMAIN_OUTPUT: [your detailed answer as bullet points]\n\nSUMMARY: [your brief summary here as a single paragraph]' 
        },
        { role: 'user', content: prompt }
      ],
      max_tokens: 1024
    });

    const rawContent = response.choices[0].message.content;
    const parsedResponse = parseStructuredResponse(rawContent);

    res.json({
      ok: true,
      answer: parsedResponse
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
        messages: [
          { 
            role: 'system', 
            content: 'You are a helpful assistant. Structure your response in three parts:\n\n1. A friendly greeting\n2. Main content formatted as bullet points (use markdown format with each point starting with "- ")\n3. A brief summary paragraph\n\nFormat your response exactly as follows:\n\nGREETING: [your greeting here]\n\nMAIN_OUTPUT: [your detailed answer as bullet points]\n\nSUMMARY: [your brief summary here as a single paragraph]' 
          },
          { role: 'user', content: msg }
        ],
        max_tokens: 1024
      });

      const rawContent = response.choices[0].message.content;
      const parsedResponse = parseStructuredResponse(rawContent);

      io.emit('chat message', {
        user: 'user',
        message: msg
      });

      io.emit('chat message', {
        user: 'ai',
        structured: true,
        greeting: parsedResponse.greeting,
        main_output: parsedResponse.main_output,
        summary: parsedResponse.summary
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
