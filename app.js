var express = require('express');
var app = express.createServer();

//
//  CONFIGURATION
//
app.configure(function(){
    app.use(express.methodOverride());
//    app.use(express.bodyDecoder());
    app.use(app.router);
    app.use(express.logger());
    app.use(express.staticProvider(__dirname + '/public'));

    app.set('views', __dirname + '/public');
    app.set('view options', {
        layout: false // we don't need no stinkin' layouts!
    });

    // Use EJS for now
    app.register('.html', require('ejs'));
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
    app.use(express.errorHandler());
});

//
//  ROUTES
//

app.get("/", function(req, res) {
    res.render('index.html', {
        locals: { title: 'My Site' }
    });
});

app.get("/article/:id", function(req, res) {
    res.send('no-op');
});

app.listen(3000);
