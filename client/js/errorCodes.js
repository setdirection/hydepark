// by convention:
//      codes < 0 are internal errors that the user can't reasonably do anything about
//          (e.g., a required variable is missing, data is corrupt)
//      codes > 0 are errors that the user can do something about
//          (e.g., the browser is unsupported, inappropriate word in a comment)
var ERROR = {
    INTERNAL_STATE_INVALID: -1     // generic error that shouldn't happen but did (state corruption issues, etc.)
}