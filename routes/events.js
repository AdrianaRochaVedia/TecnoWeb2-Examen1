/*
    Events Routes
    /api/events
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { isDate } = require('../helpers/isDate');

const { validarCampos } = require('../middlewares/validar-campos');

const{ validarJWT } = require('../middlewares/validar-jwt');
const { getEventos, getEventoPorId, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/events');     

const router = Router();



// Obtener eventos
router.get('/', getEventos);
router.get('/:id', getEventoPorId);
//Todas tiene que pasar por la validación del JWT
router.use(validarJWT);

//Crear un nuevo evento
router.post(
    '/', 
    [
        check('title', 'El título es obligatorio').not().isEmpty(),
        //Validaciones especiales
        check('start', 'Fecha de inicio es obligatoria').custom( isDate ),
        check('end', 'Fecha de finalización es obligatoria').custom( isDate ),
        validarCampos
    ],
    crearEvento
);

//Actualizar evento
router.put('/:id', actualizarEvento);

//Borrar evento
router.patch('/:id', eliminarEvento);

module.exports = router;