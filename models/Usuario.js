const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },

        rol: {
            type: String,
            required: true
        },

        isDeleted: {
            type: Boolean,
            default: false
        },

        isCentro: {
            type: Boolean,
            default: false
        },

        isSociedad: {
            type: Boolean,
            default: false
        },

        isDocente: {
            type: Boolean,
            default: false
        },

        isGraduado: {
            type: Boolean,
            default: false
        }
    
    });

module.exports = model('Usuario', UsuarioSchema);