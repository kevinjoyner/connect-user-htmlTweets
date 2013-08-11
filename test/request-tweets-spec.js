var connect = require('connect'),
    http = require('http'),
    request = require('request'),
    connectUserTweets = require('../lib/connect-user-tweets');

describe('If Twitter credentials are', function () {
    it ('not given then throw an exception', function () {
        function createMiddleware() {
            var middleware = connectUserTweets();
        }

        expect(createMiddleware).toThrow();
    });

    it ('given then create middleware', function () {
        var middleware;

        function createMiddleware() {
            middleware = connectUserTweets({
                consumer_key: process.env.TWITTER_CONSUMER_KEY, 
                consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
                access_token: process.env.TWITTER_ACCESS_TOKEN,
                access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
            });
        };

        expect(createMiddleware).not.toThrow();
        expect(middleware).toBeDefined();
    });
});

describe('Default request returns', function () {
    var app;

    beforeEach(function () {
        this.addMatchers({
            toBeLessThanOrEqualTo: function (expected) {
                return this.actual <= expected;
            }
        });
    });

    it('2 or less tweets', function (done) {
        var middleware = connectUserTweets({
            screen_name: process.env.SCREEN_NAME,
            consumer_key: process.env.TWITTER_CONSUMER_KEY, 
            consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
            access_token: process.env.TWITTER_ACCESS_TOKEN,
            access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
        });

        app = connect();
        app.use(middleware);
        app = http.createServer(app).listen(8888, function () {
            request('http://localhost:8888/tweets', function (error, response, body) {
                var tweets = [];
                function parseTweets() {
                    tweets = JSON.parse(body.toString());
                }

                expect(response.statusCode).toEqual(200);
                expect(parseTweets).not.toThrow();
                expect(tweets.length).toBeLessThanOrEqualTo(2);

                app.close();
                app = undefined;
                done();
            });
        });
    });

    it('2 or less tweets and is cached', function (done) {
        var middleware = connectUserTweets({
            screen_name: process.env.SCREEN_NAME,
            consumer_key: process.env.TWITTER_CONSUMER_KEY, 
            consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
            access_token: process.env.TWITTER_ACCESS_TOKEN,
            access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
        });

        app = connect();
        app.use(middleware);
        app = http.createServer(app).listen(8888, function () {
            var start, end, delta1, delta2;

            start = (new Date()).getTime();
            request('http://localhost:8888/tweets', function (error, response, body) {
                end = (new Date()).getTime();
                delta1 = end - start;

                var tweets = [];
                function parseTweets() {
                    tweets = JSON.parse(body.toString());
                }

                expect(response.statusCode).toEqual(200);
                expect(parseTweets).not.toThrow();

                start = (new Date()).getTime();
                request('http://localhost:8888/tweets', function (error, response, body) {
                    end = (new Date()).getTime();
                    delta2 = end - start;

                    var tweets = [];
                    function parseTweets() {
                        tweets = JSON.parse(body.toString());
                    }

                    expect(response.statusCode).toEqual(200);
                    expect(parseTweets).not.toThrow();

                    expect(Math.log(delta2)).toBeLessThan(Math.log(delta1));

                    app.close();
                    app = undefined;
                    done();
                });
            });
        });
    });
});

describe('Configured request for 5 tweets returns', function () {
    var app;

    beforeEach(function () {
        this.addMatchers({
            toBeLessThanOrEqualTo: function (expected) {
                return this.actual <= expected;
            }
        });
    });

    it('5 or less tweets', function (done) {
        var middleware = connectUserTweets({
            count: 5,
            screen_name: process.env.SCREEN_NAME,
            consumer_key: process.env.TWITTER_CONSUMER_KEY, 
            consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
            access_token: process.env.TWITTER_ACCESS_TOKEN,
            access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
        });

        app = connect();
        app.use(middleware);
        app = http.createServer(app).listen(8888, function () {
            request('http://localhost:8888/tweets', function (error, response, body) {
                var tweets = [];
                function parseTweets() {
                    tweets = JSON.parse(body.toString());
                }

                expect(response.statusCode).toEqual(200);
                expect(parseTweets).not.toThrow();
                expect(tweets.length).toBeLessThanOrEqualTo(5);

                app.close();
                app = undefined;
                done();
            });
        });
    });
});