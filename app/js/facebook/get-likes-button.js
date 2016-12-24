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
            },
            fetchDone: false
        };

        _.bindAll(this, [
            'getData',
            'getPostData',
            'handleGetData',
            'renderChart',
            'renderCount'
        ]);
    }

    getPostData() {
        this.setState({ fetchDone: false });
        const { posts } = this.props;
        const postKeys = Object.keys(posts);
        postKeys.map((postID, index) => {
            const isLastFetch = index === postKeys.length - 1;
            this.getData(postID, isLastFetch);
        });
    }

    getData(postID, isLastFetch) {
        const { path, pathCallback, params } = this.state;
        const likesPath = `${postID}${path}`;
        FB.api(likesPath, 'get', params, (response) => {
            this.handleGetData(response, postID);
            // racey logic (get it? haaaa) just don't feel like promising much yet (oohhhh)
            if(isLastFetch) {
                this.setState({ fetchDone: true });
            }
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
        // early return if we are still fetching
        if(!this.state.fetchDone) return;

        const { likes } = this.state;
        const { keys }  = Object;
        const likesData = [];
        const likesKeys = keys(likes);

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

    renderCount() {
        // early return if we are still fetching
        if(!this.state.fetchDone) return;

        const { likes } = this.state;
        const { keys }  = Object;
        const likesKeys = keys(likes);
        let likesCount = 0;

        likesKeys.map((likeKey) => {
            const likeGroup = likes[likeKey];
            likesCount += likeGroup.length;
        });

        return `Number of Likes ${likesCount}`;
    }

    render() {
        const chart = this.renderChart();
        const count = this.renderCount();
        console.log(this.state.fetchDone);

        return (
            <div>
                <button
                    onClick={ this.getPostData }
                >Get Likes</button>
                { count }
                { chart }
            </div>
        );
    }
};

export default GetLikesButton;
