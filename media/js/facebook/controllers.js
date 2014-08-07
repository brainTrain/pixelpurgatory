angular.module('facebook.controllers', [])
    .controller('facebookController', function($facebook, $filter, facebookDataFactory, facebookUserCache, facebookPostCache, facebookGraphCache, facebookAuthFactory) {
        var vm = this;
        vm.isLoggedIn = facebookAuthFactory.isLoggedIn;
        vm.FBLogin =  function() {
            $facebook
                .login()
                .then(function() {
                    facebookAuthFactory
                        .getCredentials()
                        .then(function() {
                            vm.isLoggedIn = facebookAuthFactory.isLoggedIn;
                            vm.facebookUserData = facebookUserCache.get('facebookUserData');
                        }, function() {
                            // pass through errorz
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
                    clearDownloadStatus();
                }, function() {
                    // pass through errorz
                });
        };

        vm.getAllPosts =  function() {
            clearDownloadStatus();
            var facebookPostData = facebookPostCache.get('facebookPostData') || {},
                requestComplete = {
                    "gotStatuses" : false,
                    "gotPhotos" : false,
                    "gotVideos" : false,
                    "gotLinks" : false
                },
                isComplete = false;

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
                    isComplete = facebookDataFactory.updateCacheData(facebookPostData, requestComplete);
                    if(isComplete) {
                        _getGraphy();
                    }
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
                    isComplete = facebookDataFactory.updateCacheData(facebookPostData, requestComplete);
                    if(isComplete) {
                        _getGraphy();
                    }
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
                    isComplete = facebookDataFactory.updateCacheData(facebookPostData, requestComplete);
                    if(isComplete) {
                        _getGraphy();
                    }
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
                    isComplete = facebookDataFactory.updateCacheData(facebookPostData, requestComplete);
                    if(isComplete) {
                        _getGraphy();
                    }
                });
        };

        vm.sortStuffs =  function(sortType) {
            var unsortedArray = facebookGraphCache.get('facebookGraphData'), 
                newOrder = $filter('orderBy')(unsortedArray, 'likes.photos.count', true)

            vm.graphArray = newOrder;
        };

        function _getGraphy() {
            var graphArray = facebookDataFactory.convertGraphData();
            facebookGraphCache.put('facebookGraphData', graphArray);

            vm.graphArray = graphArray;
        };
        function clearDownloadStatus() {
            vm.statusesFinish = '';
            vm.photosFinish = '';
            vm.videosFinish = '';
            vm.linksFinish = '';

            vm.graphArray = [];
        };

    });
