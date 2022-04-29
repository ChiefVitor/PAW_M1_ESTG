const mongoose = require('mongoose');

const livrosSchema = new mongoose.Schema({

    Nome:{
        type:String,
        require:true,
    },

    Id:{
        type:Number,
        require:true
    },

    Estado:{
        type:String,
        require:true,
    },

    Autor:{
        type:String,
        require:true,
    },

    Categoria:{
        type:String,
        require:true,
    },

    Quantidade:{
        type:Number,
        require:true,
    }
});

const Livros = mongoose.model('Livro', livrosSchema, 'Livros');

module.exports = Livros;

