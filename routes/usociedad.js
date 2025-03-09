/*
    Empresa Routes
    /api/usociedad
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { isDate } = require('../helpers/isDate');

const { validarCampos } = require('../middlewares/validar-campos');

const{ validarJWT } = require('../middlewares/validar-jwt');
const { getUsuariosSociedad, getUsuarioSociedad, crearUsociedad, actualizarUsociedad, eliminarUsociedad } = require('../controllers/usuariosociedad');     

const router = Router();


// Obtener eventos
router.get('/:id', getUsuarioSociedad);

//Obtener docentes
router.get('/', getUsuariosSociedad);


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
        

        // Validación de redes sociales (opcional, solo si es un array de URLs)
        check('socialLinks', 'El campo de redes sociales debe ser un array de URLs válidos').optional().isArray(),
        validarCampos
    ],
    crearUsociedad
);


//Actualizar empresa
router.put('/:id', actualizarUsociedad);

//Borrar empresa
router.patch('/:id', eliminarUsociedad);

module.exports = router;