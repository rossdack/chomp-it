import React from 'react';
import ReactDOM from 'react-dom';
import App from '../client/components/App';

describe(App, () => {

    // sanity
    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<App/>, div);
        ReactDOM.unmountComponentAtNode(div);
    });
});