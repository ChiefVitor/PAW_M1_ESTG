if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const path = require('path');

//variavel com a importação dos modulos das rotas 
const indexRouter = require('./routes/index')
const adminRouter = require('./routes/admin')
const employeesRouter = require('./routes/employees')

//Guardar variaveis de localizações
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layouts/layout')

//Fazer uso dos layouts e da pasta public
app.use(expressLayouts)
app.use(express.static('public'))

//Conexão ao mongodb (atlas)
const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true})
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Mongoose connected.'))

//Colocar servidor a rolar
app.listen(process.env.PORT)

//Definição das rotas
app.use('/', indexRouter)
app.use('/admin', adminRouter)
app.use('/employees', employeesRouter)