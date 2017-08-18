import React from 'react';
import PropTypes from 'prop-types';
import {CloseIcon} from '../../services/SvgService';
import moment from 'moment';
import StepOverviewStore from '../../stores/StepOverviewStore';
import JSONPretty from 'react-json-pretty';
import {Scrollbars} from 'react-custom-scrollbars';

import './StepOverview.scss';


class StepOverview extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentTab: 'expectedResponse',
            tabs: [
                {
                    name: 'Expected response',
                    id: 'expectedResponse',
                },
                {
                    name: 'Real response',
                    id: 'realResponse',
                },
                {
                    name: 'Errors',
                    id: 'errors',
                }
            ]
        }
    }

    componentDidMount() {
        $(document).ready(function () {
            $('ul.tabs').tabs();
        });
    }

    _parseRealResponse(response) {
        let responseBody;
        try {
            responseBody = JSON.parse(response.body);
        } catch (e) {
            responseBody = response.body ? {error: response.body} : {};
        }
        return responseBody
    }

    _parseExpectedResponse(response){
        let responseBody;
        try {
            responseBody = JSON.parse(response);
        } catch (e) {
            responseBody = "";
        }
        return responseBody
    }

    _parseRawData(rawData) {
        if (rawData) return Object.values(rawData);
        else return [{message: "No raw data, see real response tab."}];
    }

    _closeStepOverview() {
        StepOverviewStore.close();
    }

    _handleTabClick(tab) {
        if (this.state.currentTab !== tab.id) {
            this.setState({currentTab: tab.id});
        }
    }

    render() {
        console.log(this.props.step.resultData)
        return (
            <div className="stepOverview">
                <div className="header">
                    <div className="stepTitle">
                        {this.props.step.origin.apiName}
                    </div>
                    <div className="closeIcon" onClick={this._closeStepOverview.bind(this)}>
                        <CloseIcon/>
                    </div>
                </div>
                <div className="summary">
                    <div className="startedAt">
                        {moment(this.props.step.startedAt).format("MMMM Do YYYY, h:mm:ss a")}
                    </div>
                </div>
                <div className="content">
                    <ul className="tabs">
                        {
                            this.state.tabs.map((tab, index) => {
                                return (
                                    <li key={index}
                                        className={'tab ' + (tab.id === 'errors' && this.props.step.result === 'pass' ? 'disabled' : '')}
                                        onClick={this._handleTabClick.bind(this, tab)}>
                                        <a className={this.state.currentTab === tab.id && 'active'}
                                           href={'#' + tab.id}>
                                            <div className="waves-effect waves-primary" style={{width: '100%'}}>
                                                {tab.name}
                                            </div>
                                        </a>
                                    </li>
                                )
                            })
                        }
                    </ul>

                    <div id="expectedResponse" className="response col s12">
                        <Scrollbars autoHide>
                            <JSONPretty id="json-pretty"
                                        json={this._parseExpectedResponse(this.props.step.resultData.expectedResponse.bodySchema) || {}}/>
                        </Scrollbars>
                    </div>
                    <div id="realResponse" className="response col s12">
                        <Scrollbars autoHide>
                            <JSONPretty id="json-pretty"
                                        json={this._parseRealResponse(this.props.step.resultData.realResponse)}/>
                        </Scrollbars>
                    </div>
                    <div id="errors" className="response col s12">
                        <Scrollbars autoHide>
                            {this.props.step.result === 'fail' && (
                                this._parseRawData(this.props.step.resultData.result.body.rawData).map((data, index) => {
                                    return (
                                        <div className="error" key={index}>{data.message}</div>
                                    )
                                })
                            )}
                        </Scrollbars>
                    </div>
                </div>
            </div>
        );
    }
}

StepOverview.propTypes = {
    step: PropTypes.object.isRequired
};

export default StepOverview;
/*
 <li key={index}
 className={'tab'}
 onClick={this._handleTabClick.bind(this, tab)}>
 <a className={+this.state.currentTab === tab.name && 'active'}
 href="#test2">
 <div className="waves-effect waves-primary" style={{width: '100%'}}>
 {tab.name}
 </div>
 </a>
 </li>
 */