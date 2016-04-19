var connect = require('connect'),
    http = require('http'),
    request = require('request'),
    connectUserHtmlTweets = require('../lib/connect-user-htmlTweets');

describe('If Twitter credentials are', function () {
    it('not given then throw an exception', function () {
        function createMiddleware() {
            var middleware = connectUserHtmlTweets();
        }

        expect(createMiddleware).toThrow();
    });

    it('given then create middleware', function () {
        var middleware;

        function createMiddleware() {
            middleware = connectUserHtmlTweets({
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
    var app, appInit;

    beforeEach(function () {
        this.addMatchers({
            toBeLessThanOrEqualTo: function (expected) {
                return this.actual <= expected;
            }
        });

        var middleware = connectUserHtmlTweets({
            screen_name: process.env.SCREEN_NAME,
            consumer_key: process.env.TWITTER_CONSUMER_KEY, 
            consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
            access_token: process.env.TWITTER_ACCESS_TOKEN,
            access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
        });

        appInit = false;
        
        app = connect();
        app.use(middleware);

        app = http
            .createServer(app)
            .listen(3333, function () {
                appInit = true;
            });
    });

    afterEach(function () {
        app.close();
        app = undefined;
    });

    it('2 or less tweets', function () {
        waitsFor(function () {
            return appInit;
        }, 'Connect server did not initialize');

        runs(function () {
            var self = this;
            request('http://localhost:3333/tweets', function (error, response, body) {
                self.error = error;
                self.response = response;
                self.body = body;
            });
        });

        waitsFor(function () {
            return this.error || this.response || this.body;
        }, 'Request for tweets failed');

        runs(function () {
            expect(this.error).toBeNull();
            expect(this.response).toBeDefined();
            expect(this.body).toBeDefined();

            var tweets = [],
                body = this.body;
            function parseTweets() {
                tweets = JSON.parse(body.toString());
            }

            expect(this.response.statusCode).toEqual(200);
            expect(parseTweets).not.toThrow();
            expect(tweets.length).toBeLessThanOrEqualTo(2);
        });
    });

    it('2 or less tweets and is cached', function () {
        var start, end, delta1, delta2, requestOneDone;

        waitsFor(function () {
            return appInit;
        }, 'Connect server did not initialize');

        runs(function () {
            var self = this;

            start = (new Date()).getTime();
            request('http://localhost:3333/tweets', function (error, response, body) {
                end = (new Date()).getTime();
                delta1 = end - start;

                self.error = error;
                self.response = response;
                self.body = body;
            });
        });

        waitsFor(function () {
            return this.error || this.response || this.body;
        }, 'First request for tweets failed');

        runs(function () {
            expect(this.error).toBeNull();
            expect(this.response).toBeDefined();
            expect(this.body).toBeDefined();

            var tweets = [],
                body = this.body;
            function parseTweets() {
                tweets = JSON.parse(body.toString());
            }

            expect(this.response.statusCode).toEqual(200);
            expect(parseTweets).not.toThrow();
            expect(tweets.length).toBeLessThanOrEqualTo(2);

            requestOneDone = true;
        });

        waitsFor(function () {
            return requestOneDone;
        });

        runs(function () {
            var self = this;

            this.error = null;
            this.response = null;
            this.body = null;

            start = (new Date()).getTime();
            request('http://localhost:3333/tweets', function (error, response, body) {
                end = (new Date()).getTime();
                delta2 = end - start;

                self.error = error;
                self.response = response;
                self.body = body;
            });
        });

        waitsFor(function () {
            return this.error || this.response || this.body;
        }, 'Second request for tweets failed');

        runs(function () {
            expect(this.error).toBeNull();
            expect(this.response).toBeDefined();
            expect(this.body).toBeDefined();

            var tweets = [],
                body = this.body;
            function parseTweets() {
                tweets = JSON.parse(body.toString());
            }

            expect(this.response.statusCode).toEqual(200);
            expect(parseTweets).not.toThrow();
            expect(tweets.length).toBeLessThanOrEqualTo(2);

            expect(Math.log(delta2)).toBeLessThan(Math.log(delta1));
        });
    });
});

describe('Configured request for 5 tweets returns', function () {
    var app, appInit;

    beforeEach(function () {
        this.addMatchers({
            toBeLessThanOrEqualTo: function (expected) {
                return this.actual <= expected;
            }
        });

        var middleware = connectUserHtmlTweets({
            count: 5,
            screen_name: process.env.SCREEN_NAME,
            consumer_key: process.env.TWITTER_CONSUMER_KEY, 
            consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
            access_token: process.env.TWITTER_ACCESS_TOKEN,
            access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
        });

        appInit = false;

        app = connect();
        app.use(middleware);

        app = http.createServer(app).listen(3333, function () {
            appInit = true;
        });
    });

    it('5 or less tweets', function () {
        waitsFor(function () {
            return appInit;
        }, 'Connect server did not initialize');

        runs(function () {
            var self = this;
            request('http://localhost:3333/tweets', function (error, response, body) {
                self.error = error;
                self.response = response;
                self.body = body;
            });
        });

        waitsFor(function () {
            return this.error || this.response || this.body;
        }, 'Request for tweets failed');

        runs(function () {
            expect(this.error).toBeNull();
            expect(this.response).toBeDefined();
            expect(this.body).toBeDefined();

            var tweets = [],
                body = this.body;
            function parseTweets() {
                tweets = JSON.parse(body.toString());
            }

            expect(this.response.statusCode).toEqual(200);
            expect(parseTweets).not.toThrow();
            expect(tweets.length).toBeLessThanOrEqualTo(5);
        });
    });
});