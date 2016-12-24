import React from 'react';
import _ from 'lodash';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

class GetLikesButton extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            likes: {},
            path: '/likes',
            params: {
                limit: 100,
                fields: [
                    'link',
                    'name',
                    'picture',
                    'id',
                    'updated_time'
                ].join(',')
            }
        };

        _.bindAll(this, [
            'getData',
            'getPostData',
            'handleGetData',
            'renderChart'
        ]);
    }

    getPostData() {
        const { posts } = this.props;
        const postKeys = Object.keys(posts);
        postKeys.map((postID) => {
            this.getData(postID);
        });
    }

    getData(postID) {
        const { path, pathCallback, params } = this.state;
        const likesPath = `${postID}${path}`;
        FB.api(likesPath, 'get', params, (response) => {
            this.handleGetData(response, postID);
        });
    }

    handleGetData(response, postID) {
        const { likes } = this.state;
        console.log(`repsoonse: likes`, response);
        const { data, paging } = response;
        const likeData = likes;
        data && data.map((item) => {
            const { id } = item;
            const stringID = `${id}`;
            
            if(likeData[stringID]) likeData[stringID].push(item);
            if(!likeData[stringID]) {
                likeData[stringID] = [item];
            }
        });

        this.setState({ likes: likeData });
    }

    renderChart() {
        const { likes } = this.state;
        const likesData = [];
        const likesKeys = Object.keys(likes);

        likesKeys.map((likeKey) => {
            const likeGroup = likes[likeKey];
            const likeGraphObject = {
                name: likeGroup[0].name,
                count: likeGroup.length
            };
            likesData.push(likeGraphObject);
        });

        return (
            <ResponsiveContainer height={ 600 } width="100%">
                <BarChart
                     data={ _.sortBy(likesData, ['count']).reverse() }
                     margin={
                        {
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5
                        }
                    }
                >
                    <XAxis dataKey="name"/>
                    <YAxis/>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <Tooltip/>
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
        );
    }

    render() {
        const chart = this.renderChart();

        return (
            <div>
                <button
                    onClick={ this.getPostData }
                >Get Likes</button>
                { chart }
            </div>
        );
    }
};

export default GetLikesButton;
