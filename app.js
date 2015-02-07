var itemTemplate = $('#templates .item')
var list         = $('#list')
var form         = $('#add-form')

var addItemToPage = function(itemData) {
    var item = itemTemplate.clone()
    item.attr('data-id', itemData.id)
    item.find('.description').text(itemData.description)
    if(itemData.completed) {
        item.addClass('completed')
    }

    list.append(item)

    // reset form to blank
    form.find('#create').val("")
}

var loadRequest = $.ajax({
    type: 'GET',
    url: 'https://listalous.herokuapp.com/lists/mydiemho'
})

// read data from server and populate list
loadRequest.done(function(dataFromServer) {
    var itemsData = dataFromServer.items

    itemsData.forEach(function(itemData) {
        addItemToPage(itemData)
    })
})

// add item to list when user enter on form
$('#add-form').on('submit', function(event) {
    event.preventDefault()

    var itemDescription = event.target.itemDescription.value

    var creationRequest = $.ajax({
        type: 'POST',
        url: 'https://listalous.herokuapp.com/lists/mydiemho/items',
        data: { description: itemDescription, completed: false }
    })

    creationRequest.done(function(itemDataFromServer) {
        addItemToPage(itemDataFromServer)
    })
})

// grayed-out item when user click on check
$('#list').on('click', '.complete-button', function(event) {
    event.preventDefault()

    var item = $(event.target).parent()
    var isItemCompleted = item.hasClass('completed')
    var itemId = item.attr('data-id')

    var updateRequest = $.ajax({
        type: 'PUT',
        url: 'https://listalous.herokuapp.com/lists/mydiemho/items/' + itemId,
        data: { completed: true }
    })

    updateRequest.done(function(itemDataFromServer) {
        if(itemDataFromServer.completed) {
            item.addClass('completed')
        } else {
            item.removeClass('completed')
        }
    })
})

// delete item when user click on X
$('#list').on('click', '.delete-button', function(event) {
    event.preventDefault()

    var item = $(event.target).parent()
    var itemId = item.attr('data-id')

    var deleteRequest = $.ajax({
        type: 'DELETE',
        url: 'https://listalous.herokuapp.com/lists/mydiemho/items/' + itemId
    })

    deleteRequest.done(function(itemDataFromServer) {
        list.find('[data-id=' + itemId + ']').remove()
    })
})
