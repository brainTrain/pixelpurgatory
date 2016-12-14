import React from 'react';
import _ from 'lodash';

class AuthButton extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            connectionStatus: this.props.connectionStatus,
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
            'facebookLogin'
        ]);
    }

    componentDidMount() {
        this.setState({
            loginButtonActionMap: {
                connected: FB.logout,
                not_authorized: FB.login,
                unknown: FB.login
            }
        });
    }

    componentWillReceiveProps(newProps, b) {
        const { connectionStatus } = newProps;
        this.setState({ connectionStatus });
    }

    facebookLogin() {
        const { connectionStatus, loginButtonActionMap } = this.state;
        const buttonAction = loginButtonActionMap[connectionStatus];
        buttonAction && buttonAction(this.props.handleFacebookLogin);
    }

    render() {
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
}

export default AuthButton;
