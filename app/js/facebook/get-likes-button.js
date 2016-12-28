import React from 'react';
import _ from 'lodash';

import LikesByPerson from '../charts/likes-by-person';
import LikesSummary from '../stats/likes-summary';

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
            'debug'
        ]);
    }

    getPostData() {
        this.setState({ fetchDone: false });
        const { posts } = this.props;
        const postKeys = Object.keys(posts);
        const postLikesPromises = postKeys.map((postID, index) => this.getData(postID));
        Promise.all(postLikesPromises).then(() => this.setState({ fetchDone: true }));
    }

    getData(postID, isLastFetch) {
        const { path, pathCallback, params } = this.state;
        const likesPath = `${postID}${path}`;
        return new Promise((resolve) => {
            FB.api(likesPath, 'get', params, (response) => {
                this.handleGetData(response, postID);
                resolve();
            });
        });
    }

    handleGetData(response, postID) {
        const { likes } = this.state;
        console.log(`repsoonse: likes`, response);
        const { data, paging } = response;
        const likeData = likes;
        data && data.map((item) => {
            const { id } = item;
            item.postID = postID;
            
            if(likeData[id]) likeData[id].push(item);
            if(!likeData[id]) {
                likeData[id] = [item];
            }
        });

        this.setState({ likes: likeData });
    }

    debug() {
        debugger;
    }

    render() {
        console.log(this.state.fetchDone);

        return (
            <div>
                <button
                    onClick={ this.getPostData }
                >Get Likes</button>
                <button onClick={ this.debug }>likes debugz</button>
                { this.state.fetchDone && (<LikesSummary likes={ this.state.likes } />) }
                { this.state.fetchDone && (<LikesByPerson likes={ this.state.likes } />) }
            </div>
        );
    }
};

export default GetLikesButton;
