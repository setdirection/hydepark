var sys = require('sys'),
    yql = require('yql'),
    request = require('request'),
    h = {accept:'application/json', 'content-type':'application/json'},
    DB_URL = "http://localhost:5984/setdirection_blog/",
    POSTS_VIEW_URL = DB_URL + "_design/posts/_view/";

///blog/_design/docs/_view/by_date?key="2009/01/30 18:04:11"
//http://localhost:5984/setdirection_blog/_design/posts/_view/by_id?key=%22set-direction-launches%22


new yql.exec("select * from twitter.search where q in ('from:dalmaer', 'from:bgalbs') | sort(field='created_at',descending='true')", function (response) {
    response.query.results.results.forEach(function(tweet) {
        if (tweetIsNotAlreadyInDb(tweet)) {
            tweet.type = "tweet"; // tag is as a tweet
            storeTweet(tweet);
        }
        sys.puts(JSON.stringify(tweet));
        sys.puts(url_for_tweet_id(tweet.id));
    });
});

var tweetIsNotAlreadyInDb = function(tweet) {
    request({uri:url_for_tweet_id(tweet.id) + '"', headers:h}, function (err, response, body) {
      sys.puts(sys.inspect(JSON.parse(body)));
    });

    return true;
}

var storeTweet = function(tweet) {
    sys.puts("storing tweet");
}

var url_for_tweet_id = function(key) {
    return POSTS_VIEW_URL + "by_tweet_id" + ((key !== undefined) ? '?key="' + key + '"': "");
}

var url_for_blog_id = function(key) {
    return POSTS_VIEW_URL + "by_blog_id" + ((key !== undefined) ? '?key="' + key + '"': "");
}

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