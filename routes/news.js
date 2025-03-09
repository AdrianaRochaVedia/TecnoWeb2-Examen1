/*
    News Routes
    /api/news
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { isDate } = require('../helpers/isDate');

const { validarCampos } = require('../middlewares/validar-campos');

const{ validarJWT } = require('../middlewares/validar-jwt');
const { getNoticiaPorId,getNoticias, crearNoticias, actualizarNoticia, eliminarNoticia } = require('../controllers/news');    

const router = Router();

router.get('/:id', getNoticiaPorId);

// Obtener eventos
router.get('/', getNoticias);

//Todas tiene que pasar por la validación del JWT
router.use(validarJWT);

//Crear un nuevo evento
router.post(
    '/', 
    [
        check('title', 'El título es obligatorio').not().isEmpty(),
        check('description', 'La descripción es obligatoria').not().isEmpty(),

        //Validaciones especiales
        check('start', 'Fecha de inicio es obligatoria').custom( isDate ),
        validarCampos
    ],
    crearNoticias
);

//Actualizar noticia
router.put('/:id', actualizarNoticia);

//Borrar noticia
router.patch('/:id', eliminarNoticia);

module.exports = router;