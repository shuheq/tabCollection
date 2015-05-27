// include
var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var compass = require('gulp-compass');
var pleeease = require('gulp-pleeease');
var plumber = require('gulp-plumber');
var notify  = require('gulp-notify');
var ejs = require("gulp-ejs");
var browser = require("browser-sync");

// reload
gulp.task("server", function() {
    browser({
        server: {
            baseDir: "../"
        }
    });
});

// ejs -> HTML
gulp.task('ejs', function(){

	// module
	gulp.src(['./views/**/*.html','!' + './views/template/_*.html'])
		.pipe(plumber({
  		errorHandler: notify.onError("Error: <%= error.message %>")
		}))
    .pipe(ejs())
		.pipe(gulp.dest('../'))
		.pipe(browser.reload({stream:true}));
});

// js -> 結合 -> minify
gulp.task('js', function(){

	gulp.src(['./scripts/*.js'])
		.pipe(plumber({
  		errorHandler: notify.onError("Error: <%= error.message %>")
		}))
		.pipe(concat('scripts.js'))
		.pipe(uglify({mangle: false}))
		.pipe(gulp.dest('../assets/scripts'))
		.pipe(browser.reload({stream:true}));

});


// SASS -> CSSビルド -> CSS prefix & minify
gulp.task('css', function(){

	// module
	gulp.src(['./sass/*.scss'])
	  .pipe(plumber({
  		errorHandler: notify.onError("Error: <%= error.message %>")
		}))
		.pipe(compass({
			sass: './sass'
			,css: '../assets/styles'
		}))
		.pipe(pleeease({
			fallbacks:{
				autoprefixer: true
			}
			,optimizers:{
				minifier: true
			}
		}))
		.pipe(gulp.dest('../assets/styles'))
		.pipe(browser.reload({stream:true}));
});


// third部品の結合処理
gulp.task('third', function(){

	// module js
	gulp.src(['./third/jquery-1.8.3.min.js'
		,'./third/jquery.easing-1.3.min.js'
		,'./third/jquery.cookie-1.4.1.min.js'
		]).pipe(concat('third.js'))
		.pipe(gulp.dest('../assets/scripts'));
});


// ファイルウォッチ
gulp.task('watch', function(){
  
  // ejs
	gulp.watch(['./views/*.html'], ['ejs']);
  
	// js
	gulp.watch(['./scripts/*.js'], ['js']);

	// css
	gulp.watch(['./sass/*.scss'], ['css']);
});

// デフォルト実行タスク
gulp.task('default', ['ejs', 'js', 'css', 'watch', 'server']);