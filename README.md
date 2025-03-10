# Perplexity Chat

A modern AI chat application that leverages the Perplexity API to provide intelligent responses in a sleek, space-themed interface.

[View Demo](https://drive.google.com/file/d/1aY4AzQzlxzzT3M7Sdr5HvkXV7iSIZH07/view?usp=sharing)

## Features

- Real-time AI-powered chat interface
- Space-themed design with animated background
- Responsive layout for various screen sizes
- Typing indicators and message timestamps
- Error handling for network issues
- Automatic scrolling to latest messages

## Tech Stack

### Frontend
- React.js with Vite
- CSS for styling
- Socket.io client for real-time communication

### Backend
- Node.js with Express
- Socket.io for real-time messaging
- Perplexity AI API integration

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

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the Creative Commons Zero v1.0 Universal License - see the LICENSE file for details.

