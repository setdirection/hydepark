// general utility functions
// the code related to detecting element visibility is adapted from https://github.com/protonet/jquery.inview
var util = (function() {
    // used by checkInView()
    function getViewportSize() {
        var mode, domObject, size = { height: window.innerHeight, width: window.innerWidth };

        // if this is correct then return it. iPad has compat Mode, so will
        // go into check clientHeight/clientWidth (which has the wrong value).
        if (!size.height) {
            mode = document.compatMode;
            if (mode || !$.support.boxModel) { // IE, Gecko
                domObject = mode == 'CSS1Compat' ?
                    document.documentElement : // Standards
                    document.body; // Quirks
                size = {
                    height: domObject.clientHeight,
                    width:  domObject.clientWidth
                };
            }
        }

        return size;
    }

    // used by checkInView()
    function getViewportOffset() {
        return {
            top:  window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop,
            left: window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft
        };
    }

    // used by checkInView()
    function getElementSize($element) {
        return {
            height: $element.height(),
            width:  $element.width()
        };
    }

    return {
        checkInView: function(element) {
            if (!element || element.empty()) {
                console.log("civ: empty element!")
                return false;
            }
            
            viewportSize   = getViewportSize();
            viewportOffset = getViewportOffset();

            var $element      = $(element),
                elementSize   = { height: $element.height(), width: $element.width() },
                elementOffset = $element.offset(),
                visiblePartX,
                visiblePartY;

            if (elementOffset.top + elementSize.height > elementOffset.top &&
                elementOffset.top < viewportOffset.top + viewportSize.height &&
                elementOffset.left + elementSize.width > viewportOffset.left &&
                elementOffset.left < viewportOffset.left + viewportSize.width) {
                visiblePartX = (viewportOffset.left > elementOffset.left ?
                    'right' : (viewportOffset.left + viewportSize.width) < (elementOffset.left + elementSize.width) ?
                    'left' : 'both');
                visiblePartY = (viewportOffset.top > elementOffset.top ?
                    'bottom' : (viewportOffset.top + viewportSize.height) < (elementOffset.top + elementSize.height) ?
                    'top' : 'both');
                console.log("civ: visible");  
                return true;
            } else {
              console.log("civ: not visible");  
              return false;
            }
        }
    }
})();
