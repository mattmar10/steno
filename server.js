// modules =================================================
var express = require('express');
var app     = express();
var mongoose = require('mongoose');
var fs = require('fs');

// configuration ===========================================
    
// config files
//var db = require('./config/db');

//var port = process.env.PORT || 8080; // set our port
// mongoose.connect(db.url); // connect to our mongoDB database (commented out after you enter in your own credentials)

// Initializing system variables 
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var config = require('./config/config'),
mongoose = require('mongoose');

var port = process.env.PORT || 8080; // set our port
// Bootstrap db connection
var db = mongoose.connect(config.db);
var connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'connection error'));
connection.once('open', function callback(){
    console.log('whosgoing db open');
});

// Bootstrap models
var models_path = __dirname + '/app/models';
var walk = function(path) {
    fs.readdirSync(path).forEach(function(file) {
        var newPath = path + '/' + file;
        var stat = fs.statSync(newPath);
        if (stat.isFile()) {
            if (/(.*)\.(js$|coffee$)/.test(file)) {
                require(newPath);
            }
        } else if (stat.isDirectory()) {
            walk(newPath);
        }
    });
};
walk(models_path);

app.configure(function() {
    app.use(express.static(__dirname + '/public'));     // set the static files location /public/img will be /img for users
    app.use(express.logger('dev'));                     // log every request to the console
    app.use(express.bodyParser());                      // pull information from html in POST
    app.use(express.methodOverride());                  // simulate DELETE and PUT
});

// routes ==================================================
require('./app/routes/routes.js')(app); // pass our application into our routes

// start app ===============================================
app.listen(port);   
console.log('Magic happens on port ' + port);           // shoutout to the user
exports = module.exports = app;                         // expose app