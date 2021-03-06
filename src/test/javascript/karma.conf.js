// Karma configuration
// Generated on Wed Sep 30 2015 16:44:29 GMT-0400 (EDT)

module.exports = function(config) {

    //bugfix in phantomjs-rebuilt
    //https://github.com/karma-runner/karma/issues/356
    //https://github.com/karma-runner/karma-phantomjs-launcher/issues/69
    //https://github.com/amir20/phantomjs-node/issues/24
    process.env.PHANTOMJS_BIN = 'node_modules/phantomjs-prebuilt/bin/phantomjs';

    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '../../',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: [
            // bower:js
            'main/webapp/bower_components/es5-shim/es5-shim.js',
            'main/webapp/bower_components/es6-shim/es6-shim.js',
            'main/webapp/bower_components/jquery/dist/jquery.min.js',
            'main/webapp/bower_components/datatables/media/js/jquery.dataTables.js',
            'main/webapp/bower_components/angular/angular.js',
            'main/webapp/bower_components/angular-resource/angular-resource.js',
            'main/webapp/bower_components/angular-touch/angular-touch.js',
            'main/webapp/bower_components/angular-animate/angular-animate.js',
            'main/webapp/bower_components/angular-sanitize/angular-sanitize.js',
            'main/webapp/bower_components/angular-ui-router/release/angular-ui-router.js',
            'main/webapp/bower_components/angular-datatables/dist/angular-datatables.js',
            'main/webapp/bower_components/angular-smart-table/dist/smart-table.js',
            'main/webapp/bower_components/angular-scroll/angular-scroll.js',
            'main/webapp/bower_components/angular-wizard/dist/angular-wizard.min.js',
            'main/webapp/bower_components/ui-select/dist/select.js',
            'main/webapp/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
            'main/webapp/bower_components/xdomain/dist/xdomain.min.js',
            'main/webapp/bower_components/ng-dialog/js/ngDialog.js',
            'main/webapp/bower_components/matchmedia/matchMedia.js',
            'main/webapp/bower_components/ngSticky/lib/sticky.js',
            'main/webapp/bower_components/angular-vs-repeat/src/angular-vs-repeat.js',
            'main/webapp/bower_components/react/react.js',
            'main/webapp/bower_components/react/react-dom.js',
            'main/webapp/bower_components/js-cookie/src/js.cookie.js',
            'main/webapp/bower_components/moment/moment.js',
            'main/webapp/bower_components/angular-moment/angular-moment.js',
            'main/webapp/bower_components/d3/d3.js',
            'main/webapp/bower_components/c3/c3.js',
            'main/webapp/bower_components/pathseg/pathseg.js',
            'main/webapp/bower_components/nvd3/build/nv.d3.js',
            'main/webapp/bower_components/angular-nvd3/dist/angular-nvd3.js',
            'main/webapp/bower_components/isteven-multi-select/isteven-multi-select.js',
            'main/webapp/bower_components/lokijs/src/lokijs.js',
            'main/webapp/bower_components/uswds/dist/js/uswds.min.js',
            'main/webapp/bower_components/lodash/lodash.js',
            'main/webapp/bower_components/trmix/dist/trmix.min.js',
            'main/webapp/bower_components/jstree/dist/jstree.js',
            'main/webapp/bower_components/ng-js-tree/dist/ngJsTree.js',
            'main/webapp/bower_components/semantic-ui/dist/semantic.js',
            'main/webapp/bower_components/angular-local-storage/dist/angular-local-storage.js',
            'main/webapp/bower_components/angular-backtop/dist/angular-backtop.js',
            'main/webapp/bower_components/angular-mocks/angular-mocks.js',
            // endbower
            'main/webapp/bower_components/angular-multi-select/dist/prod/angular-multi-select.js',
            'main/webapp/app/**/*.html',
            'main/webapp/app/app.module.js',
            'main/webapp/app/app.config.js',
            'main/webapp/app/constants.js',
            'main/webapp/app/**/*.js',
            'test/javascript/**/!(karma.conf).js'
        ],


        // list of files to exclude
        exclude: [
            'main/webapp/bower_components/react/*.*'
        ],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            "main/webapp/app/**/*.js": "coverage",
            'main/webapp/app/**/*.html' : "ng-html2js"
        },


        ngHtml2JsPreprocessor: {
            stripPrefix: 'main/webapp/app/',
            moduleName: 'templates'
        },


        coverageReporter: {
            dir: '../target/site/coverage',
            reporters: [
                { type: 'html', subdir: 'html' },
                { type: 'cobertura', subdir: 'cobertura', file: 'cobertura.xml' },
                { type: 'lcov', subdir: 'lcov' }
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
