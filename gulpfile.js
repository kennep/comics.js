var gulp = require('gulp');
var ts = require('gulp-typescript');
var merge = require('merge2');
var sourcemaps = require('gulp-sourcemaps');
var webpack = require('gulp-webpack'); 

var serverSources = ['typings/**/*.d.ts', 'server/*.ts'];
var clientSources = ['typings/**/*.d.ts', 'client/src/*.tsx'];
var clientEntry = 'client/src/index.tsx'; 
 
gulp.task('server', function() {
    var serverProject = ts.createProject('tsconfig.json', {
        declaration: true,
        noExternalResolve: true
    });
    var tsResult = gulp.src(serverSources)
                    .pipe(sourcemaps.init())
                    .pipe(ts(serverProject));
 
    return merge([ // Merge the two output streams, so this task is finished when the IO of both operations are done. 
        tsResult.dts.pipe(gulp.dest('build/definitions')),
        tsResult.js
            .pipe(sourcemaps.write())
            .pipe(gulp.dest('build/output'))
    ]);
});

/*
gulp.task('client', function() {
    var clientProject = ts.createProject('tsconfig.json', {
        declaration: true,
        noExternalResolve: true
    });
    var tsResult = gulp.src(clientSources)
                    .pipe(ts(clientProject));
 
    return merge([ // Merge the two output streams, so this task is finished when the IO of both operations are done. 
        tsResult.dts.pipe(gulp.dest('build/definitions')),
        tsResult.js
            .pipe(gulp.dest('build/client'))
    ]);
});
*/
gulp.task('client', function() {
   return gulp.src(clientEntry)
    .pipe(webpack({
        resolve: {
            extensions: ['', '.js', '.tsx']
        },
        output: {
            filename: 'bundle.js'
        },
        module: {
            loaders: [
                { test: /\.tsx$/, loader: 'webpack-typescript'}
            ]
        }
    }))
    .pipe(gulp.dest('build/output/public'))
});

gulp.task('watch', ['server'], function() {
    gulp.watch(serverSources, ['server']);
});

gulp.task('default', ['client', 'server']);
