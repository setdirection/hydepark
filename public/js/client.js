var client = (function() {
    // selector constants (S == selector, MT == mustache template)
    var S_MAIN_CONTENT = "#main-content > div";
    var S_FIREHOSE_CONTENT = "#side-content > div";
    var S_LOADING_INDICATOR = "#loading";
    var S_SHOW_MORE_ARTICLES = "#show-more-articles";
    var S_SHOW_MORE_FIREHOSE_ITEMS = "#show-more-firehose-items";
    var S_MT_STORY = "#template-story";
    var S_MT_EXCERPT = "#template-excerpt";
    var S_MT_DETAILS = "#template-story-details";
    var S_MT_SHOW_MORE_ARTICLES = "#template-show-more-articles";
    var S_MT_SHOW_MORE_FIREHOSE_ITEMS = "#template-show-more-firehose-items";
    var S_MT_FIREHOSE_TWITTER = "#template-firehose-twitter";
    var S_MT_FIREHOSE_LINK = "#template-firehose-link";
    
    var INITIAL_STORY_FADE_IN_DELAY = 200;
    var INITIAL_FIREHOSE_ITEM_FADE_IN_DELAY = 125;
    
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
        document.title = htmlTitle;
        history.pushState({type: "displayStory", story: story, title: htmlTitle}, htmlTitle, "/article/" + story.id);            
    };
    
    // handle history
    // TODO: share with the URL parser
    $(window).bind("popstate", function(e) {
        // console.log("POP goes the weazle! ", state);
        // console.log(location.pathname.length, location.pathname.substr(1));
        var state = e.originalEvent.state;
        if (state && state.type == "displayStory" && state.story.id) {
            //console.log(state.story.id);
            document.title = state.title;
            
            // FIXME: work out the right invocation
            client.displayStoryFromHome(state.story.id);
        } else if (location.pathname && location.pathname.length > 1) { // location check here
            var articleIdMatch = location.pathname.match(/\/article\/(.+)/);
            if (articleIdMatch === null) { // no article found
                displayStoryFailure({ type: "no article id", id: articleId });
            } else {
                // FIXME: work out the right invocation
                client.displayStoryFromHome(articleIdMatch[1]);
            }
        } else {
            document.title = config.title;
            client.displayStories();
            client.displayFirehoseItems();
        }
    });

    // -- Public Methods
    return {
        // save the settings
        persistSettings: function() {
            // no op
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
                        
                        var mainContent = $(S_MAIN_CONTENT);

                        // if there are no stories present, nuke any existing content
                        // NOTE: commented out to support showing more articles                        
                        // mainContent.empty();
                        
                        var storyTemplate = $((settings.showFullStory) ? S_MT_STORY : S_MT_EXCERPT).html();

                        // add each story to the main page
                        var delay = 0;
                        var showMore = true;
                        var lastStory;
                        $.each(data, function(index, story) {
                            lastStory = story;
                            
                            var storyHtml = Mustache.to_html(storyTemplate, story);
                            mainContent.append(storyHtml);
                            
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
                            mainContent.append(showMoreHtml);

                            $(S_SHOW_MORE_ARTICLES).delay(delay * 1.2);
                            $(S_SHOW_MORE_ARTICLES).fadeIn();
                        }
                        
                    },
                    onFailure: function(errorCode) {
                        // TODO: implement the error function
                    }
            });
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
        
        displayStoryFromHome: function(storyId) {
            // requests the posts and pass in a callback
            blog.post({
                           id: storyId,
                    fullStory: true, 
                    onSuccess: function(story) {
                        // check if that story is currently in the DOM
                        var $story = $("#" + story.id);
                        var storyVisible = false;
                        if ($story) {
                            // check if the story is visible
                            storyVisible = util.checkInView($story);
                            console.log("Story visible: " + storyVisible);
                        }

                        // TODO: change this
                        storyVisible = false;

                        if (storyVisible) {
                            return displayStoryFromHomeFancy(story.id);
                        }

                        // the story is either not visible or not on the screen, so do a simpler transition

                        // kill all the stories
                        var content = $(S_MAIN_CONTENT);
                        content.empty();

                        // add the new story detail block to the main content block
                        var storyTemplate = $(S_MT_DETAILS).html();
                        var storyHtml = Mustache.to_html(storyTemplate, story);
                        content.prepend(storyHtml);
                        $("#" + story.id).fadeIn();
                        
                        var script   = document.createElement("script");
                            script.text = "var idcomments_acct = '65b747c511858417522dbbe2f72ab6ea';var idcomments_post_id = '" + story.id + "';var idcomments_post_url = 'http://setdirection.com/article/" + story.id + "';"
                        document.body.appendChild(script);

                        content.append("<span id='IDCommentsPostTitle' style='display:none'></span>");

                        var script2   = document.createElement("script");
                            script2.src = "http://www.intensedebate.com/js/genericCommentWrapperV2.js"
                        document.body.appendChild(script2);

                        // change the url, etc.
                        changeStateToStoryDetail(story);
                    },
                    onFailure: function(errorCode) {
                        // TODO: error
                    }
            });
        },

        displayStoryFromHomeFancy: function(storyId) {
            console.log("Fancy!");
        }
    }
})();
