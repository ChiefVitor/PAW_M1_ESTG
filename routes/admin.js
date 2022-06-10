const express = require('express');
const router = express.Router();
const VerificarAutorizacao = require('../middleware/VerificarAutorizacao');
const User = require('../models/User');
const Book = require('../models/Book');
const Order = require('../models/Order');


router.get('/', VerificarAutorizacao, async (req, res) => {
    const books = await Book.find();
    const users = await User.find();
    const orders = await Order.find().sort({ createdAt: -1 }).populate("user").populate("details.book").exec();
    //console.log(orders);
    res.render('admin/dashboard', { admin: req.user, books, users, orders });
});


router.delete('/delete/user/:id', VerificarAutorizacao, async (req, res) => {
    //console.log(req.params.id)
    await Order.deleteMany({ user: req.params.id })
    await User.findByIdAndDelete(req.params.id);
    res.redirect('/admin');
});

router.get('/edit/user/:id', VerificarAutorizacao ,async (req, res)=>{
    const user = await User.findById(req.params.id);
    res.render('admin/editusers', {user: user});
});

router.put('/edit/user/:id', VerificarAutorizacao ,async (req, res)=>{
    const user = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
        points: req.body.points
    };
    try{
        const updatedUser = await User.findByIdAndUpdate(req.params.id, user);
        await updatedUser.save();
        res.redirect(`/admin`);
    }catch(e){
        console.log(e);
    }
});

router.delete('/delete/order/:id', VerificarAutorizacao, async (req, res) => {
    await Order.findByIdAndDelete(req.params.id);
    res.redirect('/admin');
});

router.post('/changestatus/order/:id', VerificarAutorizacao, async (req, res) => {
    await Order.findByIdAndUpdate(req.params.id, { status: "finished" });
    res.redirect('/admin');
});

module.exports = router;