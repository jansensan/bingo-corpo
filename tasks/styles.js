const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));


const configV1 = require('../gulp-config').styles;


module.exports = compileStyles;


function compileStyles() {
  const { src, dist } = configV1;

  return gulp.src(src)
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest(dist));
}
