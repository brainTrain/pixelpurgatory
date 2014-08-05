angular.module('facebook.services', [])
    .factory('facebookAPIService', function($facebook){
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
    .factory('facebookAPICache', function($cacheFactory) {
        return $cacheFactory('facebookAPIData');
    });
