import React from 'react';
import _ from 'lodash';

class Buttons extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            types: [
                'profile',
                'posts',
                'likes',
                'reactions',
                'comments',
                'sharedposts'
            ],
            postTypes: [
                'likes',
                'reactions',
                'comments',
                'sharedposts'
            ],
            posts: {},
            profile: {},
            likes: {},
            reactions: {},
            comments: {},
            sharedposts: {},
            buttonText: {
                profile: 'Get Profile',
                posts: 'Get Posts',
                likes: 'Get Likes',
                reactions: 'Get Reactions',
                sharedposts: 'Get Shared Posts',
                comments: 'Get Comments'
            },
            path: {
                profile: '/me',
                posts: '/feed',
                likes: '/likes',
                reactions: '/reactions',
                comments: '/comments',
                sharedposts: '/sharedposts'
            },
            pathCallback: {
                profile: (path) => path,
                posts: (path) => `/${ this.props.userID }${path}`,
                likes: (path, postID) => `/${postID}${path}`,
                reactions: (path, postID) => `/${postID}${path}`,
                comments: (path, postID) => `/${postID}${path}`,
                sharedposts: (path, postID) => `/${postID}${path}`,
            },
            params: {
                profile: {
                    fields: 'first_name,last_name'
                },
                posts: {
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
                },
                likes: {
                    limit: 100,
                    fields: [
                        'link',
                        'name',
                        'picture'
                    ].join(',')
                },
                reactions: {
                    limit: 100,
                    fields: [
                        'type',
                        'link',
                        'name',
                        'picture'
                    ].join(',')
                },
                sharedposts: {
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
                },
                comments: {
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
            }
        };

        _.bindAll(this, [
            'getData',
            'getPostData',
            'handleGetData',
            'debug'
        ]);
    }

    getPostData(type) {
        const { posts } = this.state;
        const postKeys = Object.keys(posts);
        postKeys.map((postID) => this.getData(type, postID));
        console.log('get dat post data');
    }

    getData(type, postID) {
        const { path, pathCallback, params } = this.state;
        FB.api(pathCallback[type](path[type], postID), 'get', params[type], (response) => {
            this.handleGetData(response, type, postID);
        });
    }

    handleGetData(response, type, postID) {
        console.log(`repsoonse: ${type}`, response);
        const { paging } = response;
        const currentData = this.state[type];
        const newRecord = {};
        response.data && response.data.map((item) => {
            const { id } = item;
            item.postID = postID;
            newRecord[id] = item;
        });
        const updatedData = Object.assign(currentData, newRecord);
        this.setState({ [type]: updatedData });

        // keep on goin!
        if(paging && paging.next) {
            FB.api(paging.next, (response) => {
                this.handleGetData(response, type, postID);
            });
        }
    }

    renderButtons() {
        const { types, buttonText, postTypes } = this.state;
        const disabled = true;
        return types.map((type, index) =>
            <button
                onClick={ () => {
                    if(postTypes.includes(type)) {
                        this.getPostData(type);
                    } else {
                        this.getData(type);
                    }
                } }
                key={ index }
            >
                { buttonText[type] }
            </button>
        );
    }

    debug() {
        debugger;
    }

    render() {
        const { profile, posts, likes, reactions, comments, sharedposts } = this.state;
        const postsCount = Object.keys(posts).length;
        const likesCount = Object.keys(posts).length;
        const reactionsCount = Object.keys(posts).length;
        const commentsCount = Object.keys(posts).length;
        const sharedPostsCount = Object.keys(posts).length;

        return (
            <div className="button-container">
                <h3>Get some Facebook info for: { profile.name || 'gotta hit the button bro' }</h3>
                { this.renderButtons() }
                <button onClick={ this.debug }>debugger</button>
                <ul>
                    <li>Posts: { postsCount }</li>
                    <li>Likes: { likesCount }</li>
                    <li>Comments: { commentsCount }</li>
                    <li>Reactions: { reactionsCount }</li>
                    <li>Shared Posts: { sharedPostsCount }</li>
                </ul>
            </div>
        );
    }
};

export default Buttons;
