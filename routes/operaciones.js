// routes/operaciones.js
const { Router } = require('express');
const { obtenerOperaciones } = require('../controllers/operaciones');
const router = Router();

// Endpoint para obtener el número de operaciones realizadas
router.get('/', obtenerOperaciones);

module.exports = router;
