import React from 'react';
import ReactDOM from 'react-dom';
import {AppContainer} from 'react-hot-loader'
import Router from './Router';

import './core.scss';

const render = Component => {
    ReactDOM.render(
        <AppContainer>
            <Component />
        </AppContainer>,
        document.getElementById('root')
    )
};

render(Router);
if (module.hot) {
    module.hot.accept('./Router', () => {
        render(Router)
    })
}
