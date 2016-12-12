'use strict';

import gulp from 'gulp';
import sass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import config from '../config';
import buffer from 'vinyl-buffer';
import cdnizer from 'gulp-cdnizer';
import rev from 'gulp-rev';

gulp.task('styles', () => {
    const { src, fileName, devDest, prodDest } = config.styles;
    const { devBaseUrl, prodBaseUrl, imageFiles } = config.cdn;
    // TODO: figure out a DRY way to do this
    return gulp.src(`${src}/${fileName}`)
        .pipe(sass())
        .pipe(autoprefixer('last 2 versions', '> 1%', 'ie 8'))
        .pipe(cdnizer({
            files: imageFiles,
            defaultCDNBase: devBaseUrl
        }))
        .pipe(gulp.dest(devDest))
        .pipe(buffer())
        .pipe(gulp.src(`${src}/${fileName}`))
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(autoprefixer('last 2 versions', '> 1%', 'ie 8'))
        .pipe(cdnizer({
            files: imageFiles,
            defaultCDNBase: `${prodBaseUrl}`
        }))
        //.pipe(rev())
        //.pipe(rev.manifest())
        .pipe(gulp.dest(prodDest));
});
