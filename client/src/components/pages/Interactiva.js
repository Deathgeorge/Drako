import React, { useState, useEffect } from 'react';
import './Pages.css';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/comments';

const Interactiva = () => {
  const [comments, setComments] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    comment: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  // Cargar comentarios al iniciar
  useEffect(() => {
    loadComments();
  }, []);

  const loadComments = async () => {
    try {
      const response = await axios.get(API_URL);
      setComments(response.data);
    } catch (error) {
      console.error('Error cargando comentarios:', error);
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
      const response = await axios.post(API_URL, formData);
      
      // Recargar comentarios
      await loadComments();
      
      // Limpiar formulario
      setFormData({
        name: '',
        comment: ''
      });
      
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
              className="submit-btn"
            >
              {loading ? 'Enviando...' : 'Publicar Comentario'}
            </button>
          </form>
        </section>

        {/* Lista de Comentarios */}
        <section className="comments-section">
          <h2>Comentarios ({comments.length})</h2>
          
          {comments.length === 0 ? (
            <p className="no-comments">No hay comentarios aún. ¡Sé el primero en comentar!</p>
          ) : (
            <div className="comments-list">
              {comments.map(comment => (
                <div key={comment.id} className="comment-card">
                  <div className="comment-header">
                    <strong className="comment-author">{comment.name}</strong>
                    <span className="comment-date">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <div className="comment-content">
                    {comment.comment}
                  </div>
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