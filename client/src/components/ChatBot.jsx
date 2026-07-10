import { useChat } from '../context/ChatContext';
import { MessageSquare, X, Send, Loader2, Bot, User, AlertCircle, CheckCircle } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function ChatBot() {
  const { isOpen, messages, isLoading, toggleChat, closeChat, sendMessage, clearMessages } = useChat();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      sendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={toggleChat}
        className="chat-fab"
        aria-label="Open AI Health Assistant"
        aria-expanded="false"
      >
        <MessageSquare className="fab-icon" aria-hidden="true" />
        <span className="fab-tooltip">AI Health Assistant</span>
        <div className="fab-pulse" aria-hidden="true"></div>
      </button>
    );
  }

  return (
    <div className="chat-overlay" onClick={closeChat} role="dialog" aria-modal="true" aria-labelledby="chat-title">
      <div className="chat-window" onClick={(e) => e.stopPropagation()} ref={chatContainerRef}>
        <div className="chat-header">
          <div className="chat-header-info">
            <div className="bot-avatar" aria-hidden="true">
              <Bot className="avatar-icon" />
            </div>
            <div>
              <h2 id="chat-title">MedAssist AI</h2>
              <span className="chat-status">Online • AI Health Assistant</span>
            </div>
          </div>
          <button onClick={closeChat} className="chat-close" aria-label="Close chat">
            <X className="icon" aria-hidden="true" />
          </button>
        </div>

        <div className="chat-disclaimer" role="alert">
          <AlertCircle className="icon" aria-hidden="true" />
          <span>I'm an AI assistant, not a doctor. For medical emergencies, call 911 or visit our ER.</span>
        </div>

        <div className="chat-messages" aria-live="polite" aria-label="Chat messages">
          {messages.length === 0 ? (
            <div className="welcome-message">
              <div className="welcome-avatar" aria-hidden="true">
                <Bot className="icon" />
              </div>
              <h3>Hello! I'm MedAssist</h3>
              <p>Your AI health assistant for CityCare Hospital. How can I help you today?</p>
              <div className="quick-replies">
                <button onClick={() => sendMessage('What services does CityCare Hospital offer?')} className="quick-reply">
                  Hospital Services
                </button>
                <button onClick={() => sendMessage('How do I book an appointment?')} className="quick-reply">
                  Book Appointment
                </button>
                <button onClick={() => sendMessage('What are the visiting hours?')} className="quick-reply">
                  Visiting Hours
                </button>
                <button onClick={() => sendMessage('I have a health question')} className="quick-reply">
                  Health Question
                </button>
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <div key={message.id} className={`message ${message.role}`}>
                <div className="message-avatar" aria-hidden="true">
                  {message.role === 'user' ? <User className="icon" /> : <Bot className="icon" />}
                </div>
                <div className="message-content">
                  <p className="message-text">{message.content}</p>
                  <span className="message-time">
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="message assistant loading">
              <div className="message-avatar" aria-hidden="true">
                <Bot className="icon" />
              </div>
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

        <form onSubmit={handleSubmit} className="chat-input-form">
          <div className="chat-input-wrapper">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me about health, appointments, services..."
              className="chat-input"
              aria-label="Type your message"
              disabled={isLoading}
              autoFocus
            />
            <button
              type="submit"
              className="chat-send"
              disabled={!inputValue.trim() || isLoading}
              aria-label="Send message"
            >
              {isLoading ? <Loader2 className="icon spin" aria-hidden="true" /> : <Send className="icon" aria-hidden="true" />}
            </button>
          </div>
          <div className="chat-input-hints">
            <span>Press Enter to send • Shift+Enter for new line</span>
            {messages.length > 0 && (
              <button type="button" onClick={clearMessages} className="clear-chat">
                Clear conversation
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}