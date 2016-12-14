import React from 'react';
import _ from 'lodash';

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
            },
            loginButtonTextMap: {
                connected: 'Logout',
                not_authorized: 'Authorize',
                unknown: 'Login'
            },
            loginButtonActionMap: {
                connected: () => {},
                not_authorized: () => {},
                unknown: () => {}
            }
        };

        _.bindAll(this, [
            'facebookResponse',
            'initFacebook',
            'facebookLogin',
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

    facebookLogin() {
        const { connectionStatus, loginButtonActionMap } = this.state;
        const buttonAction = loginButtonActionMap[connectionStatus];
        buttonAction && buttonAction(this.handleFacebookLogin);
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

    renderLogin() {
        const { connectionStatus, loginButtonTextMap } = this.state;
        const buttonText = loginButtonTextMap[connectionStatus];

        if (buttonText) {
            return (
                <button
                    onClick={ this.facebookLogin }
                >{ buttonText }</button>
            );
        }

        return null;
    }

    render() {
        const { connectionTextMap , connectionStatus } = this.state;
        const loginButton = this.renderLogin();
        console.log(this.state);

        return (
            <div>
                <h2>Facebook Auth</h2>
                Connection Status: { connectionTextMap[connectionStatus] || 'shit! :\'(' }
                { loginButton }
                { this.props.children }
            </div>
        );
    }
}

export default FacebookAuth;
