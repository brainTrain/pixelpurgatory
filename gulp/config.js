'use strict';

export default {
    port: 6900,
    devDir: 'dev/',
    prodDir: 'public/',
    scripts: {
        fileName: 'index.js',
        watch: 'app/js/**/*.js',
        src: 'app/js',
        devDest: 'dev/js',
        prodDest: 'public/js/'
    },
    styles: {
        fileName: 'index.scss',
        watch: [
            'app/scss/**/*.scss',
            'app/js/**/*.scss'
        ],
        src: 'app/scss',
        devDest: 'dev/css',
        prodDest: 'public/css'
    },
    images: {
        src: 'app/images/**/*',
        devDest: 'dev/images',
        prodDest: 'public/images',
    },
    views: {
        src: 'app/index.html',
        devDest: 'dev/',
        prodDest: ''
    },
    svg: {
        src: 'app/icons/*.svg',
        devDest: 'dev/icons',
        prodDest: 'public/icons',
        config: {
            mode: {
                symbol: {
                    render: {
                        css: false,
                        scss: false
                    },
                    dest: 'sprite',
                    prefix: '.svg-%s',
                    example: false
                }
            }
        }
    },
    cdn: {
        prodBaseUrl: '/pixelpurgatory/public',
        devBaseUrl: '',
        files: [
            '/js/*.js',
            '/css/*.css',
            '/images/*.*',
            'dev/css/*.css',
            'public/css/*.css',
            'dev/js/*.js',
            'public/js/*.js',
            'dev/images/*.{jpg,jpeg,png,gif,svg,ico}',
            'public/images/*.{jpg,jpeg,png,gif,svg,ico}'
        ],
        imageFiles:[
            '/images/*.*'
        ]
    },
    facebook: {
        dev: {
            id: '1773319846264688'
        },
        prod: {
            id: '1788213181442021'
        }
    },
    manifest: {
        jsProdDest : 'public/js/rev-manifest.json',
        cssProdDest : 'public/css/rev-manifest.json'
    }
};
