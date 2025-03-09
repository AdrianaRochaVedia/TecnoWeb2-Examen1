const Usuario = require('./Usuario');
const { Schema, model } = require('mongoose');

const CentroSchema = Schema({
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

        // members: [{
        //     user: {
        //         type: Schema.Types.ObjectId,
        //         ref: 'Usuario',
        //         required: true
        //     },
        //     role: {
        //         type: String, // Rol del usuario en la sociedad
        //         required: true
        //     },
        //     socialLinks: {
        //         type: [String], // Links de redes sociales del usuario
        //         default: []
        //     },
        //     photo: {
        //     type: String, // URL de la foto del usuario
        //     required: true
        //     }
        // }]
    
    });
    
module.exports = model('Centro', CentroSchema);