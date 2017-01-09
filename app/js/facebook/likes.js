import React from 'react';
import _ from 'lodash';

import LikesByPerson from '../charts/likes-by-person';
import LikesOverTime from '../charts/likes-over-time';
import LikesSummary from '../stats/likes-summary';

class Likes extends React.Component {
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
                    'updated_time',
                    'time_created'
                ].join(',')
            },
            fetchDone: false
        };

        _.bindAll(this, [
            'getData',
            'getPostData',
            'handleGetData'
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

    render() {
        const { posts } = this.props;

        return (
            <div className="likes-container">
                <button
                    onClick={ this.getPostData }
                >Get Likes</button>
                <div className="likes-data-wrapper">
                    { this.state.fetchDone && (<LikesSummary likes={ this.state.likes } />) }
                    { this.state.fetchDone && (<LikesByPerson likes={ this.state.likes } />) }
                    { this.state.fetchDone && (<LikesOverTime likes={ this.state.likes } posts={ posts } />) }
                </div>
            </div>
        );
    }
};

export default Likes;
