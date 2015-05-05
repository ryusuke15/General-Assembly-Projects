console.log('linked');
//Select Body
var $body = $('body');

//Delete Homepage Content
function $deleteHome() {
    $('.home-page').empty()
};


//Select Menu Bars
var $home = $("[class='active item']");
var $restaurants = $("[id='restaurants']");
var $setting = $("[id='settings']")
var $about = $("[id='about']");

// var $MenuShow = $("[class ='ui blue button']");
$home.on('click', function() {
    console.log('click');
    $.ajax({
        url: 'index.html',
        type: 'GET'
    }).done(function(data) {
        $body.empty();
        $body.append(data);
    })
});


////Display All Restaurants Button
$restaurants.on('click', function() {
    $.ajax({
        url: 'restaurants',
        type: 'GET'

    }).done(function(data) {
        $deleteHome();
        for (var i = 0; i < data.length; i++) {
            var $show = $("[id ='ShowAll']").text();
            var restaurantObject = {
                name: data[i].name,
                image: data[i].image_url,
                cuisine: data[i].cuisine,
                location: data[i].location,
                id: data[i].id

            };
            
            var rendered = Mustache.render($show, restaurantObject)
            $body.append(rendered);
            
            ///MenuButton

            var MenuShow = $("[class ='ui blue button']");
            MenuShow.on('click',  function() {
                console.log("yes");

                var $selectId = $("[class ='chill']");
                
                var id = $selectId.attr('data-id');
                console.log(id);
                var $display = $("[id ='showMenu']").text();
                
                $.ajax({
                url: "/items/",
                type: 'GET'

                }).done(function(data) {
                
                for (var i = 0; i < data.length; i++) {
                var itemObject = {
                name: data[i].name,
                image: data[i].image_url,
                price: data[i].price,
                order: data[i].order_count
                    };
                var rendered = Mustache.render($display, itemObject)
                
                $body.append(rendered);
                

                var createButton = $("[id='createMenu']");
                
                createButton.on('click', function(){
                    console.log('click');
                    var $newMenu = $("[id ='addMenu']").text();
                    $body.append($newMenu)

                })
                }
                
            })
            })
        }
    })
})




$setting.on('click', function() {
    $.ajax({
        url: 'index.html',
        type: 'GET'
    }).done(function(data) {
        $deleteHome();
        var $addButton = $("[id ='menu']");
        var $update_page = $("[id ='update']").text();
        $body.append($update_page);




    })
});



$about.on('click', function() {
    $.ajax({
        url: 'index.html',
        type: 'GET'
    }).done(function(data) {
        $deleteHome();
        var $author_page = $("[id ='author']").text();
        $body.append($author_page);
    })
});

