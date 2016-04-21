# connect-user-htmlTweets

Middleware for [connect](https://github.com/senchalabs/connect) that registers an endpoint to look up Tweets posted by a given user. Tweets will be cached on the connect server to help prevent going over Twitter's [rate limit](https://dev.twitter.com/docs/rate-limiting/1.1).

Forked from connect-user-tweets.

When you fetch a tweet from statuses/user_timeline the tweet is delivered in plain text, with the URLs separately. I wanted to use the tweets on a website and have the links (often truncated) clickable. I also wanted to achieve this without needing to carry Twitter's JavaScript on my site.

Building on connect-user-tweets, connect-user-htmlTweets fetches the tweet IDs from statuses/user_timeline. It then fetches the HTML for each tweet from statuses/oembed. It strips out some HTML that I didn't want, and it sorts the tweets to make sure they're in recent-to-older date order.

## Install

`$ npm install connect-user-tweets`

## Usage

```javascript
var connect = require('connect'),
    connectUserTweets = require('connect-user-htmlTweets');

var app = connect();

app
    .use(connectUserTweets({
        screen_name: 'kevinjoyner',
        count: 3, // Default. Number of tweets to return.
        cache_timeout: 5 * 60000, // Default five minutes
        consumer_key: '...', 
        consumer_secret: '...',
        access_token: '...',
        access_token_secret: '...'
    }))
    .listen(3030);
```

You can now access the API by sending a GET request to: `http://localhost:3030/tweets`.
