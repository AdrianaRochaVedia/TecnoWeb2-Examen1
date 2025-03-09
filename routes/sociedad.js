/*
    Empresa Routes
    /api/sociedad
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { isDate } = require('../helpers/isDate');

const { validarCampos } = require('../middlewares/validar-campos');

const{ validarJWT } = require('../middlewares/validar-jwt');
const { getSociedades,getSociedad, crearSociedad, actualizarSociedad, eliminarSociedad } = require('../controllers/sociedad');     

const router = Router();


// Obtener eventos
router.get('/:id', getSociedad);
// Obtener eventos
router.get('/', getSociedades);

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
    crearSociedad
);

//Actualizar empresa
router.put('/:id', actualizarSociedad);

//Borrar empresa
router.patch('/:id', eliminarSociedad);

module.exports = router;