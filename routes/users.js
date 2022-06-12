const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const passport = require('passport');
const VerificarAutenticacao = require('../middleware/VerificarAutenticacao');
const Book = require('../models/Book');
const Order = require('../models/Order');
const moment = require('moment');
const Used = require('../models/Used');


// Get Rota Para Registo
router.get('/register', (req, res) => {
	if (req.isAuthenticated()) {
		res.redirect('/books');
	} else {
		res.render('users/register');
	}
});

// Post Rota Para Registo de Utilizador
router.post('/register', async (req, res) => {

	const foundDuplicate = async (email) => {
		try {
			const duplicate = await User.findOne({ email: email });
			if (duplicate) return true;
			return false;
		} catch (e) {
			console.log(e);
			return false;
		}
	};
	const errors = [];
	const nameRagex = /^[a-zA-Z ]*$/;
	const emailRagex =
		/^[a-zA-Z0-9\-_]+(\.[a-zA-Z0-9\-_]+)*@[a-z0-9]+(\-[a-z0-9]+)*(\.[a-z0-9]+(\-[a-z0-9]+)*)*\.[a-z]{2,4}$/;
	const newUser = {
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
	};
	if (!nameRagex.test(newUser.name)) {
		errors.push({
			msg: `Nome não pode conter números e carateres especiais.`,
		});
	}
	if (!emailRagex.test(newUser.email)) {
		errors.push({
			msg: `Email não é valido. Por favor insira um email valido.`,
		});
	}
	if (newUser.password.length < 6) {
		errors.push({
			msg: `Password deve conter 6 carateres`,
		});
	}
	if (await foundDuplicate(newUser.email)) {
		errors.push({
			msg: `Email ja se encontra registado`,
		});
	}
	if (errors.length > 0) {
		res.render('users/register', { errors: errors, newUser: newUser });
	} else {
		try {
			const hashedPassword = await bcrypt.hash(newUser.password, 10);
			try {
				const savedUser = new User({
					name: newUser.name,
					email: newUser.email,
					password: hashedPassword,
				});
				await savedUser.save();
				req.flash('sucesso', 'Esta agora Registado.');
				res.redirect('/users/login');
			} catch (e) {
				res.render('users/register', {
					errors: { msg: 'Erro de Servidor Interno' },
					newUser: newUser,
				});
			}
		} catch (e) {
			res.render('users/register', { errors: { msg: 'Erro de Servidor Interno' }, newUser: newUser });
		}
	}
});

// Rota de Logins de Utilizador
router.get('/login', (req, res) => {
	if (req.isAuthenticated()) {
		res.redirect('/books');
	} else {
		res.render('users/login');
	}
});

// Post de Logins de Utilizador
router.post(
	'/login',
	passport.authenticate('local', {
		successFlash: true,
		successRedirect: '/books',
		failureFlash: true,
		failureRedirect: '/users/login',
	}),
	(req, res) => { }
);

router.get('/logout', (req, res) => {
	req.logOut();
	res.redirect('/books');
});

// Rota do Carrinho PUT
router.put('/cart/:id', VerificarAutenticacao, async (req, res) => {
	try {
		const book = await Book.findById(req.params.id);
		const user = req.user;
		user.carts.push({ book });
		User.findByIdAndUpdate(user.id, user, (err, savedUser) => {
			if (err) {
				console.log(err);
				res.redirect('back');
			} else {
				res.redirect('/users/dashboard');
			}
		});
	} catch (e) {
		console.log(e);
		res.redirect('back');
	}
});

// Eliminar Item do carrinho
router.delete('/cart/:id/delete', VerificarAutenticacao, async (req, res) => {
	try {
		const user = await User.findById(req.user.id);
		const index = user.carts.findIndex((book) => book.equals(req.params.id));
		user.carts.splice(index, 1);
		User.findByIdAndUpdate(user.id, user, (err, savedUser) => {
			if (err) {
				console.log(err);
				res.redirect('back');
			} else {
				res.redirect('/users/dashboard');
			}
		});
	} catch (e) {
		console.log(e);
		res.redirect('back');
	}
});

// Dashboard
router.get('/dashboard', VerificarAutenticacao, async (req, res) => {

	if (req.user.role === 'admin') {
		res.redirect('/admin');
	}
	if (req.user.role === 'staff') {
		res.redirect('/staff');
	}

	const orders = await Order.find({ user: req.user })
		.sort({ createdAt: -1 })
		.populate('details.book')
		.exec();

		const used = await Used.find({ user: req.user })
		.sort({ createdAt: -1 })
		.exec();

	if (req.user.role === 'customer') {
		User.findById(req.user.id)
			.populate('carts.book')
			.exec((err, user) => {
				if (err) {
					res.redirect('/books');
				} else {
					res.render('users/dashboard', { user: user, orders: orders, used: used });
				}
			});
	}
});

