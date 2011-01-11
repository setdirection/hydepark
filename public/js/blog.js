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
            content: 'And there it is: Verizon will hold a special event at New York City’s Lincoln Center (Frederick P. Rose Hall) on Jan. 11–next Tuesday. No details on its focus, but sources close to the company tell me this will indeed prove to be the long-rumored Verizon iPhone announcement. Question now is will Apple CEO Steve Jobs join Verizon President and COO Lowell McAdam onstage to make it. Remember, while there’s an enormous amount of interest in the Verizon iPhone, this really isn’t much more than a carrier announcement — for last year’s iPhone. If it were more (e.g., a hardware announcement), you can bet the event would be in Cupertino or San Francisco. Below, the event invite, which I’m posting here despite Verizon’s mandate not to. Just hope it doesn’t result in a personalized data cap. The announcement will be headlined by President and COO Lowell McAdam, but there will likely be a special guest as well. Apple CEO Steve Jobs. While the appearance isn’t 100 percent assured, sources in a position to know tell me that, barring any unforeseen circumstances, Jobs will likely join McAdam onstage in New York when he announces the addition of the iPhone to its handset lineup.'
        }, {
            id: 'css-transforms-yay',
            title: 'CSS Transforms. Yay!',
            author: 'Dion Almaer',
            pubDate: 'Wed, 18 Dec 2010 19:56:31 +0000',
            tags: ['css', 'html5'],
            excerpt: true,
            content: 'CSS transforms can be 3d-ish as well as 2d-ish.'
        }, {
            id: 'verizon-iphone',
            title: 'Verizon iPhone',
            author: 'Ben Galbraith',
            pubDate: 'Wed, 17 Nov 2010 19:56:31 +0000',
            tags: ['announcement'],
            excerpt: true,
            content: 'And there it is: Verizon will hold a special event at New York City’s Lincoln Center (Frederick P. Rose Hall) on Jan. 11–next Tuesday. No details on its focus, but sources close to the company tell me this will indeed prove to be the long-rumored Verizon iPhone announcement. Question now is will Apple CEO Steve Jobs join Verizon President and COO Lowell McAdam onstage to make it. Remember, while there’s an enormous amount of interest in the Verizon iPhone, this really isn’t much more than a carrier announcement — for last year’s iPhone. If it were more (e.g., a hardware announcement), you can bet the event would be in Cupertino or San Francisco. Below, the event invite, which I’m posting here despite Verizon’s mandate not to. Just hope it doesn’t result in a personalized data cap. The announcement will be headlined by President and COO Lowell McAdam, but there will likely be a special guest as well. Apple CEO Steve Jobs. While the appearance isn’t 100 percent assured, sources in a position to know tell me that, barring any unforeseen circumstances, Jobs will likely join McAdam onstage in New York when he announces the addition of the iPhone to its handset lineup.'
        }, {
            id: 'ajax-now-html5',
            title: 'Ajax is now HTML5',
            author: 'Dion Almaer',
            pubDate: 'Wed, 18 Nov 2010 19:56:31 +0000',
            tags: ['announcement', 'ajax', 'html5'],
            excerpt: true,
            content: 'HTML5 is the best thing that has ever happened to people who have been searching for numerals to put at the end of HTML. 5 has long been known as a holy number in obscure Southern religions around the globe, representing the convergence of syntaxtical phantasmic forces that have plagued the natural treasures of humanity since the Ancients walked our great spinning orb.'
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
                if (byid[opts.id]) {
                    postProcessToHandleExcerpts(opts, byid[opts.id]);
                } else {
                    opts.onFailure({type: "no article id", id: opts.id});
                }
            } else {
                opts.onFailure({type: "nothing given"});
            }
        }
    }
})();
