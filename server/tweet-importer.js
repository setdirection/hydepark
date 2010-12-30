var sys = require('sys'),
    yql = require('yql');

new yql.exec("select * from twitter.search where q in ('from:dalmaer', 'from:bgalbs') | sort(field='created_at',descending='true')", function(response) {
    sys.puts(JSON.stringify(response.query.results));
    sys.puts("\n\n");
});

// 
// var tweetstream = require('tweetstream'),
//     sys = require('sys');
// 
// var stream = tweetstream.createTweetStream({ 
//     username:"dalmaer",
//     password:"vi!twitter",
//     follow: [users.dalmaer, users.bgalbs] //, 'setdirection']
// });
// 
// stream.addListener("tweet", function (tweet) {
//     sys.puts(sys.inspect(tweet))
// });
// 
// sys.puts("Listening to Twitter.");