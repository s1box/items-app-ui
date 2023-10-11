var apiConfig
var itemsRatingsServiceBaseUrl
fetch('/config').then(res => {
    res.json().then(config => {
        apiConfig = config
        itemsRatingsServiceBaseUrl = apiConfig.ITEMS_RATING_SERVICE_BASE_URL
    }).catch((error) => {
        console.log(error)
    })
}).catch((error) => {
    console.log(error)
})

// Navbar handlers

document.addEventListener('DOMContentLoaded', function() {

const getItemAvgRatingNav = document.getElementById('items-ratings-nav-get-item-avg-rating')
const getAllRatingForItemRandomItemNav = document.getElementById('items-ratings-nav-get-all-ratings-for-item')
const getRandomItemRatingNav = document.getElementById('items-ratings-nav-get-random-item-rating')
const addNewRatingForItemNav = document.getElementById('items-ratings-nav-add-new-item-rating')

const navLinks = [getItemAvgRatingNav, getAllRatingForItemRandomItemNav, getRandomItemRatingNav, addNewRatingForItemNav]

const getItemAvgRating = document.getElementById('get-item-avg-rating')
const getAllRatingForItemRandomItem = document.getElementById('get-all-ratings-for-item')
const getRandomItemRating = document.getElementById('get-random-item-rating')
const addNewRatingForItem = document.getElementById('add-new-item-rating')

const containers = [getItemAvgRating, getAllRatingForItemRandomItem, getRandomItemRating, addNewRatingForItem]

const navLinkOnClickHandler = function(event) {
    for (const c of containers) {
        c.classList.add('d-none')
    }

    const navItem = event.target
    for (const nl of navLinks) {
        nl.classList.remove('active')
    }
    navItem.classList.add('active')

    const containerId = navItem.id.slice('items-ratings-nav-'.length)
    const container = document.getElementById(containerId)
    container.classList.remove('d-none')
}

for (const nl of navLinks) {
    nl.onclick = navLinkOnClickHandler
}

}, false)

// Button handlers

document.addEventListener('DOMContentLoaded', function() {

const getItemAvgRatingButton = document.getElementById('get-item-avg-rating-button')
getItemAvgRatingButton.onclick = async function() {
    let rendered
    try {
        const itemId = document.getElementById('get-item-avg-rating-item-id').value
        const requestUrl = itemsRatingsServiceBaseUrl + `items/${itemId}/rating`
        const response = await fetch(requestUrl, { method: 'GET' })
        const itemAvgRating = await response.json()
        if (response.status !== 200 || itemAvgRating.message) {
            rendered = Mustache.render(errorTemplate, { error: itemAvgRating.message })
        } else {
            rendered = Mustache.render(singleItemAvgRatingTableTemplate, { item: itemAvgRating })
        }
    } catch (e) {
        rendered = Mustache.render(errorTemplate, { error: e })
    }
    const resultElement = document.getElementById('get-item-avg-rating-result')
    resultElement.innerHTML = rendered
}

const getAllRatingsForItemButton = document.getElementById('get-all-ratings-for-item-button')
getAllRatingsForItemButton.onclick = async function() {
    let rendered
    try {
        const itemId = document.getElementById('get-all-ratings-for-item-item-id').value
        const requestUrl = itemsRatingsServiceBaseUrl + `items/${itemId}/ratings`
        const response = await fetch(requestUrl, { method: 'GET' })
        const itemRatings = await response.json()
        if (response.status !== 200 || itemRatings.message) {
            rendered = Mustache.render(errorTemplate, { error: itemRatings.message })
        } else {
            rendered = Mustache.render(itemAllRatingsTableTemplate, { item: itemRatings })
        }
    } catch (e) {
        rendered = Mustache.render(errorTemplate, { error: e })
    }
    const resultElement = document.getElementById('get-all-ratings-for-item-result')
    resultElement.innerHTML = rendered
}

const getRandomRatingButton = document.getElementById('get-random-item-rating-button')
getRandomRatingButton.onclick = async function() {
    let rendered
    try {
        const requestUrl = itemsRatingsServiceBaseUrl + 'items/random/rating'
        const response = await fetch(requestUrl, { method: 'GET' })
        const randomRating = await response.json()
        if (response.status !== 200 || randomRating.message) {
            rendered = Mustache.render(errorTemplate, { error: randomRating.message })
        } else {
            rendered = Mustache.render(randomRatingTableTemplate, { item_id: randomRating.item_id, rating: randomRating.rating })
        }
    } catch (e) {
        rendered = Mustache.render(errorTemplate, { error: e })
    }
    const resultElement = document.getElementById('get-random-item-rating-result')
    resultElement.innerHTML = rendered
}

const AddNewItemRatingButton = document.getElementById('add-new-item-rating-button')
AddNewItemRatingButton.onclick = async function() {
    let rendered
    try {
        const itemId = document.getElementById('add-new-item-rating-item-id').value
        const itemRating = document.getElementById('add-new-item-rating-rating').value
        const requestUrl = itemsRatingsServiceBaseUrl + `items/${itemId}/rating`
        const response = await fetch(requestUrl, {
            method: 'POST',
            body: JSON.stringify({rating: new Number(itemRating)}),
        })
        if (response.status !== 201) {
            const newRatingInfo = await response.json()
            if (newRatingInfo.message) {
                rendered = Mustache.render(errorTemplate, { error: newRatingInfo.message })
            }
        } else {
            template = '<div class="alert alert-success" role="alert">Added Rating {{itemRating}} for Item with ID {{itemId}}</div>'
            rendered = Mustache.render(template, { itemId, itemRating })
        }
    } catch (e) {
        rendered = Mustache.render(errorTemplate, { error: e })
    }
    const resultElement = document.getElementById('add-new-item-rating-result')
    resultElement.innerHTML = rendered
}

}, false)

// Templates

const singleItemAvgRatingTableTemplate = `
<table class="table">
  <thead>
    <tr><th>Item ID</th><th>Name</th><th>Rating</th></tr>
  </thead>
  <tbody>
    <tr><td>{{item.item_id}}</td><td>{{item.item_name}}</td><td>{{item.avg_rating}}</td></tr>
  </tbody>
</table>
`

const itemAllRatingsTableTemplate = `
<table class="table">
  <thead>
    <tr><th>Item ID</th><th>Name</th><th>Rating</th></tr>
  </thead>
  <tbody>
    {{#item.ratings}}
    <tr><td>{{item.item_id}}</td><td>{{item.item_name}}</td><td>{{.}}</td></tr>
    {{/item.ratings}}
  </tbody>
</table>
`

const randomRatingTableTemplate = `
<table class="table">
  <thead>
    <tr><th>Item ID</th><th>Rating</th></tr>
  </thead>
  <tbody>
    <tr><td>{{item_id}}</td><td>{{rating}}</td></tr>
  </tbody>
</table>
`

const errorTemplate = '<div class="alert alert-danger" role="alert">{{error}}</div>'