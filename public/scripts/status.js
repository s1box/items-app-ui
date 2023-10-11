var apiConfig
var itemsServiceBaseUrl
var itemsRatingsServiceBaseUrl
fetch('/config').then(res => {
    res.json().then(config => {
        apiConfig = config
        itemsServiceBaseUrl = apiConfig.ITEMS_SERVICE_BASE_URL
        itemsRatingsServiceBaseUrl = apiConfig.ITEMS_RATING_SERVICE_BASE_URL
        const refreshAllButoon = document.getElementById('refresh-all-button')
        refreshAllButoon.click()
    }).catch((error) => {
        console.log(error)
    })
}).catch(error => {
    console.log(error)
})

document.addEventListener('DOMContentLoaded', function() {

const itemsSrvStatus = document.getElementById('items-srv')
const itemsRatingsSrvStatus = document.getElementById('items-ratings-srv')

const itemsSrvStatusRefreshButton = document.getElementById('items-srv-refresh-button')
const itemsRatingsSrvStatusRefreshButton = document.getElementById('items-ratings-srv-refresh-button')
const refreshAllButton = document.getElementById('refresh-all-button')

itemsSrvStatusRefreshButton.onclick = async function() {
    itemsSrvStatus.innerHTML = spinnerTemplate

    let stats = {conn: false, connMsg: '', db: false, dbMsg: ''}
    try {
        const response = await fetch(itemsServiceBaseUrl + 'status', { method: 'GET' })
        if (response.status !== 200) {
            throw new Error('Cannot reach the service: ' + response.status)
        }
        stats.conn = true
        stats.connMsg = 'OK'
        try {
            const data = await response.json()
            stats.db = data.database === 'OK'
            stats.dbMsg = data.database
        } catch (e) {
            stats.db = false
            stats.dbMsg = e
        }
    } catch (e) {
        stats.conn = false
        stats.connMsg = e
        stats.db = false
        stats.dbMsg = 'N/A'
    }

    const templateData = {
        connAttr: stats.conn ? 'text-success' : 'text-danger',
        dbAttr: stats.db ? 'text-success' : 'text-danger',
        connMsg: stats.connMsg,
        dbMsg: stats.dbMsg,
    }
    itemsSrvStatus.innerHTML = Mustache.render(itemsServiceStatsTemplate, templateData)
}

itemsRatingsSrvStatusRefreshButton.onclick = async function() {
    itemsRatingsSrvStatus.innerHTML = spinnerTemplate

    let stats = {conn: false, connMsg: '', db: false, dbMsg: '', itemsSrv: false, itemsSrvMsg: ''}
    try {
        const response = await fetch(itemsRatingsServiceBaseUrl + 'status', { method: 'GET' })
        if (response.status !== 200) {
            throw new Error('Cannot reach the service: ' + response.status)
        }
        stats.conn = true
        stats.connMsg = 'OK'
        try {
            const data = await response.json()
            stats.db = data.database === 'OK'
            stats.dbMsg = data.database
            stats.itemsSrv = data.items_service == 'OK'
            stats.itemsSrvMsg = data.items_service
        } catch (e) {
            stats.db = false
            stats.dbMsg = e
            stats.itemsSrv = false
            stats.itemsSrvMsg = 'N/A'
        }
    } catch (e) {
        stats.conn = false
        stats.connMsg = e
        stats.db = false
        stats.dbMsg = 'N/A'
        stats.itemsSrv = false
        stats.itemsSrvMsg = 'N/A'
    }

    const templateData = {
        connAttr: stats.conn ? 'text-success' : 'text-danger',
        dbAttr: stats.db ? 'text-success' : 'text-danger',
        itemsSrvAttr: stats.itemsSrv ? 'text-success' : 'text-danger',
        connMsg: stats.connMsg,
        dbMsg: stats.dbMsg,
        itemsSrvMsg: stats.itemsSrvMsg,
    }
    itemsRatingsSrvStatus.innerHTML = Mustache.render(itemsRatigsServiceStatsTemplate, templateData)
}

refreshAllButton.onclick = function() {
    itemsSrvStatusRefreshButton.click()
    itemsRatingsSrvStatusRefreshButton.click()
}

}, false)

const itemsServiceStatsTemplate = `
  <p class="{{connAttr}}">Connection to service: {{connMsg}}</p>
  <p class="{{dbAttr}}">Database connection: {{dbMsg}}</p>
`

const itemsRatigsServiceStatsTemplate = `
  <p class="{{connAttr}}">Connection to service: {{connMsg}}</p>
  <p class="{{dbAttr}}">Database connection: {{dbMsg}}</p>
  <p class="{{itemsSrvAttr}}">Items service connection: {{itemsSrvMsg}}</p>
`
const spinnerTemplate = `<div class="spinner-border" role="status"></div>`