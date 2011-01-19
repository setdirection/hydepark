//
// The API to get blog content - In Memory Mock Edition
// 
// To use: make sure that blog.js is loaded instead of blog.db.js
//
var blog = (function() {

    //
    // MOCK DATA
    //

    // Articles
    var articleData = [
        {
            id: 'set-direction-launches',
            title: 'Set Direction Launches Awesome Blog',
            author: 'Ben Galbraith',
            pubDate: 'Wed, 17 Nov 2010 19:56:31 +0000',
            tags: ['announcement'],
            excerpt: 'The world needed another blog. We needed an Ajaxian 2 for the new world, and here it is.',
            content: 'The world needed another blog. We needed an Ajaxian 2 for the new world, and here it is. Powered by node, mongo, express, mongoose, jquery, and yo momma. If it were more (e.g., a hardware announcement), you can bet the event would be in Cupertino or San Francisco. Below, the event invite, which I’m posting here despite Verizon’s mandate not to. Just hope it doesn’t result in a personalized data cap. The announcement will be headlined by President and COO Lowell McAdam, but there will likely be a special guest as well. Apple CEO Steve Jobs. While the appearance isn’t 100 percent assured, sources in a position to know tell me that, barring any unforeseen circumstances, Jobs will likely join McAdam onstage in New York when he announces the addition of the iPhone to its handset lineup.'
        }, {
            id: 'v8-fibers',
            title: 'Adding fibers to your server side v8 diet offers efficiency and clarity',
            author: 'Dion Almaer',
            pubDate: 'Tuesday, 14 Jan 2011 11:26:21 +0000',
            tags: ['v8', 'serverside'],
            excerpt: 'The <a href="http://asana.com/">Asana</a> team continue their quest to make an ergonomic, productive, and performant framework for the Web.<p>Today they <a href="http://asana.com/blog/?p=49">are discussing</a> their <a href="http://groups.google.com/group/v8cgi/browse_thread/thread/4c6ed51b4999bdf2">patch to v8cgi</a> that adds in support for their own fiber implementation.</p>',
            content: '<blockquote><p>In computer science, a fiber is a particularly lightweight thread of execution.</p><p>Like threads, fibers share address space. However, fibers use co-operative multitasking while threads use pre-emptive multitasking. Threads often depend on the kernel\'s thread scheduler to preempt a busy thread and resume another thread; fibers yield themselves to run another fiber while executing. The article on threads contains more on the distinction between threads and fibers.</p><p>Fibers describe essentially the same concept as coroutines. The distinction, if there is any, is that coroutines are a language-level construct, a form of control flow, while fibers are a systems-level construct, viewed as threads that happen not to run concurrently. Priority is contentious; fibers may be viewed as an implementation of coroutines, or as a substrate on which to implement coroutines.</p></blockquote><p>The above is taken from <a href="http://en.wikipedia.org/wiki/Fiber_(computer_science)">Wikipedia</a>, which is discussing the computer science concepts behind fibers.</p><p>Why do we bring this up? The <a href="http://asana.com/">Asana</a> team (who we <a href="http://ajaxian.com/archives/lunascript-a-new-language-and-platform-to-take-your-web-2-0-apps-to-the-moon">featured when they came out with LunaScript</a>) continue their quest to make an ergonomic, productive, and performant framework for the Web.</p><p>Today they <a href="http://asana.com/blog/?p=49">are discussing</a> their <a href="http://groups.google.com/group/v8cgi/browse_thread/thread/4c6ed51b4999bdf2">patch to v8cgi</a> that adds in support for their own fiber implementation.</p><p>It all ends up with this:</p> <blockquote><p>Few languages support fibers natively (though support was recently added to <a href="http://all-thing.net/fibers">Ruby</a>). We write most of our server code in JavaScript and run it under Google’s v8 engine, the same JS runtime that Chrome uses. Fortunately the v8 codebase is excellently structured, so we were able to add fiber support in just a few days. Our changes take the form of a patch (currently pending review) to <a href="http://code.google.com/p/v8cgi/">v8cgi</a>, a library of server-oriented extensions to v8.</p>',
        }, {
            id: 'illuminations-for-developers',
            title: 'Illuminations for Developers',
            author: 'Dion Almaer',
            pubDate: 'Tuesday, 18 Jan 2011 09:56:31 +0000',
            tags: ['tools', 'html5'],
            excerpt: '<a href="http://www.illuminations-for-developers.com/">Illuminations</a> is a new tool from Steven Roussey to help you develop web applications by making your existing tools smarter -- investing them with the knowledge of your JavaScript framework and your workflow with it.',
            content: '<a href="http://www.illuminations-for-developers.com/">Illuminations</a> is a new tool from Steven Roussey to help you develop web applications by making your existing tools smarter -- investing them with the knowledge of your JavaScript framework and your workflow with it.'
        }, {
            id: 'zombiejs',
            title: 'Zombie.js: fast, headless, full-stack testing',
            author: 'Dion Almaer',
            pubDate: 'Wednesday, 14 Jan 2011 09:56:31 +0000',
            tags: ['jquery', 'testing'],
            excerpt: 'What\'s Zombie.js? An insanely fast, headless, full-stack testing written in CoffeeScript for Node.js. Zombie.js simulates a headless browser, essentially it will load the page into memory and execute any JavaScript in an environment that approximates a modern Web browser. It lets you test applications that are heavy on client-side JavaScript (jQuery, Sammy.js, Backbone.js, etc) without running an actual browser.',
            content: 'What\'s Zombie.js? An insanely fast, headless, full-stack testing written in CoffeeScript for Node.js. Zombie.js simulates a headless browser, essentially it will load the page into memory and execute any JavaScript in an environment that approximates a modern Web browser. It lets you test applications that are heavy on client-side JavaScript (jQuery, Sammy.js, Backbone.js, etc) without running an actual browser.'
        }, {
            id: 'css-transforms-yay',
            title: 'CSS Transforms. Yay!',
            author: 'Dion Almaer',
            pubDate: 'Wed, 18 Dec 2010 19:56:31 +0000',
            tags: ['css', 'html5'],
            excerpt: 'CSS transforms can be 3d-ish as well as 2d-ish.',
            content: 'CSS transforms can be 3d-ish as well as 2d-ish. And we love the 3d-ish as the GPU gets in the mood! matrix3d(0, 0, 1) is the new zoom!'
        }, {
            id: 'verizon-iphone',
            title: 'Verizon iPhone',
            author: 'Ben Galbraith',
            pubDate: 'Wed, 17 Nov 2010 19:56:31 +0000',
            tags: ['announcement'],
            excerpt: 'And there it is: Verizon will hold a special event at New York City’s Lincoln Center.',
            content: 'And there it is: Verizon will hold a special event at New York City’s Lincoln Center (Frederick P. Rose Hall) on Jan. 11–next Tuesday. No details on its focus, but sources close to the company tell me this will indeed prove to be the long-rumored Verizon iPhone announcement. Question now is will Apple CEO Steve Jobs join Verizon President and COO Lowell McAdam onstage to make it. Remember, while there’s an enormous amount of interest in the Verizon iPhone, this really isn’t much more than a carrier announcement — for last year’s iPhone. If it were more (e.g., a hardware announcement), you can bet the event would be in Cupertino or San Francisco. Below, the event invite, which I’m posting here despite Verizon’s mandate not to. Just hope it doesn’t result in a personalized data cap. The announcement will be headlined by President and COO Lowell McAdam, but there will likely be a special guest as well. Apple CEO Steve Jobs. While the appearance isn’t 100 percent assured, sources in a position to know tell me that, barring any unforeseen circumstances, Jobs will likely join McAdam onstage in New York when he announces the addition of the iPhone to its handset lineup.'
        }, {
            id: 'ajax-now-html5',
            title: 'Ajax is now HTML5',
            lastArticle: true,
            author: 'Dion Almaer',
            pubDate: 'Wed, 18 Nov 2010 19:56:31 +0000',
            tags: ['announcement', 'ajax', 'html5'],
            excerpt: 'HTML5 is the best thing that has ever happened to people.',
            content: 'HTML5 is the best thing that has ever happened to people who have been searching for numerals to put at the end of HTML. 5 has long been known as a holy number in obscure Southern religions around the globe, representing the convergence of syntaxtical phantasmic forces that have plagued the natural treasures of humanity since the Ancients walked our great spinning orb.',
            lastArticle: true
            }
    ];

    var articleByID = {};

    // munge data to create lookup table
    for (var i in articleData) {
        var item = articleData[i];
        if (item.id) {
            articleByID[item.id] = item;
        }
    }
    
    // Firehose items
    var hoseData = [
        {
            id: 'jquery-1.5b1',
            title: '',
            excerpt: 'Been looking for the big changes in jQuery 1.5? promises (jQuery.getJSON( url ).error( errorCallback )) and subclassing <a href="http://t.co/QlvjqLY">http://t.co/QlvjqLY</a>',
            link: 'http://t.co/QlvjqLY',
            type: 'twitter',
            author: 'dalmaer'
        }, {
            id: 'rwd-html5-less',
            title: '',
            excerpt: 'Responsive Web Design with HTML5 and the Less Framework 3 <a href="http://bit.ly/eVVbA1">http://bit.ly/eVVbA1</a>',
            link: 'http://bit.ly/eVVbA1',
            type: 'twitter',
            author: 'smashingmag'
        }, {
            id: 'jquery-view',
            title: '',
            excerpt: 'Ryan Johnson has released his awesome jQuery View <a href="http://t.co/w4QlfbW">http://t.co/w4QlfbW</a> (<a href="http://t.co/D2GsOHG">http://t.co/D2GsOHG</a> great Backbone example using CoffeeScript)',
            link: 'http://t.co/w4QlfbW',
            type: 'twitter',
            author: 'dalmaer'
        }, {
            id: 'ripple-phonegap',
            title: 'Ripple',
            excerpt: "Test your Phonegap Apps inside Chrome with Ripple",
            link: 'http://bit.ly/ar4Svx',
            type: 'link'            
        }, {
            id: 'variable-size-bg',
            title: '',
            excerpt: 'Variable size background image from @jonathanstark <a href="http://jonathanstark.com/blog/2011/01/03/variable-size-background-image/">http://bit.ly/a0a9x</a>',
            link: 'http://jonathanstark.com/blog/2011/01/03/variable-size-background-image/',
            type: 'twitter',
            author: 'webdirections'
        }, {
            id: 'fb-comments-new',
            title: 'Facebook Comments Plugin',
            excerpt: "The Comments plugin enables users to easily engage and comment on your site's content — whether it's a web page, article, photo, or video.",
            link: 'http://developers.facebook.com/docs/reference/plugins/comments(new)/',
            type: 'link'            
        }, {
            id: 'iphone-may-cost-verizon-5-billion',
            title: 'Phone May Cost Verizon $5 Billion in Subsidies in First Year',
            excerpt: "Verizon Wireless, set to get Apple Inc.'s iPhone this month after four years of waiting, may spend $3 billion to $5 billion to subsidize customer purchases of the device this year, cutting into profits, analysts say.",
            link: 'http://www.businessweek.com/news/2011-01-10/iphone-may-cost-verizon-5-billion-in-subsidies-in-first-year.html',
            type: 'link',
            lastItem: true            
        }
    ];
    
    var hoseByID = {};

    // munge data to create lookup table
    for (var i in hoseByID) {
        var item = hoseByID[i];
        if (hoseByID.id) {
            hoseByID[item.id] = item;
        }
    }
    
    //
    // FUNCTIONS
    //
    
    // -- the interface itself
    return {
        // opts = { count: x, lastId: y }
        posts: function(opts) {
            // slice mode
            if (opts && (opts.count || opts.lastId)) {
                var offset = 0;
                
                if (opts.lastId) {
                    $.each(articleData, function(index, article) {
                        if (article.id == opts.lastId) {
                            offset = index + 1;
                            return false;
                        }
                    });
                }
                
                var count = opts.count || articleData.length;

                opts.onSuccess(articleData.slice(offset, (offset + count)));
            } else { // return it all
                opts.onSuccess(articleData);
            }
        },
    
        post: function(opts) {
            // check for id
            if (opts.id) {
                if (articleByID[opts.id]) {
                    opts.onSuccess(articleByID[opts.id]);
                } else {
                    opts.onFailure({type: "no article id", id: opts.id});
                }
            } else {
                opts.onFailure({type: "nothing given"});
            }
        },
        
        // opts = { count: x, offset: y }
        firehosePosts: function(opts) {
            if (opts && (opts.count || opts.lastId)) {
                var offset = 0;
                
                if (opts.lastId) {
                    $.each(hoseData, function(index, item) {
                        if (item.id == opts.lastId) {
                            offset = index + 1;
                            return false;
                        }
                    });
                }
                
                var count = opts.count || hoseData.length;

                opts.onSuccess(hoseData.slice(offset, (offset+count)));
            } else { // return it all
                opts.onSuccess(hoseData);
            }
        },
        
        firehosePost: function(opts) {
            // check for id
            if (opts.id) {
                if (hoseByID[opts.id]) {
                    opts.onSuccess(hoseByID[opts.id]);
                } else {
                    opts.onFailure({type: "no article id", id: opts.id});
                }
            } else {
                opts.onFailure({type: "nothing given"});
            }
        }
    }
})();
