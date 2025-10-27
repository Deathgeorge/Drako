import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Pages.css';

const Interactiva = () => {
  const [counter, setCounter] = useState(0);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const [color, setColor] = useState('#667eea');
  const [backendStatus, setBackendStatus] = useState('checking');
  const [apiUrl, setApiUrl] = useState('');

  // Detectar la URL base automáticamente
  useEffect(() => {
    const baseUrl = window.location.origin;
    setApiUrl(baseUrl);
    console.log('🌐 URL base detectada:', baseUrl);
  }, []);

  // Verificar conexión con el backend
  useEffect(() => {
    const checkBackendConnection = async () => {
      try {
        setBackendStatus('checking');
        console.log('🔍 Probando conexión con el backend...');
        
        // Intentar conectar al backend
        const response = await axios.get('/api/health', { 
          timeout: 5000,
          baseURL: window.location.origin
        });
        
        console.log('✅ Backend conectado:', response.data);
        setBackendStatus('connected');
      } catch (error) {
        console.error('❌ Error conectando al backend:', error);
        setBackendStatus('error');
        
        // Mostrar detalles del error
        if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNREFUSED') {
          console.log('🔌 El backend no está corriendo o no es accesible');
        }
      }
    };

    checkBackendConnection();
  }, []);

  const addMessage = async () => {
    if (inputText.trim()) {
      try {
        // Guardar mensaje localmente inmediatamente
        const newMessage = {
          id: Date.now(),
          text: inputText,
          timestamp: new Date().toLocaleTimeString(),
          status: 'sending'
        };
        
        setMessages(prev => [newMessage, ...prev]);
        setInputText('');

        // Intentar enviar al backend
        if (backendStatus === 'connected') {
          try {
            await axios.post('/api/comments', {
              name: 'Usuario',
              comment: inputText
            }, {
              baseURL: window.location.origin
            });
            
            // Actualizar estado a enviado
            setMessages(prev => 
              prev.map(msg => 
                msg.id === newMessage.id 
                  ? { ...msg, status: 'sent' } 
                  : msg
              )
            );
          } catch (error) {
            console.error('Error enviando al backend:', error);
            // Mantener mensaje local pero marcar error
            setMessages(prev => 
              prev.map(msg => 
                msg.id === newMessage.id 
                  ? { ...msg, status: 'local' } 
                  : msg
              )
            );
          }
        } else {
          // Solo modo local
          setMessages(prev => 
            prev.map(msg => 
              msg.id === newMessage.id 
                ? { ...msg, status: 'local' } 
                : msg
            )
          );
        }
      } catch (error) {
        console.error('Error agregando mensaje:', error);
      }
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

  const testBackendConnection = async () => {
    try {
      setBackendStatus('checking');
      const response = await axios.get('/api/health', {
        baseURL: window.location.origin,
        timeout: 3000
      });
      setBackendStatus('connected');
      alert(`✅ Backend conectado\nPuerto: ${response.data.port}\nStatus: ${response.data.status}`);
    } catch (error) {
      setBackendStatus('error');
      alert(`❌ Error conectando al backend:\n${error.message}`);
    }
  };

  const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];

  return (
    <div className="page-container">
      <div className="content-card">
        <h2>Sección Interactiva</h2>
        
        {/* Estado de la conexión */}
        <div className="connection-status">
          <div className={`status-indicator ${backendStatus}`}>
            {backendStatus === 'connected' && '✅ Backend Conectado'}
            {backendStatus === 'checking' && '🔍 Verificando conexión...'}
            {backendStatus === 'error' && '❌ Error de conexión'}
          </div>
          <button onClick={testBackendConnection} className="btn btn-secondary">
            🔄 Probar Conexión
          </button>
          {backendStatus === 'error' && (
            <div className="error-help">
              <p>💡 El backend no está disponible. Posibles soluciones:</p>
              <ul>
                <li>Verifica que el servidor esté corriendo</li>
                <li>Ejecuta: <code>npm start</code> en la terminal</li>
                <li>Revisa la consola para errores</li>
              </ul>
            </div>
          )}
        </div>

        <p className="page-description">
          ¡Juega con estos componentes interactivos! {backendStatus === 'connected' ? 
          'Los mensajes se guardarán en el backend.' : 'Los mensajes se guardarán localmente.'}
        </p>

        <div className="interactive-grid">
          {/* Contador */}
          <div className="interactive-card">
            <h3>Contador Interactivo</h3>
            <div className="counter-display">
              <span className="counter-value">{counter}</span>
            </div>
            <div className="counter-buttons">
              <button className="btn btn-danger" onClick={() => setCounter(prev => prev - 1)}>
                -1
              </button>
              <button className="btn btn-secondary" onClick={() => setCounter(0)}>
                Reiniciar
              </button>
              <button className="btn btn-success" onClick={() => setCounter(prev => prev + 1)}>
                +1
              </button>
            </div>
          </div>

          {/* Selector de Color */}
          <div className="interactive-card">
            <h3>Selector de Color</h3>
            <div className="color-preview" style={{ backgroundColor: color }}></div>
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
            <div className="backend-status">
              <small>
                {backendStatus === 'connected' ? '✅ Conectado al backend' : 
                 backendStatus === 'error' ? '⚠️ Modo local (backend no disponible)' : 
                 '🔍 Verificando conexión...'}
              </small>
            </div>
            <div className="messages-container">
              {messages.map(message => (
                <div key={message.id} className={`message ${message.status}`}>
                  <span className="message-text">{message.text}</span>
                  <div className="message-info">
                    <span className="message-time">{message.timestamp}</span>
                    {message.status === 'local' && <span className="message-local">💾 Local</span>}
                    {message.status === 'sending' && <span className="message-sending">⏳ Enviando...</span>}
                  </div>
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
              <button className="btn btn-secondary clear-btn" onClick={clearMessages}>
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