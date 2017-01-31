// Code modified from
// https://60devs.com/development-of-cross-browser-browser-extensions-using-es6-babeljs.html

"use strict";

var gulp  = require("gulp");
var del   = require("del");
var babel = require("gulp-babel");

var build_path = "./build/";

// watch is helpful for development
gulp.task("watch", ["build"], function() {
  gulp.watch("./src/**/*.js", ["build:process:js"]);
  gulp.watch("./src/**/*.css", ["build:process:css"]);
});

gulp.task("clean:build", function () {
  return del.sync([
    build_path,
  ]);
});

// we"re building js for ff
gulp.task("build:process:js", function() {
  return gulp.src([
    "./src/**/*.js",
  ])
  .pipe(babel())
  .on("error", console.error.bind(console))
  .pipe(gulp.dest(build_path));
});

// we can tweak our css. E.g. autoprefix it but
// here we just copy it
gulp.task("build:process:css", function() {
  return gulp.src([
    "./src/**/*.css",
  ])
  .on("error", console.error.bind(console))
  .pipe(gulp.dest(build_path));
});

gulp.task(
  "build:copy:all-files",
  [
    "clean:build",
  ],
  function() {
    return gulp.src([
      "./src/**/*",
      "!./src/**/*.js",
      "!./src/**/*.css",
    ])
    .on("error", console.error.bind(console))
    .pipe(gulp.dest(build_path));
  }
);

// a single command for each piece
gulp.task("build", [
  "build:copy:all-files",
  "build:process:js",
  "build:process:css",
]);
