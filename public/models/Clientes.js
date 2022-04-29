const mongoose = require('mongoose');

const ClientesSchema = new mongoose.Schema({

    PrimeiroNome: {
        type: String,
        required: true,
    },

    SegundoNome: {
        type: String,
        required: true,
    },

    Idade: {
        type: Number,
        required: true,

    },

    Email: {
        type: String,
        required: true,
    },

    Password: {
        type: String,
        required: true,

    },

    active: {
        type: Boolean,
        default: true,

    },

    Fidelizacao: {
        type: Boolean,
        default: true,

    },

    Pontos: {
        type: Number,

    }

});

const Clientes = mongoose.model('Cliente', ClientesSchema, 'Clientes');

module.exports = Clientes;