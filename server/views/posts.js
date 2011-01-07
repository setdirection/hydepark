{
   "_id": "_design/posts",
   "_rev": "3-bac4693d4a3613c06c021e1326c27c3e",
   "language": "javascript",
   "views": {
       "all": {
           "map": "function(doc) { emit(null, doc) }"
       },
       "by_title": {
           "map": "function(doc) { emit(doc.title, doc) }"
       },
       "by_id": {
           "map": "function(doc) { emit(doc.id, doc) }"
       },
       "by_tweet_id": {
           "map": "function(doc) { if (doc.type=='tweet') { emit(doc.id, doc) } }"
       },
       "by_blog_id": {
           "map": "function(doc) { if (doc.type=='blog') { emit(doc.id, doc) } }"
       }
   }
}