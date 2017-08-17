import React from 'react';
import ApiService from '../../services/ApiService';
import Run from '../../components/run/Run';
import StepOverview from '../../components/stepOverview/StepOverview';
import StepOverviewStore from '../../stores/StepOverviewStore';
import {CSSTransitionGroup} from 'react-transition-group';
import {Scrollbars} from 'react-custom-scrollbars';

import './Runs.scss';

class RunsView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            errorMessage: '',
            runs: [],
            loadedPage: false,
            stepOverviewData: null
        }
    }

    _updateDimensions() {
        this.setState({width: window.innerWidth, height: window.innerHeight});
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this._updateDimensions.bind(this));
    }

    componentWillMount() {
        this._updateDimensions();
        ApiService
            .getRuns()
            .then(runs => this.setState({runs, loadedPage: true}))
            .catch(() => this.setState({
                errorMessage: 'Failed to load data from server.',
                loadedPage: true
            }))
    }

    componentDidMount() {
        window.addEventListener("resize", this._updateDimensions.bind(this));
        StepOverviewStore.watch(data => {
            switch (data.action) {
                case 'OPEN':
                    this.setState({stepOverviewData: data.step});
                    break;
                case 'CLOSE':
                    this.setState({stepOverviewData: null});
                    let verticalScrollbar = document.querySelectorAll('.scrollbar > div');
                    verticalScrollbar = verticalScrollbar[verticalScrollbar.length - 1];
                    verticalScrollbar.style.display = "none";
                    setTimeout(() => {
                        verticalScrollbar.style.display = "block";
                    }, 220);
                    break;
            }
        })
    }

    render() {
        return (
            <div style={{display: 'flex', flex: '1 1 100%'}}>
                <div ref='runsView' className={'runsView ' + (this.state.stepOverviewData ? 'runsViewLeft' : '')}>
                    {!this.state.loadedPage ? (
                        <div className="progress">
                            <div className="indeterminate"/>
                        </div>
                    ) : (
                        <Scrollbars className="scrollbar"
                                    autoHide
                                    style={{width: 'calc(100% - 10px)', height: '100%'}}>
                            <div className="runs">
                                {
                                    this.state.runs && this.state.runs.sort((a, b) => b.startedAt - a.startedAt).map((run, index) => {
                                        return (
                                            <Run key={index}
                                                 hostname={run.hostname}
                                                 startedAt={run.startedAt}
                                                 endedAt={run.endedAt}
                                                 status={run.status}
                                                 steps={run.steps}/>
                                        )
                                    })
                                }
                            </div>
                        </Scrollbars>
                    )}
                </div>

                <CSSTransitionGroup
                    transitionName="slideInRightFast"
                    transitionEnterTimeout={0}
                    transitionLeaveTimeout={0}>
                    {this.state.stepOverviewData && <StepOverview step={this.state.stepOverviewData}/>}
                </CSSTransitionGroup>

                { this.state.errorMessage && (
                    <div className="errorMessage">{this.state.errorMessage}</div>
                )}
            </div>
        );
    }
}

export default RunsView;