const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware para Replit
app.use(cors({
  origin: ['https://tu-replit-url.repl.co', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Almacenamiento en memoria
let comments = [];
let nextId = 1;

// Validar comentario (mismo código que antes)
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

// Routes (mismo código que antes)
app.get('/api/comments', (req, res) => {
  try {
    const sortedComments = [...comments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(sortedComments);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los comentarios' });
  }
});

app.post('/api/comments', (req, res) => {
  try {
    const { name, comment } = req.body;
    
    const validationErrors = validateComment({ name, comment });
    
    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }
    
    const newComment = {
      id: nextId++,
      name: name.trim(),
      comment: comment.trim(),
      createdAt: new Date().toISOString()
    };
    
    comments.push(newComment);
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el comentario' });
  }
});

// Servir el frontend React (si está en la misma repl)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Manejar todas las rutas para React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar servidor para Replit
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📝 API disponible en: /api/comments`);
});