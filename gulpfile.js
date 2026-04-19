import gulp from 'gulp';
const { src, dest, watch, series, parallel } = gulp;

import * as path from 'path';
import { fileURLToPath } from 'url';

import fileinclude from 'gulp-file-include';
import cssbeautify from 'gulp-cssbeautify';
import sourcemaps from 'gulp-sourcemaps';
import autoprefixer from 'gulp-autoprefixer';
import zip from 'gulp-zip';
import { deleteAsync } from 'del';
import concat from 'gulp-concat';

import sassCompiler from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(sassCompiler);

import browserSyncInstance from 'browser-sync';
const browserSync = browserSyncInstance.create();

const paths = {
  html: './src/html/pages/*.html',
  htmlWatch: './src/html/**/*.html',

  scss: './src/assets/sass/**/*.scss',
  mainScss: './src/assets/sass/main.scss',

  js: './src/assets/js/custom-lib/*.js',
  jsWatch: './src/assets/js/**/*.js',

  output: './src/',
};

export function style() {
  return src(paths.mainScss)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({ cascade: false }))
    .pipe(cssbeautify())
    .pipe(sourcemaps.write('.'))
    .pipe(dest('./src/assets/css'))
    .pipe(browserSync.stream());
}

export function htmlfileinclude() {
  return src(paths.html)
    .pipe(
      fileinclude({
        prefix: '@@',
        basepath: '@file',
      })
    )
    .pipe(dest(paths.output))
    .pipe(browserSync.stream());
}

export function scripts() {
  return src(paths.js)
    .pipe(concat('main.js'))
    .pipe(dest('./src/assets/js/'))
    .pipe(browserSync.stream());
}

export function clean() {
  return deleteAsync(['src/*.html']);
}

function serve(done) {
  browserSync.init({
    server: {
      baseDir: './src/',
    },
    notify: false,
  });
  done();
}

function watcher() {
  watch(paths.htmlWatch, htmlfileinclude);
  watch(paths.scss, style);
  watch(paths.js, scripts);

  watch(paths.htmlWatch).on('change', browserSync.reload);
  watch(paths.scss).on('change', browserSync.reload);
  watch(paths.jsWatch).on('change', browserSync.reload);
}

export function makeZip() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const currentDir = path.basename(__dirname);

  return src([
    'src/**',
    '!src/html/**',
    '!src/assets/sass/**',
    '!src/test.html',
    '!src/assets/css/*.map',
  ])
    .pipe(zip(`${currentDir}.zip`))
    .pipe(dest('./'));
}

export const build = series(clean, htmlfileinclude, style, scripts);
export const dev = series(build, serve, watcher);
export const zipBuild = series(build, makeZip);

// Default
export default dev;