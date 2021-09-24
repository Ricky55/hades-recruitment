// Import packages
const {src, dest, watch, series, parallel} = require('gulp'),
sass = require('gulp-sass'),
autoprefixer = require('autoprefixer'),
cssnano = require('cssnano'),
concat = require('gulp-concat'),
uglify = require('gulp-uglify'),
postcss = require('gulp-postcss'),
sourcemaps = require('gulp-sourcemaps'),
imagemin = require('gulp-imagemin'),
svgSymbols = require('gulp-svg-symbols');

// File paths array
const files = {
	scssPath: 'src/scss/**/*.scss',
	cssPath: 'dist/_/css',
	jsDest: 'dist/_/js',
	svgSource: 'src/img/svg-sprite/*.svg',
	svgDest: 'dist/_/img/svg-sprite',
	imgSource: 'src/img/*',
	imgDest: 'dist/_/img'
}

// Process scss task
function scssProcess() {
	return src(files.scssPath)
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(postcss([ autoprefixer(), cssnano() ]))
		.pipe(sourcemaps.write('.'))
		.pipe(dest(files.cssPath)
	);
}

// Process javascript task
function jsProcess() {
	return src(['src/js/jquery.js',
		'src/js/odometer.js',
		'src/js/app.js'])
		.pipe(concat('global.min.js'))
		.pipe(uglify())
		.pipe(dest(files.jsDest)
	);
}

// Optimise Images
function imgOptim() {
	return src(files.imgSource)
		.pipe(imagemin([ 
			imagemin.optipng({optimizationLevel: 5}),
			imagemin.mozjpeg({quality: 95, progressive: true})
		]))
		.pipe(dest(files.imgDest)
	);
}

// Optimise SVG
function svgOptim() {
	return src(files.svgSource)
		.pipe(imagemin())
		.pipe(dest('src/img/svg-sprite')
	);
}

// Create SVG Sprite
function sprite() {
	return src(files.svgSource)
		.pipe(svgSymbols({
                title: false,
            	templates: ['default-svg']
            }))
		.pipe(dest(files.svgDest)
	);
}

// Task that optimises the svgs and then creates the sprite
exports.svg = series(
	svgOptim,
	sprite
);

// Watch task
function watchTask() {
	watch([files.scssPath],
		parallel(scssProcess));
}

// Setup Default task
exports.default = series(
	scssProcess,
	watchTask
);

// Run separate tasks
exports.scss = scssProcess;
exports.jsProcess = jsProcess;
exports.svgOptim = svgOptim;
exports.sprite = sprite;
exports.imgOptim = imgOptim;



