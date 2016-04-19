# connect-user-htmlTweets

Forked from connect-user-tweets.

This README file needs updating.

Middleware for [connect](https://github.com/senchalabs/connect) that registers an endpoint to look up Tweets posted by a given user. Tweets will be cached on the connect server to help prevent going over Twitter's [rate limit](https://dev.twitter.com/docs/rate-limiting/1.1).

## Install

`$ npm install connect-user-tweets`

## Usage

```javascript
var connect = require('connect'),
    connectUserTweets = require('connect-user-tweets');

var app = connect();

app
    .use(connectUserTweets({
        screen_name: 'posco2k8',
        count: 2, // Default. Number of tweets to return.
        cache_timeout: 5 * 60000, // Default five minutes
        consumer_key: '...', 
        consumer_secret: '...',
        access_token: '...',
        access_token_secret: '...'
    }))
    .listen(3000);
```

You can now access the API by sending a GET request to: `http://localhost:3000/tweets`.
