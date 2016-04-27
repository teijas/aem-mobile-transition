module.exports = function(grunt){
    "use strict";
    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        
        copy: {
            main: {
                files: [
                    {expand: true, src: ['js/*.js'], dest: 'demo/'},
                    {expand: true, src: ['css/*.css'], dest: 'demo/'}
                ]
            }
        },
        
        sass: {
          dist: {
              files: {
                'css/aem-mobile-transition.css': 'css/aem-mobile-transition.scss'
              }
          }
        },
        
        watch: {
            css: {
                files: ['css/*.scss'],
                tasks: ['sass']
            },
            other: {
                files: ['js/*.js','css/*.css'],
                tasks: ['copy']
            }
        }
        
    });

    grunt.registerTask('default', ['watch']);

};