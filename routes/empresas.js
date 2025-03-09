/*
    Empresa Routes
    /api/empresas
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { isDate } = require('../helpers/isDate');

const { validarCampos } = require('../middlewares/validar-campos');

const{ validarJWT } = require('../middlewares/validar-jwt');
const { getEmpresa, crearEmpresa, actualizarEmpresa, eliminarEmpresa } = require('../controllers/empresas');     

const router = Router();



// Obtener eventos
router.get('/', getEmpresa);

//Todas tiene que pasar por la validación del JWT
router.use(validarJWT);

//Crear un nuevo evento
router.post(
    '/', 
    [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        // check ('description', 'La descripcion es obligatoria').not().isEmpty(),
        // check('link', 'El link es obligatorio').isURL(),
        // check('image', 'La imagen es obligatoria').not().isEmpty(),

        validarCampos
    ],
    crearEmpresa
);

//Actualizar empresa
router.put('/:id', actualizarEmpresa);

//Borrar empresa
router.patch('/:id', eliminarEmpresa);

module.exports = router;