import React from 'react';
import _ from 'lodash';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

import { stringToDate } from '../date-time/format';

class LikesOverTime extends React.Component {

    constructor(...props) {
        super(...props);

        this.state = {
            sortType: 'timeInt',
            sortMap: {
                'timeInt': 'Time',
                'count': 'Likes'
            },
            buttonMap: {
                'timeInt': 'Likes',
                'count': 'Time'
            },
            likesData: []
        };

        _.bindAll(this, [
            'changeSort',
            'onDataClick'
        ]);
    }

    componentDidMount() {
        const likesData = this.formatData();
        this.setState({ likesData });
    }

    changeSort() {
        let newSortType = 'timeInt';
        const { sortType } = this.state;

        if(sortType === 'timeInt') newSortType = 'count';

        this.setState({ sortType: newSortType });
    }

    formatData() {
        const { likes, posts } = this.props;
        const { keys }  = Object;
        const likesKeys = keys(likes);
        const postKeys = keys(posts);

        const likesData = [];
        likesKeys.map((likeKey) => {
            const likeGroup = likes[likeKey];
            const name = likeGroup[0].name;

            likeGroup.map((like) => {
                const { id, postID } = like;
                const post = posts[postID];
                // oh no, not the immutables! Monster!! D':<
                if (!post.likeIDs) {
                    post.likeIDs = [id];
                } else {
                    post.likeIDs.push(id);
                }

            });

        });

        postKeys.map((postKey) => {
            const post = posts[postKey];
            const { updated_time, likeIDs } = post;
            const dateObject = stringToDate(updated_time);
            const count = likeIDs ? likeIDs.length : 0;

            const likeGraphObject = {
                postID: postKey,
                count,
                time: updated_time,
                timeInt: dateObject.getTime()
            };

            likesData.push(likeGraphObject);
        });

        return likesData;
    }

    onDataClick({ postID }) {
        const { posts } = this.props;
        const post = posts[postID];
        const { permalink_url } = post;

        window.open(permalink_url, '_blank');
    }

    render() {
        const { sortType, sortMap, buttonMap, likesData } = this.state;
        const yAxisLabelHeight = 15;
        const chartHeight = likesData.length * yAxisLabelHeight;
        const marginFormat = {
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5
                };

        const graphData = _.sortBy(likesData, [sortType]).reverse();

        return (
            <div className="chart-container">
                <h3 className="chart-title">
                    Total Likes Over Time | Sorted By: { sortMap[sortType] }
                </h3>
                <div className="chart-box">
                    <div className="chart-header">
                        <button onClick={ this.changeSort }>Sort by { buttonMap[sortType] }</button>
                    </div>
                    <ResponsiveContainer height={ 30 } width="100%">
                        <BarChart
                             data={ graphData }
                             layout="vertical"
                             margin={ marginFormat }
                        >
                            <XAxis dataKey="count" type="number" orientation="top" />
                            <YAxis width={ 200 } />
                            <CartesianGrid strokeDasharray="3 3"/>
                        </BarChart>
                    </ResponsiveContainer>
                    <div className="chart-body">
                        <ResponsiveContainer height={ chartHeight } width="100%">
                            <BarChart
                                 data={ graphData }
                                 layout="vertical"
                                 margin={ marginFormat }
                            >
                                <XAxis style={ { display: 'none' } } dataKey="count" type="number" />
                                <YAxis dataKey="time" type="category" width={ 200 } />
                                <CartesianGrid strokeDasharray="3 3"/>
                                <Tooltip />
                                <Bar
                                    onClick={ this.onDataClick }
                                    dataKey="count"
                                    fill="#8884d8"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        );
    }
};

export default LikesOverTime;
