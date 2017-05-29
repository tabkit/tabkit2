// Code modified from
// https://60devs.com/development-of-cross-browser-browser-extensions-using-es6-babeljs.html

"use strict";

const gulp  = require("gulp");
const gulpsync = require("gulp-sync")(gulp);
const del   = require("del");
const babel = require("gulp-babel");
const zip   = require("gulp-zip");
const dateFormat = require("dateformat");
const Promise = require("bluebird");

require("any-promise/register")("bluebird", {Promise: Promise});
const fsp = require("mz/fs");
const fileExists = require("file-exists");


const build_path = "./build/";

// watch is helpful for development
gulp.task("watch", ["build:src"], function() {
  gulp.watch("./src/**/*.js", ["build:src:js"]);
  gulp.watch("./src/**/*.css", ["build:src:css"]);
  gulp.watch(
    [
      "./src/**/*",
      "!./src/**/*.js",
      "!./src/**/*.css",
    ],
    ["build:src:static_files"]);
});

gulp.task("clean:build", function () {
  return del.sync([
    build_path,
  ]);
});

// we"re building js for ff
gulp.task("build:src:js", function() {
  return gulp.src([
    "./src/**/*.js",
  ])
  .pipe(babel())
  .on("error", console.error.bind(console))
  .pipe(gulp.dest(build_path));
});

// we can tweak our css. E.g. auto-prefix it but
// here we just copy it
gulp.task("build:src:css", function() {
  return gulp.src([
    "./src/**/*.css",
  ])
  .on("error", console.error.bind(console))
  .pipe(gulp.dest(build_path));
});

gulp.task(
  "build:src:static_files",
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

gulp.task(
  "build:xpi:official_release", ["build:src"],
  function() {
    const final_install_rdf_path = "./src/install.rdf";
    const product_path = "./product";
    const product_ext = ".xpi";

    return fsp.readFile(final_install_rdf_path, {encoding: "utf8"})
    .then(function(content) {
      const matchData = /<em:version>(.+)<\/em:version>/i.exec(content);
      return matchData[1];
    })
    .then(function(version_string) {
      if (typeof version_string !== "string" || version_string.length === 0) {
        throw new Error("Something is wrong, version is nil");
      }

      let product_filename = `tabkit2_${version_string}`;

      if (fileExists.sync(`${product_path}/${product_filename}${product_ext}`)) {
        let now = new Date();
        product_filename = `${product_filename}-${dateFormat(now, "yyyy-mm-dd-hhMMss")}`;
      }

      return gulp.src(`${build_path}/**/*`)
      .pipe(zip(`${product_filename}${product_ext}`))
      .pipe(gulp.dest(product_path));
    });
  }
);

// a single command for each piece
gulp.task(
  "build:src",
  gulpsync.sync([
    "clean:build",
    [
      "build:src:static_files",
      "build:src:js",
      "build:src:css",
    ],
  ])
);
