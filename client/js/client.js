var client = (function() {
    
    // -- Settings and configuration
    
    // default settings values; can be overridden by the user
    var settings = {
        storiesOnHome: 10,
        showFullStory: false,
        contentBlockId: "content"
    }

    // -- Private methods
    
    // called when the request to retrieve the stories has been successful and blows away the existing content
    // block contents to display them
    var displayStoriesSuccess = function(data) {
        // will automatically hide the main stories loading indicator if shown
        ui.addStoriesToMain(data);
    }

    // used when the story retrieval fails and there is no content for the user to see. this is really bad
    var displayStoriesFailure = function(errorCode) {
        console.log("on error");

        ui.newMainStoriesNotLoaded(errorCode);
    }

    // -- The Public API

    return {
        // save the settings
        persistSettings: function() {
            // no op
        },

        // performs the initial display of the stories; not used for subsequent displays because those subsequent
        // displays are added to the content block, whereas these replace any existing content block and show a special
        // loading indicator
        displayStories: function() {
            // check for the blog object; if not found, throw an error
            if (!blog) throw { message: "Blog instance not created", type: ERROR.INTERNAL_STATE_INVALID };
            
            // display a loading indicator
            ui.showMainStoriesLoading();

            // requests the posts and pass in a callback
            blog.posts({
                count: settings.storiesOnHome,
                onSuccess: displayStoriesSuccess,
                onFailure: displayStoriesFailure
            });
        }        
    }
})();
