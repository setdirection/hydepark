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
        function checkInView(element) {
            viewportSize   = getViewportSize();
            viewportOffset = getViewportOffset();

            if (!$.contains(document.documentElement, element)) {
              return false;
            }

            var $element      = $(element),
                elementSize   = { height: $element.height(), width: $element.width() },
                elementOffset = $element.offset(),
                visiblePartX,
                visiblePartY,
                visiblePartsMerged;

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
                visiblePartsMerged = visiblePartX + "-" + visiblePartY;
                return true;
            } else {
              return false;
            }
        }
    }
})();
