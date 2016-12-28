import React from 'react';
import _ from 'lodash';

import PostsSummary from '../stats/posts-summary';

class GetPostsButton extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            posts: {},
            path: '/posts',
            params: {
                limit: 100,
                fields: [
                    'icon',
                    'from',
                    'link',
                    'message',
                    'message_tags',
                    'parent_id',
                    'permalink_url',
                    'picture',
                    'place',
                    'properties',
                    'shares',
                    'source',
                    'status_type',
                    'type',
                    'updated_time'
                ].join(',')
            }
        };

        _.bindAll(this, [
            'getData',
            'handleGetData',
            'renderChildren'
        ]);
    }

    getData() {
        const { path, pathCallback, params } = this.state;
        const { userID } = this.props;
        const postsPath = `/${userID}${path}`;
        FB.api(postsPath, 'get', params, this.handleGetData);
    }

    handleGetData(response) {
        console.log(`repsoonse: posts`, response);
        const { data, paging } = response;
        const currentData = this.state.posts;
        let newRecord = {};
        data && data.map((item) => {
            const { id } = item;
            newRecord[id] = item;
        });

        const updatedData = Object.assign(currentData, newRecord);
        this.setState({ posts: updatedData });

        // keep on goin!
        /*
        if(paging && paging.next) {
            FB.api(paging.next, (response) => {
                this.handleGetData(response);
            });
        }
        */
    }

    renderChildren() {
        const { children, userID, accessToken } = this.props;
        const { posts } = this.state;
        const childrenProps = {
            userID,
            accessToken,
            posts
        };
        return React.Children.map(children, (child) => {
            return React.cloneElement(child, childrenProps);
        });
    }

    render() {
        const { posts } = this.state;
        const { keys } = Object;
        const hasPosts = !_.isEmpty(posts);

        return (
            <div>
                <button onClick={ this.getData }>Get Posts</button>
                <PostsSummary posts={ posts } />
                <br />
                { hasPosts && this.renderChildren() }
            </div>
        );
    }
};

export default GetPostsButton;
