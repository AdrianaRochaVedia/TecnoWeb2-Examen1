/*
    Empresa Routes
    /api/centro
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { isDate } = require('../helpers/isDate');

const { validarCampos } = require('../middlewares/validar-campos');

const{ validarJWT } = require('../middlewares/validar-jwt');
const { getCentros,getCentro, crearCentro, actualizarCentro, eliminarCentro } = require('../controllers/centro');     

const router = Router();


// Obtener eventos
router.get('/', getCentros);
// Obtener eventos
router.get('/:id', getCentro);

//Todas tiene que pasar por la validación del JWT
router.use(validarJWT);

//Crear un nuevo docente
router.post(
    '/', 
    [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('objetive', 'El objetivo es obligatorio').not().isEmpty(),
        check('start', 'La fecha de inicio es obligatoria y debe ser válida').isISO8601(),
        check('end', 'La fecha de fin es obligatoria y debe ser válida').isISO8601(),
        // check('image', 'La imagen es obligatoria').not().isEmpty(),
        check('socialLinks', 'El campo de redes sociales debe ser un array válido').optional().isArray(),

        validarCampos
    ],
    crearCentro
);

//Actualizar empresa
router.put('/:id', actualizarCentro);

//Borrar empresa
router.patch('/:id', eliminarCentro);

module.exports = router;