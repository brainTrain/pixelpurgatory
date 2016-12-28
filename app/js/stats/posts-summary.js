import React from 'react';
import _ from 'lodash';

class PostsSummary extends React.Component {

    render() {
        const { posts } = this.props;
        const { keys } = Object;
        const postsCount = keys(posts).length;
        const postsCountText = `Number of posts: ${postsCount}`;

        return (
            <div>{ postsCountText }</div>
        );
    }
};

export default PostsSummary;
