angular.module('facebook.directives', [])
    .directive('d3Bars', function($window, d3Service, facebookGraphCache) {
        return {
            restrict: 'EA',
            scope: {
                data: '='
            },
            link: function(scope, element, attrs) {
                d3Service.d3()
                    .then(function(d3) {
                        console.log('d3');
                        console.log(d3);
                        var margin = parseInt(attrs.margin) || 20,
                            barHeight = parseInt(attrs.barHeight) || 20,
                            barPadding = parseInt(attrs.barPadding) || 5,
                            svg = d3.select(element[0])
                                    .append('svg')
                                    .style('width', '100%');
                        $window.onresize = function() {
                            scope.$apply();
                        };

                        //scope.data = facebookGraphCache.get('facebookGraphData');
                        scope.data = [
                            {name: "Greg", score: 98},
                            {name: "Ari", score: 96},
                            {name: 'Q', score: 75},
                            {name: "Loser", score: 48}
                        ];

                        scope.$watch(function() {
                            return angular.element($window)[0].innerWidth;
                        }, function() {
                            scope.render(scope.data);
                        });

                        scope.render = function(data) {
                            console.log('data');
                            console.log(data);
                            // clean up previous svg'z
                            svg.selectAll('*').remove();
                            // only do this stuff if we get data
                            if(data) {
                                var width = d3.select(element[0])[0][0].offsetWidth - margin,
                                    height = scope.data.length * (barHeight + barPadding),
                                    color = d3.scale.category20(),
                                    xScale = d3.scale.linear()
                                                .domain([0, d3.max(data, function(d) { 
                                                    return d.score; 
                                                })])
                                                .range([0, width]);

                                svg.attr('height', height);
                                svg.selectAll('rect')
                                    .data(data)
                                    .enter()
                                        .append('rect')
                                        .attr('height', barHeight)
                                        .attr('width', 140)
                                        .attr('x', Math.round(margin/2))
                                        .attr('y', function(d, i) {
                                            return i * (barHeight + barPadding); 
                                        })
                                        .attr('fill', function(d) {
                                            return color(d.score);
                                        })
                                        .transition()
                                            .duration(1000)
                                            .attr('width', function(d) {
                                                return xScale(d.score);
                                            });

                            }
                        };

                        scope.$watch('data', function(newVals, oldVals) {
                            return scope.render(newVals);
                        }, true);
                    });

            }
        };
    });
