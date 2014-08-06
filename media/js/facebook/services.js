angular.module('facebook.services', [])
    .factory('facebookDataFactory', function($facebook, facebookPostCache){
        var facebookAPI = {},
            facebookPromise;

        facebookAPI.getPostedStatuses = function() {
            facebookPromise = $facebook.api('/v2.0/me/statuses?limit=100');
            return facebookPromise;
        }; 

        facebookAPI.getPostedPhotos = function() {
            facebookPromise = $facebook.api('/v2.0/me/photos/uploaded?limit=100');
            return facebookPromise;
        }; 

        facebookAPI.getPostedVideos = function() {
            facebookPromise = $facebook.api('/v2.0/me/videos/uploaded?limit=100');
            return facebookPromise;
        }; 

        facebookAPI.getPostedLinks = function() {
            facebookPromise = $facebook.api('/v2.0/me/links?limit=100');
            return facebookPromise;
        }; 

        facebookAPI.updateCacheData = function(facebookPostData, requestComplete) {
            var allComplete = requestComplete.gotStatuses === true && 
                              requestComplete.gotPhotos === true && 
                              requestComplete.gotVideos === true && 
                              requestComplete.gotLinks === true;
            if(allComplete) {
                facebookPostCache.put('facebookPostData', facebookPostData);
                console.log("facebookPostCache.get('facebookPostData')");
                console.log(facebookPostCache.get('facebookPostData'));
            }

            //return allComplete;
        };

        return facebookAPI;
    })
    .factory('facebookUserCache', function($cacheFactory) {
        return $cacheFactory('facebookUserData');
    })
    .factory('facebookPostCache', function($cacheFactory) {
        return $cacheFactory('facebookPostData');
    })
    .factory('facebookAuthFactory', function($facebook, facebookUserCache) {
        var facebookAuth = {};

        facebookAuth.isLoggedIn = false;
        facebookAuth.userData = {};

        facebookAuth.getCredentials = function() {
            return $facebook
                .api('/me')
                .then(function(response) {
                        // set new cache on login
                        var userData = {
                            "id": response.id,
                            "name": response.name,
                            "first_name": response.first_name,
                            "last_name": response.last_name
                        };
                        facebookAuth.isLoggedIn = true;
                        facebookUserCache.put('facebookUserData', userData);
                    },
                    function(error) {
                        // pass through for now
                        facebookUserCache.put('facebookUserData', {});
                    });
        };

        facebookAuth.logout = function() {
            return $facebook
                .logout()
                .then(function(response) {
                        facebookAuth.isLoggedIn = false;
                        facebookDataCache.put('facebookData', {});
                    },
                    function(error) {
                        // pass through for now
                    });
        };

        return facebookAuth;
    });
