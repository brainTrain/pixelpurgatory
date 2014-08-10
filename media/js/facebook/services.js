angular.module('facebook.services', [])
    .factory('facebookDataFactory', function($facebook, facebookPostCache, facebookGraphCache){
        var facebookAPI = {},
            facebookPromise;

        facebookAPI.queryParams = '?since=2014-01-08T16:02:49+0000&until=now&limit=100';

        facebookAPI.getPostedStatuses = function() {
            facebookPromise = $facebook.api('/v2.0/me/statuses' + facebookAPI.queryParams);
            return facebookPromise;
        }; 

        facebookAPI.getPostedLinks = function() {
            facebookPromise = $facebook.api('/v2.0/me/links' + facebookAPI.queryParams);
            return facebookPromise;
        }; 
        
        facebookAPI.getPostedPhotos = function() {
            facebookPromise = $facebook.api('/v2.0/me/photos/uploaded' + facebookAPI.queryParams);
            return facebookPromise;
        }; 

        facebookAPI.getPostedVideos = function() {
            facebookPromise = $facebook.api('/v2.0/me/videos/uploaded' + facebookAPI.queryParams);
            return facebookPromise;
        }; 

        facebookAPI.updateCacheData = function(facebookPostData, requestComplete) {
            var allComplete = requestComplete.gotStatuses === true && 
                              requestComplete.gotPhotos === true && 
                              requestComplete.gotVideos === true && 
                              requestComplete.gotLinks === true;
            if(allComplete) {
                facebookPostCache.put('facebookPostData', facebookPostData);
                console.log(facebookPostCache.get('facebookPostData'));
            }

            return allComplete;
        };

        facebookAPI.convertGraphData = function() {
            var rawPostData = facebookPostCache.get('facebookPostData'),
                statusLikes = _getLikes('statuses'),
                photoLikes = _getLikes('photos'),
                linkLikes = _getLikes('links'),
                videoLikes = _getLikes('videos');
                userLikesHash = _bucketLikesByUser(statusLikes, photoLikes, linkLikes, videoLikes),
                userLikesArray = [];

            _.each(userLikesHash, function(value, key) {
                userLikesArray.push(value);
            });

            return userLikesArray;
        };

        function _bucketLikesByUser(statusLikes, photoLikes, linkLikes, videoLikes) {
            var userHash = {},
                totalLikeCount,
                thisLikeCount;
            angular.forEach(statusLikes.likes, function(value, key) {
                if(!userHash[value.id]) {
                    userHash[value.id] = {
                        id: value.id,
                        name: value.name,
                        likes: {
                            "total": {
                                "count": 1
                            },
                            "statuses": {
                                "type": "statuses",
                                "count": 1
                            },
                            "photos": {
                                "type": "photos",
                                "count": 0
                            },
                            "videos": {
                                "type": "videos",
                                "count": 0
                            },
                            "links": {
                                "type": "links",
                                "count": 0
                            }
                        }
                    }
                } else {
                    totalLikeCount = userHash[value.id].likes.total.count;
                    thisLikeCount = userHash[value.id].likes['statuses'].count;

                    userHash[value.id].likes.total.count = totalLikeCount + 1;
                    userHash[value.id].likes['statuses'].count = thisLikeCount + 1;
                }
            });

            angular.forEach(linkLikes.likes, function(value, key) {
                if(!userHash[value.id]) {
                    userHash[value.id] = {
                        id: value.id,
                        name: value.name,
                        likes: {
                            "total": {
                                "count": 1
                            },
                            "statuses": {
                                "type": "statuses",
                                "count": 0
                            },
                            "photos": {
                                "type": "photos",
                                "count": 0
                            },
                            "videos": {
                                "type": "videos",
                                "count": 0
                            },
                            "links": {
                                "type": "links",
                                "count": 1
                            }
                        }
                    }
                } else {
                    totalLikeCount = userHash[value.id].likes.total.count;
                    thisLikeCount = userHash[value.id].likes['links'].count;

                    userHash[value.id].likes.total.count = totalLikeCount + 1;
                    userHash[value.id].likes['links'].count = thisLikeCount + 1;
                }
            });

            angular.forEach(photoLikes.likes, function(value, key) {
                if(!userHash[value.id]) {
                    userHash[value.id] = {
                        id: value.id,
                        name: value.name,
                        likes: {
                            "total": {
                                "count": 1
                            },
                            "statuses": {
                                "type": "statuses",
                                "count": 0
                            },
                            "photos": {
                                "type": "photos",
                                "count": 1
                            },
                            "videos": {
                                "type": "videos",
                                "count": 0
                            },
                            "links": {
                                "type": "links",
                                "count": 0
                            }
                        }
                    }
                } else {
                    totalLikeCount = userHash[value.id].likes.total.count;
                    thisLikeCount = userHash[value.id].likes['photos'].count;

                    userHash[value.id].likes.total.count = totalLikeCount + 1;
                    userHash[value.id].likes['photos'].count = thisLikeCount + 1;
                }
            });

            angular.forEach(videoLikes.likes, function(value, key) {
                if(!userHash[value.id]) {
                    userHash[value.id] = {
                        id: value.id,
                        name: value.name,
                        likes: {
                            "total": {
                                "count": 1
                            },
                            "statuses": {
                                "type": "statuses",
                                "count": 0
                            },
                            "photos": {
                                "type": "photos",
                                "count": 0
                            },
                            "videos": {
                                "type": "videos",
                                "count": 1
                            },
                            "links": {
                                "type": "links",
                                "count": 0
                            }
                        }
                    }
                } else {
                    totalLikeCount = userHash[value.id].likes.total.count;
                    thisLikeCount = userHash[value.id].likes['videos'].count;

                    userHash[value.id].likes['videos'].count = thisLikeCount + 1;
                    userHash[value.id].likes.total.count = totalLikeCount + 1;
                }
            });

            return userHash;
        };
        function _getLikes(postType) {
            var rawPostData = facebookPostCache.get('facebookPostData'),
                postArray = rawPostData[postType],
                likeArray = [],
                likeObject = {};

            angular.forEach(postArray, function(value, key) {
                if(value.likes && value.likes.data) {
                    // add the post id so I can bind links to graphs
                    angular.forEach(value.likes.data, function(value, key) {
                        value.postId = value.id;
                        likeArray.push(value);
                    });
                }
            });

            likeObject.likes = likeArray;
            likeObject.type = postType;

            return likeObject;
        };

        return facebookAPI;
    })
    .factory('facebookUserCache', function($cacheFactory) {
        return $cacheFactory('facebookUserData');
    })
    .factory('facebookPostCache', function($cacheFactory) {
        return $cacheFactory('facebookPostData');
    })
    .factory('facebookGraphCache', function($cacheFactory) {
        return $cacheFactory('facebookGraphData');
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
                        facebookUserCache.put('facebookUserData', {});
                    },
                    function(error) {
                        // pass through for now
                    });
        };

        return facebookAuth;
    });
