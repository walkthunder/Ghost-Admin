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
        res_url: {
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

    model(params) {
        return Promise.resolve().then(() => {
            let queryParams = {};
            let paginationParams = {
                perPageParam: 'limit',
                totalPagesParam: 'meta.pagination.pages'
            };

            if (!isBlank(params.order)) {
                queryParams.order = params.order;
            }

            let perPage = this.get('perPage');
            let paginationSettings = assign({perPage, startingPage: 1}, paginationParams, queryParams);

            return this.infinityModel('crawlsite', paginationSettings);
        });
    },

    _typeParams(type) {
        let status = 'all';

        switch (type) {
        case 'draft':
            status = 'draft';
            break;
        case 'published':
            status = 'published';
            break;
        case 'scheduled':
            status = 'scheduled';
            break;
        case 'page':
            break;
        }

        return {
            status
        };
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
