require('fixed-data-table/dist/fixed-data-table.css');

import React from 'react';
import ReactDOM from 'react-dom';

import _ from 'lodash';
import {Row, Col, Button, ButtonGroup, Input, FormGroup, FormControl} from 'react-bootstrap';

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
                <Col sm={4}>
                    <FormGroup>
                        <FormControl type="text"
                                     placeholder="Search Url"
                                     bsSize="small"
                                     onChange={this.filterTextChanged.bind(this)}
                                     ref="filterText"/>
                    </FormGroup>
                </Col>
            </Row>
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
            let filterText = ReactDOM.findDOMNode(this.refs.filterText).value;
            this.props.onFilterTextChange(filterText)
        }
    }

    filterRequested(type, event) {

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
    onFilterTextChange: React.PropTypes.func
};

export default FilterBar;