const express = require('express')
const router = express.Router()

//Admin Index page (Login page)
router.get('/', (req, res) => {
    res.render('employees/index')
})

router.get('/dash', (req, res) => {
    res.render('employees/dash')
})

/** Add new admin page
router.get('/new', (req, res) => {
    res.render('admin/new')
})
**/

/** Add new admin post
router.post('/new', (req, res) => {
    res.send('data')
})
**/

module.exports = router