const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware para Replit - MÁS PERMISIVO
app.use(cors({
  origin: true, // Permitir todos los orígenes
  credentials: true
}));

app.use(express.json());

// Log todas las requests para debugging
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// VERIFICAR SI EXISTE EL BUILD DE REACT
const clientBuildPath = path.join(__dirname, '../client/build');
const indexHtmlPath = path.join(clientBuildPath, 'index.html');

console.log('🔍 Verificando rutas...');
console.log('Ruta del build:', clientBuildPath);

if (fs.existsSync(clientBuildPath)) {
  console.log('✅ Build de React encontrado');
  app.use(express.static(clientBuildPath));
} else {
  console.log('⚡ Modo desarrollo - Build no encontrado');
}

// Almacenamiento en memoria
let comments = [];
let nextId = 1;

// Validar comentario
const validateComment = (comment) => {
  const errors = [];
  if (!comment.name || comment.name.trim() === '') errors.push('El nombre es requerido');
  if (!comment.comment || comment.comment.trim() === '') errors.push('El comentario es requerido');
  if (comment.comment && comment.comment.length > 500) errors.push('El comentario no puede tener más de 500 caracteres');
  if (comment.name && comment.name.length > 100) errors.push('El nombre no puede tener más de 100 caracteres');
  return errors;
};

// ========== RUTAS DE LA API ==========

app.get('/api', (req, res) => {
  console.log('✅ API root accedida');
  res.json({ 
    message: '✅ API funcionando correctamente',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    replInfo: {
      slug: process.env.REPL_SLUG,
      owner: process.env.REPL_OWNER,
      id: process.env.REPL_ID
    }
  });
});

app.get('/api/health', (req, res) => {
  console.log('🏥 Health check');
  res.json({ 
    status: 'OK',
    server: 'running',
    time: new Date().toISOString(),
    port: PORT,
    buildExists: fs.existsSync(clientBuildPath)
  });
});

app.get('/api/comments', (req, res) => {
  console.log('📝 Obteniendo comentarios');
  try {
    const sortedComments = [...comments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({
      success: true,
      data: sortedComments,
      count: sortedComments.length
    });
  } catch (error) {
    console.error('❌ Error al obtener comentarios:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error interno al obtener los comentarios' 
    });
  }
});

app.post('/api/comments', (req, res) => {
  console.log('📝 Creando comentario:', req.body);
  try {
    const { name, comment } = req.body;
    const validationErrors = validateComment({ name, comment });
    
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        success: false,
        errors: validationErrors 
      });
    }
    
    const newComment = {
      id: nextId++,
      name: name.trim(),
      comment: comment.trim(),
      createdAt: new Date().toISOString()
    };
    
    comments.push(newComment);
    console.log('✅ Comentario creado:', newComment);
    
    res.status(201).json({
      success: true,
      data: newComment,
      message: 'Comentario creado exitosamente'
    });
  } catch (error) {
    console.error('❌ Error al crear comentario:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error interno al crear el comentario' 
    });
  }
});

// ========== RUTAS DEL FRONTEND ==========

app.get('/', (req, res) => {
  console.log('🏠 Serviendo ruta raíz');
  if (fs.existsSync(indexHtmlPath)) {
    res.sendFile(indexHtmlPath);
  } else {
    res.json({
      message: '🚀 Backend funcionando - Frontend no construido',
      instruction: 'Ejecuta: npm run build-replit',
      endpoints: ['/api', '/api/health', '/api/comments']
    });
  }
});

// Manejar rutas de React Router
app.get('*', (req, res) => {
  console.log(`🔄 Ruta catch-all: ${req.path}`);
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({
      success: false,
      error: 'Endpoint API no encontrado',
      availableEndpoints: ['/api', '/api/health', '/api/comments']
    });
  }
  
  if (fs.existsSync(indexHtmlPath)) {
    res.sendFile(indexHtmlPath);
  } else {
    res.json({
      message: 'Backend activo - Frontend en desarrollo',
      currentPath: req.path
    });
  }
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log('🚀 =================================');
  console.log('✅ Servidor INICIADO correctamente');
  console.log(`📡 Puerto: ${PORT}`);
  console.log(`🌐 URL: https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`);
  console.log(`🔗 Health: https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co/api/health`);
  console.log('🚀 =================================');
});