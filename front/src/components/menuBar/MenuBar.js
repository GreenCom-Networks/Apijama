import React from 'react';
import PropTypes from 'prop-types';
import {Logo} from '../../services/SvgService';

import './MenuBar.scss';

const menuTabs = [
    {
        name: 'Runs',
        link: '/'
    }
];

class MenuBar extends React.Component {
    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor(props, context) {
        super(props, context);

        this.state = {
            currentTab: menuTabs[0].name
        }
    }

    componentDidMount() {

    }

    _handleTabClick(tab) {
        if (tab.name !== this.state.currentTab) {
            this.setState({
                currentTab: tab.name
            });

            this.context.router.history.push(tab.link)
        }
    }

    render() {
        return (
            <div className="menuBar">
                <div className="logo">
                    <Logo height={80}/>
                </div>
                <div className="tabsContainer">
                    <ul className="tabs">
                        {
                            menuTabs.map((tab, index) => {
                                return (
                                    <li key={index}
                                        className={'tab'}
                                        onClick={this._handleTabClick.bind(this, tab)}>
                                        <a className={this.state.currentTab === tab.name && 'active'}
                                           href="#test2">
                                            <div className="waves-effect waves-primary" style={{width: '100%'}}>
                                                {tab.name}
                                            </div>
                                        </a>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
            </div>
        );
    }
}

export default MenuBar;