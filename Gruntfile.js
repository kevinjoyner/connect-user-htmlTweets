module.exports = function (grunt) {
    
    grunt.initConfig({
        jasmine_node: {
            specNameMatch: './test'
        }
    });

    grunt.loadNpmTasks('grunt-jasmine-node');

    grunt.registerTask('default', 'test');
    grunt.registerTask('test', ['load_credentials', 'jasmine_node']);
    grunt.registerTask('load_credentials', 'Load Twitter credentials from file system.', function () {
        var credentials = grunt.file.readJSON('credentials.json');

        process.env.SCREEN_NAME = credentials.SCREEN_NAME;
        process.env.TWITTER_CONSUMER_KEY = credentials.TWITTER_CONSUMER_KEY;
        process.env.TWITTER_CONSUMER_SECRET = credentials.TWITTER_CONSUMER_SECRET;
        process.env.TWITTER_ACCESS_TOKEN = credentials.TWITTER_ACCESS_TOKEN;
        process.env.TWITTER_ACCESS_TOKEN_SECRET = credentials.TWITTER_ACCESS_TOKEN_SECRET;
    });

};