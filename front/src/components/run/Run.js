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
                                {this.props.steps.map((step, index) => <Step key={index} step={step}/>)}
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
