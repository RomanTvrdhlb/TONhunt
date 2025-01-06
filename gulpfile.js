const {
  src,
  dest,
  series,
  watch
} = require('gulp');
// const autoprefixer = require('autoprefixer');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const del = require('del');
const browserSync = require('browser-sync').create();
const sass = require('sass');
const gulpSass = require('gulp-sass');
// const svgmin = require('gulp-svgmin');
// const cheerio = require('gulp-cheerio');
// const replace = require('gulp-replace');
const fileInclude = require('gulp-file-include');
const rev = require('gulp-rev');
const revRewrite = require('gulp-rev-rewrite');
const revDel = require('gulp-rev-delete-original');
// const resolve = require('resolve');
const htmlmin = require('gulp-htmlmin');
const gulpif = require('gulp-if');
const notify = require('gulp-notify');
const image = require('gulp-imagemin');

// const webpack = require('webpack');

const {readFileSync} = require('fs');

const webp = require('gulp-webp');
const mainSass = gulpSass(sass);
const webpackStream = require('webpack-stream');
const plumber = require('gulp-plumber');
const path = require('path');
const zip = require('gulp-zip');
const rootFolder = path.basename(path.resolve());

const svgstore = require("gulp-svgstore");
const rename = require("gulp-rename");
const ico = require('gulp-to-ico');

// paths
const srcFolder = './source';
const buildFolder = './build';
const paths = {
  srcSvg: `${srcFolder}/img/sprite/*.svg`,
  srcImgFolder: `${srcFolder}/img`,
  buildImgFolder: `${buildFolder}/img`,
  buildSpriteFolder: `${buildFolder}/img/sprite`,
  srcScss: `${srcFolder}/scss/**/*.scss`,
  buildCssFolder: `${buildFolder}/css`,
  srcFullJs: `${srcFolder}/js/**/*.js`,
  srcMainJs: `${srcFolder}/js/main.js`,
  buildJsFolder: `${buildFolder}/js`,
  srcPartialsFolder: `${srcFolder}/partials`,
  resourcesFolder: `${srcFolder}/resources`,
  faviconFolder: `${srcFolder}/favicon`,
};

let isProd = false; // dev by default

const clean = () => {
  return del([buildFolder])
}

const json = () => {
  return src([`${srcFolder}/**/**.json`])
    // .pipe(avif())
    .pipe(dest(`${buildFolder}`))
};

const faviconIcon = () => {
  return src(`${paths.faviconFolder}/**/**.png`)
    .pipe(ico('favicon.ico'))
    .pipe(dest(`${buildFolder}`));
}

//svg sprite
const svgSprites = () => {
  return src(paths.srcSvg)
      .pipe(svgstore({
        inlineSvg: true
      }))
      .pipe(rename("sprite.svg"))
      .pipe(dest(paths.buildSpriteFolder));
}


// scss styles
const styles = () => {
  return src(paths.srcScss, { sourcemaps: !isProd })
    .pipe(plumber(
      notify.onError({
        title: "SCSS",
        message: "Error: <%= error.message %>"
      })
    ))
    .pipe(mainSass())
    .pipe(autoprefixer({
      cascade: false,
      grid: true,
      overrideBrowserslist: ["last 5 versions"]
    }))
    .pipe(gulpif(isProd, cleanCSS({
      level: 2
    })))
    .pipe(dest(paths.buildCssFolder, { sourcemaps: '.' }))
    .pipe(browserSync.stream());
};


// styles backend
const stylesBackend = () => {
  return src(paths.srcScss)
    .pipe(plumber(
      notify.onError({
        title: "SCSS",
        message: "Error: <%= error.message %>"
      })
    ))
    .pipe(mainSass())
    .pipe(autoprefixer({
      cascade: false,
      grid: true,
      overrideBrowserslist: ["last 5 versions"]
    }))
    .pipe(dest(paths.buildCssFolder))
    .pipe(browserSync.stream());
};

// scripts
const scripts = () => {
  return src(paths.srcMainJs)
    .pipe(plumber(
      notify.onError({
        title: "JS",
        message: "Error: <%= error.message %>"
      })
    ))
    .pipe(webpackStream({
      mode: isProd ? 'production' : 'development',
      output: {
        filename: 'main.js',
      },
      module: {
        rules: [
          {
            test: /\.m?js$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [
                  ['@babel/preset-env', {
                    targets: "defaults"
                  }]
                ]
              }
            }
          },
          {
            type: 'javascript/auto',
            test: /\.json$/,
            include: /(lottie)/,
            loader: 'lottie-web-webpack-loader',
            options: {
              assets: {
                scale: 0.5
              }
            }
          }
        ]
      },
      devtool: !isProd ? 'source-map' : false,
      resolve: {
        fallback: {
          "path": require.resolve("path-browserify")
        }
      }
    }))
    .on('error', function (err) {
      console.error('WEBPACK ERROR', err);
      this.emit('end');
    })
    .pipe(dest(paths.buildJsFolder))
    .pipe(browserSync.stream());
}

