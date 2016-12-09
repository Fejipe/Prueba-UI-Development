// Gruntfile.js
'use strict';

module.exports = function ( grunt ) {

    require( 'load-grunt-tasks' )( grunt );

    grunt.initConfig( {

        /**
         * Clean: empties folders to start fresh
         */
        clean: {
            dist: {
                files: [ {
                    dot: true,
                    src: 'dist/'
                } ]
            }
        },

        /**
         * SASS
         */
        sass: {
            dist: {
                options: {
                    style: 'expanded',
                    require: 'susy'
                },
                files: [ {
                    expand:  true,
                    cwd:     "src/styles/sass/",
                    src:     [ "*.scss" ],
                    dest:    "src/styles/css/",
                    ext:     ".css"
                } ]
            }
        },

        /**
         * Concat script files
         */
        concat: {
            mainScriptFiles: {
                files: {
                    'dist/scripts/app.js': [ 'src/scripts/*.js' ]
                }
            }
        },

        babel: {
            options: {
                sourceMap: true,
                presets: [ 'es2015-ie' ]
            },
            dist: {
                files: {
                    'dist/scripts/app.js': 'dist/scripts/app.js'
                }
            }
        },

        uglify: {
            scripts: {
                files: [
                    {
                        expand: true,
                        src: 'dist/scripts/{,*/}*.js',
                        dest: './'
                    }
                ]
            }
        },

        cssmin: {
            combine: {
                files: {
                    'dist/styles/style.css': [ 'src/styles/css/*.css' ]
                }
            }
        },

        /**
         * Combine matching media queries into one media query definition
         */
        combine_mq: {
            dist: {
                options: {
                    beautify: false
                },
                expand: true,
                src: 'dist/styles/style.css',
                dest: './'
            }
        },

        copy: {
            json: {
                expand: true,
                cwd: 'data/',
                dest: 'dist/data/',
                src: [ '**' ]
            },
            images: {
                expand: true,
                cwd: 'src/images/',
                dest: 'dist/images/',
                src: [ '**' ]
            },
            html: {
                expand: true,
                cwd: 'src/',
                src: [ '*.html' ],
                dest: 'dist/'
            }
        },

        /**
         * Post CSS
         * Using this tool only for autoprefixer
         *
         */
        postcss: {
            options: {
                map: true,
                processors: [
                    require( 'autoprefixer' ) ( {
                        browsers: [ 'last 3 versions' ]
                    } )
                ]
            },
            dist: {
                src: 'dist/styles/style.css'
            }
        },

        /**
         * HTMLClean
         *
         */
        htmlclean: {
            options: {},
            deploy: {
                cwd: 'dist/',
                src: '*.html',
                expand: true,
                dest: 'dist/'
            }
        },

        watch: {
            options: {},

            sass: {
                files: [ 'src/styles/sass/*.scss' ],
                tasks: [ 'sass' ]
            }
        }
    } );

    /**
     * Register Sync task for testing over multiple browsers
     */
    grunt.registerTask( 'build', [
        // Clean folders
        'clean:dist',

        // Parsing SASS files
        'sass:dist',

        // Copy: styles, scripts and images
        'copy',

        // JS files
        'concat',
        'babel',
        'uglify',

        // CSS files
        'cssmin:combine',
        'combine_mq',
        'postcss',

        // HTML files
        'htmlclean'
    ] );
};