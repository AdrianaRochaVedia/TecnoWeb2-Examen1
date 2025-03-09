const Usuario = require('./Usuario');
const { Schema, model } = require('mongoose');

const SociedadSchema = Schema({
        name: {
            type: String,
            required: true
        },
        objetive: {
            type: String,
            required: true,
        },
        image: {
            type: String
        },
        isDeleted: {
            type: Boolean,
            default: false
        },

        start: {
        type: Date,
        required: true
        },

        end: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                return value > this.start; // La fecha de fin debe ser posterior a la de inicio
            },
            message: 'La fecha de fin debe ser posterior a la fecha de inicio.'
        }
        },
        socialLinks: {
                type: [String], // Links de redes sociales del usuario
                default: []
        }
    });
    
module.exports = model('Sociedad', SociedadSchema);