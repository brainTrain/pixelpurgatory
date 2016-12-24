import React from 'react';

import FacebookAuth from './facebook/auth';

import GetProfileButton from './facebook/get-profile-button';
import GetPostsButton from './facebook/get-posts-button';

import GetReactionsButton from './facebook/get-reactions-button';
import GetLikesButton from './facebook/get-likes-button';
import GetSharesButton from './facebook/get-shares-button';
import GetCommentsButton from './facebook/get-comments-button';

class PixelPurgatory extends React.Component {
    render() {
        return (
            <div>
                <h1>Pixel Purgatory</h1>
                <FacebookAuth>
                    <GetProfileButton />
                    <GetPostsButton>
                        <GetLikesButton />
                        <GetReactionsButton />
                        <GetSharesButton />
                        <GetCommentsButton />
                    </GetPostsButton>
                </FacebookAuth>
            </div>
        );
    }
}

export default PixelPurgatory;
