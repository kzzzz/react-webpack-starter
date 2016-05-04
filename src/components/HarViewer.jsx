require('fixed-data-table/dist/fixed-data-table.css');

import React from 'react';
import ReactDOM from 'react-dom';

import _ from 'lodash';
import {Grid, Row, Col, PageHeader, Button, ButtonGroup, Input} from 'react-bootstrap';
import FixedDataTable from 'fixed-data-table';

import mimeTypes from '../core/mimeTypes';
import HarEntryTable from './HarEntryTable.jsx';

const {Table, Column} = FixedDataTable;
const GutterWidth = 30;

class HarViewer extends React.Component {
    constructor() {
        super();
        this.state = {
            entries: []
        };
    }

    componentDidMount() {
    }


    render() {
        return (
            <div>
                {this.renderHeader()}
                <Grid>
                    <Row>
                        <Col sm={12}>
                            <HarEntryTable entries={this.state.entries}/>
                        </Col>
                    </Row>
                </Grid>
            </div>
        )
    }

    renderHeader() {

        var types = _.keys(mimeTypes.types);

        var buttons = _.map(types, (x) => this.createButton(x, mimeTypes.types[x].label));
        let options = _.map(window.samples, s => (<option key={s.id}>{s.label}</option>));

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
                        <select className="form-control" onChange={this.sampleChanged.bind(this)}>
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