import React from 'react';
import _ from 'lodash';
import LikesByPerson from '../charts/likes-by-person';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

class LikesSummary extends React.Component {

    render() {
        const { likes } = this.props;
        const { keys }  = Object;
        const likesKeys = keys(likes);
        let likesCount = 0;

        likesKeys.map((likeKey) => {
            const likeGroup = likes[likeKey];
            likesCount += likeGroup.length;
        });

        return (
            <ul>
                <li>Number of Likes: { likesCount }</li>
                <li>Number of friends: { likesKeys.length }</li>
            </ul>
        );
    }
};

export default LikesSummary;
