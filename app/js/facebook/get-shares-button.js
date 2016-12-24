import React from 'react';
import _ from 'lodash';

class GetSharesButton extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            shares: {},
            path: '/sharedposts',
            params: {
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
            >Get Shares</button>
        );
    }
};

export default GetSharesButton;
