import React from 'react';
import _ from 'lodash';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';


class LikesByPerson extends React.Component {

    constructor(...props) {
        super(...props);

        this.state = {
            filterQuery: '',
            likesData: []
        };

        _.bindAll(this, [
            'filterData',
            'formatData',
            'setFilterQuery',
            'filterByName'
        ]);

        // lovingly lifted from http://jsfiddle.net/seanodotcom/rerd3b87/
        // we need to de bounce, but can't debounce the handler directly
        // since event.persist() doesn't appear to keep the event around
        // so we can't access data from it async, instead we need to debounce
        // a function that sets the state individually from the event
        this.setFilterQuery = _.debounce(this.setFilterQuery, 400);
    }

    componentDidMount() {
        const likesData = this.formatData();
        this.setState({ likesData });
    }

    filterData(event) {
        this.setFilterQuery(event.target.value);
    }

    setFilterQuery(filterQuery) {
        const { likesData } = this.state;
        this.setState({ filterQuery });
    }

    formatData() {
        const { keys }  = Object;
        const { likes } = this.props;
        const likesKeys = keys(likes);

        const likesData = [];
        likesKeys.map((likeKey) => {
            const likeGroup = likes[likeKey];
            const likeGraphObject = {
                name: likeGroup[0].name,
                count: likeGroup.length
            };
            likesData.push(likeGraphObject);
        });

        return likesData;
    }

    filterByName(data) {
        let { filterQuery } = this.state;
        filterQuery = filterQuery.toLowerCase();
        const { name = '' } = data;
        return name.toLowerCase().indexOf(filterQuery) > -1;
    }

    render() {
        const { likesData, filterQuery } = this.state;
        let graphData = _.filter(likesData, this.filterByName);
        graphData = _.sortBy(graphData, ['count']).reverse();

        const nameCount = graphData.length;
        const yAxisLabelHeight = 25;
        const minYAxisHeight = 100;
        let chartHeight = nameCount * yAxisLabelHeight;
        if(chartHeight <minYAxisHeight) chartHeight = minYAxisHeight;
        const marginFormat = {
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5
                };

        return (
            <div className="chart-container">
                <h3 className="chart-title">Total Likes By Person | filtered by: { filterQuery }</h3>
                <div className="chart-box">
                    <div className="chart-header">
                        <input
                            onChange={ this.filterData }
                            className="chart-filter"
                        />
                    </div>
                    <ResponsiveContainer height={ 30 } width="100%">
                        <BarChart
                             data={ graphData }
                             layout="vertical"
                             margin={ marginFormat }
                        >
                            <XAxis dataKey="count" type="number" orientation="top" />
                            <YAxis width={ 200 } type="category" />
                            <CartesianGrid strokeDasharray="3 3" />
                        </BarChart>
                    </ResponsiveContainer>
                    <div className="chart-body">
                        <ResponsiveContainer height={ chartHeight } width="100%">
                            <BarChart
                                 data={ graphData }
                                 layout="vertical"
                                 margin={ marginFormat }
                            >
                                <XAxis style={ { display: 'none' } } dataKey="count" type="number" />
                                <YAxis dataKey="name" type="category" width={ 200 } />
                                <CartesianGrid strokeDasharray="3 3" />
                                <Tooltip />
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
