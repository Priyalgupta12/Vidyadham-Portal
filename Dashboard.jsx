import { useState, useRef, useEffect } from 'react';
import API from '../services/api';
import './Chatbot.css';

// Simple markdown-lite parser for bot responses
function parseMarkdown(text) {
  if (!text) return '';
  return text
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Line breaks
    .replace(/\n/g, '<br />');
}

const SUGGESTIONS = [
  'How do I add a teacher?',
  'Tips for scheduling',
  'Managing transport',
  'What can you help with?',
];

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    try {
      const saved = sessionStorage.getItem('vidyadham_chat');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Persist messages to sessionStorage
  useEffect(() => {
    sessionStorage.setItem('vidyadham_chat', JSON.stringify(messages));
  }, [messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 350);
    }
  }, [isOpen]);

  const sendMessage = async (content) => {
    const text = content || input.trim();
    if (!text || isLoading) return;

    setError('');
    const userMessage = { role: 'user', content: text };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const res = await API.post('/chat', { messages: updatedMessages });
      const assistantMessage = {
        role: 'assistant',
        content: res.data.reply,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg =
        err.response?.data?.message || 'Failed to get response. Please try again.';
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError('');
    sessionStorage.removeItem('vidyadham_chat');
  };

  return (
    <>
      {/* Chat Panel */}
      <div className={`chatbot-panel ${isOpen ? 'visible' : ''}`} id="chatbot-panel">
        {/* Header */}
        <div className="chatbot-header">
          <div className="chatbot-header-avatar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2a4.5 4.5 0 00-4.5 4.5c0 1.657.896 3.105 2.232 3.888L9 12l-1.5 2 1 1.5L7 18l1 2h8l1-2-1.5-2.5 1-1.5L15 12l-.732-1.612A4.5 4.5 0 0016.5 6.5 4.5 4.5 0 0012 2z" />
            </svg>
          </div>
          <div className="chatbot-header-info">
            <h4>Vidya AI Assistant</h4>
            <span>Online</span>
          </div>
          <button
            className="chatbot-close-btn"
            onClick={clearChat}
            title="Clear chat"
            id="chatbot-clear-btn"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3,6 5,6 21,6" />
              <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
            </svg>
          </button>
          <button
            className="chatbot-close-btn"
            onClick={() => setIsOpen(false)}
            title="Close chat"
            id="chatbot-close-btn"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="chatbot-messages" id="chatbot-messages">
          {messages.length === 0 && !isLoading ? (
            <div className="chatbot-welcome">
              <div className="chatbot-welcome-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="1.5">
                  <path d="M12 2a4.5 4.5 0 00-4.5 4.5c0 1.657.896 3.105 2.232 3.888L9 12l-1.5 2 1 1.5L7 18l1 2h8l1-2-1.5-2.5 1-1.5L15 12l-.732-1.612A4.5 4.5 0 0016.5 6.5 4.5 4.5 0 0012 2z" />
                </svg>
              </div>
              <h4>Hi! I&apos;m Vidya 👋</h4>
              <p>
                Your AI assistant for Vidyadham School.
                <br />
                Ask me anything about managing teachers, drivers, vehicles, or scheduling.
              </p>
              <div className="chatbot-suggestions">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    className="chatbot-suggestion"
                    onClick={() => sendMessage(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, i) => (
                <div key={i} className={`chat-msg ${msg.role}`}>
                  <div className="chat-msg-avatar">
                    {msg.role === 'assistant' ? '✦' : 'A'}
                  </div>
                  <div
                    className="chat-msg-content"
                    dangerouslySetInnerHTML={{
                      __html: msg.role === 'assistant'
                        ? parseMarkdown(msg.content)
                        : msg.content.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br />'),
                    }}
                  />
                </div>
              ))}

              {/* Typing indicator */}
              {isLoading && (
                <div className="chat-typing">
                  <div className="chat-msg-avatar" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>
                    ✦
                  </div>
                  <div className="chat-typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="chat-error" id="chatbot-error">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}

        {/* Input */}
        <div className="chatbot-input-area">
          <textarea
            ref={inputRef}
            className="chatbot-input"
            placeholder="Ask Vidya anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={isLoading}
            id="chatbot-input"
          />
          <button
            className="chatbot-send-btn"
            onClick={() => sendMessage()}
            disabled={!input.trim() || isLoading}
            title="Send message"
            id="chatbot-send-btn"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22,2 15,22 11,13 2,9" />
            </svg>
          </button>
        </div>
      </div>

      {/* Floating Bubble */}
      <button
        className={`chatbot-bubble ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title={isOpen ? 'Close chat' : 'Chat with Vidya AI'}
        id="chatbot-bubble"
      >
        {!isOpen && <span className="chatbot-bubble-dot" />}
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            <path d="M8 10h.01M12 10h.01M16 10h.01" strokeWidth="3" strokeLinecap="round" />
          </svg>
        )}
      </button>
    </>
  );
}

export default Chatbot;
