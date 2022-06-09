const express = require('express');
const router = express.Router();
const Book = require('../models/Book');


// const VerificarAutenticacao = require('../middleware/VerificarAutenticacao');
const VerificarAutorizacao = require('../middleware/VerificarAutorizacao');
const { application } = require('express');

router.get('/', async (req, res) => {

    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');

        const books = await Book.find({ title: regex });
        res.render('books/home', { books: books, user: req.user });






    } else {
        const books = await Book.find({});
        res.render('books/home', { books: books, user: req.user});
    }

});



router.get('/view/:id', (req, res) => {
    Book.findById(req.params.id).populate('comments').exec((err, book) => {
        if (err) {
            console.log(err);
            res.redirect('/books');
        } else {
            res.render('books/view', { book: book, user: req.user });
        }
    });
});

router.get('/new', VerificarAutorizacao, (req, res) => {
    res.render('books/new');
});

router.post('/new', VerificarAutorizacao, async (req, res) => {
    const book = {
        title: req.body.title,
        image: req.body.image,
        description: req.body.description,
        price: parseFloat(req.body.price),
        stock: req.body.stock,
        category: req.body.category,
    };
    try {
        const newBook = new Book(book);
        await newBook.save();
        res.redirect(`/books/view/${newBook._id}`);
    } catch (e) {
        console.log(e);
        res.render('books/new', { book: book });
    }
});

router.get('/edit/:id', VerificarAutorizacao, async (req, res) => {
    const book = await Book.findById(req.params.id);
    res.render('books/edit', { book: book });
});
router.put('/edit/:id', VerificarAutorizacao, async (req, res) => {
    const book = {
        title: req.body.title,
        image: req.body.image,
        description: req.body.description,
        price: parseFloat(req.body.price),
        stock: req.body.stock,
        category: req.body.category
    };
    try {
        const updatedBook = await Book.findByIdAndUpdate(req.params.id, book);
        await updatedBook.save();
        res.redirect(`/books/view/${updatedBook._id}`);
    } catch (e) {
        console.log(e);
        res.render('books/new', { book: book });
    }
});

router.delete('/delete/:id', VerificarAutorizacao, async (req, res) => {
    await Book.findByIdAndDelete(req.params.id);
    res.redirect('/books');
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


module.exports = router;