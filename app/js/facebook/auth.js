import React from 'react';
import _ from 'lodash';

import AuthButton from './auth-button';

class FacebookAuth extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
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
            'facebookLoaded',
            'initFacebook',
            'handleFacebookLogin'
        ]);
    }

    componentDidMount() {
        this.initFacebook();
    }

    initFacebook() {
        // research some best practices for initializing sdks in react
        const facebookLoaded = this.facebookLoaded;

        window.fbAsyncInit = function() {
            FB.init({
                appId      : '1773319846264688',
                xfbml      : true,
                version    : 'v2.8'
            });
            FB.AppEvents.logPageView();
            FB.getLoginStatus((response) => {
                facebookLoaded(response);
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

    facebookLoaded(response) {
        this.setState({ connectionStatus: response.status });
    }

    handleFacebookLogin(response) {
        const { userID, expiresIn, accessToken } = response.authResponse || {};
        console.log(response);

        this.setState({
            connectionStatus: response.status,
            userID,
            expiresIn,
            accessToken
        });
    }

    renderChildren() {
        const { children } = this.props;
        const { userID, accessToken } = this.state;
        const childrenProps = {
            userID,
            accessToken
        };
        return React.Children.map(children, (child) => {
            return React.cloneElement(child, childrenProps);
        });
    }

    render() {
        const { connectionTextMap , connectionStatus, userID, accessToken } = this.state;
        const isFacebookLoaded = typeof(FB) === 'object';
        const isConnected = connectionStatus === 'connected';

        return (
            <div>
                <h2>Facebook Auth</h2>
                Connection Status: { connectionTextMap[connectionStatus] || 'shit! :\'(' }
                { isFacebookLoaded && (
                    <AuthButton
                        connectionStatus={ this.state.connectionStatus }
                        handleFacebookLogin={ this.handleFacebookLogin }
                    />
                ) }
                { isConnected && this.renderChildren() }
            </div>
        );
    }
}

export default FacebookAuth;
