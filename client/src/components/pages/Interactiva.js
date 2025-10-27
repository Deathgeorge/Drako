import React, { useState, useEffect } from 'react';
import './Interactiva.css';
import axios from 'axios';

const Interactiva = () => {
  const [comments, setComments] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    comment: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [backendStatus, setBackendStatus] = useState('checking');
  const [apiUrl, setApiUrl] = useState('');

  // Detectar la URL base automáticamente
  useEffect(() => {
    const baseUrl = window.location.origin;
    setApiUrl(baseUrl);
    console.log('🌐 URL base detectada:', baseUrl);
  }, []);

  // Verificar conexión con el backend y cargar comentarios
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
        
        // Cargar comentarios si el backend está conectado
        await loadComments();
      } catch (error) {
        console.error('❌ Error conectando al backend:', error);
        setBackendStatus('error');
        
        // Mostrar comentarios de ejemplo si el backend no está disponible
        setComments([
          {
            id: 1,
            name: 'Sistema',
            comment: 'El backend no está disponible. Los comentarios se muestran en modo local.',
            createdAt: new Date().toISOString()
          }
        ]);
      }
    };

    checkBackendConnection();
  }, []);

  const loadComments = async () => {
    try {
      const response = await axios.get('/api/comments', {
        baseURL: window.location.origin
      });
      
      if (response.data.success) {
        setComments(response.data.data);
      } else {
        console.error('Error en la respuesta del servidor:', response.data);
      }
    } catch (error) {
      console.error('Error cargando comentarios:', error);
      // Mantener comentarios existentes o mostrar mensaje de error
      if (comments.length === 0) {
        setComments([
          {
            id: 1,
            name: 'Sistema',
            comment: 'No se pudieron cargar los comentarios del servidor.',
            createdAt: new Date().toISOString()
          }
        ]);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar errores cuando el usuario escribe
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);

    try {
      if (backendStatus === 'connected') {
        // Enviar al backend real
        const response = await axios.post('/api/comments', formData, {
          baseURL: window.location.origin
        });
        
        if (response.data.success) {
          // Recargar comentarios desde el backend
          await loadComments();
          
          // Limpiar formulario
          setFormData({
            name: '',
            comment: ''
          });
        } else {
          setErrors(response.data.errors || ['Error al enviar el comentario']);
        }
      } else {
        // Modo local - agregar comentario localmente
        const newComment = {
          id: Date.now(),
          name: formData.name || 'Anónimo',
          comment: formData.comment,
          createdAt: new Date().toISOString(),
          local: true
        };
        
        setComments(prev => [newComment, ...prev]);
        setFormData({
          name: '',
          comment: ''
        });
        
        console.log('💾 Comentario guardado localmente:', newComment);
      }
      
    } catch (error) {
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors(['Error al enviar el comentario']);
      }
    } finally {
      setLoading(false);
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
      
      // Recargar comentarios después de conectar
      await loadComments();
      
      alert(`✅ Backend conectado\nStatus: ${response.data.status}\nComentarios: ${response.data.totalComments}`);
    } catch (error) {
      setBackendStatus('error');
      alert(`❌ Error conectando al backend:\n${error.message}`);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="App">
      <div className="container">
        <header>
          <h1>Foro de Comentarios</h1>
          <p>Comparte tus pensamientos con la comunidad</p>
        </header>

        {/* Estado de la conexión */}
        <div className="connection-status">
          <div className={`status-indicator ${backendStatus}`}>
            {backendStatus === 'connected' && '✅ Conectado al Backend'}
            {backendStatus === 'checking' && '🔍 Verificando conexión...'}
            {backendStatus === 'error' && '❌ Modo Local - Backend no disponible'}
          </div>
          <button onClick={testBackendConnection} className="btn btn-secondary">
            🔄 Probar Conexión
          </button>
          {backendStatus === 'error' && (
            <div className="error-help">
              <p>💡 El backend no está disponible. Los comentarios se guardarán localmente.</p>
              <ul>
                <li>Para conectar el backend, ejecuta: <code>npm start</code> en la terminal</li>
                <li>Los comentarios locales se perderán al recargar la página</li>
              </ul>
            </div>
          )}
        </div>

        {/* Formulario */}
        <section className="form-section">
          <h2>Agregar Comentario</h2>
          <form onSubmit={handleSubmit} className="comment-form">
            <div className="form-group">
              <label htmlFor="name">Nombre:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Tu nombre"
                maxLength="100"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="comment">Comentario:</label>
              <textarea
                id="comment"
                name="comment"
                value={formData.comment}
                onChange={handleInputChange}
                placeholder="Escribe tu comentario aquí (máximo 500 caracteres)"
                rows="4"
                maxLength="500"
                required
              />
              <div className="char-count">
                {formData.comment.length}/500 caracteres
              </div>
            </div>

            {errors.length > 0 && (
              <div className="errors">
                {errors.map((error, index) => (
                  <div key={index} className="error">⚠️ {error}</div>
                ))}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className={`submit-btn ${backendStatus === 'error' ? 'local-mode' : ''}`}
            >
              {loading ? 'Enviando...' : 
               backendStatus === 'error' ? '💾 Guardar Localmente' : '📤 Publicar Comentario'}
            </button>

            {backendStatus === 'error' && (
              <div className="local-warning">
                <small>⚠️ Los comentarios se guardarán solo en esta sesión</small>
              </div>
            )}
          </form>
        </section>

        {/* Lista de Comentarios */}
        <section className="comments-section">
          <div className="comments-header">
            <h2>Comentarios ({comments.length})</h2>
            <button onClick={loadComments} className="btn btn-refresh">
              🔄 Actualizar
            </button>
          </div>
          
          {comments.length === 0 ? (
            <p className="no-comments">No hay comentarios aún. ¡Sé el primero en comentar!</p>
          ) : (
            <div className="comments-list">
              {comments.map(comment => (
                <div key={comment.id} className={`comment-card ${comment.local ? 'local-comment' : ''}`}>
                  <div className="comment-header">
                    <strong className="comment-author">
                      {comment.name}
                      {comment.local && <span className="local-badge"> 💾 Local</span>}
                    </strong>
                    <span className="comment-date">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <div className="comment-content">
                    {comment.comment}
                  </div>
                  {comment.local && (
                    <div className="comment-footer">
                      <small>Este comentario solo está visible en tu navegador</small>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Interactiva;