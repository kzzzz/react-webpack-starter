require('fixed-data-table/dist/fixed-data-table.css');

import React from 'react';
import ReactDOM from 'react-dom';

import _ from 'lodash';
import {Row, Col, Button, ButtonGroup, Input} from 'react-bootstrap';

import mimeTypes from '../core/mime-types';

class FilterBar extends React.Component {
    constructor() {
        super();
        this.state = {
            type: 'all'
        }
    }

    render() {
        var types = _.keys(mimeTypes.types);

        var buttons = _.map(types, (x) => this.createButton(x, mimeTypes.types[x].label));

        return (
            <Row>
                <Col sm={8} bsSize="small">
                    <ButtonGroup>
                        {this.createButton('all', 'All')}
                        {buttons}
                    </ButtonGroup>
                </Col>
            </Row>
        )
    }

    renderSearchInput() {
        return (
            <Col sm={4}>
                <Input type="search"
                       placeholder="Search URL"
                       bsSize="small"
                       onChange={this.filterTextChanged.bind(this)}
                       ref="filterText"/>
            </Col>
        )
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

    filterTextChanged() {

        if (this.props.onFilterTextChange) {
            let filterText = ReactDOM.findDOMNode(this.refs.filterText).value();
            this.props.onFilterTextChang(filterText)
        }

    }

    filterRequested(type, event) {
        console.log('filterRequested', type, event);

        this.setState({type, event});
        if (this.props.onChange) {
            this.props.onChange(type);
        }
    }
}

FilterBar.defaultProps = {
    onChange: null,
    onFilterTextChang: null
};

FilterBar.propTypes = {
    onChange: React.PropTypes.func,
    onFilterTextChang: React.PropTypes.func
};

export default FilterBar;