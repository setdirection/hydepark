var client = (function() {
    // selector constants (S == selector, MT == mustache template)
    var S_MAIN_CONTENT = "#main-content";
    var S_STORIES_CONTENT = "#stories";
    var S_STORY_CONTENT = "#story";
    var S_FIREHOSE_CONTENT = "#items";
    var S_LOADING_INDICATOR = "#loading";
    var S_SHOW_MORE_ARTICLES = "#show-more-articles";
    var S_SHOW_MORE_FIREHOSE_ITEMS = "#show-more-firehose-items";
    var S_SMALL_STORIES_CONTENT = "#story-items";
    var S_MT_STORY = "#template-story";
    var S_MT_EXCERPT = "#template-excerpt";
    var S_MT_DETAILS = "#template-story-details";
    var S_MT_SHOW_MORE_ARTICLES = "#template-show-more-articles";
    var S_MT_SHOW_MORE_FIREHOSE_ITEMS = "#template-show-more-firehose-items";
    var S_MT_FIREHOSE_TWITTER = "#template-firehose-twitter";
    var S_MT_FIREHOSE_LINK = "#template-firehose-link";
    var S_MT_STORY_SMALL = "#template-story-small";
    
    var INITIAL_STORY_FADE_IN_DELAY = 200;
    var INITIAL_FIREHOSE_ITEM_FADE_IN_DELAY = 125;
    
    var DATA_LOADED_WITH_STORIES = false;
    
    // -- Settings and configuration
    
    // default settings values; can be overridden by the user
    var settings = {
        storiesOnHome: 10,
        firehoseItemsOnHome: 15,
        showFullStory: false
    };

    // -- Private methods

    // couldn't load story
    function displayStoryFailure(failure) {
        // will automatically hide the main stories loading indicator if shown
        var errorString;

        if (failure.type == "no article id") {
            errorString = "No article found with the id " + failure.id + ". Please try again, maybe <a href=''>do a search?</a> or <a href=''>go to the front page</a>, or <a href='javascript:history.back()'>go back to where you came from</a>."
        } else {
            errorString = "No article requested or found.";
        }
        ui.displayError(errorString);
    };
    
    function changeStateToStoryDetail(story) {
        // setup history state
        // TODO make sure the "currentState" object has info it needs to get back to onpopstate
        var htmlTitle = story.title + " on Set Direction";
        history.pushState({type: "displayStory", story: story, title: htmlTitle}, htmlTitle, "/article/" + story.id);
        document.title = htmlTitle;
        console.log("PUSH: ", {type: "displayStory", story: story, title: htmlTitle});
    };
    
    function insertCommentsViaIntenseDebate(story, content) {
        var script   = document.createElement("script");
            script.text = "var idcomments_acct = '65b747c511858417522dbbe2f72ab6ea';var idcomments_post_id = '" + story.id + "';var idcomments_post_url = 'http://setdirection.com/article/" + story.id + "';"
        document.body.appendChild(script);
        
        content.append("<span id='IDCommentsPostTitle' style='display:none'></span>");
        
        var script2   = document.createElement("script");
            script2.src = "http://www.intensedebate.com/js/genericCommentWrapperV2.js"
        document.body.appendChild(script2);        
    }
    
    function insertCommentsViaDisqus(story, content) {
        content.append('<div id="disqus_thread"></div>');
        
        var script   = document.createElement("script");
            script.text = "var disqus_shortname = 'set-direction';" +
                "var disqus_identifier = '" + story.id + "';" +
                ((config.type == "development") ? "var disqus_developer = 1;" : "") +
                "var disqus_url = 'http://setdirection.com/article/" + story.id + "';" +
                "(function() { var dsq = document.createElement('script'); dsq.async = true; dsq.src = 'http://' + disqus_shortname + '.disqus.com/embed.js';" + 
                "(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);})();";
        document.body.appendChild(script);        
    }
    
    // handle history
    // TODO: share with the URL parser
    $(window).bind("popstate", function(e) {
        console.log(e);
        var state = e.originalEvent.state;
        
        console.log("POP goes the weazle! ", state);
        console.log(location.pathname.length, location.pathname.substr(1));
        
        if (state && state.type == "displayStory" && state.story.id) {
            console.log("displayStory: ", state);
            
            //console.log(state.story.id);
            document.title = state.title;
            
            // FIXME: work out the right invocation
            client.displayStory(state.story.id, true);
        } else if (location.pathname && location.pathname.length > 1) { // location check here
            console.log("real pathname: " + location.pathname);
            
            var articleIdMatch = location.pathname.match(/\/article\/(.+)/);
            if (articleIdMatch === null) { // no article found
                displayStoryFailure({ type: "no article id", id: articleId });
            } else {
                console.log("display from home: " + articleIdMatch[1]);

                // FIXME: work out the right invocation
                client.displayStory(articleIdMatch[1], true);
            }
        } else {
            console.log("display all of them");
            document.title = config.title;

            client.displayStoriesFromAnywhere();
        }
        client.displayFirehoseItems();
    });

    // -- Public Methods
    return {
        // save the settings
        persistSettings: function() {
            // no op
        },

        // make sure that the right thing happens no matter where you are
        // TODO: bug if you haven't gone to the front page first, where it doesn't load the content when transitioning back
        displayStoriesFromAnywhere: function(opts) {
            if ($("body").hasClass("moveRight")) {
                this.displayStoriesFromStory(opts);
            } else {
                this.displayStories(opts);
            }
        },

        // performs the initial display of the stories when the site is loaded
        displayStories: function(opts) {
            opts = opts || {};
            
            // TODO: display some kind of loading indicator
            
            // if show more articles present, nuke it
            $(S_SHOW_MORE_ARTICLES).remove();
            
            // requests the posts and pass in a callback
            blog.posts({ 
                        count: settings.storiesOnHome, 
                       lastId: opts.lastId,
                    onSuccess: function(data) {
                        // TODO: remove the loading indicator
                        
                        var storiesContent = $(S_STORIES_CONTENT);
                        
                        var storyTemplate = $((settings.showFullStory) ? S_MT_STORY : S_MT_EXCERPT).html();

                        // add each story to the main page
                        var delay = 0;
                        var showMore = true;
                        var lastStory;
                        $.each(data, function(index, story) {
                            lastStory = story;
                            
                            var storyHtml = Mustache.to_html(storyTemplate, story);
                            storiesContent.append(storyHtml);
                            
                            // the templates are hidden initially to permit a nice little fade-in effect
                            var newStorySelector = "#" + story.id;
                            $(newStorySelector).delay(delay);
                            delay += INITIAL_STORY_FADE_IN_DELAY; 
                            $(newStorySelector).fadeIn();

                            if (story.lastArticle) showMore = false;
                        });
                        
                        // if there's more, show a more link at the bottom
                        if (showMore && lastStory) {
                            var showMoreTemplate = $(S_MT_SHOW_MORE_ARTICLES).html();
                            lastStory.urlId = encodeURI(lastStory.id);
                            var showMoreHtml = Mustache.to_html(showMoreTemplate, lastStory);
                            storiesContent.append(showMoreHtml);

                            $(S_SHOW_MORE_ARTICLES).delay(delay * 1.2);
                            $(S_SHOW_MORE_ARTICLES).fadeIn();
                        }
                        
                        DATA_LOADED_WITH_STORIES = true;
                    },
                    onFailure: function(errorCode) {
                        // TODO: implement the error function
                    }
            });
        },

        displayStoriesFromStory: function(opts) {
            $("body").removeClass("moveRight");
            if (!DATA_LOADED_WITH_STORIES) { // just show them!
                this.displayStories(opts);
            }
        },

        displayFirehoseItems: function(opts) {
            opts = opts || {};
            
            // TODO: show loading indicator
            
            // if show more articles present, nuke it
            $(S_SHOW_MORE_FIREHOSE_ITEMS).remove();
            
            // requests the posts and pass in a callback
            blog.firehosePosts({ 
                        count: settings.firehoseItemsOnHome, 
                       lastId: opts.lastId,
                    onSuccess: function(data) {
                        // TODO: remove the loading indicator
                        
                        var firehoseContent = $(S_FIREHOSE_CONTENT);

                        // if there are no stories present, nuke any existing content
                        // NOTE: commented out to support showing more articles                        
                        // mainContent.empty();
                        
                        var twitterTemplate = $(S_MT_FIREHOSE_TWITTER).html();
                        var linkTemplate = $(S_MT_FIREHOSE_LINK).html();

                        // add each story to the main page
                        var delay = 0;
                        var showMore = true;
                        var lastItem;
                        $.each(data, function(index, item) {
                            lastItem = item;

                            var template;
                            switch (item.type) {
                                case "twitter":
                                    template = twitterTemplate;
                                    break;
                                case "link":
                                    template = linkTemplate;
                                    break;
                                default:
                                    template = undefined;
                            }
                            
                            if (!template) {
                                // TODO: make sure console is always around
                                console.warn("Firehose item type '" + item.type + "' unsupported (id: " + item.id + ")");
                                return true;
                            }
                            
                            var itemHtml = Mustache.to_html(template, item);
                            firehoseContent.append(itemHtml);
                            
                            // the templates are hidden initially to permit a nice little fade-in effect
                            var newItemSelector = "#" + item.id;
                            $(newItemSelector).delay(delay);
                            delay += INITIAL_FIREHOSE_ITEM_FADE_IN_DELAY; 
                            $(newItemSelector).fadeIn();

                            if (item.lastItem) showMore = false;
                        });
                        
                        if (showMore && lastItem) {
                            var showMoreTemplate = $(S_MT_SHOW_MORE_FIREHOSE_ITEMS).html();
                            lastItem.urlId = encodeURI(lastItem.id);
                            var showMoreHtml = Mustache.to_html(showMoreTemplate, lastItem);
                            firehoseContent.append(showMoreHtml);
                        
                            $(S_SHOW_MORE_FIREHOSE_ITEMS).delay(delay * 1.2);
                            $(S_SHOW_MORE_FIREHOSE_ITEMS).fadeIn();
                        }
                        
                    },
                    onFailure: function(errorCode) {
                        // TODO: implement the error function
                    }
            });
        },
        
        displayStory: function(storyId, fromPop) {
            // requests the posts and pass in a callback
            blog.post({
                           id: storyId,
                    fullStory: true, 
                    onSuccess: function(story) {
                        // check if that story is currently in the DOM
                        // var $story = $("#" + story.id);
                        // var storyVisible = false;
                        // if ($story) {
                        //     // check if the story is visible
                        //     storyVisible = util.checkInView($story);
                        //     console.log("Story visible: " + storyVisible);
                        // }
                        // 
                        // // TODO: change this
                        // storyVisible = false;

                        // if (storyVisible) {
                        //     return displayStoryFancy(story.id);
                        // }

                        var storyContent = $(S_STORY_CONTENT);
                        storyContent.empty();
                        
                        var storyTemplate = $(S_MT_DETAILS).html();
                        var storyHtml = Mustache.to_html(storyTemplate, story);
                        storyContent.append(storyHtml);

                        $("body").addClass("moveRight");
                        
                        // put comments into the story
                        //insertCommentsViaDisqus(story, storyContent);

                        // change the url, etc.
                        if(!fromPop) changeStateToStoryDetail(story);
                        
                        // TODO: change settings to ensure same stories on main page are displayed
                        // in the sidebar; rely on blog to do the caching
                        blog.posts({ 
                                    count: settings.storiesOnHome, 
                                onSuccess: function(data) {
                                    var storiesContent = $(S_SMALL_STORIES_CONTENT);
                                    storiesContent.empty();

                                    var storyTemplate = $(S_MT_STORY_SMALL).html();

                                    // add each story to the main page
                                    var showMore = true;
                                    var lastStory;
                                    $.each(data, function(index, story) {
                                        lastStory = story;

                                        if (storyId == story.id) story.specialClass = "current-story-small";
                                        var storyHtml = Mustache.to_html(storyTemplate, story);
                                        story.specialClass = undefined;
                                        
                                        storiesContent.append(storyHtml);

                                        if (story.lastArticle) showMore = false;
                                    });

                                    // if there's more, show a more link at the bottom
                                    if (showMore && lastStory) {
                                        // TODO: implement me
                                    }

                                },
                                onFailure: function(errorCode) {
                                    // TODO: implement the error function
                                }
                        });
                    },
                    onFailure: function(errorCode) {
                        // TODO: error
                    }
            });
        },

        displayStoryFancy: function(storyId) {
            console.log("Fancy!");
        }
    }
})();
