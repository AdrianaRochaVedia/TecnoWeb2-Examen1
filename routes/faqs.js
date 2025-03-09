/*
    News Routes
    /api/faqs
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { isDate } = require('../helpers/isDate');

const { validarCampos } = require('../middlewares/validar-campos');

const{ validarJWT } = require('../middlewares/validar-jwt');
const { getFaqs, crearFaqs, actualizarFaqs, eliminarFaqs } = require('../controllers/faqs');

const router = Router();

// Obtener eventos
router.get('/', getFaqs);

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
    crearFaqs
);

//Actualizar noticia
router.put('/:id', actualizarFaqs);

//Borrar noticia
router.patch('/:id', eliminarFaqs);

module.exports = router;