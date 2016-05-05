require('fixed-data-table/dist/fixed-data-table.css');

import _ from 'lodash';
import React from 'react';
import {Grid, Row, Col, PageHeader, Alert} from 'react-bootstrap';

import harParser from '../core/har-parser';
import FilterBar from './FilterBar.jsx';
import SampleSelector from './SampleSelector.jsx';
import TypePieChart from './pie-chart/TypePieChart.jsx';
import HarEntryTable from './har-entry-table/HarEntryTable.jsx';

class HarViewer extends React.Component {
    constructor() {
        super();
        this.state = this.initialState();
    }

    initialState() {
        return {
            activeHar: null,
            sortKey: null,
            sortDirection: null,
            filterType: 'all',
            filterText: null
        };
    }

    render() {
        const content = this.state.activeHar
            ? this.renderViewer(this.state.activeHar)
            : this.renderEmptyViewer();

        return (
            <div>
                {this.renderHeader()}
                {content}
            </div>
        )
    }

    renderHeader() {
        return (
            <Grid fluid>
                <Row>
                    <Col sm={12}>
                        <PageHeader> HAR Viewer </PageHeader>
                    </Col>
                    <Col sm={3} smOffset={9}>
                        <SampleSelector onSampleChanged={this.sampleChanged.bind(this)}/>
                    </Col>
                </Row>
            </Grid>
        )
    }

    renderViewer(har) {

        let pages = harParser(har);
        let currentPage = pages[0];
        let filter = {
            type: this.state.filterType,
            text: this.state.filterText
        };
        let filteredEntries = this.filterEntries(filter, currentPage.entries);
        let entries = this.sortEntriesByKey(this.state.sortKey, this.state.sortDirection, filteredEntries);

        return (
            <Grid fluid>
                <Row>
                    <Col sm={12}>
                        <TypePieChart entries={currentPage.entries}/>
                    </Col>
                </Row>
                <Row>
                    <Col sm={12}>
                        <FilterBar onChange={this.onFilterChanged.bind(this)}
                                   onFilterTextChange={this.onFilterTextChanged.bind(this)}/>
                    </Col>
                </Row>
                <Row>
                    <Col sm={12}>
                        <HarEntryTable
                            entries={entries}
                            page={currentPage}
                            onColumnSort={this.onColumnSort.bind(this)}/>
                    </Col>
                </Row>
            </Grid>
        )
    }

    renderEmptyViewer() {
        return (
            <Grid fluid>
                <Row>
                    <p></p>
                    <Alert bsStyle="warning">
                        <strong>No HAR loaded</strong>
                    </Alert>
                </Row>
            </Grid>
        )
    }

    onColumnSort(dataKey, direction) {
        this.setState({sortKey: dataKey, sortDirection: direction});
    }

    sortEntriesByKey(sortKey, sortDirection, entries) {
        if (_.isEmpty(sortKey) || _.isEmpty(sortDirection)) {
            return entries;
        }

        var keyMap = {
            url: 'request.url',
            time: 'time.start'
        };

        var getValue = function (entry) {
            let key = keyMap[sortKey] || sortKey;
            return _.get(entry, key);
        };

        var sorted = _.sortBy(entries, getValue);

        if (sortDirection === 'desc') {
            sorted.reverse();
        }

        return sorted;
    }

    filterEntries(filter, entries) {
        var filtered = _.filter(entries, x => {
            let matchesType = filter.type === 'all' || filter.type === x.type;
            let matchesText = filter.text && _.includes(x.request.url, filter.text);

            return matchesType || matchesText;
        });

        return filtered;
    }

    onFilterChanged(filterType) {
        this.setState({filterType});
    }

    onFilterTextChanged(filterText) {
        this.setState({filterText});
    }

    sampleChanged(har) {
        if (har) {
            this.setState({activeHar: har});
        } else {
            this.setState(this.initialState());
        }
    }
}

HarViewer.defaultProps = {};

export default HarViewer;