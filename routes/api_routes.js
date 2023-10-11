const express = require('express')
const router = express.Router()

router.get('/config', (req, res) => {
    let itemsServiceBaseUrl
    let itemsRatingsServiceBaseUrl

    const useProxy = process.env.USE_BACKEND_PROXY
    if (useProxy && (useProxy === 'true' || useProxy === '1')) {
        itemsServiceBaseUrl = '/api/items/'
        itemsRatingsServiceBaseUrl = '/api/items-ratings/'
    } else {
        itemsServiceBaseUrl = 'http://' + process.env.ITEMS_SERVICE_HOSTNAME
        if (process.env.ITEMS_SERVICE_PORT) {
            itemsServiceBaseUrl += ':' + process.env.ITEMS_SERVICE_PORT
        }
        itemsServiceBaseUrl += '/'

        itemsRatingsServiceBaseUrl = 'http://' + process.env.ITEMS_RATING_SERVICE_HOSTNAME
        if (process.env.ITEMS_RATING_SERVICE_PORT) {
            itemsRatingsServiceBaseUrl += ':' + process.env.ITEMS_RATING_SERVICE_PORT
        }
        itemsRatingsServiceBaseUrl += '/'
    }

    res.json({
        // 'ITEMS_SERVICE_HOSTNAME': process.env.ITEMS_SERVICE_HOSTNAME,
        // 'ITEMS_SERVICE_PORT': process.env.ITEMS_SERVICE_PORT,
        'ITEMS_SERVICE_BASE_URL': itemsServiceBaseUrl,

        // 'ITEMS_RATING_SERVICE_HOSTNAME': process.env.ITEMS_RATING_SERVICE_HOSTNAME,
        // 'ITEMS_RATING_SERVICE_PORT': process.env.ITEMS_RATING_SERVICE_PORT,
        'ITEMS_RATING_SERVICE_BASE_URL': itemsRatingsServiceBaseUrl,
    })
})

module.exports = router
