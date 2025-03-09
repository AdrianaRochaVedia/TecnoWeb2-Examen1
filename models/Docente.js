const Usuario = require('./Usuario');
const { Schema, model } = require('mongoose');

const DocenteSchema = Schema({
        usuario: {
           type: Schema.Types.ObjectId,
            ref: 'Usuario',
            required: true 
        },
       imagen: {
        type: String,
        required: function() {
            return this.usuario && this.usuario.isDocente === true;
            }
        },
        socialLinks: {
        type: [String], // array de URLs
        default: []
        },
        designation: {
            type: String
        },
        state: {
            type: Boolean,
            default: true
        }
    
 });

module.exports = model('Docente', DocenteSchema);