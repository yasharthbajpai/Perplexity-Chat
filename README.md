
# Perplexity Chat V2.0

A modern AI chat application that leverages the Perplexity API to provide intelligent responses in a sleek, space-themed interface. This application demonstrates real-time communication using WebSockets, structured AI responses, and a responsive user interface.

## Version History

### Version 2.0 - Enhanced Structured Responses
- Added structured AI responses with greeting, bullet points, and summary sections
- Improved formatting with Markdown support
- Enhanced parsing logic for consistent response structure
- Better visual presentation of AI responses

[View Demo (v2.0)](https://drive.google.com/file/d/1bO8JLMOj9q86I_O8wJWQ8od_W9iG1Fem/view?usp=sharing)

### Version 1.0 - Initial Release
- Real-time AI-powered chat interface
- Space-themed design with animated background
- Responsive layout for various screen sizes

[View Demo (v1.0)](https://drive.google.com/file/d/1aY4AzQzlxzzT3M7Sdr5HvkXV7iSIZH07/view?usp=sharing)

## Features

- **Structured AI Responses**: Each response includes a greeting, detailed content as bullet points, and a summary
- **Markdown Support**: Rich text formatting for better readability
- **Real-time Communication**: Instant messaging using WebSockets
- **Space-themed UI**: Engaging animated background and modern design
- **Responsive Design**: Works on devices of all sizes
- **User Experience Enhancements**: Typing indicators, message timestamps, auto-scrolling, and error handling

## Architecture Overview

### Frontend-Backend Communication

The application uses a dual communication approach:

1. **RESTful API** for initial message sending and handling
2. **WebSockets** for real-time updates and continuous communication

### WebSocket Implementation

The application leverages Socket.IO to establish a persistent connection between the client and server:

- **Server-side**: Sets up a Socket.IO server that listens for connections and message events
- **Client-side**: Connects to the Socket.IO server and handles real-time message updates

This approach allows for lower latency, real-time updates without polling, bidirectional communication, and automatic reconnection handling.

### Structured Response Format

Each AI response is structured as:

```javascript
{
  greeting: "Hello! I'd be happy to help with your question about quantum computing.",
  main_output: "- Quantum computing uses quantum bits or 'qubits'\n- Qubits can exist in multiple states simultaneously\n- This property is called superposition\n- Quantum computers can solve certain problems exponentially faster",
  summary: "Quantum computing represents a fundamentally different approach to computation that leverages quantum mechanical properties for potentially exponential speedups on certain problems."
}
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/perplexity-chat.git
cd perplexity-chat
```

2. Install dependencies for both frontend and backend:
```bash
# Install backend dependencies
npm install

# Navigate to frontend directory
cd frontend
npm install
```

3. Create a `.env` file in the root directory with your Perplexity API key:
```
PERPLEXITY_API_KEY=your_api_key_here
PERPLEXITY_MODEL=sonar-pro
PORT=3000
```

## Usage

1. Start the backend server:
```bash
node index.js
```

2. In a separate terminal, start the frontend development server:
```bash
cd frontend
npm run dev
```

3. Open your browser and navigate to the URL shown in your terminal (typically http://localhost:5173)

## Project Structure

```
perplexity-chat/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   │   └── videoplayback.webm
│   │   ├── App.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── index.js
├── package.json
└── .env
```

## Tech Stack

### Frontend
- **React.js** with Vite for fast development and optimized builds
- **ReactMarkdown** for rendering formatted content
- **Socket.IO Client** for WebSocket communication
- **CSS** for styling and animations

### Backend
- **Node.js** with Express for API endpoints and server management
- **Socket.IO** for WebSocket server implementation
- **Perplexity AI API** for intelligent responses
- **Custom Parsing Logic** for structured response handling

## Detailed Implementation

### Backend Processing Flow

1. **Request Reception**: Server receives a message via HTTP POST or WebSocket
2. **AI Processing**: Message is sent to Perplexity API with structured format instructions
3. **Response Parsing**: Raw AI response is processed through multiple parsing strategies
4. **Response Cleaning**: Citations and unnecessary formatting are removed
5. **Structured Response Creation**: Final response is organized into greeting, main content, and summary
6. **Response Delivery**: Structured data is sent back via HTTP or emitted through WebSocket

### Frontend Rendering Process

1. **Message Submission**: User submits a message through the interface
2. **UI Update**: Message immediately appears in the chat with a loading indicator
3. **Response Reception**: Structured response is received from the server
4. **Markdown Processing**: ReactMarkdown converts formatted text into HTML
5. **Structured Display**: Response is rendered in distinct sections with appropriate styling
6. **Auto-scrolling**: View automatically scrolls to the latest message

### Structured Response Format

Each AI response is structured with a greeting, main output (as bullet points), and a summary section, ensuring consistent and readable responses.

## Installation and Usage

The README provides detailed installation instructions, including:
- Repository cloning
- Dependencies installation
- Environment configuration
- Starting both backend and frontend servers

## Performance Considerations

### WebSocket Efficiency

The application uses WebSockets to provide real-time updates without the overhead of establishing new HTTP connections for each message, reducing latency and providing a more responsive experience.

### Response Parsing Robustness

The response parsing logic employs multiple strategies to handle various response formats, ensuring consistent user experience even when the AI model doesn't follow the formatting instructions perfectly.


## Future Enhancements

Planned improvements include:
1. **Conversation Memory**: Implementing history storage for context
2. **User Authentication**: Adding accounts and personalized history
3. **Enhanced UI Features**: Message reactions, file sharing, voice options
4. **Advanced AI Features**: Multi-turn conversations, image generation, custom knowledge base

## Troubleshooting

The README includes solutions for common issues like WebSocket connection failures, AI response formatting problems, and performance optimization.

## Contributing

Contributions are welcome through the standard fork-and-pull-request workflow.

## License

This project is licensed under the Creative Commons Zero v1.0 Universal License.


## Acknowledgments

- Perplexity AI for providing the API
- Socket.IO team for the excellent WebSocket library
- React and Vite communities for the frontend tools


