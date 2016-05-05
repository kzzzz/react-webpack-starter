import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';

export default class TimingDetails extends React.Component {
    constructor() {
        super();
        this.state = {}
    }

    render() {
        const {blocked, connect, dns, wait, send, receive} = this.props.timings;
        return (
            <table className="table table-condensed timing-details">
                <tbody>
                <tr className="bg-danger">
                    <td></td>
                </tr>
                </tbody>
            </table>
        )
    }
}

TimingDetails.defaultTypes = {};

TimingDetails.propTypes = {};