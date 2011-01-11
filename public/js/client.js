var client = (function() {
    // selector constants (S == selector, MT == mustache template)
    var S_MAIN_CONTENT = "#main-content";
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

    // TODO: rename the "display" functions here to be "load" instead, reflecting that the UI tier actually does
    // the displaying
    // called when the request to retrieve the stories has been successful and passes stories to the UI to display
    function displayStoriesSuccess(data) {
        // will automatically hide the main stories loading indicator if shown
        ui.addStoriesToMain(data);
    };

    // used when the story retrieval fails and there is no content for the user to see. this is really bad
    function displayStoriesFailure(errorCode) {
        ui.newMainStoriesNotLoaded(errorCode);
    };
    
    // called when story detail has been loaded; passes the detail to the UI for display
    function displayStorySuccess(story) {
        // will automatically hide the main stories loading indicator if shown
        ui.showStoryDetail(story);
    };
    
    // couldn't load story
    function displayStoryFailure(story) {
        // will automatically hide the main stories loading indicator if shown
        ui.showStoryDetail(story);
    };

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
                    fullStory: settings.showFullStory, 
                        count: settings.storiesOnHome, 
                    onSuccess: function(data) {
                        // TODO: remove the loading indicator
                        
                        // there shouldn't be existing content, but just to be sure, let's nuke it
                        var mainContent = $(S_MAIN_CONTENT);
                        mainContent.empty();
                        
                        var storyTemplate = $(S_MT_STORY).html();
                        var excerptTemplate = $(S_MT_EXCERPT).html();

                        // add each story to the main page
                        var delay = 0;
                        $.each(data, function(index, story) {
                            console.log("Okay!");

                            var storyHtml = Mustache.to_html( (story.excerpt) ? excerptTemplate : 
                                                                                storyTemplate,    story);
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
        
        displayStory: function(id) {
            // requests the posts and pass in a callback
            blog.post({
                           id: id,
                    fullStory: true, 
                    onSuccess: displayStorySuccess,
                    onFailure: displayStoryFailure
            });
        }
    }
})();

// handle history
// TODO: share with the URL parser
$(window).bind("popstate", function(e) {
    console.log("POP!");
    var state = e.originalEvent.state;
    console.log(state);
    if (state && state.type == "displayStory" && state.story.id) {
        console.log(state.story.id);
        document.title = state.title;
        client.displayStory(state.story.id);
    } else {
        document.title = config.title;
        client.displayStories();
    }
});
