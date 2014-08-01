angular
    .module('facebookStats', [
        'base',
        'ngFacebook',
        'facebook'
    ])
    .config(function($facebookProvider){
        $facebookProvider.setAppId('1446543078942368');
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
