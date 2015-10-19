var gulp = require('gulp');
var ts = require('gulp-typescript');
var merge = require('merge2');
var sourcemaps = require('gulp-sourcemaps');
var webpack = require('gulp-webpack'); 
var wp = require('webpack');
var rimraf = require('rimraf');

var serverSources = ['typings/**/*.d.ts', 'server/*.ts'];
var clientEntry = 'client/src/index.tsx'; 
var clientCss = ['client/public/css/*',
    'node_modules/bootstrap/dist/css/bootstrap.css']
var clientHtml = 'client/public/index.html';
 
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
            .pipe(gulp.dest('build/dist'))
    ]);
});

gulp.task('client-compile', function() {
   return gulp.src(clientEntry)
    .pipe(webpack({
        resolve: {
            extensions: ['', '.js', '.tsx']
        },
        output: {
            filename: 'bundle.js'
        },
        devtool: "source-map",
        module: {
            loaders: [
                { test: /\.tsx$/, loader: 'webpack-typescript'}
            ]
        },
        plugins: [
            new wp.optimize.UglifyJsPlugin()
        ]
    }))
    .pipe(gulp.dest('build/dist/public'))
});

gulp.task('client-css', function() {
    return gulp.src(clientCss)
        .pipe(gulp.dest('build/dist/public/css'))
});

gulp.task('client-html', function() {
    return gulp.src(clientHtml)
        .pipe(gulp.dest('build/dist/public'))
});

gulp.task('client', ['client-compile', 'client-html', 'client-css']);

gulp.task('watch', ['server'], function() {
    gulp.watch(serverSources, ['server']);
});

gulp.task('clean', function(cb) {
   rimraf('./build', cb); 
});

gulp.task('build', ['client', 'server']);

gulp.task('default', ['build']);