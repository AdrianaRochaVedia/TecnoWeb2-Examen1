const Usuario = require('../models/Usuario');  // Modelo de Usuario
const Producto = require('../models/Producto');  // Modelo de Producto

// Endpoint para obtener el número total de documentos en Usuarios y Productos
const obtenerContadores = async (req, res) => {
    try {
        // Contar documentos en Usuarios y Productos
        const [usuariosCount, productosCount] = await Promise.all([
            Usuario.countDocuments({ isDeleted: false }),
            Producto.countDocuments({ isDeleted: false }),
        ]);
        
        return res.json({
            usuarios: usuariosCount,
            productos: productosCount
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al contar los documentos' });
    }
};

module.exports = { obtenerContadores };
