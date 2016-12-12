/*
TODO: determine if I need this (think may not)
'use strict';

import config from '../config';
import gulp from 'gulp';
import htmlclean from 'gulp-htmlclean';
import templateCache from 'gulp-angular-templatecache';
import fs from 'fs';
import path from 'path';
import rename from 'gulp-rename';

// builds a list of all folders in the directory
function getFolders(dir) {
    let folders = [];
    fs.readdirSync(dir)
        .filter(file => fs.statSync(path.join(dir, file)).isDirectory())
        .map(module => {
            let subfolders = getFolders(dir + module + '/');
            if (subfolders.length > 0) {
                subfolders.map(subFolder => folders.push(module + '/' + subFolder))
            } else {
                folders.push(module);
            }
        });
    return folders;
}
gulp.task('templates', () => {
    // Process the template files inside app/js
    const scriptsPath = config.templates.src;
    const folders = getFolders(scriptsPath);

    return folders.map(folder => {
        let names = folder.split('/');
        let moduleName = names.join('.') + '.templates';
        let fileName = moduleName + '.js';
        
        return gulp.src(scriptsPath + folder + '/*.html')
            .pipe(htmlclean())
            .pipe(templateCache({
                standalone: true,
                module: moduleName,
                root: folder,
                moduleSystem: 'Browserify'
            }))
            .pipe(rename(fileName))
            .pipe(gulp.dest(scriptsPath + folder));
    });
});
*/
