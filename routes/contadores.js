const { Router } = require('express');
const { obtenerContadores } = require('../controllers/contadores');
const router = Router();

// Endpoint para obtener los contadores
router.get('/', obtenerContadores);

module.exports = router;
