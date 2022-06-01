require('dotenv').config();
const express = require('express');
const app = express();
const methodOverride = require('method-override');
const session = require('cookie-session');
const passport = require('passport');
const connectDB = require('./config/db');
const flash = require('connect-flash');

connectDB(process.env.MONGO_URI);
require('./config/passport')(passport);

app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: true,
		saveUninitialized: true,
	})
);
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use((req, res, next) => {
	res.locals.s_m = req.flash('Sucesso');
	res.locals.e_m = req.flash('Erro');
	next();
});

app.get('/', (req, res) => {
	res.redirect('/books');
});

app.use('/books', require('./routes/books'));
app.use('/users', require('./routes/users'));
app.use('/admin', require('./routes/admin'));
app.use('/staff', require('./routes/staff'));

const PORT = process.env.PORT;
const IP = process.env.IP;
app.listen(PORT, IP, () => {
	console.log(`Listening in: ${IP}:${PORT}`);
});
