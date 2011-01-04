var client = (function() {
    
    // default settings values; can be overridden by the user
    var settings = {
        storiesOnHome: 10,
        showFullStory: false
    };
    
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
    
    return {
        // save the settings
        persistSettings: function() {
            // no op
        },

        // performs the initial display of the stories; not used for subsequent displays because those subsequent
        // displays are added to the content block, whereas these replace any existing content block and show a special
        // loading indicator
        displayStories: function() {
            // display a loading indicator
            ui.showMainStoriesLoading();

            // requests the posts and pass in a callback
            blog.posts({ 
                    fullStory: settings.showFullStory, 
                        count: settings.storiesOnHome, 
                    onSuccess: displayStoriesSuccess,
                    onFailure: displayStoriesFailure
            });
        },
        
        displayStory: function(id) {
            console.log("display story");
            
            // display a loading indicator
            ui.showMainStoriesLoading();
            
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