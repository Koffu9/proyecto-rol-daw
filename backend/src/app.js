require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas (las iremos añadiendo aquí)
// app.use('/api/auth', authRoutes);

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});


//Rutas
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const campanaRoutes = require('./routes/campanaRoutes');
app.use('/api/campanas', campanaRoutes);

const personajeRoutes = require('./routes/personajeRoutes');
app.use('/api/personajes', personajeRoutes);

const tiradaRoutes = require('./routes/tiradaRoutes');
app.use('/api/tiradas', tiradaRoutes);

const path = require('path');
// Servir archivos estáticos de uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const uploadRoutes = require('./routes/uploadRoutes');
app.use('/api/upload', uploadRoutes);

const perfilRoutes = require('./routes/perfilRoutes');
app.use('/api/perfil', perfilRoutes);

module.exports = app;