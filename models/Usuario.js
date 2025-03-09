const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
        nombre: {
            type: String,
            required: true
        },
        edad: {
            type: Number,
            required: true,
        },
        ocupacion: {
            type: String,
            required: true
        },

        isDeleted: {
            type: Boolean,
            default: false
        },

    });

module.exports = model('Usuario', UsuarioSchema);