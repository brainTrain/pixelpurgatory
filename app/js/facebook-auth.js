import React from 'react';
import _ from 'lodash';

import AuthButton from './facebook/auth-button';

class FacebookAuth extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            userID: undefined,
            accessToken: '',
            expiresIn: 0,
            connectionStatus: 'loading',
            connectionTextMap: {
                loading: 'Loading',
                connected: 'Connected',
                not_authorized: 'Please Authorize This App',
                unknown: 'Please Log In to Facebook'
            }
        };

        _.bindAll(this, [
            'facebookResponse',
            'initFacebook',
            'handleFacebookLogin'
        ]);
    }

    initFacebook() {
        // research some best practices for initializing sdks in react
        const facebookResponse = this.facebookResponse;

        window.fbAsyncInit = function() {
            FB.init({
                appId      : '1773319846264688',
                xfbml      : true,
                version    : 'v2.8'
            });
            FB.AppEvents.logPageView();
            FB.getLoginStatus((response) => {
                facebookResponse(response);
            });
        };

        (function(d, s, id){
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {return;}
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    }

    componentDidMount() {
        this.initFacebook();
    }

    facebookResponse(response) {
        console.log('response', response);
        this.setState({
            connectionStatus: response.status,
            loginButtonActionMap: {
                connected: FB.logout,
                not_authorized: FB.login,
                unknown: FB.login
            }
        });
    }

    handleFacebookLogin(response) {
        const { userID, expiresIn, accessToken } = response.authResponse || {};
        this.setState({
            connectionStatus: response.status,
            userID,
            expiresIn,
            accessToken
        });
    }

    render() {
        const { connectionTextMap , connectionStatus } = this.state;
        console.log(this.state);

        return (
            <div>
                <h2>Facebook Auth</h2>
                Connection Status: { connectionTextMap[connectionStatus] || 'shit! :\'(' }
                <AuthButton
                    connectionStatus={ this.state.connectionStatus }
                    handleFacebookLogin={ this.handleFacebookLogin }
                />
                { this.props.children }
            </div>
        );
    }
}

export default FacebookAuth;
