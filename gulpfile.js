const gulp = require('gulp');
const eslint = require('gulp-eslint');
const gulpIf = require('gulp-if');
const clear = require('cli-clear');

const JS_FILES = ['src/**/*.js', 'src/**/*.jsx', 'test/**/*.js', 'test/**/*.jsx'];

const ESLINT_OPTIONS = {
    fix: true
};

function isFixed(file) {
    return file.eslint !== null && file.eslint.fixed;
}

gulp.task('clear', () => clear());

gulp.task('eslint', ['clear'], () => {
    return gulp.src(JS_FILES, { base: './' })
        .pipe(eslint(ESLINT_OPTIONS))
        .pipe(eslint.format())
        .pipe(gulpIf(isFixed, gulp.dest('./')))
        .pipe(eslint.failAfterError());
});

gulp.task('eslint:watch', ['clear'], () => {
    return gulp.watch(JS_FILES, ['eslint']);
});
