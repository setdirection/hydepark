var ui = (function() {

    return {
        function showMainStoriesLoading() {}
        
        function hideMainStoriesLoading() {}
        
        function showSideStoriesLoading() {}
        
        function hideSideStoriesLoading() {}
        
        function addStoriesToMain(stories) {}
        
        function addStoriesToSide(stories) {}
        
        // informs the user that whatever they are looking at is stale, or, if no cached data is available,
        // do something reasonable to inform the user why he didn't get any data.
        function newMainStoriesNotLoaded(error) {}        
    }
})();