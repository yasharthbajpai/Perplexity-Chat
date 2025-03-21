import { useState, useEffect, useRef } from 'react';
import './App.css';
import ReactMarkdown from 'react-markdown';

function App() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Focus input field when component mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Function to ensure main output is formatted as bullet points
  const formatMainOutput = (text) => {
    // If the text already has bullet points, return as is
    if (text.includes('- ')) {
      return text;
    }
    
    // Otherwise, try to convert paragraphs or sections to bullet points
    const lines = text.split(/\n+/).filter(line => line.trim() !== '');
    
    // Skip headers (lines starting with #)
    const bulletPoints = lines.map(line => {
      if (line.startsWith('#')) {
        return line;
      } else {
        return `- ${line}`;
      }
    });
    
    return bulletPoints.join('\n\n');
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return;
    
    // Add user message to chat
    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    
    try {
      // Send message to backend
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: inputMessage }),
      });
      
      const data = await response.json();
      
      if (data.ok) {
        // Format main output as bullet points if needed
        const formattedMainOutput = formatMainOutput(data.answer.main_output);
        
        // Add AI response to chat with structured format
        const aiMessage = {
          id: Date.now() + 1,
          structured: true,
          greeting: data.answer.greeting,
          main_output: formattedMainOutput,
          summary: data.answer.summary,
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        setMessages(prevMessages => [...prevMessages, aiMessage]);
      } else {
        // Handle error
        const errorMessage = {
          id: Date.now() + 1,
          text: 'Sorry, I encountered an error. Please try again.',
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        setMessages(prevMessages => [...prevMessages, errorMessage]);
      }
    } catch (error) {
      console.error('Error:', error);
      
      // Add error message to chat
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Network error. Please check your connection and try again.',
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <div className="video-background">
        <video autoPlay muted loop>
          <source src="./src/assets/videoplayback.webm" type="video/webm" />
        </video>
      </div>
      
      <div className="chat-container">
        <div className="chat-header">
          <h1>Perplexity Chat</h1>
          <p>Ask me anything</p>
        </div>
        
        <div className="messages-container">
          {messages.length === 0 ? (
            <div className="welcome-message">
              <h2>Welcome to Perplexity Chat!</h2>
              <p>Start a conversation by typing a message below.</p>
            </div>
          ) : (
            messages.map((message) => (
              <div 
                key={message.id} 
                className={`message ${message.sender === 'user' ? 'user-message' : 'ai-message'}`}
              >
                <div className="message-content">
                  {message.structured ? (
                    <div className="structured-message">
                      <div className="greeting">
                        <ReactMarkdown>{message.greeting}</ReactMarkdown>
                      </div>
                      <div className="main-output">
                        <ReactMarkdown>{message.main_output}</ReactMarkdown>
                      </div>
                      <div className="summary">
                        <strong>Summary:</strong> <ReactMarkdown>{message.summary}</ReactMarkdown>
                      </div>
                    </div>
                  ) : (
                    <span className="message-text">{message.text}</span>
                  )}
                  <span className="message-time">{message.timestamp}</span>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="message ai-message">
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="input-container">
          <textarea
            ref={inputRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here..."
            rows="1"
          />
          <button 
            onClick={handleSendMessage}
            disabled={isLoading || inputMessage.trim() === ''}
            className={isLoading ? 'sending' : ''}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
