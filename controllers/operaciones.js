// controllers/operaciones.js
const { getOperacionesCount } = require('../middlewares/operaciones');

const obtenerOperaciones = (req, res) => {
    const contador = getOperacionesCount();
    console.log(`Operación número actual: ${contador}`);
    res.json({ operaciones: contador });
};

module.exports = { obtenerOperaciones };