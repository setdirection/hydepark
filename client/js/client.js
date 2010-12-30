var client = (function() {
    
    // default settings values; can be overridden by the user
    var settings = {
        storiesOnHome: 10,
        showFullStory: false,
        contentBlockId: "content"
    }

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

            // display a loading indicator

            // requests the posts and pass in a callback

        },
        
        // called when the request to retrieve the stories has been successful and blows away the existing content
        // block contents to display them
        displayStoriesSuccess: function() {
            
        },

        // used when the story retrieval fails and there is no content for the user to see. this is really bad
        displayStoriesError: function(errorCode) {

        }
    }
})();