var fs = require('fs');

var express = require('express');
var app = express();
// app.use(express.static(__dirname + '/public/'));
app.use("/public", express.static(__dirname + '/public'))



var morgan = require('morgan');
app.use(morgan('dev'));

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: false
}));


var methodOverride = require('method-override');
app.use(methodOverride('_method'));





//Main Page//
app.get('/index', function(req, res) {
    res.send(fs.readFileSync('./index.html', 'utf8'));
});

app.listen(3000, function() {
    console.log("Yooo LISTENING!");
});