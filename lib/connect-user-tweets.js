var url = require('url'),
    twit = require('twit'),
    dateFormat = require('dateformat'),
    _ = require('underscore');

var defaultOptions = {
        screen_name: '',
        count: 2,
        cache_timeout: 5 * 60000,
        consumer_key: '', 
        consumer_secret: '',
        access_token: '',
        access_token_secret: ''
    };

function writeTweets(res, tweets) {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, pre-check=0, post-check=0');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Expires', 'Thu, 01 Jan 1970 00:00:00 GMT');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Last-Modified', dateFormat(new Date(), 'UTC:ddd, dd mmm yyyy HH:MM:ss') + ' GMT');
    res.statusCode = 200;

    res.end(JSON.stringify(tweets));
}

var connectUserTweets = function (options) {
    options = _.extend({}, defaultOptions, options);

    var twitter = new twit({
            consumer_key: options.consumer_key, 
            consumer_secret: options.consumer_secret,
            access_token: options.access_token,
            access_token_secret: options.access_token_secret
        }),
        cache;

    function setCache(data) {
        if (options.cache_timeout) {
            cache = data;

            setTimeout(
                function () {
                    cache = undefined;
                }, 
                options.cache_timeout
            );
        }
        else {
            cache = undefined;
        }

        return data;
    }

    return function (req, res, next) {
        var path = url.parse(req.url),
            route = /^\/tweets$/;

        path = path.pathname;

        if (req.method == 'GET' && path.match(route)) {
            if (cache) {
                writeTweets(res, cache);
                return;
            }

            twitter.get(
                'statuses/user_timeline', 
                {
                    screen_name: options.screen_name,
                    count: options.count
                }, 
                function (err, reply) {
                    if (err) {
                        next(err);
                        return;
                    }

                    var tweets = setCache(reply);
                    writeTweets(res, tweets);
                }
            );
        }
        else {
            next();
        }
    };
};

module.exports = connectUserTweets;