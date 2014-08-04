angular.module('facebook.controllers', [])
    .controller('facebookController', ['$facebook', '$scope', 'facebookAPIService', function($facebook, $scope, facebookAPIService) {
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
                });
        };
        $scope.getMyShit =  function() {
            facebookAPIService
                    .getPostedStatuses()
                    .then(function(response) {
                            $scope.uglyFeed = response;
                        },
                        function(error) {
                            $scope.uglyFeed = 'damn, errorz :\'(';
                        });
        };
        function logMeIn() {
            $facebook
                .api('/me')
                .then(function(response) {
                        $scope.yo = 'whatup ' + response.name + '?';
                        $scope.isLoggedIn = true;
                    },
                    function(error) {
                        $scope.yo = 'gotta log in dawg';
                    });
        }
        logMeIn();
    }]);
