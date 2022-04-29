const mongoose = require('mongoose');

const FuncionariosSchema = new mongoose.Schema({

    FirstName:{
        type: String,
        required: true,
    },

    SecondName:{
        type:String,
        required: true,
    },

    Id:{
        type:Number,
        required:true,
    },

    Email:String,
    required:true,

    Password:{
        type:String,
        required:true,

    },

    active:{
        type:Boolean,
        default:true,

    }

});

const Funcionario = mongoose.model('Funcionario', FuncionariosSchema, 'Funcionarios');

module.exports = Funcionario;





