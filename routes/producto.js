/*
    Empresa Routes
    /api/producto
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { isDate } = require('../helpers/isDate');

const { validarCampos } = require('../middlewares/validar-campos');

const{ validarJWT } = require('../middlewares/validar-jwt');
const { getProducto, getProductos, crearProducto, actualizarProducto, eliminarProducto, eliminarProductoFisico } = require('../controllers/producto');     

const router = Router();


// Obtener eventos
router.get('/:id', getProducto);

//Obtener docentes
router.get('/', getProductos);


//Todas tiene que pasar por la validación del JWT
// router.use(validarJWT);
//Crear un nuevo docente

router.post(
    '/', 
    [
        // Validación de nombre
        check('nombre', 'El nombre es obligatorio').not().isEmpty(), 
        check('precio', 'El precio debe ser un número flotante válido').isFloat(), 
        check('categoria', 'La categoria es obligatorio').not().isEmpty(), 
        validarCampos
    ],
    crearProducto
);


//Actualizar producto
router.put('/:id', actualizarProducto);

//Borrar producto logico
router.patch('/:id', eliminarProducto);

//Borrar producto fisico
router.delete('/:id', eliminarProductoFisico);

module.exports = router;