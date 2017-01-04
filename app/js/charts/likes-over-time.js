import React from 'react';
import _ from 'lodash';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

import { stringToObject } from '../format/date-time';

class LikesOverTime extends React.Component {

    constructor(props) {
        super(props);

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
            'changeSort'
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
        const likesData = [];
        const likesKeys = keys(likes);
        const postKeys = keys(posts);

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
            const dateObject = stringToObject(updated_time);
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

    render() {
        const { sortType, sortMap, buttonMap, likesData } = this.state;
        const yAxisLabelHeight = 25;
        const chartHeight = likesData.length * yAxisLabelHeight;
        const marginFormat = {
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5
                };

        const sortedData = _.sortBy(likesData, [sortType]).reverse();

        return (
            <div>
                <h3>Total Likes Over Time | Sorted By: { sortMap[sortType] }</h3>
                <button onClick={ this.changeSort }>Sort by { buttonMap[sortType] }</button>
                <ResponsiveContainer height={ 30 } width="100%">
                    <BarChart
                         data={ sortedData }
                         layout="vertical"
                         margin={ marginFormat }
                    >
                        <XAxis dataKey="count" type="number" orientation="top" />
                        <YAxis width={ 200 } />
                        <CartesianGrid strokeDasharray="3 3"/>
                    </BarChart>
                </ResponsiveContainer>
                <ResponsiveContainer height={ chartHeight } width="100%">
                    <BarChart
                         data={ sortedData }
                         layout="vertical"
                         margin={ marginFormat }
                    >
                        <XAxis dataKey="count" type="number" />
                        <YAxis dataKey="time" type="category" width={ 200 } />
                        <CartesianGrid strokeDasharray="3 3"/>
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        );
    }
};

export default LikesOverTime;
