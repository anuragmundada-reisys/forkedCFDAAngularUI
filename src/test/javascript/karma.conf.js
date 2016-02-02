// Karma configuration
// Generated on Wed Sep 30 2015 16:44:29 GMT-0400 (EDT)

module.exports = function(config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '../../',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: [
            // bower:js
            'main/webapp/bower_components/jquery/dist/jquery.js',
            'main/webapp/bower_components/angular/angular.js',
            'main/webapp/bower_components/angular-resource/angular-resource.js',
            'main/webapp/bower_components/angular-touch/angular-touch.js',
            'main/webapp/bower_components/angular-animate/angular-animate.js',
            'main/webapp/bower_components/angular-sanitize/angular-sanitize.js',
            'main/webapp/bower_components/ui-router/release/angular-ui-router.js',
            'main/webapp/bower_components/angular-smart-table/dist/smart-table.js',
            'main/webapp/bower_components/angular-scroll/angular-scroll.js',
            'main/webapp/bower_components/lodash/dist/lodash.compat.js',
            'main/webapp/bower_components/angular-wizard/dist/angular-wizard.min.js',
            'main/webapp/bower_components/ui-select/dist/select.js',
            'main/webapp/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
            'main/webapp/bower_components/xdomain/dist/xdomain.js',
            'main/webapp/bower_components/matchmedia/matchMedia.js',
            'main/webapp/bower_components/ngSticky/lib/sticky.js',
            'main/webapp/bower_components/angular-vs-repeat/src/angular-vs-repeat.js',
            'main/webapp/bower_components/angular-mocks/angular-mocks.js',
            // endbower
            'main/webapp/scripts/app/**/*.html',
            'main/webapp/scripts/app/app.bootstrap.js',
            'main/webapp/scripts/app/app.module.js',
            'main/webapp/scripts/app/app.config.js',
            'main/webapp/scripts/app/constants.js',
            'main/webapp/scripts/app/**/*.js',
            'test/javascript/**/!(karma.conf).js'
        ],


        // list of files to exclude
        exclude: [
        ],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            "main/webapp/scripts/app/**/*.js": "coverage",
            'main/webapp/scripts/app/**/*.html' : "ng-html2js"
        },


        ngHtml2JsPreprocessor: {
            stripPrefix: 'main/webapp/scripts/app/',
            moduleName: 'templates'
        },


        coverageReporter: {
            dir: '../target/site/coverage',
            reporters: [
                { type: 'html', subdir: 'html' },
                { type: 'cobertura', subdir: 'cobertura', file: 'cobertura.xml' }
            ]
        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress', 'coverage'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['PhantomJS'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true
    })
};
