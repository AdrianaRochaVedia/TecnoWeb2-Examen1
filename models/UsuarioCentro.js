const Usuario = require('./Usuario');
const { Schema, model } = require('mongoose');

const UsuarioCentroSchema = Schema({
        
        usuario: {
           type: Schema.Types.ObjectId,
            ref: 'Usuario',
            required: true 
        },
        role: {
            type: String, // Rol del usuario en la sociedad
            required: true
        },
        socialLinks: {
            type: [String], // Links de redes sociales del usuario
            default: []
        },
        idcentro: {
            type: String
        },
        photo: {
            type: String, // URL de la foto del usuario
        },
        state: {
            type: Boolean,
            default: true
        }
    
    });
    
module.exports = model('UsuarioCentro', UsuarioCentroSchema);