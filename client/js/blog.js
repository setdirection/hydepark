// the API to get blog content
var blog = (function() {

    // -- mock data
    var data = [
        {
            id: 'set-direction-launches',
            title: 'Set Direction Launches Awesome Blog',
            author: 'Ben Galbraith',
            pubDate: 'Wed, 17 Nov 2010 19:56:31 +0000',
            tags: ['announcement'],
            description: 'Yay, Set Direction launched! It is so cool!'
        }, {
            id: 'ajax-now-html5',
            title: 'Ajax is now HTML5',
            author: 'Dion Almaer',
            pubDate: 'Wed, 18 Nov 2010 19:56:31 +0000',
            tags: ['announcement', 'ajax', 'html5'],
            description: 'Yup, it changed.'
        }
    ];

    var byid = {};

    // munge data to create lookup table
    for (var i in data) {
        var item = data[i];
        if (item.id) {
            byid[item.id] = item;
        }
    }

    // -- the interface itself
    return {
        // opts = { count: x, offset: y }
        posts: function(opts) {
            return data;
        },
    
        post: function(id) {
            return byid[id];
        }
    }
})();
