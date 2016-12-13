import React from 'react';
import _ from 'lodash';

class FacebookAuth extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            authToken: '',
            connectionStatus: 'loading',
            connectionTextMap: {
                'loading': 'Loading',
                'connected': 'Connected',
                'not_authorized': 'Please Authorize This App',
                'unknown': 'Please Log In to Facebook'
            }
        };

        _.bindAll(this, [
            'facebookResponse',
            'initFacebook'
        ]);
    }

    initFacebook() {
        // TODO: un-hack scoping issue
        // and research some best practices for initializing sdks in react
        const self = this;
        window.fbAsyncInit = function() {
            FB.init({
                appId      : '1773319846264688',
                xfbml      : true,
                version    : 'v2.8'
            });
            FB.AppEvents.logPageView();
            FB.getLoginStatus((response) => {
                self.facebookResponse(response);
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
        console.log(response);
        this.setState({connectionStatus: response.status});
    }

    render() {
        const { connectionTextMap , connectionStatus } = this.state;

        return (
            <div>
                <h2>Facebook Auth</h2>
                Connection Status: { connectionTextMap[connectionStatus] || 'Yikes! :\'(' }
                { this.props.children }
            </div>
        );
    }
}

export default FacebookAuth;
