angular.module('facebook', [])
    .controller('FBController', ['$facebook', '$scope', function($facebook, $scope){
        $scope.isLoggedIn = false;
        $scope.FBLogin =  function() {
            $facebook
                .login()
                .then(function() {
                    refresh();  
                });
        };
        function refresh() {
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
        refresh();
    }]);
