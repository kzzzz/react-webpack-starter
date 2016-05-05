require('fixed-data-table/dist/fixed-data-table.css');
require('./_har-entry-table.scss');

import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import FixedDataTable from 'fixed-data-table';
import d3 from 'd3';
import _ from 'lodash';

import formatter from '../../core/formatter';
import TimeBar from '../timebar/TimeBar.jsx';
import FileType from '../file-type/FileType.jsx';

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
            sortDirection: {
                url: null,
                size: null,
                time: null
            },
            tableWidth: 1000,
            tableHeight: 500
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
                   height={this.state.tableHeight}
                   rowHeight={30}
                   rowGetter={this.getEntry.bind(this)}
                   isColumnResizing={this.state.isColumnResizing}
                   onColumnResizeEndCallback={this.onColumnResized.bind(this)}>
                <Column dataKey="url"
                        headerRenderer={this.renderHeader.bind(this)}
                        cellRenderer={this.renderUrlColumn.bind(this)}
                        cellDataGetter={this.readKey.bind(this)}
                        width={this.state.columnWidths.url}
                        isResizable={true}
                        label="Url"
                        flexGrow={null}/>
                <Column dataKey="size"
                        headerRenderer={this.renderHeader.bind(this)}
                        cellRenderer={this.renderSizeColumn.bind(this)}
                        cellDataGetter={this.readKey.bind(this)}
                        width={this.state.columnWidths.size}
                        isResizable={true}
                        label="Size"/>
                <Column dataKey="time"
                        headerRenderer={this.renderHeader.bind(this)}
                        cellRenderer={this.renderTimeColumn.bind(this)}
                        cellDataGetter={this.readKey.bind(this)}
                        width={this.state.columnWidths.time}
                        isResizable={true}
                        label="Timeline"/>
            </Table>
        )
    }

    readKey(key, entry) {
        var keyMap = {
            url: 'request.url',
            time: 'time.start'
        };

        key = keyMap[key] || key;

        return _.get(entry, key);
    }

    renderHeader(label, dataKey) {
        var dir = this.state.sortDirection[dataKey];

        var classMap = {
            asc: 'glyphicon glyphicon-sort-by-attributes',
            desc: 'glyphicon glyphicon-sort-by-attributes-alt'
        };

        var sortClass = dir ? classMap[dir] : '';

        return (
            <div className="text-primary sortable"
                 onClick={this.columnClicked.bind(this, dataKey)}>
                <strong>{label}</strong>
                &nbsp;
                <i className={sortClass}></i>
            </div>
        )
    }

    renderUrlColumn(cellData, cellDataKey, rowData, rowIndex, columnData, width) {
        return (<FileType url={rowData.request.url} type={rowData.type}/>);
    }

    renderSizeColumn(cellData, cellDataKey, rowData, rowIndex, columnData, width) {
        return (<span>{formatter.fileSize(cellData)}</span>);
    }

    renderTimeColumn(cellData, cellDataKey, rowData, rowIndex, columnData, width) {
        const {start, total} = rowData.time;
        const pgTimings = this.props.page.pageTimings;
        const scale = this.prepareScale(this.props.entries, this.props.page);

        return (
            <TimeBar scale={scale}
                     start={start}
                     total={total}
                     timings={rowData.time.details}
                     domContentLoad={pgTimings.onContentLoad}
                     pageLoad={pgTimings.pageLoad}/>
        );
    }

    prepareScale(entries, page) {
        let startTime = 0;
        let lastEntry = _.last(entries);
        let endTime = lastEntry.time.start + lastEntry.time.total;
        let maxTime = Math.max(endTime, page.pageTimings.onLoad);

        var scale = d3.scale.linear()
            .domain([startTime, Math.ceil(maxTime)])
            .range([0, 100]);

        return scale;
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

    columnClicked(dataKey) {
        let sortDirections = this.state.sortDirection;
        let dir = sortDirections[dataKey];

        switch (dir) {
            case 'asc':
                dir = 'desc';
                break;
            case 'desc':
            default:
                dir = 'asc';
        }

        // Reset all sorts
        _.each(_.keys(sortDirections), x => sortDirections[x] = null);
        sortDirections[dataKey] = dir;

        if (this.props.onColumnSort) {
            this.props.onColumnSort(dataKey, dir);
        }
    }
}

HarEntryTable.defaultProps = {
    entries: [],
    page: null,
    onColumnSort: null
};

HarEntryTable.propTypes = {
    entries: PropTypes.array,
    page: PropTypes.object,
    onColumnSort: PropTypes.func
};

export default HarEntryTable;