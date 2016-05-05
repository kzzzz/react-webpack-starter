import React from 'react';
import ReactDOM from 'react-dom';

export default class SampleSelector extends React.Component {
    constructor() {
        super();
        this.state = {}
    }

    render() {
        let options = _.map(window.samples, s => (<option key={s.id} value={s.id}>{s.label}</option>));
        return (
            <div>
                <label className="control-label"></label>
                <select ref="selector"
                        className="form-control"
                        onChange={this.sampleChanged.bind(this)}>
                    <option value="">---</option>
                    {options}
                </select>
            </div>
        )
    }

    sampleChanged() {
        let selection = ReactDOM.findDOMNode(this.refs.selector).value;

        let har = selection
            ? _.find(window.samples, s => s.id === selection).har
            : null;

        if (this.props.onSampleChanged) {
            this.props.onSampleChanged(har);
        }
    }
}

SampleSelector.defaultTypes = {
    onSampleChanged: null
};

SampleSelector.PropTypes = {
    onSampleChanged: React.PropTypes.func
};