require('fixed-data-table/dist/fixed-data-table.css');

import React from 'react';
import ReactDOM from 'react-dom';

import _ from 'lodash';
import {Grid, Row, Col, PageHeader, Button, ButtonGroup, Alert} from 'react-bootstrap';

import mimeTypes from '../core/mime-types';
import harParser from '../core/har-parser';
import HarEntryTable from './HarEntryTable.jsx';

class HarViewer extends React.Component {
    constructor() {
        super();
        this.state = this.initialState();
    }

    initialState() {
        return {
            activaHar: null,
            entries: []
        };
    }

    componentDidMount() {
    }

    renderViewer(har) {

        let pages = harParser(har);
        let currentPage = pages[0];
        let entries = currentPage.entries;

        console.log('currentPage', currentPage);
        return (
            <Grid fluid>
                <Row>
                    <Col sm={12}>
                        <HarEntryTable entries={entries}/>
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

        var types = _.keys(mimeTypes.types);

        var buttons = _.map(types, (x) => this.createButton(x, mimeTypes.types[x].label));
        let options = _.map(window.samples, s => (<option key={s.id} value={s.id}>{s.label}</option>));

        return (
            <Grid fluid>
                <Row>
                    <Col sm={12}>
                        <PageHeader>
                            HAR Viewer
                        </PageHeader>
                    </Col>
                    <Col sm={3} smOffset={9}>
                        <label className="control-label"></label>
                        <select ref="selector"
                                className="form-control"
                                onChange={this.sampleChanged.bind(this)}>
                            <option value="">---</option>
                            {options}
                        </select>
                    </Col>
                    <Col sm={12}>
                        <p>Pie Chart</p>
                    </Col>
                    <Col sm={8} bsSize="small">
                        <ButtonGroup>
                            {this.createButton('all', 'All')}
                            {buttons}
                        </ButtonGroup>
                    </Col>
                </Row>
            </Grid>
        )
    }


    sampleChanged() {
        let selection = ReactDOM.findDOMNode(this.refs.selector).value;

        let har = selection
            ? _.find(window.samples, s => s.id === selection).har
            : null;


        if (har) {
            console.log('selected har', har);
            this.setState({activeHar: har});
        } else {
            this.setState(this.initialState());
        }
    }

    createButton(type, label) {
        var handler = this.filterRequested.bind(this, type);
        return (
            <Button key={type}
                    bsStyle="primary"
                    active={this.state.type === type}
                    onClick={handler}>
                {label}
            </Button>
        )
    }

    filterRequested(type, event) {

    }

    filterTextChanged() {

    }
}

HarViewer.defaultProps = {};

export default HarViewer;