angular.module('facebook.controllers', [])
    .controller('facebookController', function($facebook, facebookDataFactory, facebookDataCache, facebookAuthFactory) {
        var vm = this;
        vm.isLoggedIn = facebookAuthFactory.isLoggedIn;
        vm.FBLogin =  function() {
            facebookAuthFactory
                .login()
                .then(function() {
                    vm.isLoggedIn = facebookAuthFactory.isLoggedIn;
                    vm.facebookData = facebookDataCache.get('facebookData');
                });
        };
        vm.FBLogout =  function() {
            $facebook
                .logout()
                .then(function(){
                })
                .finally(function(){
                    // clear out cache when the user logs out
                    vm.isLoggedIn = false;
                    vm.facebookData = facebookDataCache.get('facebookData');
                    //facebookDataCache.put('facebookData', {})
                    // clear out statuses
                    vm.statusesFinish = '';
                    vm.photosFinish = '';
                    vm.videosFinish = '';
                    vm.linksFinish = '';
                });
        };
        vm.getIt =  function() {
            vm.statusesFinish = '';
            vm.photosFinish = '';
            vm.videosFinish = '';
            vm.linksFinish = '';

            var facebookData = facebookDataCache.get('facebookData'),
                requestComplete = {
                    "gotStatuses" : false,
                    "gotPhotos" : false,
                    "gotVideos" : false,
                    "gotLinks" : false
                };

            // update the until value so we know when these requests were made
            // and make sure that sucker's an int so I don't have to do conversions elsewhere
            facebookData.data.until = parseInt(new Date().getTime()/1000, 10);

            facebookDataFactory
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
            facebookDataFactory
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
            facebookDataFactory
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
            facebookDataFactory
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
        function updateCacheData(facebookData, requestComplete) {
            var allComplete = requestComplete.gotStatuses === true && 
                              requestComplete.gotPhotos === true && 
                              requestComplete.gotVideos === true && 
                              requestComplete.gotLinks === true;
            if(allComplete) {
                facebookDataCache.put('facebookData', facebookData);
                console.log(facebookDataCache.get('facebookData'));
            }
        };
    });
