import React from 'react';
import _ from 'lodash';

class Profile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            profile: {},
            path: '/me',
            params: {
                fields: [
                    'first_name',
                    'last_name'
                ].join(',')
            }
        };

        _.bindAll(this, [
            'getData',
            'handleGetData'
        ]);
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        const { path, pathCallback, params } = this.state;
        const { userID, accessToken } = this.props;
        const postsPath = `${path}?access_token=${accessToken}`;
        FB.api(postsPath, 'get', params, this.handleGetData);
    }

    handleGetData(response) {
        const updatedData = response;
        this.setState({ profile: updatedData });
    }

    render() {
        const { profile } = this.state;
        const { first_name, last_name } = profile;
        const name = `yo ${ first_name } ${ last_name }! `;

        return (
            <div className="profile-container">
                <h3 className="profile-title">Profile</h3>
                <h4 className="profile-name">{ !_.isEmpty(profile) && name }</h4>
            </div>
        );
    }
};

export default Profile;
