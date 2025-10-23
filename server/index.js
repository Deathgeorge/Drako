const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Servir archivos estáticos del frontend en producción
app.use(express.static(path.join(__dirname, '../client/build')));

// Rutas de ejemplo
app.get('/api', (req, res) => {
  res.json({ 
    message: '¡Hola desde el backend!',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/users', (req, res) => {
  const users = [
    { id: 1, name: 'Juan Pérez', email: 'juan@example.com' },
    { id: 2, name: 'María García', email: 'maria@example.com' },
    { id: 3, name: 'Carlos López', email: 'carlos@example.com' }
  ];
  res.json(users);
});

app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  
  // Simular guardado en base de datos
  console.log('Nuevo mensaje de contacto:', { name, email, message });
  
  res.json({ 
    success: true, 
    message: 'Mensaje recibido correctamente' 
  });
});

// Para todas las demás rutas, servir el frontend React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});