import React from 'react';
import {CheckedIcon, CrossIcon, ChevronDown, ChevronUp} from '../../services/SvgService';
import Step from '../step/Step';
import moment from 'moment';
import PropTypes from 'prop-types';
import {CSSTransitionGroup} from 'react-transition-group';

import './Run.scss';

class Run extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpened: false
        }
    }

    _toggleChevronClick() {
        this.setState({isOpened: !this.state.isOpened});
    }

    _packSteps(steps) {
        let result = {};
        steps.forEach(step => {
            if (!result[step.origin.resourceName]) result[step.origin.resourceName] = [];
            result[step.origin.resourceName].push(step);
        });
        return Object.values(result);
    }

    render() {
        return (
            <div className={'run ' + (this.state.isOpened && 'open')}>
                <div className={'preview ' + (this.props.status === 'failed' && 'failed')}>
                    <div className="hostname">{this.props.hostname}</div>
                    <div className="startedAt">{moment.unix(this.props.startedAt).fromNow()}</div>
                    <div className="timeElapsed">{(this.props.endedAt - this.props.startedAt) + 'ms'}</div>
                    <div className={'status ' + this.props.status}>
                        {this.props.status === 'failed' ? <CrossIcon/> : <CheckedIcon/>}
                    </div>
                    <div className="separator"/>
                    <div className="chevron" onClick={this._toggleChevronClick.bind(this)}>
                        {this.state.isOpened ? <ChevronUp/> : <ChevronDown/>}
                    </div>
                </div>
                {!this.state.isOpened && <div className="subPreview"/>}
                <CSSTransitionGroup
                    transitionName="slideInDownFast"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={300}>
                    {
                        this.state.isOpened && (
                            <div className="steps">
                                {this._packSteps(this.props.steps).map((packs, index1) => {
                                    return (
                                        <div className="stepPack" key={index1}>
                                            {packs.map((step, index2) => <Step key={index2} step={step}/>)}
                                        </div>
                                    )
                                })}
                            </div>
                        )
                    }
                </CSSTransitionGroup>

            </div>
        );
    }
}

Run.propTypes = {
    hostname: PropTypes.string.isRequired,
    startedAt: PropTypes.number.isRequired,
    endedAt: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    steps: PropTypes.array.isRequired
};

export default Run;
