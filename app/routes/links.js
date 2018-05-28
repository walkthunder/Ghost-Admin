import $ from 'jquery';
import AuthenticatedRoute from 'ghost-admin/routes/authenticated';
import InfinityRoute from 'ember-infinity/mixins/route';
import {assign} from '@ember/polyfills';
import {isBlank} from '@ember/utils';

export default AuthenticatedRoute.extend(InfinityRoute, {

    queryParams: {
        status: {
            refreshModel: true,
            replace: true
        },
        crawlsite_id: {
            refreshModel: true,
            replace: true
        },
        post_id: {
            refreshModel: true,
            replace: true
        },
        order: {
            refreshModel: true,
            replace: true
        }
    },

    titleToken: 'Content',

    perPage: 30,

    _type: null,

    model(params = {}) {
        return Promise.resolve().then(() => {
            console.log('---user---', params);
            let queryParams = {};
            let paginationParams = {
                perPageParam: 'limit',
                totalPagesParam: 'meta.pagination.pages'
            };

            if (params.status) {
                queryParams.status = params.status;
            }

            if (!isBlank(params.order)) {
                queryParams.order = params.order;
            }

            let perPage = this.get('perPage');
            let paginationSettings = assign({perPage, startingPage: 1}, paginationParams, queryParams);

            return this.infinityModel('crawllink', paginationSettings);
        });
    },

    _filterString(filter) {
        return Object.keys(filter).map((key) => {
            let value = filter[key];

            if (!isBlank(value)) {
                return `${key}:${filter[key]}`;
            }
        }).compact().join('+');
    }
});
