import React from 'react';

import Buttons from './buttons';
import FacebookAuth from './facebook/auth';

class PixelPurgatory extends React.Component {
    render() {
        return (
            <div>
                <h1>Pixel Purgatory</h1>
                <FacebookAuth>
                    <h3>Buttons</h3>
                    <Buttons />
                </FacebookAuth>
            </div>
        );
    }
}

export default PixelPurgatory;
