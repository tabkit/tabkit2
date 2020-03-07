// Code modified from
// https://60devs.com/development-of-cross-browser-browser-extensions-using-es6-babeljs.html

"use strict"

const gulp  = require("gulp")
const del   = require("del")
const babel = require("gulp-babel")
const zip   = require("gulp-zip")
const dateFormat = require("dateformat")
const Promise = require("bluebird")

require("any-promise/register")("bluebird", {Promise: Promise})
const fsp = require("mz/fs")
const fileExists = require("file-exists")


const build_path = "./build/"

// watch is helpful for development
function watch() {
  build_src()
  gulp.watch("./src/**/*.js", build_src_js)
  gulp.watch("./src/**/*.css", build_src_css)
  gulp.watch(
    [
      "./src/**/*",
      "!./src/**/*.js",
      "!./src/**/*.css",
    ],
    build_src_static_files,
  )
}

function clean_build() {
  return del([
    build_path,
  ])
}

// we"re building js for ff
function build_src_js() {
  return gulp.src([
    "./src/**/*.js",
  ])
  .pipe(babel())
  .on("error", console.error.bind(console))
  .pipe(gulp.dest(build_path))
}

// we can tweak our css. E.g. auto-prefix it but
// here we just copy it
function build_src_css() {
  return gulp.src([
    "./src/**/*.css",
  ])
  .on("error", console.error.bind(console))
  .pipe(gulp.dest(build_path))
}

function build_src_static_files() {
  return gulp.src([
    "./src/**/*",
    "!./src/**/*.js",
    "!./src/**/*.css",
  ])
  .on("error", console.error.bind(console))
  .pipe(gulp.dest(build_path))
}

// a single command for each piece
const build_src = gulp.series(
  clean_build,
  gulp.parallel(
    build_src_js,
    build_src_css,
    build_src_static_files,
  ),
)


function build_xpi_official_release_impl() {
  const final_install_rdf_path = "./src/install.rdf"
  const product_path = "./product"
  const product_ext = ".xpi"

  return fsp.readFile(final_install_rdf_path, {encoding: "utf8"})
  .then(function (content) {
    const matchData = /<em:version>(.+)<\/em:version>/i.exec(content)
    return matchData[1]
  })
  .then(function (version_string) {
    if (typeof version_string !== "string" || version_string.length === 0) {
      throw new Error("Something is wrong, version is nil")
    }

    let product_filename = `tabkit2_${version_string}`

    if (fileExists.sync(`${product_path}/${product_filename}${product_ext}`)) {
      let now = new Date()
      product_filename = `${product_filename}-${dateFormat(now, "yyyy-mm-dd-hhMMss")}`
    }

    return gulp.src(`${build_path}/**/*`)
    .pipe(zip(`${product_filename}${product_ext}`))
    .pipe(gulp.dest(product_path))
  })
}

const build_xpi_official_release = gulp.series(
  build_src,
  build_xpi_official_release_impl,
)

exports.default = watch
exports.clean_build = clean_build
exports.watch = watch
exports.build_xpi_official_release = build_xpi_official_release
