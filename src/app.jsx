// require('bootstrap/dist/css/bootstrap.css');
// require('bootstrap/dist/css/bootstrap-theme.css');
require('./app.scss');
require('./samples');

import React from 'react';
import ReactDOM from 'react-dom';
import HarViewer from './components/HarViewer.jsx';

class App extends React.Component {
    render() {
        return (
            <div>
                <HarViewer />
            </div>
        )
    }
}

ReactDOM.render(<App/>, document.body);