router.post('/checkout', VerificarAutenticacao, async (req, res) => {

	try {
		let oldUser = req.user;

		oldUser.carts[oldUser.carts.length - 1].shippingmethod = req.body.shippingmethod;
		oldUser.carts[oldUser.carts.length - 1].shippingprice = 0;

		if (oldUser.carts[oldUser.carts.length - 1].shippingmethod === 'free') {
			if (oldUser.points < 5) {
				return res.redirect('back');
			}
		}

		if (oldUser.carts[oldUser.carts.length - 1].shippingmethod === 'paid') {
			oldUser.carts[oldUser.carts.length - 1].shippingprice = 5;
		}


		oldUser.carts.forEach((cartItem) => {
			cartItem.quantity = req.body[cartItem.book];
			if (cartItem.quantity > cartItem.book.stock) {
				return res.redirect('back');
			}
		});

		shippingprice = oldUser.carts[oldUser.carts.length - 1].shippingprice;
		shippingmethod = oldUser.carts[oldUser.carts.length - 1].shippingmethod;

		await User.findByIdAndUpdate(oldUser.id, oldUser);

		User.findById(oldUser.id)
			.populate('carts.book')
			.exec((err, user) => {
				if (err) {
					res.redirect('/books');
				} else {
					let total = 0;
					user.carts.forEach((cartItem) => {
						total += cartItem.quantity * cartItem.book.price;
					});
					total += shippingprice;
					res.render('users/checkout', { user, total, shippingprice });
				}
			});
	} catch (e) {
		console.log(e);
		res.redirect('back');
	}
});

router.post('/order', VerificarAutenticacao, async (req, res) => {
	User.findById(req.user.id)
		.populate('carts.book')
		.exec(async (err, user) => {
			if (err) {
				req.flash('error', 'Nao Foi possivel efetuar o pagamento');
				res.redirect('/books');
			} else {
				let total = 0;
				let shippingprice = 0;
				let shippingmethod = "";
				user.carts.forEach((cartItem) => {
					Book.findOneAndUpdate({ _id: cartItem.book.id }, { $inc: { stock: -cartItem.quantity } }, { new: true }, (err, doc) => {
						if (err) {
							console.log("Erro a remover stock de determinado livro.");
						}


						console.log(doc);
					});
					total += cartItem.quantity * cartItem.book.price;
				});



				shippingprice = user.carts[user.carts.length - 1].shippingprice
				shippingmethod = user.carts[user.carts.length - 1].shippingmethod

				total += shippingprice;

				let orderstatus = "";
				let ordertype = "";

				if (shippingmethod === 'pickup') {
					orderstatus = 'pending',
						ordertype = 'store'
				} else {
					orderstatus = 'finished',
						ordertype = 'online'
				}

				try {
					const order = new Order({
						user,
						createdAt: Date.now(),
						details: user.carts,
						amount: total,
						shippingmethod: shippingmethod,
						shippingprice: shippingprice,
						status: orderstatus,
						type: ordertype,
					});
					await order.save();
					let updatedUser = req.user;
					updatedUser.carts = [];
					await User.findByIdAndUpdate(updatedUser.id, updatedUser);
					if (shippingmethod === 'paid') {
						await User.findByIdAndUpdate(updatedUser.id, { $inc: { points: 1 } });
					}
					if (shippingmethod === 'free') {
						await User.findByIdAndUpdate(updatedUser.id, { $inc: { points: -5 } });
					}
					req.flash('sucesso', 'O seu pedido foi feito com sucesso.');
					res.redirect('/users/dashboard');
				} catch (e) {
					res.json(e);
				}
			}
		});
});

router.get('/used/add', (req, res) => {
	res.render('users/used');
});

router.post('/used/add', async (req, res) => {

	const user = await User.findById(req.user.id);

	const used = {
		user,
		title: req.body.title,
		isbn: req.body.isbn,
		price: req.body.price,
		createdAt: Date.now(),
		status: "pending"
	};
	try {
		const newUsed = new Used(used);
		await newUsed.save();
		res.redirect(`/users/dashboard`);
	} catch (e) {
		console.log(e);
		res.redirect(`/users/dashboard`);
	}
});

router.delete('/used/:id/delete', async (req, res) => {

	let usedBook = await Used.findById(req.params.id).exec()

	try {
		if (usedBook.status === "pending"){
			await Used.findByIdAndDelete(usedBook.id);
			res.redirect('/users/dashboard');
		}
	} catch (e) {
		console.log(e);
		res.redirect('/users/dashboard');
	}
});

module.exports = router;
