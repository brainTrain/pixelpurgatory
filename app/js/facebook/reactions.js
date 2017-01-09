import React from 'react';
import _ from 'lodash';

class Reactions extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            reactions: {},
            path: '/reactions',
            params: {
                limit: 100,
                fields: [
                    'type',
                    'link',
                    'name',
                    'picture'
                ].join(',')
            }
        };

        _.bindAll(this, [
            'getData'
        ]);
    }

    getData() {
    }

    render() {
        return (
            <button
                onClick={ this.getData }
            >Get Reactions</button>
        );
    }
};

export default Reactions;
