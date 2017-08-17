import React from 'react';
import {ExclamationPoint} from '../../services/SvgService';
import StepOverviewStore from '../../stores/StepOverviewStore';
import PropTypes from 'prop-types';

import './Step.scss';

class Step extends React.Component {
    constructor(props) {
        super(props);
    }

    _openStepOverview() {
        StepOverviewStore.open(this.props.step);
    }

    render() {
        return (
            <div className="step" onClick={this._openStepOverview.bind(this)}>
                {this.props.step.resultData.request && (
                    <div>
                        {this.props.step.result === 'fail' && <div className="failStepIcon"><ExclamationPoint/></div>}
                        <div className="method">
                            {this.props.step.resultData.request.method}
                        </div>
                        <div className="uri">
                            {this.props.step.resultData.request.uri}
                        </div>
                        <div className="actionName">
                            {this.props.step.origin.actionName}
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

Step.propTypes = {
    step: PropTypes.object.isRequired
};

export default Step;
