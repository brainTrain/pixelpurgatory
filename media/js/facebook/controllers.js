angular.module('facebook.controllers', [])
    .controller('facebookController', function($facebook, facebookDataFactory, facebookUserCache, facebookPostCache, facebookAuthFactory) {
        var vm = this;
        vm.isLoggedIn = facebookAuthFactory.isLoggedIn;
        vm.FBLogin =  function() {
            $facebook
                .login()
                .then(function() {
                    facebookAuthFactory
                        .getCredentials()
                        .finally(function() {
                            vm.isLoggedIn = facebookAuthFactory.isLoggedIn;
                            vm.facebookUserData = facebookUserCache.get('facebookUserData');
                        });
                });
        };
        vm.FBLogout =  function() {
            facebookAuthFactory
                .logout()
                .then(function() {
                    vm.isLoggedIn = facebookAuthFactory.isLoggedIn;
                    vm.facebookUserData = facebookUserCache.get('facebookUserData');
                    // clear out statuses
                    vm.statusesFinish = '';
                    vm.photosFinish = '';
                    vm.videosFinish = '';
                    vm.linksFinish = '';
                }, function() {
                    // pass through errorz
                });
        };
        vm.getAllPosts =  function() {
            vm.statusesFinish = '';
            vm.photosFinish = '';
            vm.videosFinish = '';
            vm.linksFinish = '';

            var facebookPostData = facebookPostCache.get('facebookPostData') || {},
                requestComplete = {
                    "gotStatuses" : false,
                    "gotPhotos" : false,
                    "gotVideos" : false,
                    "gotLinks" : false
                };

            // update the until value so we know when these requests were made
            // and make sure that sucker's an int so I don't have to do conversions elsewhere
            facebookPostData.until = parseInt(new Date().getTime()/1000, 10);

            facebookDataFactory
                .getPostedStatuses()
                .then(function(success) {
                        facebookPostData.statuses = success.data;
                        vm.statusesFinish = 'successfully got statuses';
                    }, function(error) {
                        facebookPostData.statuses = [];
                        vm.statusesFinish = 'error getting statuses';
                })
                .finally(function() {
                    requestComplete.gotStatuses = true;    
                    facebookDataFactory.updateCacheData(facebookPostData, requestComplete);
                });
            facebookDataFactory
                .getPostedPhotos()
                .then(function(success) {
                        facebookPostData.photos = success.data;
                        vm.photosFinish = 'successfully got photos';
                    }, function(error) {
                        facebookPostData.photos = [];
                        vm.photosFinish = 'error getting photos';
                })
                .finally(function() {
                    requestComplete.gotPhotos = true;
                    facebookDataFactory.updateCacheData(facebookPostData, requestComplete);
                });
            facebookDataFactory
                .getPostedVideos()
                .then(function(success) {
                        facebookPostData.videos = success.data;
                        vm.videosFinish = 'successfully got videos';
                    }, function(error) {
                        facebookPostData.videos = [];
                        vm.videosFinish = 'error getting videos';
                })
                .finally(function() {
                    requestComplete.gotVideos = true;
                    facebookDataFactory.updateCacheData(facebookPostData, requestComplete);
                });
            facebookDataFactory
                .getPostedLinks()
                .then(function(success) {
                        facebookPostData.links = success.data;
                        vm.linksFinish = 'successfully got links';
                    }, function(error) {
                        facebookPostData.links = [];
                        vm.linksFinish = 'failed getting links';
                })
                .finally(function() {
                    requestComplete.gotLinks = true;
                    facebookDataFactory.updateCacheData(facebookPostData, requestComplete);
                });
        };

    });
