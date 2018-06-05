import BaseValidator from './base';
import validator from 'npm:validator';
import {isBlank} from '@ember/utils';

export default BaseValidator.create({
    properties: [
        'resUrl',
        'interval',
        'queryRule',
        'subQueryRule',
        'status'
    ],

    queryRule(model) {
        let queryRule = model.get('queryRule');

        if (isBlank(queryRule)) {
            model.get('errors').add('queryRule', 'You must specify a queryRule for the crawl site.');
            this.invalidate();
        }

        if (!validator.isLength(queryRule || '', 0, 255)) {
            model.get('errors').add('queryRule', 'queryRule cannot be longer than 255 characters.');
            this.invalidate();
        }
    }
});
