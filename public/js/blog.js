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
            excerpt: true,
            content: 'Yay, Set Direction launched! It is so cool!'
        }, {
            id: 'ajax-now-html5',
            title: 'Ajax is now HTML5',
            author: 'Dion Almaer',
            pubDate: 'Wed, 18 Nov 2010 19:56:31 +0000',
            tags: ['announcement', 'ajax', 'html5'],
            excerpt: true,
            content: 'Yup, it changed.'
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
    
    function postProcessToHandleExcerpts(opts, data) {
        $.each(data, function(index, datum) {
            if (opts.fullStory) {
                datum.excerpt = false;
            }
        });
        opts.onSuccess(data);
    }

    // -- the interface itself
    return {
        // opts = { count: x, offset: y }
        posts: function(opts) {
            // slice mode
            if (opts && (opts.count || opts.offset)) {
                var offset = opts.offset || 0;
                var count = opts.count || data.length;

                postProcessToHandleExcerpts(opts, data.slice(offset, (offset+count)));
                //opts.onSuccess(data.slice(offset, (offset+count)));
            } else { // return it all
                postProcessToHandleExcerpts(opts, data);
                //opts.onSuccess(data);
            }
        },
    
        post: function(opts) {
            // check for id
            if (opts.id) {
                postProcessToHandleExcerpts(opts, byid[opts.id]);
                //opts.onSuccess(byid[opts.id]);
            } else {
                opts.onFailure();
            }
        }
    }
})();
