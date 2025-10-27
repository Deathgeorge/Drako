const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Almacenamiento en memoria
let comments = [];
let nextId = 1;

// Validar comentario
const validateComment = (comment) => {
  const errors = [];
  
  if (!comment.name || comment.name.trim() === '') {
    errors.push('El nombre es requerido');
  }
  
  if (!comment.comment || comment.comment.trim() === '') {
    errors.push('El comentario es requerido');
  }
  
  if (comment.comment && comment.comment.length > 500) {
    errors.push('El comentario no puede tener más de 500 caracteres');
  }
  
  if (comment.name && comment.name.length > 100) {
    errors.push('El nombre no puede tener más de 100 caracteres');
  }
  
  return errors;
};

// Routes
// GET /api/comments - Obtener todos los comentarios (más recientes primero)
app.get('/api/comments', (req, res) => {
  try {
    // Ordenar por fecha descendente (más recientes primero)
    const sortedComments = [...comments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(sortedComments);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los comentarios' });
  }
});

// POST /api/comments - Crear nuevo comentario
app.post('/api/comments', (req, res) => {
  try {
    const { name, comment } = req.body;
    
    // Validar datos
    const validationErrors = validateComment({ name, comment });
    
    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }
    
    // Crear nuevo comentario
    const newComment = {
      id: nextId++,
      name: name.trim(),
      comment: comment.trim(),
      createdAt: new Date().toISOString()
    };
    
    // Agregar a la lista
    comments.push(newComment);
    
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el comentario' });
  }
});

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    message: 'API de Comentarios funcionando',
    endpoints: {
      'GET /api/comments': 'Obtener todos los comentarios',
      'POST /api/comments': 'Crear nuevo comentario'
    }
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📝 API de comentarios disponible en http://localhost:${PORT}/api/comments`);
});