// scripts backend
const scriptsBackend = () => {
  return src(paths.srcMainJs)
    .pipe(plumber(
      notify.onError({
        title: "JS",
        message: "Error: <%= error.message %>"
      })
    ))
    .pipe(webpackStream({
      mode: 'development',
      output: {
        filename: 'main.js',
      },
      module: {
        rules: [{
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  targets: "defaults"
                }]
              ]
            }
          }
        }]
      },
      devtool: false,
      resolve: {
        fallback: {
          "path": require.resolve("path-browserify")
        }
      }
    }))
    .on('error', function (err) {
      console.error('WEBPACK ERROR', err);
      this.emit('end');
    })
    .pipe(dest(paths.buildJsFolder))
    .pipe(browserSync.stream());
}

const resources = () => {
  return src([
    `${paths.resourcesFolder}/**/*`
  ])
    .pipe(dest(buildFolder))
}

const images = () => {
  return src([`${paths.srcImgFolder}/**/**.{jpg,jpeg,png,svg,gif,ico}`])
    .pipe(gulpif(isProd, image([
      // image.mozjpeg({
      //   quality: 80,
      //   progressive: true
      // }),
      // image.optipng({
      //   optimizationLevel: 2
      // }),
    ])))
    .pipe(dest(paths.buildImgFolder))
};


const video = () => {
  return src([`${paths.srcImgFolder}/**/**.{mp4,webm}`])
    .pipe(dest(paths.buildImgFolder));
};

const webpImages = () => {
  return src([`${paths.srcImgFolder}/**/**.{jpg,jpeg,png}`])
    .pipe(webp())
    .pipe(dest(paths.buildImgFolder))
};

const pdfInclude = () => {
  return src([`${srcFolder}/*.pdf`])
    .pipe(dest(buildFolder))
    .pipe(browserSync.stream());
}

const htmlInclude = () => {
  return src([`${srcFolder}/*.html`])
    .pipe(fileInclude({
      prefix: '@',
      basepath: '@file'
    }))
    .pipe(dest(buildFolder))
    .pipe(browserSync.stream());
}

const watchFiles = () => {
  browserSync.init({
    server: {
      baseDir: `${buildFolder}`
    },
  });

  watch(paths.srcScss, styles);
  watch(paths.srcFullJs, scripts);
  watch(`${paths.srcPartialsFolder}/**/*.html`, htmlInclude);
  watch(`${srcFolder}/*.html`, htmlInclude);
  watch(`${paths.resourcesFolder}/**`, resources);
  watch(`${paths.srcImgFolder}/**/**.{jpg,jpeg,png,svg,gif}`, images);
  watch(`${paths.srcImgFolder}/**/**.{webm,mp4,MPEG-4}`, video);
  watch(`${paths.srcImgFolder}/**/**.{jpg,jpeg,png}`, webpImages);
  watch(paths.srcSvg, svgSprites);
}

const cache = () => {
  return src(`${buildFolder}/**/*.{css,js,svg,png,jpg,jpeg,webp,woff2, pdf,woff,webm, mp4}`, {
      base: buildFolder
    })
    .pipe(rev())
    .pipe(revDel())
    .pipe(dest(buildFolder))
    .pipe(rev.manifest('rev.json'))
    .pipe(dest(buildFolder));
};

const rewrite = () => {
  const manifest = readFileSync('build/rev.json');
  src(`${paths.buildCssFolder}/*.css`)
    .pipe(revRewrite({
      manifest
    }))
    .pipe(dest(paths.buildCssFolder));
  return src(`${buildFolder}/**/*.html`)
    .pipe(revRewrite({
      manifest
    }))
    .pipe(dest(buildFolder));
}

const htmlMinify = () => {
  return src(`${buildFolder}/**/*.html`)
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(dest(buildFolder));
}

const zipFiles = (done) => {
  del.sync([`${buildFolder}/*.zip`]);
  return src(`${buildFolder}/**/*.*`, {})
    .pipe(plumber(
      notify.onError({
        title: "ZIP",
        message: "Error: <%= error.message %>"
      })
    ))
    .pipe(zip(`${rootFolder}.zip`))
    .pipe(dest(buildFolder));
}

const toProd = (done) => {
  isProd = true;
  done();
};

exports.default = series(clean, htmlInclude, pdfInclude, json, scripts, styles, resources, faviconIcon ,images,  webpImages, video, svgSprites, watchFiles);

exports.backend = series(clean, htmlInclude, scriptsBackend, stylesBackend, resources, video,images, webpImages, svgSprites)

exports.build = series(toProd, clean, htmlInclude, json, scripts, styles, resources, faviconIcon ,video,images, webpImages, svgSprites, htmlMinify);

exports.cache = series(cache, rewrite);

exports.zip = zipFiles;
