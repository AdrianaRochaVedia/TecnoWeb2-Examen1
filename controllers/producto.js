const { response } = require('express');
const Producto = require('../models/Producto');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// Función para validar el formato de un ID de MongoDB
const esObjectIdValido = (id) => mongoose.Types.ObjectId.isValid(id);

// Obtener todos los docentes
// Obtener todos los productos activos
const getProductos = async (req, res = response) => {
    try {
        // Consulta todos los centros no eliminados
        const productos = await Producto.find({ isDeleted: false }); 

        if (!productos || productos.length === 0) {
            return res.status(404).json({
                ok: false,
                msg: 'No se encontraron productos'
            });
        }

        res.json({
            ok: true,
            productos
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al obtener los productos'
        });
    }
};


// Obtener un producto por ID
const getProducto = async (req, res = response) => {
    const { id } = req.params; 

    try {
        const producto= await Producto.findById(id); 

        if (!producto) {
            return res.status(404).json({
                ok: false,
                msg: 'Producto no encontrado'
            });
        }

        res.json({
            ok: true,
            producto
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al obtener el producto'
        });
    }
};

// Crear un nuevo producto
const crearProducto = async (req, res = response) => {
    const { nombre, precio, categoria } = req.body;

    try {
        // Crear el producto
        const nuevoProducto = new Producto({
            nombre,
            precio,
            categoria
        });
        
        console.log(nuevoProducto);
        await nuevoProducto.save();

        res.status(201).json({
            ok: true,
            producto: nuevoProducto
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al crear el producto'
        });
    }
};

// Actualizar un producto
const actualizarProducto = async (req, res = response) => {
    const { id } = req.params; 

    try {
        // Buscar el producto por ID
        const producto = await Producto.findById(id);

        if (!producto) {
            return res.status(404).json({
                ok: false,
                msg: 'Producto no encontrado'
            });
        }

        // Actualizar el producto
        const nuevosDatos = { ...req.body };
        const productoActualizado = await Producto.findByIdAndUpdate(id, nuevosDatos, { new: true });

        res.json({
            ok: true,
            producto: productoActualizado
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al actualizar el producto'
        });
    }
};

// Eliminación lógica de un producto
const eliminarProducto = async (req, res = response) => {
    const { id } = req.params; // ID del producto a eliminar

    try {
        // Buscar el centro por ID
        const producto = await Producto.findById(id);

        if (!producto) {
            return res.status(404).json({
                ok: false,
                msg: 'Producto no encontrado'
            });
        }

        // Realizar la eliminación lógica
        producto.isDeleted = true;
        await producto.save();

        res.json({
            ok: true,
            msg: 'Producto eliminado lógicamente',
            producto
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al eliminar el producto'
        });
    }
};

// Eliminación lógica de un producto
// Eliminación física de un producto

const eliminarProductoFisico = async (req, res = response) => {
    const { id } = req.params; // ID del producto a eliminar

    try {
        // Buscar el centro por ID
        const producto = await Producto.findById(id);

        if (!producto) {
            return res.status(404).json({
                ok: false,
                msg: 'Producto no encontrado'
            });
        }

        // Realizar la eliminación física
        await Producto.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'Producto eliminado físicamente',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al eliminar el producto'
        });
    }
};
module.exports = {
    getProducto,
    getProductos,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    eliminarProductoFisico
};
