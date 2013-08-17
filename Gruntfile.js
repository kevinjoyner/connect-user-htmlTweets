module.exports = function (grunt) {
    
    grunt.initConfig({
        jasmine_node: {
            specNameMatch: './spec'
        }
    });

    grunt.loadNpmTasks('grunt-jasmine-node');

    grunt.registerTask('default', 'test');
    grunt.registerTask('test', ['load_credentials', 'jasmine_node']);
    grunt.registerTask('load_credentials', 'Load Twitter credentials from file system.', function () {
        var credentials;

        try {
            credentials = grunt.file.readJSON('credentials.json');
        }
        catch (ex) {
            grunt.log.error('Could not load credentials.json');
            return false;
        }

        if (!credentials) {
            grunt.log.error('Could not parse credentials.json');
            return false;
        }

        if (!credentials.SCREEN_NAME ||
            !credentials.TWITTER_CONSUMER_KEY ||
            !credentials.TWITTER_CONSUMER_SECRET ||
            !credentials.TWITTER_ACCESS_TOKEN ||
            !credentials.TWITTER_ACCESS_TOKEN_SECRET)
        {
            grunt.log.error('credentials.json must be have the following format:');
            grunt.log.error('{\n  "SCREEN_NAME": "...",\n  "TWITTER_CONSUMER_KEY": "...",\n  "TWITTER_ACCESS_TOKEN": "...",\n  "TWITTER_ACCESS_TOKEN_SECRET": "..."\n}');
            return false;
        }

        process.env.SCREEN_NAME = credentials.SCREEN_NAME;
        process.env.TWITTER_CONSUMER_KEY = credentials.TWITTER_CONSUMER_KEY;
        process.env.TWITTER_CONSUMER_SECRET = credentials.TWITTER_CONSUMER_SECRET;
        process.env.TWITTER_ACCESS_TOKEN = credentials.TWITTER_ACCESS_TOKEN;
        process.env.TWITTER_ACCESS_TOKEN_SECRET = credentials.TWITTER_ACCESS_TOKEN_SECRET;

        grunt.log.writeln('Processed credentials.json');
    });

};