angular.module('d3.directives', [])
    .directive('d3Bars', function($window, $filter, d3Service, facebookGraphCache) {
        return {
            restrict: 'EA',
            scope: {
                data: '='
            },
            link: function(scope, element, attrs) {
                d3Service.d3()
                    .then(function(d3) {
                        var margin = parseInt(attrs.margin) || 20,
                            barHeight = parseInt(attrs.barHeight) || 20,
                            barPadding = parseInt(attrs.barPadding) || 5,
                            svg = d3.select(element[0])
                                    .append('svg')
                                    .style('width', '100%');

                        // watches window resize event for rendering graph
                        $window.onresize = function() {
                            scope.$apply();
                        };
                        scope.$watch(function() {
                            return angular.element($window)[0].innerWidth;
                        }, function() {
                            scope.render(scope.graphArray);
                        });
                        // watches facebook controller's graphArray change for rendering graph
                        scope.$watch(function() {
                            return scope.$parent.fb.graphArray;
                        }, function(graphArray) {
                            scope.graphArray = graphArray;
                            return scope.render(scope.graphArray);
                        });

                        scope.render = function(graphArray) {
                            // clean up previous svg'z
                            svg.selectAll('*').remove();
                            // only do this stuff if we get data
                            if(graphArray) {
                                var width = d3.select(element[0])[0][0].offsetWidth - margin,
                                    height = scope.graphArray.length * (barHeight + barPadding),
                                    color = d3.scale.category20(),
                                    xScale = d3.scale.linear()
                                                .domain([0, d3.max(graphArray, function(d) { 
                                                    return d.likes.total.count; 
                                                })])
                                                .range([0, width]);

                                svg.attr('height', height);
                                svg.selectAll('rect')
                                    .data(graphArray)
                                    .enter()
                                        .append('rect')
                                        .attr('height', barHeight)
                                        .attr('width', 140)
                                        .attr('x', Math.round(margin/2))
                                        .attr('y', function(d, i) {
                                            return i * (barHeight + barPadding); 
                                        })
                                        .attr('fill', function(d) {
                                            return color(d.likes.total.count);
                                        })
                                        .transition()
                                            .duration(1000)
                                            .attr('width', function(d) {
                                                return xScale(d.likes.total.count);
                                            });
                                svg.selectAll('text')
                                    .data(graphArray)
                                    .enter()
                                        .append('text')
                                        .attr('fill', '#545450')
                                        .attr('y', function(d, i) {
                                            return i * (barHeight + barPadding) + 15;
                                        })
                                        .attr('x', 15)
                                        .text(function(d) {
                                            return d.name  + " total(" + d.likes.total.count + ")";
                                        })
                            }
                        };
                        /*
                        scope.$watch('graphArray', function(newVals, oldVals) {
                            console.log('hmmm');
                            console.log(newVals);
                            return scope.render(newVals);
                        }, true);
                        */
                    });

            }
        };
    });
