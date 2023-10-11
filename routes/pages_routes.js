const express = require('express')

const router = express.Router()

router.get('/', (req, res) => {
    res.redirect("/main")
})

router.get('/main', (req, res) => {
    res.render('main', {main: true})
})

router.get('/items', (req, res) => {
    res.render('items', {items: true})
})

router.get('/items-ratings', (req, res) => {
    res.render('items-ratings', {'itemsratings': true})
})

router.get('/status', (req, res) => {
    res.render('status', {status: true})
})

module.exports = router