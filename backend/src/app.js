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

module.exports = app;