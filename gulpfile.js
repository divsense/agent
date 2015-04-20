var gulp = require("gulp");3
var lint = require('gulp-jshint');
var inline = require("gulp-inline-source");
var br = require('browserify');
var source = require('vinyl-source-stream');

gulp.task( "lint", function(){
	return gulp.src('./src/*.js')
			.pipe( lint({asi:true,expr:true,laxcomma:true,laxbreak:true}) )
			.pipe( lint.reporter('default') );
});

gulp.task( "main-bundle", function(){
return br('./src/main.js')
		.bundle()
		.pipe( source('bundle.js') )
		.pipe( gulp.dest('./build'));
});

gulp.task( "main", ["main-bundle"], function(){
	return gulp.src('./src/index.html')
			   .pipe( inline() )
			   .pipe( gulp.dest("./lib") )
});

gulp.task( "default", ["lint", "main"]);
					  


