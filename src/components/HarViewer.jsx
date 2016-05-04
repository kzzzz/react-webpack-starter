require('fixed-data-table/dist/fixed-data-table.css');

import React from 'react';
import ReactDOM from 'react-dom';

import _ from 'lodash';
import {Grid, Row, Col, PageHeader, Button, ButtonGroup, Input} from 'react-bootstrap';
import FixedDataTable from 'fixed-data-table';

import mimeTypes from '../core/mimeTypes';

const {Table, Column} = FixedDataTable;
const GutterWidth = 30;

class HarViewer extends React.Component {
    constructor() {
        super();
        this.state = {
            isColumnResizing: false,
            columnWidths: {
                url: 500,
                size: 100,
                time: 200
            },
            tableWidth: 1000,
            tableHeiht: 500
        };
    }

    componentDidMount() {
        window.addEventListener('resize',
            _.debounce(this.onResize.bind(this),
                50,
                {
                    leading: true,
                    trailing: true
                }));

        this.onResize();
    }


    render() {
        var types = _.keys(mimeTypes.types);

        var buttons = _.map(types, (x) => this.createButton(x, mimeTypes.types[x].label));

        return (
            <Grid>
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
                <Row>
                    <Col sm={12}>
                        <Table ref="entriesTable"
                               rowsCount={this.props.entries.length}
                               width={this.state.tableWidth}
                               headerHeight={30}
                               height={this.state.tableHeiht}
                               rowHeight={30}
                               rowGetter={this.getEntry.bind(this)}
                               isColumnResizing={this.state.isColumnResizing}
                               onColumnResizeEndCallback={this.onColumnResized.bind(this)}>
                            <Column dataKey="url"
                                    width={this.state.columnWidths.url}
                                    isResizable={true}
                                    label="Url"
                                    flexGrow={null}/>
                            <Column dataKey="size"
                                    width={this.state.columnWidths.size}
                                    isResizable={true}
                                    label="Size"/>
                            <Column dataKey="time"
                                    width={this.state.columnWidths.time}
                                    isResizable={true}
                                    label="Timeline"/>
                        </Table>
                    </Col>
                </Row>
            </Grid>
        )
    }

    getEntry(index) {
        return this.props.entries[index];
    }

    onColumnResized(newColumnWidth, dataKey) {
        var columnWidths = this.state.columnWidths;
        columnWidths[dataKey] = newColumnWidth;

        this.setState({
            columnWiths: columnWidths,
            isColumnResizing: false
        });
    }

    onResize() {
        var parent = ReactDOM.findDOMNode(this.refs.entriesTable).parentNode;

        this.setState({
            tableWidth: parent.clientWidth - GutterWidth,
            tableHeight: document.body.clientHeight - parent.offsetTop - GutterWidth * 0.5
        })
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

HarViewer.defaultProps = {
    entries: []
};

export default HarViewer;