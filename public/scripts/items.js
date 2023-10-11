var apiConfig
var itemsServiceBaseUrl
fetch('/config').then(res => {
    res.json().then(config => {
        apiConfig = config
        itemsServiceBaseUrl = apiConfig.ITEMS_SERVICE_BASE_URL
    }).catch((error) => {
        console.log(error)
    })
}).catch((error) => {
    console.log(error)
})

// Navbar handlers

document.addEventListener('DOMContentLoaded', function() {

const getItemByIdNav = document.getElementById('items-nav-get-item')
const getRandomItemNav = document.getElementById('items-nav-get-random-item')
const getAllItemsNav = document.getElementById('items-nav-get-all-items')
const createItemdNav = document.getElementById('items-nav-create-item')
const deleteItemByIdNav = document.getElementById('items-nav-delete-item')

const navLinks = [getItemByIdNav, getRandomItemNav, getAllItemsNav, createItemdNav, deleteItemByIdNav]

const getItemById = document.getElementById('get-item')
const getRandomItem = document.getElementById('get-random-item')
const getAllItems = document.getElementById('get-all-items')
const createItemd = document.getElementById('create-item')
const deleteItemById = document.getElementById('delete-item')

const containers = [getItemById, getRandomItem, getAllItems, createItemd, deleteItemById]

const navLinkOnClickHandler = function(event) {
    for (const c of containers) {
        c.classList.add('d-none')
    }

    const navItem = event.target
    for (const nl of navLinks) {
        nl.classList.remove('active')
    }
    navItem.classList.add('active')

    const containerId = navItem.id.slice('items-nav-'.length)
    const container = document.getElementById(containerId)
    container.classList.remove('d-none')
}

for (const nl of navLinks) {
    nl.onclick = navLinkOnClickHandler
}

}, false)

// Button handlers

document.addEventListener('DOMContentLoaded', function() {

const getItemByIdButton = document.getElementById('get-item-button')
getItemByIdButton.onclick = async function() {
    let rendered
    try {
        const itemId = document.getElementById('get-item-id').value
        const requestUrl = itemsServiceBaseUrl + 'items/' + itemId
        const response = await fetch(requestUrl, { method: 'GET' })
        const item = await response.json()
        if (response.status !== 200 || item.message) {
            rendered = Mustache.render(errorTemplate, { error: item.message })
        } else {
            rendered = Mustache.render(singleItemTableTemplate, { item })
        }
    } catch (e) {
        rendered = Mustache.render(errorTemplate, { error: e })
    }
    const resultElement = document.getElementById('get-item-result')
    resultElement.innerHTML = rendered
}

const getRandomItemButton = document.getElementById('get-random-item-button')
getRandomItemButton.onclick = async function() {
    let rendered
    try {
        const requestUrl = itemsServiceBaseUrl + 'items/random'
        const response = await fetch(requestUrl, { method: 'GET' })
        const item = await response.json()
        if (response.status !== 200 || item.message) {
            rendered = Mustache.render(errorTemplate, { error: item.message })
        } else {
            rendered = Mustache.render(singleShortItemTableTemplate, { item })
        }
    } catch (e) {
        rendered = Mustache.render(errorTemplate, { error: e })
    }
    const resultElement = document.getElementById('get-random-item-result')
    resultElement.innerHTML = rendered
}

const getAllItemsButton = document.getElementById('get-all-items-button')
getAllItemsButton.onclick = async function() {
    let rendered
    try {
        const requestUrl = itemsServiceBaseUrl + 'items'
        const response = await fetch(requestUrl, { method: 'GET' })
        const items = await response.json()
        if (response.status !== 200 || items.message) {
            rendered = Mustache.render(errorTemplate, { error: items.message })
        } else {
            rendered = Mustache.render(itemsTableTemplate, { items })
        }
    } catch (e) {
        rendered = Mustache.render(errorTemplate, { error: e })
    }
    const resultElement = document.getElementById('get-all-items-result')
    resultElement.innerHTML = rendered
}

const createItemButton = document.getElementById('create-item-button')
createItemButton.onclick = async function() {
    let rendered
    try {
        const itemName = document.getElementById('create-item-name').value
        const itemNum = document.getElementById('create-item-num').value
        const requestUrl = itemsServiceBaseUrl + 'items'
        const response = await fetch(requestUrl, {
            method: 'POST',
            body: JSON.stringify({name: itemName, num: new Number(itemNum)}),
        })
        const newItemInfo = await response.json()
        if (response.status !== 201 || newItemInfo.message) {
            rendered = Mustache.render(errorTemplate, { error: newItemInfo.message })
        } else {
            template = '<div class="alert alert-success" role="alert">Created Item with ID {{id}}</div>'
            rendered = Mustache.render(template, { id: newItemInfo.id })
        }
    } catch (e) {
        rendered = Mustache.render(errorTemplate, { error: e })
    }
    const resultElement = document.getElementById('create-item-result')
    resultElement.innerHTML = rendered
}

const deleteItemButton = document.getElementById('delete-item-button')
deleteItemButton.onclick = async function() {
    let rendered
    try {
        const itemId = document.getElementById('delete-item-id').value
        const requestUrl = itemsServiceBaseUrl + 'items/' + itemId
        const response = await fetch(requestUrl, { method: 'DELETE' })
        if (response.status !== 204) {
            if (response.status === 404) {
                rendered = Mustache.render(errorTemplate, { error: 'Item with ID ' + itemId + ' does not exist.' })
            } else {
                rendered = Mustache.render(errorTemplate, { error: 'unexpected reponse status ' + response.status })
            }
        } else {
            template = '<div class="alert alert-success" role="alert">Delete Item with ID {{id}}</div>'
            rendered = Mustache.render(template, { id: itemId })
        }
    } catch (e) {
        rendered = Mustache.render(errorTemplate, { error: e })
    }
    const resultElement = document.getElementById('delete-item-result')
    resultElement.innerHTML = rendered
}

}, false)

// Templates

const singleItemTableTemplate = `
<table class="table">
  <thead>
    <tr><th>Item ID</th><th>Name</th><th>Num</th></tr>
  </thead>
  <tbody>
    <tr><td>{{item.id}}</td><td>{{item.name}}</td><td>{{item.num}}</td></tr>
  </tbody>
</table>
`

const singleShortItemTableTemplate = `
<table class="table">
  <thead>
    <tr><th>Item ID</th><th>Name</th></tr>
  </thead>
  <tbody>
    <tr><td>{{item.id}}</td><td>{{item.name}}</td></tr>
  </tbody>
</table>
`

const itemsTableTemplate = `
<table class="table">
  <thead>
    <tr><th>Item ID</th><th>Name</th></tr>
  </thead>
  <tbody>
    {{#items}}
    <tr><td>{{id}}</td><td>{{name}}</td></tr>
    {{/items}}
  </tbody>
</table>
`

const errorTemplate = '<div class="alert alert-danger" role="alert">{{error}}</div>'