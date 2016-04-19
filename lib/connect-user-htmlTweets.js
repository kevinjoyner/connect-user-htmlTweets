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
	
	// Take this out once the server's setup correctly
	res.setHeader('Access-Control-Allow-Origin', '*');
	
	res.setHeader('Content-Type', 'text/plain; charset=utf-8');
	res.setHeader('Expires', 'Thu, 01 Jan 1970 00:00:00 GMT');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Last-Modified', dateFormat(new Date(), 'UTC:ddd, dd mmm yyyy HH:MM:ss') + ' GMT');
    res.statusCode = 200;
	res.end(JSON.stringify(tweets.sort(function(a, b){return b.created_at - a.created_at})));
}

var connectUserHtmlTweets = function (options) {
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
			
			function cacheHtmlTweets(htmlTweets) {
				var tweets = setCache(htmlTweets);
				writeTweets(res, tweets);
			};
			
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
					
					var htmlTweets = [];
					reply.forEach(function(item) {
						twitter.get(
							'statuses/oembed', 
							{
								id: item["id_str"],
								omit_script: true
							}, 
							function (err, reply) {
								if (err) {
									next(err);
									return;
								}
								htmlTweets.push({"created_at": (new Date(item["created_at"]).getTime() / 1000), "html": reply["html"].replace(/^(<blockquote\sclass=\"twitter-tweet\">)(.+)(<\/blockquote>\n)$/g, "$2").replace(/\"/g, "'")});
							}
						);
					});
					cacheHtmlTweets(htmlTweets);
				}
			);
        }
        else {
            next();
        }
    };
};

module.exports = connectUserHtmlTweets;