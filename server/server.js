const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware para Replit
app.use(cors({
  origin: [
    'https://' + process.env.REPL_SLUG + '.' + process.env.REPL_OWNER + '.repl.co',
    'https://' + process.env.REPL_ID + '.id.repl.co',
    'http://localhost:3000',
    'http://localhost:5000'
  ],
  credentials: true
}));
app.use(express.json());

// VERIFICAR SI EXISTE EL BUILD DE REACT
const clientBuildPath = path.join(__dirname, '../client/build');
const clientPublicPath = path.join(__dirname, '../client/public');
const indexHtmlPath = path.join(clientBuildPath, 'index.html');

console.log('🔍 Verificando rutas...');
console.log('Ruta del build:', clientBuildPath);
console.log('Ruta public:', clientPublicPath);
console.log('Ruta de index.html:', indexHtmlPath);

// Verificar si existe el build de React
if (fs.existsSync(clientBuildPath)) {
  console.log('✅ Build de React encontrado - Sirviendo archivos estáticos');
  app.use(express.static(clientBuildPath));
} else {
  console.log('⚠️  Build de React NO encontrado - Modo desarrollo');
  // En desarrollo, servir archivos estáticos de public si existen
  if (fs.existsSync(clientPublicPath)) {
    app.use(express.static(clientPublicPath));
  }
}

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

// ========== RUTAS DE LA API ==========

// Ruta de verificación del servidor
app.get('/api', (req, res) => {
  res.json({ 
    message: '✅ API funcionando correctamente',
    timestamp: new Date().toISOString(),
    mode: fs.existsSync(clientBuildPath) ? 'production' : 'development',
    endpoints: {
      comments: {
        GET: '/api/comments',
        POST: '/api/comments'
      }
    }
  });
});

// Ruta de salud
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    server: 'running',
    time: new Date().toISOString(),
    buildExists: fs.existsSync(clientBuildPath),
    totalComments: comments.length
  });
});

// Obtener todos los comentarios
app.get('/api/comments', (req, res) => {
  try {
    const sortedComments = [...comments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({
      success: true,
      data: sortedComments,
      count: sortedComments.length
    });
  } catch (error) {
    console.error('Error al obtener comentarios:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error interno al obtener los comentarios' 
    });
  }
});

// Crear nuevo comentario
app.post('/api/comments', (req, res) => {
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
    
    console.log('📝 Nuevo comentario creado:', newComment);
    
    res.status(201).json({
      success: true,
      data: newComment,
      message: 'Comentario creado exitosamente'
    });
  } catch (error) {
    console.error('Error al crear comentario:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error interno al crear el comentario' 
    });
  }
});

// ========== MANEJO DE RUTAS DEL FRONTEND ==========

app.get('/', (req, res) => {
  if (fs.existsSync(indexHtmlPath)) {
    // ✅ MODO PRODUCCIÓN: Servir el build de React
    console.log('🏠 Sirviendo index.html desde build');
    res.sendFile(indexHtmlPath);
  } else if (fs.existsSync(path.join(clientPublicPath, 'index.html'))) {
    // ⚡ MODO DESARROLLO: Servir desde public si existe
    console.log('🏠 Sirviendo index.html desde public');
    res.sendFile(path.join(clientPublicPath, 'index.html'));
  } else {
    // 📡 SOLO BACKEND: Mostrar información de la API
    res.json({
      message: '🚀 Backend Express funcionando correctamente',
      status: 'Servidor activo',
      mode: 'api-only',
      frontend: fs.existsSync(clientBuildPath) ? 'Build encontrado' : 'No construido',
      availableEndpoints: {
        root: '/api',
        health: '/api/health',
        comments: {
          GET: '/api/comments',
          POST: '/api/comments'
        }
      },
      instructions: {
        development: 'Para desarrollo: cd client && npm start',
        production: 'Para producción: npm run build-replit'
      },
      stats: {
        totalComments: comments.length,
        serverUptime: new Date().toISOString()
      }
    });
  }
});

// Manejar todas las rutas para React Router
app.get('*', (req, res) => {
  // Si es una ruta de API que no existe
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({
      success: false,
      error: 'Endpoint API no encontrado',
      availableEndpoints: ['/api', '/api/health', '/api/comments']
    });
  }
  
  // Para rutas del frontend
  if (fs.existsSync(indexHtmlPath)) {
    res.sendFile(indexHtmlPath);
  } else if (fs.existsSync(path.join(clientPublicPath, 'index.html'))) {
    res.sendFile(path.join(clientPublicPath, 'index.html'));
  } else {
    res.json({
      error: 'Frontend no disponible',
      message: 'El frontend React no está construido ni disponible',
      instruction: 'Ejecuta: npm run build-replit para construir el frontend'
    });
  }
});

// Iniciar servidor para Replit
app.listen(PORT, '0.0.0.0', () => {
  console.log('🚀 =================================');
  console.log('✅ Servidor Express iniciado correctamente');
  console.log(`📡 Puerto: ${PORT}`);
  console.log(`🌐 URL: https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`);
  console.log(`📊 Modo: ${fs.existsSync(clientBuildPath) ? 'PRODUCCIÓN' : 'DESARROLLO'}`);
  console.log(`💾 Comentarios en memoria: ${comments.length}`);
  console.log('🔗 Endpoints disponibles:');
  console.log('   GET  /api          - Información del API');
  console.log('   GET  /api/health   - Estado del servidor');
  console.log('   GET  /api/comments  - Obtener comentarios');
  console.log('   POST /api/comments  - Crear comentario');
  console.log('🚀 =================================');
});