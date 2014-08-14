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
                            barTitle = attrs.graphTitle || '',
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
                            // TODO: there's gotta be a better way than parent traversals to do this
                            return scope.$parent.fb.graphArray;
                        }, function(graphArray) {
                            scope.graphArray = graphArray;
                            scope.graphType = scope.$parent.fb.graphType;

                            return scope.render(scope.graphArray);
                        });
                        scope.clearCurrentGraph = function() {
                            svg.selectAll('*').remove();
                        };
                        scope.render = function(graphArray) {
                            // clean up previous svg'z
                            scope.clearCurrentGraph();
                            // only do this stuff if we get data
                            if(graphArray) {

                                var width = d3.select(element[0])[0][0].offsetWidth - margin,
                                    height = scope.graphArray.length * (barHeight + barPadding),
                                    graphType = scope.graphType || 'total',
                                    xScale = d3.scale
                                                .linear()
                                                .domain([0, d3.max(graphArray, function(d) { 
                                                    return d.likes[graphType].count; 
                                                })])
                                                .range([0, width]),
                                    leftMargin = 203;

                                                
                                svg.attr('height', height);
                                svg.selectAll('rect')
                                    .data(graphArray)
                                    .enter()
                                        .append('rect')
                                        .attr('height', barHeight)
                                        .attr('width', 40)
                                        .attr('x', leftMargin)
                                        .attr('y', function(d, i) {
                                            return i * (barHeight + barPadding); 
                                        })
                                        .attr('fill', '#3b5998')
                                        .transition()
                                            .duration(1000)
                                            .attr('width', function(d) {
                                                return xScale(d.likes[graphType].count);
                                            });
                                svg.selectAll('name-text')
                                    .data(graphArray)
                                    .enter()
                                        .append('text')
                                        .attr('fill', '#333')
                                        .attr('y', function(d, i) {
                                            return i * (barHeight + barPadding) + 15;
                                        })
                                        .attr('x', 15)
                                        .text(function(d) {
                                            return d.name;
                                        });

                                svg.selectAll('count-text')
                                    .data(graphArray)
                                    .enter()
                                        .append('text')
                                        .attr('fill', '#fff')
                                        .attr('y', function(d, i) {
                                            return i * (barHeight + barPadding) + 15;
                                        })
                                        .attr('x', leftMargin + 5)
                                        .text(function(d) {
                                            return d.likes[graphType].count;
                                        });

                            }
                        };
                    });

            }
        };
    });
