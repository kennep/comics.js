var gulp = require('gulp');
var ts = require('gulp-typescript');
var merge = require('merge2');
 
var tsProject = ts.createProject('tsconfig.json', {
    declaration: true,
    noExternalResolve: true
});

var tsSources = ['typings/**/*.d.ts', 'common/*.ts', 'client/*.ts', 'server/*.ts'];
 
gulp.task('typescript', function() {
    var tsResult = gulp.src(tsSources)
                    .pipe(ts(tsProject));
 
    return merge([ // Merge the two output streams, so this task is finished when the IO of both operations are done. 
        tsResult.dts.pipe(gulp.dest('build/definitions')),
        tsResult.js.pipe(gulp.dest('build/output'))
    ]);
});
gulp.task('watch', ['typescript'], function() {
    gulp.watch(tsSources, ['typescript']);
});

gulp.task('default', ['typescript']);
