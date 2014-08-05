angular.module('facebook.controllers', [])
    .controller('facebookController', ['$facebook', '$scope', 'facebookAPIService', 'facebookAPICache', function($facebook, $scope, facebookAPIService, facebookAPICache) {
        $scope.isLoggedIn = false;
        $scope.FBLogin =  function() {
            $facebook
                .login()
                .then(function() {
                    logMeIn();  
                });
        };
        $scope.FBLogout =  function() {
            $facebook
                .logout()
                .then(function(){
                    $scope.yo = 'gotta log in dawg';
                    $scope.uglyFeed = '';
                    $scope.isLoggedIn = false;
                })
                .finally(function(){
                    // clear out cache when the user logs out
                    facebookAPICache.put('facebookAPIData', {})
                    // clear out statuses
                    $scope.statusesFinish = '';
                    $scope.photosFinish = '';
                    $scope.videosFinish = '';
                    $scope.linksFinish = '';
                });
        };
        $scope.getMyShit =  function() {
            var facebookData = facebookAPICache.get('facebookAPIData'),
                requestComplete = {
                    "gotStatuses" : false,
                    "gotPhotos" : false,
                    "gotVideos" : false,
                    "gotLinks" : false
                };

            // update the until value so we know when these requests were made
            // and make sure that sucker's an int so I don't have to do conversions elsewhere
            facebookData.data.until = parseInt(new Date().getTime()/1000, 10);

            facebookAPIService
                .getPostedStatuses()
                .then(function(success) {
                        facebookData.data.statuses = success.data;
                        $scope.statusesFinish = 'successfully got statuses';
                    }, function(error) {
                        facebookData.data.statuses = [];
                        $scope.statusesFinish = 'error getting statuses';
                })
                .finally(function() {
                    requestComplete.gotStatuses = true;    
                    updateCacheData(facebookData, requestComplete);
                });
            facebookAPIService
                .getPostedPhotos()
                .then(function(success) {
                        facebookData.data.photos = success.data;
                        $scope.photosFinish = 'successfully got photos';
                    }, function(error) {
                        facebookData.data.photos = [];
                        $scope.photosFinish = 'error getting photos';
                })
                .finally(function() {
                    requestComplete.gotPhotos = true;
                    updateCacheData(facebookData, requestComplete);
                });
            facebookAPIService
                .getPostedVideos()
                .then(function(success) {
                        facebookData.data.videos = success.data;
                        $scope.videosFinish = 'successfully got videos';
                    }, function(error) {
                        facebookData.data.videos = [];
                        $scope.videosFinish = 'error getting videos';
                })
                .finally(function() {
                    requestComplete.gotVideos = true;
                    updateCacheData(facebookData, requestComplete);
                });
            facebookAPIService
                .getPostedLinks()
                .then(function(success) {
                        facebookData.data.links = success.data;
                        $scope.linksFinish = 'successfully got links';
                    }, function(error) {
                        facebookData.links = [];
                        $scope.linksFinish = 'failed getting links';
                })
                .finally(function() {
                    requestComplete.gotLinks = true;
                    updateCacheData(facebookData, requestComplete);
                });
        };
        function logMeIn() {
            $facebook
                .api('/me')
                .then(function(response) {
                        // set new cache on login
                        var cachedResponse = {
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

                        $scope.yo = 'whatup ' + response.name + '?';
                        $scope.isLoggedIn = true;

                        facebookAPICache.put('facebookAPIData', cachedResponse)
                    },
                    function(error) {
                        $scope.yo = 'gotta log in dawg';
                    });
        };
        function updateCacheData(facebookData, requestComplete) {
            var allComplete = requestComplete.gotStatuses === true && requestComplete.gotPhotos === true && requestComplete.gotVideos === true && requestComplete.gotLinks === true ;
            if(allComplete) {
                facebookAPICache.put('facebookAPIData', facebookData);
            }
        };

        logMeIn();
    }]);
