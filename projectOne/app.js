var fs = require('fs');

var express = require('express');
var app = express();
app.use(express.static(__dirname + '/image'));

var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('./wiki.db');

var morgan = require('morgan');
app.use(morgan('dev'));

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: false
}));
var mustache = require('mustache');

var methodOverride = require('method-override');
app.use(methodOverride('_method'));

var marked = require('marked');



//Main Page//
app.get('/', function(req, res) {
    res.send(fs.readFileSync('./html/index.html', 'utf8'));
});

//Compose a blog//
app.get('/compose', function(req, res) {
    res.send(fs.readFileSync('./html/compose.html', 'utf8'))
});

app.post('/compose/new', function(req, res) {
    console.log(req.body);

    db.run("INSERT INTO blog (author, authorID, date, category, title, content, image) VALUES ('" + req.body.author + "','" + req.body.authorID + "', datetime('now','localtime'),'" + req.body.category + "','" + req.body.title + "','" + marked(req.body.content.replace(/'/g, "''"))+ "','" + req.body.image + "')");
    res.redirect('/');
});

//Display All the blogs  //
app.get('/selectAll', function(req, res) {
    var selectData = fs.readFileSync('./html/ListAll.html', 'utf8');

    db.all('SELECT * FROM blog;', function(err, blog) {
        var html = mustache.render(selectData, {
            allBlogs: blog
        });
        res.send(html)
    })
})


//Edit page from SelectALL//
app.get('/select/:id', function(req, res) {
    var id = req.params.id;
    db.all("SELECT * FROM blog WHERE id = " + id + ";", {}, function(err, blog) {
        fs.readFile('./html/search.html', 'utf8', function(err, html) {
            console.log(blog);
            var renderedHTML = mustache.render(html, blog[0]);
            res.send(renderedHTML);
        });
    });
});

//edit article via selectAll//
app.put('/select/:id', function(req, res) {
    var id = req.params.id;
    var contentInfo = req.body;
    db.run("UPDATE blog SET  content =  '" + marked(contentInfo.content.replace(/'/g, "''")) + "', editName = '" + contentInfo.editName + "', editDate = datetime('now', 'localtime')  WHERE id = " + id + ";");
    res.redirect('/selectAll');
});


//Search Blogs//
app.get('/search', function(req, res) {
    res.send(fs.readFileSync('./html/searchtemp.html', 'utf8'));
});

app.get('/search/result', function(req, res) {
    var search = req.query.search;

    db.all("SELECT " + search + ", id FROM blog;", {}, function(err, blog) {
        var data = fs.readFileSync('./html/result.html', 'utf8')
        console.log(blog)
        var html = mustache.render(data, {
            searchResult: blog
        });
        res.send(html)
    })
});


app.get('/search/result/:id', function(req, res) {
    var id = req.params.id

    db.all("SELECT * FROM blog WHERE id = " + id + ";", {}, function(err, blog) {
        fs.readFile('./html/search.html', 'utf8', function(err, html) {
            console.log(blog);
            var renderedHTML = mustache.render(html, blog[0]);
            res.send(renderedHTML);
        });
    });
});

app.put('/search/result/:id', function(req, res) {
    var id = req.params.id;
    var contentInfo = req.body;
    db.run("UPDATE blog SET  content =  '" + marked(contentInfo.content.replace(/'/g, "''")) + "', editName = '" + contentInfo.editName + "', editDate = datetime('now', 'localtime')  WHERE id = " + id + ";");
    res.redirect('/selectAll');
});
app.listen(3000, function() {
    console.log("Yooo LISTENING!");
});



//req.body.content.replace(/'/g, "''")
// app.delete('/select/:id', function(req, res) {
//     var id = req.params.id;
//     db.run("DELETE FROM blogs WHERE id = " + id + ";");
//     res.redirect("/selectAll");
// });