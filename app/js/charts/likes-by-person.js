import React from 'react';
import _ from 'lodash';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

class LikesByPerson extends React.Component {

    render() {
        const { likes } = this.props;
        const { keys }  = Object;
        const likesData = [];
        const likesKeys = keys(likes);
        const nameCount = likesKeys.length;
        const yAxisLabelHeight = 25;
        const chartHeight = nameCount * yAxisLabelHeight;
        const marginFormat = {
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5
                };

        likesKeys.map((likeKey) => {
            const likeGroup = likes[likeKey];
            const likeGraphObject = {
                name: likeGroup[0].name,
                count: likeGroup.length
            };
            likesData.push(likeGraphObject);
        });

        return (
            <div className="chart-container">
                <h3 className="chart-title">Total Likes By Person</h3>
                <div className="chart-box">
                    <div className="chart-header">
                        <input className="chart-filter" />
                    </div>
                    <ResponsiveContainer height={ 30 } width="100%">
                        <BarChart
                             data={ _.sortBy(likesData, ['count']).reverse() }
                             layout="vertical"
                             margin={ marginFormat }
                        >
                            <XAxis dataKey="count" type="number" orientation="top" />
                            <YAxis width={ 200 } />
                            <CartesianGrid strokeDasharray="3 3"/>
                        </BarChart>
                    </ResponsiveContainer>
                    <div className="chart-body">
                        <ResponsiveContainer height={ chartHeight } width="100%">
                            <BarChart
                                 data={ _.sortBy(likesData, ['count']).reverse() }
                                 layout="vertical"
                                 margin={ marginFormat }
                            >
                                <XAxis style={ { display: 'none' } } dataKey="count" type="number" />
                                <YAxis dataKey="name" type="category" width={ 200 } />
                                <CartesianGrid strokeDasharray="3 3"/>
                                <Tooltip/>
                                <Bar dataKey="count" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        );
    }
};

export default LikesByPerson;
