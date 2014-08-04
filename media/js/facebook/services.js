angular.module('facebook.services', [])
    .factory('facebookAPIService', function($facebook){
        var facebookAPI = {},
            facebookPromise;

        facebookAPI.getPostedStatuses = function() {
            facebookPromise = $facebook.api('/v2.0/me/posts');

            return facebookPromise;
        }; 

        facebookAPI.getPostedPhotos = function() {
            facebookPromise = $facebook.api('/v2.0/me/photos/uploaded');
            return facebookPromise;
        }; 

        facebookAPI.getPostedLinks = function() {
            facebookPromise = $facebook.api('/v2.0/me/links');
            return facebookPromise;
        }; 

        return facebookAPI;
    });
