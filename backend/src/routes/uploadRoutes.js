const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const { verificarToken } = require('../middleware/authMiddleware');

// Subir una imagen
router.post('/', verificarToken, upload.single('imagen'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No se ha subido ninguna imagen' });
    
    const url = `http://localhost:3000/uploads/${req.file.filename}`;
    res.json({ url });
});

module.exports = router;