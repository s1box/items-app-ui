const express = require('express')
const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')

const apiRoutes = require('./routes/api_routes.js')
const pagesRoutes = require('./routes/pages_routes.js')

const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express()

app.set('views', './views')
app.set('view engine', 'mustache')
app.engine('mustache', mustacheExpress())

app.use(bodyParser.urlencoded({extended : true}))

app.use(express.static('public'))

app.use('/', apiRoutes)
app.use('/', pagesRoutes)

const itemsApiProxy = createProxyMiddleware('/api/items', {
    target: 'http://' + process.env.ITEMS_SERVICE_HOSTNAME + ':' + process.env.ITEMS_SERVICE_PORT + '/',
    changeOrigin: true,
    pathRewrite: { '^/api/items': '' },
})
app.use('/api/items', itemsApiProxy)

const itemsRatingsApiProxy = createProxyMiddleware('/api/items-ratings', {
    target: 'http://' + process.env.ITEMS_RATING_SERVICE_HOSTNAME + ':' + process.env.ITEMS_RATING_SERVICE_PORT + '/',
    changeOrigin: true,
    pathRewrite: { '^/api/items-ratings': '' },
})
app.use('/api/items-ratings', itemsRatingsApiProxy)

module.exports = app
