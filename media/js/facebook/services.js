angular.module('facebook.services', [])
    .factory('facebookDataFactory', function($facebook){
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

        return facebookAPI;
    })
    .factory('facebookDataCache', function($cacheFactory) {
        return $cacheFactory('facebookData');
    })
    .factory('facebookAuthFactory', function($facebook, facebookDataCache) {
        var facebookAuth = {};

        facebookAuth.isLoggedIn = false;
        facebookAuth.userData = {};

        facebookAuth.login = function() {
            return $facebook
                .api('/me')
                .then(function(response) {
                        // set new cache on login
                        var authedResponse = {
                            "user": {
                                "id": response.id,
                                "name": response.name,
                                "first_name": response.first_name,
                                "last_name": response.last_name
                            },
                            "data": {
                                "until": "",
                                "links": [],
                                "statuses": [],
                                "photos": []
                            }
                        };

                        facebookAuth.isLoggedIn = true;
                        facebookDataCache.put('facebookData', authedResponse);
                    },
                    function(error) {
                        // pass through for now
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
