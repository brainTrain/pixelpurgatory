angular
    .module('facebookStats', [
        'base',
        'ngFacebook',
        'facebook.controllers',
        'facebook.services'
    ])
    .config(function($facebookProvider){
        $facebookProvider
            .setAppId('1446543078942368') // prod id
            .setPermissions('read_stream,user_photos')
            .setCustomInit({
                version: 'v2.0'
            });
    })
    .run(function($rootScope) {
        (function() {
            // only load if facebook isn't already loaded
            if(!document.getElementById('facebook-jssdk')) {
                var firstScriptElement = document.getElementsByTagName('script')[0], 
                    facebookJS = document.createElement('script'); 

                facebookJS.src = '//connect.facebook.net/en_us/all.js';
                firstScriptElement.parentNode.insertBefore(facebookJS, firstScriptElement);
            }
        }());
    });
