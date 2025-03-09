/*
    Rutas de Usuarios / Auth
    host + /api/auth
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { crearUsuario, loginUsuario, revalidarToken, getUsuario, getUsuarios } = require('../controllers/auth');
const { validarJWT } = require('../middlewares/validar-jwt');
const { getDocentes } = require('../controllers/docente');

const router = Router();



router.post(
    '/new', 
    [//middlewares
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe de ser de 6 caracteres').isLength({ min: 6 }),
        check('rol', 'El rol es obligatorio').not().isEmpty(),
        check('isDeleted', 'El campo isDeleted debe ser un booleano').isBoolean(),


        validarCampos
    ],
     crearUsuario 
);

router.post(
    '/',
    [//middlewares
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe de ser de 6 caracteres').isLength({ min: 6 }),
        validarCampos
    ],
     loginUsuario
);

//Revalidar token
router.get('/renew',validarJWT, revalidarToken);


// Obtener eventos
router.get('/:id', getUsuario);

//Obtener docentes
router.get('/', getUsuarios);



//Para crear un nuevo usuario post

module.exports = router;