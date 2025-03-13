/*
    Rutas de Usuarios / Auth
    host + /api/usuario
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { crearUsuario, getUsuario, getUsuarios, actualizarUsuario, eliminarUsuario, eliminarUsuarioFisico } = require('../controllers/usuario');
const { validarJWT } = require('../middlewares/validar-jwt');


const router = Router();



router.post(
    '/', 
    [//middlewares
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('edad', 'La edad es obligatoria').isInt(),
        check('ocupacion', 'La ocupacion es obligatoria').not().isEmpty(),
        validarCampos
    ],
     crearUsuario 
);

// router.post(
//     '/',
//     [//middlewares
//         check('email', 'El email es obligatorio').isEmail(),
//         check('password', 'El password debe de ser de 6 caracteres').isLength({ min: 6 }),
//         validarCampos
//     ],
//      loginUsuario
// );

//Revalidar token
// router.get('/renew',validarJWT, revalidarToken);


// Obtener eventos
router.get('/:id', getUsuario);

//Obtener docentes
router.get('/', getUsuarios);

//Actualizar usuaario
router.put('/:id', actualizarUsuario);

//Borrar usuario logico
router.patch('/:id', eliminarUsuario);

//Borrar usuario fisico
router.delete('/:id', eliminarUsuarioFisico);
//Para crear un nuevo usuario post

module.exports = router;