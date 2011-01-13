//
// Seed the database with data
//


var mongo  = require('mongodb'),
    config = require('../public/js/config'),
    data   = require('./sample.blog').sampleBlog.value,
    db     = new mongo.Db('blog', new mongo.Server('localhost', mongo.Connection.DEFAULT_PORT, {}));

//console.log(data.items);

db.open(function() {
    db.collection('articles', function(err, collection) {
        collection.remove(function(){
            console.log("Removed");
        });
        
        collection.insert(data.items, function(err) {
            console.log("Inserted into DB");
        });
        // collection.count(function(err, count) { 
        //             sys.puts("There are " + count + " records."); 
        //             collection.find(function(err, cursor) { 
        //                cursor.each(function(err, item) { 
        //                   if (item != null) { 
        //                      sys.puts(" a = " + JSON.stringify(item)); 
        //                   } 
        //                   else { 
        //                      sys.puts("END!!!"); 
        //                   } 
        //                }); 
        //             }); 
        //          });
        // for (var x in collection) {
        //     sys.puts(x + ": ", collection[x]);    
        // }
    });
});

//process.exit(0);