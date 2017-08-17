/**
 * Created by Vashnak on 28/06/17.
 */

import React from 'react';
import {BrowserRouter, Switch, Route, Redirect} from 'react-router-dom';
import MenuBar from './components/menuBar/MenuBar';
import RunsView from './views/runs/Runs';


const routes = () => {
    return (
        <BrowserRouter>
            <div>
                <MenuBar/>
                <div className="views">
                    <Switch>
                        <Route path='/' component={RunsView}/>
                    </Switch>
                </div>
            </div>
        </BrowserRouter>
    );
};

export default routes;