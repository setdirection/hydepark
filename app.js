var express = require('express');
var config = require('./public/js/config');

var app = module.exports = express.createServer();

//
//  CONFIGURATION
//
app.configure(function(){
    app.use(express.methodOverride());
    app.use(express.bodyDecoder());
    app.use(app.router);
    app.use(express.logger());
    app.use(express.staticProvider(__dirname + '/public'));

    app.set('views', __dirname + '/public');
    app.set('view engine', 'mustache');
    app.set('view options', {
        layout: false // we don't need no stinkin' layouts!
    });

    // Use mustache
    app.register('.html', {
        render: function(str, options) {
            return require('mustache').to_html(str, options.locals);
        }
    });
});

app.configure('development', function() {
    config.type = 'development';
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function() {
    config.type = 'production';
    app.use(express.errorHandler());
});

//
//  ROUTES
//

app.get("/", function(req, res) {
    res.render('index.html', {
        locals: config
    });
});

app.get("/article/:id", function(req, res) {
    res.render('index.html', {
        locals: config
    });
});

//
// RUN SERVER
//  - Only listen on $ node app.js
//
if (!module.parent) {
  app.listen(Number(config.serverport));
  console.log("Express server listening on port %d", app.address().port);
}
