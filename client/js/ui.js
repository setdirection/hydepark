var ui = (function() {
    // selector constants (S == selector, MT == mustache template)
    var S_MAIN_CONTENT = "#main-content";
    var S_LOADING_INDICATOR = "#loading"
    var S_MT_STORY = "#template-story";
    var S_MT_EXCERPT = "#template-excerpt";
    var S_MT_DETAILS = "#template-story-details";

    // state constants
    var STATE_ALL_STORIES = "stories";
    var STATE_STORY = "story";
    var STATE_TRANSITION = "transition";

    // current state of the UI; the initial state is probably STATE_ALL_STORIES
    var currentState = STATE_ALL_STORIES;

    // a trivial, temporary loading effect
    function sillyLoading(show) {
        if (show) { // show it
            $(S_LOADING_INDICATOR).show();
        } else {    // hide it
            $(S_LOADING_INDICATOR).hide(1000);
        }
    }

    return {
        showMainStoriesLoading: function() {
            sillyLoading(true);
        },
        
        hideMainStoriesLoading: function() {
            sillyLoading(false);
        },
        
        showSideStoriesLoading: function() {
            sillyLoading(true);
        },
        
        hideSideStoriesLoading: function() {
            sillyLoading(false);
        },
        
        // prepends one or more stories to the beginning of the stream of stories
        //
        // args:
        //   stories: array of story data objects; see blog.js to understand the story object schema
        addStoriesToMain: function(stories) {
            var content = $(S_MAIN_CONTENT);
            var storyTemplate = $(S_MT_STORY).html();
            var excerptTemplate = $(S_MT_EXCERPT).html();
            
            // for each story in stories, instantiate the story template as the first child of the content element
            $.each(stories, function(storyIndex, story) {
                var storyHtml = Mustache.to_html( (story.excerpt) ? excerptTemplate : storyTemplate, 
                                                  story);
                
                content.prepend(storyHtml);
            });
            
            ui.hideMainStoriesLoading();
        },
        
        showStoryDetail: function(story) {
            console.log("story detail");
            
            // I'd like to support some nice state transitions here, but for now, there will essentially be no transitions;
            // state changes occur immediately
            
            // whack the contents of the main content block
            var content = $(S_MAIN_CONTENT);
            content.empty();
            
            // add the new story detail block to the main content block
            var storyTemplate = $(S_MT_DETAILS).html();
            var storyHtml = Mustache.to_html(storyTemplate, story);
            content.prepend(storyHtml);
            window.location.hash = story.id;
            
            // request the comments for the story
            // TODO: work out the API for this
            
            ui.hideMainStoriesLoading();
        },
        
        addStoriesToSide: function(stories) {
            
            ui.hideSideStoriesLoading();
        },
        
        // informs the user that whatever they are looking at is stale, or, if no cached data is available,
        // do something reasonable to inform the user why he didn't get any data.
        newMainStoriesNotLoaded: function(error) {}        
    }
})();