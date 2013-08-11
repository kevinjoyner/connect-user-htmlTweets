
describe('Twitter credential', function () {
    it('process.env.SCREEN_NAME must be provided', function () {
        expect(process.env.SCREEN_NAME).toBeDefined();
    });

    it('process.env.TWITTER_CONSUMER_KEY must be provided', function () {
        expect(process.env.TWITTER_CONSUMER_KEY).toBeDefined();
    });

    it('process.env.TWITTER_CONSUMER_SECRET must be provided', function () {
        expect(process.env.TWITTER_CONSUMER_SECRET).toBeDefined();
    });

    it('process.env.TWITTER_ACCESS_TOKEN must be provided', function () {
        expect(process.env.TWITTER_ACCESS_TOKEN).toBeDefined();
    });

    it('process.env.TWITTER_ACCESS_TOKEN_SECRET must be provided', function () {
        expect(process.env.TWITTER_ACCESS_TOKEN_SECRET).toBeDefined();
    });
});