var ui = (function() {

    // a trivial, temporary loading effect
    function sillyLoading(show) {
        if (show) { // show it
            $("#loading").show();
        } else {    // hide it
            $("#loading").hide(1000);
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
        
        // prepends a story to the beginning of the stream of stories
        //
        // args:
        //   stories: array of story data objects; see blog.js to understand the story object schema
        addStoriesToMain: function(stories) {
            // get the content div
            var content = $("#content");
            
            // get the template for the story
            var storyTemplate = $("#template-story").html();
            
            // for each story in stories, instantiate the story template as the first child of the content element
            $.each(stories, function(storyIndex, story) {
                var storyHtml = Mustache.to_html(storyTemplate, story);
                
                content.prepend(storyHtml);
            });
            
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