angular.module('facebook', [])
    .controller('FBController', ['$facebook', '$scope', function($facebook, $scope){
        $scope.isLoggedIn = false;
        $scope.FBLogin =  function() {
            $facebook
                .login()
                .then(function() {
                    logMeIn();  
                });
        };
        $scope.getMyShit =  function() {
            $facebook
                .api('/v2.0/me/posts/?until=now')
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
