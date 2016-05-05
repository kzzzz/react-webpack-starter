require('./_timebar.scss');
import React, {PropTypes} from 'react';

export default class TimeBar extends React.Component {
    constructor() {
        super();
        this.state = {}
    }

    render() {
        return (
            <div className="timebar">
                {this.renderBarElements()}
                <span className="timebar-label">{this.props.total}</span>
            </div>
        )
    }

    renderBarElements(){
        let value = v =>`${this.props.scale(v)}%`;

        var bars = [
            {
                type: 'time',
                style: {
                    left: value(this.props.start),
                    width: value(this.props.total)
                },
                className: 'timebar-mark-time'
            },
            {
                type: 'contentLoad',
                style: {
                    left: value(this.props.domContentLoad),
                    width: 1
                },
                className: 'timebar-mark-contentLoad'
            },
            {
                type: 'pageLoad',
                style: {
                    left: value(this.props.pageLoad),
                    width: 1
                },
                className: 'timebar-mark-pageLoad'
            }
        ];

        let barElements = _.chain(bars)
            .map(b => <div key={b.type}
                           className={`timebar-mark ${b.className}`}
                           style={b.style}></div>
            )
            .value();

        return barElements;
    }
}

TimeBar.defaultTypes = {
    scale: null,
    start: 0,
    total: 0,
    timings: null,
    domContentLoad: 0,
    pageLoad: 0
};

TimeBar.propTypes = {
    scale: PropTypes.func,
    start: PropTypes.number,
    total: PropTypes.number,
    timings: PropTypes.object,
    domContentLoad: PropTypes.number,
    pageLoad: PropTypes.number
};