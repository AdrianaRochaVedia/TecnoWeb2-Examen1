/*
    Empresa Routes
    /api/docente
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { isDate } = require('../helpers/isDate');

const { validarCampos } = require('../middlewares/validar-campos');

const{ validarJWT } = require('../middlewares/validar-jwt');
const { getGraduado, getGraduados, crearGraduado, actualizarGraduado, eliminarGraduado } = require('../controllers/graduado');     

const router = Router();


// Obtener eventos
router.get('/:id', getGraduado);

//Obtener docentes
router.get('/', getGraduados);


//Todas tiene que pasar por la validación del JWT
router.use(validarJWT);
//Crear un nuevo docente

router.post(
    '/', 
    [
        // Validación de nombre
        check('name', 'El nombre es obligatorio').not().isEmpty(), 

        // Validación de email
        check('email', 'El email es obligatorio y debe ser válido').isEmail(), 

        // Validación de contraseña
        check('password', 'El password es obligatorio y debe tener al menos 6 caracteres').isLength({ min: 6 }), 
        
        // Validación de imagen (según el esquema el nombre es 'imagen', no 'image')
        check('description', 'La descripcion es obligatoria y debe ser válido').not().isEmpty(),
        check('excelencia', 'La excelencia es obligatoria y debe ser un booleano').isBoolean(),
        // Validación de redes sociales (opcional, solo si es un array de URLs)
        check('socialLinks', 'El campo de redes sociales debe ser un array de URLs válidos').optional().isArray(), 
        // Llamada al middleware de validación
        check('state', 'El estado es obligatorio y debe ser un booleano').isBoolean(),
        validarCampos
    ],
    crearGraduado
);


//Actualizar empresa
router.put('/:id', actualizarGraduado);

//Borrar empresa
router.patch('/:id', eliminarGraduado);

module.exports = router;