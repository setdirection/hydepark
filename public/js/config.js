//
// if the node "process" object exists and there is a VMC_MONGODB environment, we are running in production
// else we are running in development
//
var config = (typeof process !== "undefined" && process.env['VMC_MONGODB']) ? { // prod settings
    dburi: "mongodb://" + process.env['VMC_MONGODB'] + "/testdb",
    serverport: process.env.VMC_APP_PORT
} : { // dev settings
    dburi: 'mongodb://localhost/testdb',
    serverport: 3000
};

config.title = "Set Direction - A Ben and Dion Company";
config.storiesOnHome = 10;
config.firehoseItemsOnHome = 15;
config.showFullStory = false;

// only save this off if not in a browser
if (typeof window === 'undefined') {
    module.exports = config;
} else { // now in a browser
    config.type = (location.hostname == "localhost") ? "development" : "production";
}
