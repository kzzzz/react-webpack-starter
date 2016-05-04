require('fixed-data-table/dist/fixed-data-table.css');

import React from 'react';
import ReactDOM from 'react-dom';

import _ from 'lodash';
import FixedDataTable from 'fixed-data-table';

const {Table, Column} = FixedDataTable;
const GutterWidth = 30;

class HarEntryTable extends React.Component {
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
        return (
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
}

HarEntryTable.defaultProps = {
    entries: []
};

export default HarEntryTable;