const { Schema, model } = require('mongoose');

const ProductoSchema = Schema({
        nombre: {
            type: String,
            required: true
        },
        precio: {
            type: Number,
            required: true,
        },
        categoria: {
            type: String,
            required: true
        },

        isDeleted: {
            type: Boolean,
            default: false
        },
    
 });

module.exports = model('Producto', ProductoSchema);