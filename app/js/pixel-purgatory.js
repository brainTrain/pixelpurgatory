import React from 'react';

import FacebookAuth from './facebook/auth';

import Profile from './facebook/profile';
import Posts from './facebook/posts';

import Reactions from './facebook/reactions';
import Likes from './facebook/likes';
import Shares from './facebook/shares';
import Comments from './facebook/comments';

class PixelPurgatory extends React.Component {
    render() {
        return (
            <div className="app-container">
                <h1 className="app-title">Pixel Purgatory</h1>
                <FacebookAuth>
                    <Profile />
                    <Posts>
                        <Likes />
                        <Reactions />
                        <Shares />
                        <Comments />
                    </Posts>
                </FacebookAuth>
            </div>
        );
    }
}

export default PixelPurgatory;
