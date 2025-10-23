// client/src/components/pages/Interactiva.js
import React, { useState, useEffect } from 'react';
import './Pages.css';

const Interactiva = () => {
  const [counter, setCounter] = useState(0);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const [color, setColor] = useState('#667eea');

  useEffect(() => {
    document.documentElement.style.setProperty('--interactive-color', color);
  }, [color]);

  const addMessage = () => {
    if (inputText.trim()) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: inputText,
        timestamp: new Date().toLocaleTimeString()
      }]);
      setInputText('');
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addMessage();
    }
  };

  const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];

  return (
    <div className="page-container">
      <div className="content-card">
        <h2>Sección Interactiva</h2>
        <p className="page-description">
          ¡Juega con estos componentes interactivos! Puedes contar, cambiar colores y enviar mensajes.
        </p>

        <div className="interactive-grid">
          {/* Contador */}
          <div className="interactive-card">
            <h3>Contador Interactivo</h3>
            <div className="counter-display">
              <span className="counter-value">{counter}</span>
            </div>
            <div className="counter-buttons">
              <button 
                className="btn btn-danger"
                onClick={() => setCounter(prev => prev - 1)}
              >
                -1
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => setCounter(0)}
              >
                Reiniciar
              </button>
              <button 
                className="btn btn-success"
                onClick={() => setCounter(prev => prev + 1)}
              >
                +1
              </button>
            </div>
          </div>

          {/* Selector de Color */}
          <div className="interactive-card">
            <h3>Selector de Color</h3>
            <div 
              className="color-preview"
              style={{ backgroundColor: color }}
            ></div>
            <div className="color-palette">
              {colors.map((col, index) => (
                <button
                  key={index}
                  className="color-swatch"
                  style={{ backgroundColor: col }}
                  onClick={() => setColor(col)}
                ></button>
              ))}
            </div>
            <p className="color-code">Código: {color}</p>
          </div>

          {/* Chat Interactivo */}
          <div className="interactive-card chat-container">
            <h3>Chat en Tiempo Real</h3>
            <div className="messages-container">
              {messages.map(message => (
                <div key={message.id} className="message">
                  <span className="message-text">{message.text}</span>
                  <span className="message-time">{message.timestamp}</span>
                </div>
              ))}
              {messages.length === 0 && (
                <p className="no-messages">No hay mensajes aún...</p>
              )}
            </div>
            <div className="chat-input">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe un mensaje..."
                className="text-input"
              />
              <button 
                className="btn btn-primary"
                onClick={addMessage}
                disabled={!inputText.trim()}
              >
                Enviar
              </button>
            </div>
            {messages.length > 0 && (
              <button 
                className="btn btn-secondary clear-btn"
                onClick={clearMessages}
              >
                Limpiar Chat
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interactiva;