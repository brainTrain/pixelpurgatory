angular.module('facebook.controllers', [])
    .controller('facebookController', function($facebook, facebookAPIService, facebookAPICache) {
        var vm = this;
        vm.isLoggedIn = false;
        vm.FBLogin =  function() {
            $facebook
                .login()
                .then(function() {
                    logMeIn();  
                });
        };
        vm.FBLogout =  function() {
            $facebook
                .logout()
                .then(function(){
                    vm.yo = 'gotta log in dawg';
                    vm.uglyFeed = '';
                    vm.isLoggedIn = false;
                })
                .finally(function(){
                    // clear out cache when the user logs out
                    facebookAPICache.put('facebookAPIData', {})
                    // clear out statuses
                    vm.statusesFinish = '';
                    vm.photosFinish = '';
                    vm.videosFinish = '';
                    vm.linksFinish = '';
                });
        };
        vm.getIt =  function() {
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
                        vm.statusesFinish = 'successfully got statuses';
                    }, function(error) {
                        facebookData.data.statuses = [];
                        vm.statusesFinish = 'error getting statuses';
                })
                .finally(function() {
                    requestComplete.gotStatuses = true;    
                    updateCacheData(facebookData, requestComplete);
                });
            facebookAPIService
                .getPostedPhotos()
                .then(function(success) {
                        facebookData.data.photos = success.data;
                        vm.photosFinish = 'successfully got photos';
                    }, function(error) {
                        facebookData.data.photos = [];
                        vm.photosFinish = 'error getting photos';
                })
                .finally(function() {
                    requestComplete.gotPhotos = true;
                    updateCacheData(facebookData, requestComplete);
                });
            facebookAPIService
                .getPostedVideos()
                .then(function(success) {
                        facebookData.data.videos = success.data;
                        vm.videosFinish = 'successfully got videos';
                    }, function(error) {
                        facebookData.data.videos = [];
                        vm.videosFinish = 'error getting videos';
                })
                .finally(function() {
                    requestComplete.gotVideos = true;
                    updateCacheData(facebookData, requestComplete);
                });
            facebookAPIService
                .getPostedLinks()
                .then(function(success) {
                        facebookData.data.links = success.data;
                        vm.linksFinish = 'successfully got links';
                    }, function(error) {
                        facebookData.links = [];
                        vm.linksFinish = 'failed getting links';
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

                        vm.yo = 'whatup ' + response.name + '?';
                        vm.isLoggedIn = true;

                        facebookAPICache.put('facebookAPIData', cachedResponse);
                    },
                    function(error) {
                        vm.yo = 'gotta log in dawg';
                    });
        };
        function updateCacheData(facebookData, requestComplete) {
            var allComplete = requestComplete.gotStatuses === true && 
                              requestComplete.gotPhotos === true && 
                              requestComplete.gotVideos === true && 
                              requestComplete.gotLinks === true;
            if(allComplete) {
                facebookAPICache.put('facebookAPIData', facebookData);
                console.log(facebookAPICache.get('facebookAPIData'));
            }
        };

        logMeIn();
    });
