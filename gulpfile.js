var gulp = require('gulp');
var concat = require('gulp-concat');
var minify = require('gulp-minify');
var cleanCss = require('gulp-clean-css');
var rev = require('gulp-rev');
var del = require('del');
var inject = require('gulp-inject');
var htmlmin = require('gulp-htmlmin');

//TODO: add imgmin capability, right now only copying the files


gulp.task('clean-js', function () {
	return del([
		'./docs/js/*.js'
	]);
});
 
gulp.task('clean-css', function () {
	return del([
		'./docs/css/*.css'
	]);
});

gulp.task('clean-html', function () {
	return del([
		'./docs/*.html'
	]);
});

gulp.task('clean-images', function () {
	return del([
		'./docs/img/**/*'
	]);
});

gulp.task('pack-js', ['clean-js'], function () {	
	return gulp.src('./src/js/*.js')
        .pipe(concat('main.js'))
        .pipe(minify({
            ext:{
                min:'.js'
            },
            noSource: true
        }))
        .pipe(rev())
        .pipe(gulp.dest('./docs/js'))
        .pipe(rev.manifest('./docs/rev-manifest.json', {
            merge: true
        }))
        .pipe(gulp.dest(''));
});
 
gulp.task('pack-css', ['clean-css'], function () {	
	return gulp.src('./src/css/*.css')
        .pipe(concat('main.css'))
        .pipe(cleanCss())
        .pipe(rev())
        .pipe(gulp.dest('./docs/css'))
        .pipe(rev.manifest('./docs/rev-manifest.json', {
            merge: true
        }))
        .pipe(gulp.dest(''));
});

gulp.task('pack-images', ['clean-images'], function () {
    var target = gulp.src(['./src/img/**/*'])
    return target.pipe(gulp.dest('./docs/img'))
})

gulp.task('transport-html', ['clean-html'], function () {
    var target = gulp.src('./src/*.html');
    return target.pipe(gulp.dest('./docs'))
})

gulp.task('pack-html', ['transport-html'], function () {
    process.chdir('./docs')
    var target = gulp.src('./*.html');
    var sources = gulp.src(['./js/*.js', './css/*.css'], {read: false});
   
    return target.pipe(inject(sources))
        .pipe(htmlmin({
            collapseWhitespace: true,
            minifyCSS: true,
            minifyJS: true,
            removeComments: true
        }))
        .pipe(gulp.dest('./'));
  });


gulp.task('default', ['pack-js', 'pack-css', 'pack-html', 'pack-images'])