'use strict';

import gulp from 'gulp';
import config from '../config';
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import babelify from 'babelify';
import rev from 'gulp-rev';
import uglify from 'gulp-uglify';

gulp.task('scripts', () => {
    // Grabs the app.js file
    const { src, fileName, devDest, prodDest } = config.scripts;

    return browserify(`${src}/${fileName}`)
        .transform(babelify, {presets: ['es2015', 'react']})
        // bundles it and creates a file named index.js
        .bundle()
        .pipe(source(fileName))
        .pipe(gulp.dest(devDest))
        .pipe(buffer())
        .pipe(uglify())
        //.pipe(rev())
        //.pipe(rev.manifest())
        // saves it the config prodDest directory
        .pipe(gulp.dest(prodDest));
});
