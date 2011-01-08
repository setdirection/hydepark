var state = (function() {
    var currentState = state.STATE_DEFAULT;
    var destinationState;
    var postTransitionQueue = [];
    
    var transitions = {
        setNewState: function(newState) {
            currentState = newState;
            
            var queue = postTransitionQueue;
            postTransitionQueue = [];
            jQuery.each(queue, function(index, op) {
                if (op.state == currentState) op.callback();
            });
        }
    }
    
    return {
        STATE_DEFAULT = "default",
        STATE_HOME = "home";
        STATE_STORY = "story";

        STATE_IN_TRANSITION = "Will you, Quintus? Will I?";
        
        transitionState: function(newState) {
            // ensure that the new state isn't STATE_IN_TRANSITION; that's not allowed
            if (newState == STATE_IN_TRANSITION) return;
            
            // avoid transitioning to the same state
            if (newState == currentState) return;
                    
            // build the name of the transition function
            var oldState = currentState;
            oldState = oldState.toUpperCase().charAt(0) + oldState.substr(1);
            newState = newState.toUpperCase().charAt(0) + newState.substr(1);
            var transitionFunctionName = "transition" + oldState + "To" + newState;

            // get the function and execute it if it exists
            var transitionFunction = transitions[transitionFunctionName];
            if (transitionFunction) {
                transitionFunction();
            } else {
                console.error("Couldn't find transition function '" + transitionFunctionName + "'");
            }
        }
    }
})();