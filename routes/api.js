const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const Comment = require('../models/Comment');
var cors = require('cors');
const VerificarAutorizacao = require('../middleware/VerificarAutorizacao');
const Order = require('../models/Order');
const User = require('../models/User');
const { response } = require('express');
const checkCommentOwnerShip = require('../middleware/checkCommentOwnerShip');
const { deleteMany } = require('../models/Book');

// ver todos os livros
router.get('/', cors(), async (req, res) => {
    try{
    const books = await Book.find({});
    const data = ({books:books})
    JSON.stringify(data);
    res.send(data);
    }
    catch{
        res.sendStatus(404);
    }
});

//ver livro por id
router.get('/view/:id',cors(), async (req, res) => {
    try{
    const book = await Book.findById(req.params.id);
   const data = ({book : book});
   JSON.stringify(data);
   res.send(data);
    }
    catch(e){
        res.sendStatus(404);
    }
});

//Edita livro com o ID existente
router.post('/editarbook/:id',cors(), async (req, res) => {
    const book = {
        title: req.body.title,
        image: req.body.image,
        description: req.body.description,
        price: req.body.price,
        stock: req.body.stock,
        category: req.body.category,
        isbn : req.body.isbn,
        year: req.body.year,
        writer: req.body.writer
    };
    
        const updatedBook = await Book.findByIdAndUpdate(req.params.id,book);
        await updatedBook.save();
       const data = (`${updatedBook.id}`);
       JSON.stringify(data);
       res.send(data);
    
    
});

//Novo livro , cria ID para o livro e retorna o ID criado
router.post('/new',cors(), async (req, res) => {
    const book = {
        title: req.body.title,
        image: req.body.image,
        description: req.body.description,
        price: parseFloat(req.body.price),
        stock: req.body.stock,
        category: req.body.category,
        isbn : req.body.isbn,
        year: req.body.year,
        writer: req.body.writer
    };
    try{
        const newBook = new Book(book);
        await newBook.save();
       const data = (`${newBook._id}`,{book:book})
      /* JSON.stringify(data);
       res.send(data);
       res.sendStatus(200);
    */
        res.sendStatus(200);
    }
    catch(e){
        res.sendStatus(400);

    }
});

//Ver compras de um user
router.get('/orders/:user',cors(), async (req, res) => {
    try{
    const user = await User.findById(req.params.user)
    const order = await Order.find(user)
    const data = (order);
    JSON.stringify(data);
    res.send(data);
    }
    catch(e){
        res.sendStatus(404)
    }
    
});



module.exports= router;

