import Constants from './ConstantsService';
import request from 'superagent';

export default {
    getRuns(){
        return new Promise((resolve, reject) => {
            request
                .get(Constants.API_URL + '/runs')
                .then(res => {
                    resolve(res.body);
                })
                .catch(reject);
        });
    }
}