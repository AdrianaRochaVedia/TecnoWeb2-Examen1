const { Schema, model } = require('mongoose');

const EmpresasAliadasSchema = Schema({
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        description: {
            type: String,
            required: true
        },
        link: {
            type: String,
            required: true
        },
        state: {
            type: Boolean,
            default: true
        },
        image: {
            type: String
        }
    
    });

module.exports = model('EmpresasAliadas', EmpresasAliadasSchema);