var client = (function() {
    // selector constants (S == selector, MT == mustache template)
    var S_MAIN_CONTENT = "#main-content > div";
    var S_LOADING_INDICATOR = "#loading"
    var S_MT_STORY = "#template-story";
    var S_MT_EXCERPT = "#template-excerpt";
    var S_MT_DETAILS = "#template-story-details";
    
    var INITIAL_STORY_FADE_IN_DELAY = 200;
    
    // -- Settings and configuration
    
    // default settings values; can be overridden by the user
    var settings = {
        storiesOnHome: 10,
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
        console.log("POP goes the weazle! ", state);
        console.log(location.pathname.length, location.pathname.substr(1));
        var state = e.originalEvent.state;
        if (state && state.type == "displayStory" && state.story.id) {
            console.log(state.story.id);
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
        }
    });

    // -- Public Methods
    return {
        // save the settings
        persistSettings: function() {
            // no op
        },

        // performs the initial display of the stories when the site is loaded
        displayStories: function() {
            // TODO: display some kind of loading indicator

            // requests the posts and pass in a callback
            blog.posts({ 
                        count: settings.storiesOnHome, 
                    onSuccess: function(data) {
                        // TODO: remove the loading indicator
                        
                        // there shouldn't be existing content, but just to be sure, let's nuke it
                        var mainContent = $(S_MAIN_CONTENT);
                        mainContent.empty();
                        
                        var storyTemplate = $((settings.showFullStory) ? S_MT_STORY : S_MT_EXCERPT).html();

                        // add each story to the main page
                        var delay = 0;
                        $.each(data, function(index, story) {
                            var storyHtml = Mustache.to_html(storyTemplate, story);
                            mainContent.append(storyHtml);
                            
                            // the templates are hidden initially to permit a nice little fade-in effect
                            var newStorySelector = "#" + story.id;
                            $(newStorySelector).delay(delay);
                            delay += INITIAL_STORY_FADE_IN_DELAY; 
                            $(newStorySelector).fadeIn();
                        });
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
