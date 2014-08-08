angular.module('d3.services', [])
    .factory('d3Service', function($document, $q, $rootScope) {
        var d = $q.defer(),
            scriptTag = $document[0].createElement('script'),
            s = $document[0].getElementsByTagName('body')[0];

        scriptTag.type = 'text/javascript';
        scriptTag.async = true;
        scriptTag.src = 'http://d3js.org/d3.v3.min.js'
        scriptTag.onreadystatechange = function() {
            if(this.readState === 'complete') {
                onScriptLoad();
            }
        };
        scriptTag.onload = onScriptLoad;

        s.appendChild(scriptTag);

        function onScriptLoad() {
            $rootScope.$apply(function() {
                d.resolve(window.d3);
            });
        };

        return {
            d3: function() {
                return d.promise;
            }
        };
    });
